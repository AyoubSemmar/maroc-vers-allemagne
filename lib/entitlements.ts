/**
 * Server-only entitlements helper.
 *
 * Single source of truth for "can this user use feature X, and if so, how?"
 *
 * Tiers (checked in order):
 *   1. Premium — daily limit per feature.
 *   2. Pay-per-use credits — decrement balance.
 *   3. Free daily quota — only for ausbildung_reveal.
 *   4. Deny.
 *
 * Templates + German levels are one-time unlocks (premium = all unlocked;
 * free = must have a row in user_unlocks, except A1 which is free for all).
 */

import { createClient as createAdminClient } from '@supabase/supabase-js'

function admin() {
  return createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } }
  )
}

function todayUTC(): string {
  return new Date().toISOString().slice(0, 10)
}

// ── Daily caps for premium users ───────────────────────────────
export const PREMIUM_DAILY_LIMITS = {
  photo: 5,
  cv: 2,
  motivation: 2,
  ausbildung_reveal: Infinity,
} as const

// ── Daily cap for free (signed-in) users ───────────────────────
// After these limits, the user must buy credits or upgrade to premium.
// Bumped cv + motivation from 1/day to 2/day to match photo (consistent
// "2 free tries per day" across the three paid AI features).
export const FREE_DAILY_LIMITS = {
  photo: 2,
  cv: 2,
  motivation: 2,
  ausbildung_reveal: 10,
} as const

export type PaidFeature = 'photo' | 'cv' | 'motivation' | 'ausbildung_reveal'
export type UnlockFeature = `template:${string}` | `german:${string}`
export type Feature = PaidFeature | UnlockFeature

export type CheckResult =
  | { allowed: true;  source: 'premium' | 'credit' | 'free_daily' | 'free_lifetime' | 'unlock' | 'always_free'; remaining?: number }
  | { allowed: false; reason: 'not_authenticated' | 'premium_daily_limit' | 'free_daily_limit' | 'no_credits' | 'not_unlocked'; remaining?: number }

// ── Usage table routing per paid feature ───────────────────────
const USAGE_TABLE: Record<PaidFeature, string> = {
  photo: 'photo_enhance_usage',
  cv: 'cv_enhance_usage',
  motivation: 'motivation_usage',
  ausbildung_reveal: 'ausbildung_reveals_usage',
}

const CREDIT_COLUMN: Record<Exclude<PaidFeature, 'ausbildung_reveal'>, string> = {
  photo: 'photo_credits',
  cv: 'cv_enhance_credits',
  motivation: 'motivation_credits',
}

// ── Profile lookup ─────────────────────────────────────────────
async function getProfile(userId: string) {
  const { data } = await admin()
    .from('profiles')
    .select('is_admin, is_premium, premium_until, motivation_free_used')
    .eq('user_id', userId)
    .maybeSingle()
  return data
}

function isPremiumActive(p: { is_premium: boolean; premium_until: string | null } | null): boolean {
  if (!p || !p.is_premium) return false
  if (!p.premium_until) return true
  return new Date(p.premium_until).getTime() > Date.now()
}

async function getDailyUsage(userId: string, table: string): Promise<number> {
  const { data } = await admin()
    .from(table)
    .select('count')
    .eq('user_id', userId)
    .eq('day', todayUTC())
    .maybeSingle()
  return data?.count ?? 0
}

export async function bumpDailyUsage(userId: string, table: string): Promise<number> {
  const day = todayUTC()
  const current = await getDailyUsage(userId, table)
  const next = current + 1
  await admin().from(table).upsert(
    { user_id: userId, day, count: next, updated_at: new Date().toISOString() },
    { onConflict: 'user_id,day' }
  )
  return next
}

async function decrementCredit(userId: string, column: string): Promise<boolean> {
  // Read-then-write. Since each user only has one row and API calls are per-user,
  // race conditions are not a concern (the user would have to double-click AND
  // the request would need to interleave exactly; worst case: one extra free use).
  const { data } = await admin()
    .from('user_credits')
    .select(column)
    .eq('user_id', userId)
    .maybeSingle()
  const current = (data as unknown as Record<string, number> | null)?.[column] ?? 0
  if (current <= 0) return false
  await admin()
    .from('user_credits')
    .update({ [column]: current - 1, updated_at: new Date().toISOString() })
    .eq('user_id', userId)
  return true
}

async function hasUnlock(userId: string, kind: 'template' | 'german_level', key: string): Promise<boolean> {
  const { data } = await admin()
    .from('user_unlocks')
    .select('user_id')
    .eq('user_id', userId)
    .eq('kind', kind)
    .eq('key', key)
    .maybeSingle()
  return !!data
}

// ── Public API: check + consume ────────────────────────────────
/**
 * Check whether a user can use a feature, and if yes, consume the entitlement.
 * Call this from API routes right before performing the expensive action.
 * If allowed, the call has side effects (usage bump / credit decrement).
 * If not allowed, nothing is consumed — return an error to the client.
 */
export async function checkAndConsume(userId: string, feature: Feature): Promise<CheckResult> {
  if (!userId) return { allowed: false, reason: 'not_authenticated' }

  // Unlock-based features (templates, German levels)
  if (feature.startsWith('template:') || feature.startsWith('german:')) {
    const [kindRaw, key] = feature.split(':') as [string, string]
    const kind: 'template' | 'german_level' = kindRaw === 'template' ? 'template' : 'german_level'

    // A1 is always free for everyone.
    if (kind === 'german_level' && key.toUpperCase() === 'A1') {
      return { allowed: true, source: 'always_free' }
    }

    const profile = await getProfile(userId)
    if (isPremiumActive(profile)) return { allowed: true, source: 'premium' }

    const unlocked = await hasUnlock(userId, kind, key)
    return unlocked
      ? { allowed: true, source: 'unlock' }
      : { allowed: false, reason: 'not_unlocked' }
  }

  // Paid features: photo, cv, motivation, ausbildung_reveal
  const paid = feature as PaidFeature
  const profile = await getProfile(userId)

  // 1. Premium daily limit
  if (isPremiumActive(profile)) {
    const limit = PREMIUM_DAILY_LIMITS[paid]
    if (limit === Infinity) {
      // No bump needed for uncapped features (still bump for analytics).
      await bumpDailyUsage(userId, USAGE_TABLE[paid])
      return { allowed: true, source: 'premium' }
    }
    const used = await getDailyUsage(userId, USAGE_TABLE[paid])
    if (used >= limit) {
      return { allowed: false, reason: 'premium_daily_limit', remaining: 0 }
    }
    const next = await bumpDailyUsage(userId, USAGE_TABLE[paid])
    return { allowed: true, source: 'premium', remaining: Math.max(0, limit - next) }
  }

  // 2. Free daily quota — every signed-in user gets a small daily allowance
  //    on photo/cv/motivation/ausbildung_reveal. After the limit, they must
  //    buy credits or upgrade to premium.
  if (paid in FREE_DAILY_LIMITS) {
    const limit = FREE_DAILY_LIMITS[paid as keyof typeof FREE_DAILY_LIMITS]
    const used = await getDailyUsage(userId, USAGE_TABLE[paid])
    if (used < limit) {
      const next = await bumpDailyUsage(userId, USAGE_TABLE[paid])
      return { allowed: true, source: 'free_daily', remaining: Math.max(0, limit - next) }
    }
    // Daily allowance exhausted. For ausbildung_reveal there are no paid
    // credits, so reject. For photo/cv/motivation, fall through to credits.
    if (paid === 'ausbildung_reveal') {
      return { allowed: false, reason: 'free_daily_limit', remaining: 0 }
    }
  }

  // 3. Pay-per-use credits (photo/cv/motivation only)
  const column = CREDIT_COLUMN[paid as Exclude<PaidFeature, 'ausbildung_reveal'>]
  const ok = await decrementCredit(userId, column)
  if (!ok) return { allowed: false, reason: 'no_credits' }
  // Log usage for audit/analytics
  await bumpDailyUsage(userId, USAGE_TABLE[paid])
  return { allowed: true, source: 'credit' }
}

/**
 * Roll back a consumed entitlement after an expensive op fails (e.g. Replicate
 * returns an error). Pass the `source` returned by checkAndConsume so we know
 * which ledger to reverse.
 */
export async function refund(userId: string, feature: PaidFeature, source: 'premium' | 'credit' | 'free_daily' | 'free_lifetime' | 'unlock' | 'always_free') {
  if (source === 'free_lifetime' && feature === 'motivation') {
    // Give back the lifetime try
    await admin()
      .from('profiles')
      .update({ motivation_free_used: false })
      .eq('user_id', userId)
  }
  if (source === 'credit') {
    const column = CREDIT_COLUMN[feature as Exclude<PaidFeature, 'ausbildung_reveal'>]
    const { data } = await admin()
      .from('user_credits')
      .select(column)
      .eq('user_id', userId)
      .maybeSingle()
    const current = (data as unknown as Record<string, number> | null)?.[column] ?? 0
    await admin()
      .from('user_credits')
      .upsert(
        { user_id: userId, [column]: current + 1, updated_at: new Date().toISOString() },
        { onConflict: 'user_id' }
      )
  }
  // Daily-usage rows were bumped for every success path; decrement them too.
  const table = USAGE_TABLE[feature]
  const current = await getDailyUsage(userId, table)
  if (current > 0) {
    await admin().from(table).upsert(
      { user_id: userId, day: todayUTC(), count: current - 1, updated_at: new Date().toISOString() },
      { onConflict: 'user_id,day' }
    )
  }
}

/**
 * Read-only status snapshot for the UI (e.g. "remaining today: 3/5").
 * Does not consume anything.
 */
export async function getStatus(userId: string, feature: PaidFeature) {
  const profile = await getProfile(userId)
  const isPremium = isPremiumActive(profile)
  const used = await getDailyUsage(userId, USAGE_TABLE[feature])

  if (isPremium) {
    const limit = PREMIUM_DAILY_LIMITS[feature]
    return {
      tier: 'premium' as const,
      limit: limit === Infinity ? null : limit,
      used,
      remaining: limit === Infinity ? null : Math.max(0, limit - used),
    }
  }

  if (feature === 'ausbildung_reveal') {
    const limit = FREE_DAILY_LIMITS.ausbildung_reveal
    return { tier: 'free' as const, limit, used, remaining: Math.max(0, limit - used) }
  }

  // photo / cv / motivation — free daily allowance + (optional) paid credits
  const dailyLimit = FREE_DAILY_LIMITS[feature as keyof typeof FREE_DAILY_LIMITS] ?? 0
  const dailyRemaining = Math.max(0, dailyLimit - used)
  const column = CREDIT_COLUMN[feature as Exclude<PaidFeature, 'ausbildung_reveal'>]
  const { data } = await admin()
    .from('user_credits')
    .select(column)
    .eq('user_id', userId)
    .maybeSingle()
  const credits = (data as unknown as Record<string, number> | null)?.[column] ?? 0

  return {
    tier: 'free' as const,
    dailyLimit,
    dailyRemaining,
    used,
    credits,
  }
}

/**
 * Admin-only: grant helpers. Call from /api/admin/grant after verifying caller.is_admin.
 */
export async function setPremium(userId: string, isPremium: boolean, until: string | null = null) {
  await admin().from('profiles').update({ is_premium: isPremium, premium_until: until }).eq('user_id', userId)
}

export async function addCredits(userId: string, feature: 'photo' | 'cv' | 'motivation', amount: number) {
  const column = CREDIT_COLUMN[feature]
  const { data } = await admin()
    .from('user_credits')
    .select(column)
    .eq('user_id', userId)
    .maybeSingle()
  const current = (data as unknown as Record<string, number> | null)?.[column] ?? 0
  await admin().from('user_credits').upsert(
    { user_id: userId, [column]: current + amount, updated_at: new Date().toISOString() },
    { onConflict: 'user_id' }
  )
}

export async function grantUnlock(userId: string, kind: 'template' | 'german_level', key: string) {
  await admin().from('user_unlocks').upsert(
    { user_id: userId, kind, key },
    { onConflict: 'user_id,kind,key' }
  )
}

export async function revokeUnlock(userId: string, kind: 'template' | 'german_level', key: string) {
  await admin()
    .from('user_unlocks')
    .delete()
    .eq('user_id', userId)
    .eq('kind', kind)
    .eq('key', key)
}

export async function isAdmin(userId: string): Promise<boolean> {
  const p = await getProfile(userId)
  return !!p?.is_admin
}

/**
 * Look up a user by email (admin search). Uses the service role auth admin API
 * to avoid exposing auth.users to RLS.
 */
export async function findUserByEmail(email: string) {
  // Supabase admin listUsers doesn't support email filtering in v2, so we
  // paginate through auth.users until we find the user. Previous version
  // only fetched page 1 (up to 1000) which missed users on later pages —
  // a Gmail/OAuth signup that landed on page 2 would silently not appear
  // in the admin search even though they exist.
  const a = admin()
  const needle = email.trim().toLowerCase()
  const PER_PAGE = 1000
  const MAX_PAGES = 10 // safety cap = 10k users
  let user: any = null
  for (let page = 1; page <= MAX_PAGES; page++) {
    const { data } = await a.auth.admin.listUsers({ page, perPage: PER_PAGE })
    const found = data?.users?.find(u => (u.email ?? '').toLowerCase() === needle)
    if (found) { user = found; break }
    if (!data?.users || data.users.length < PER_PAGE) break // last page
  }
  if (!user) return null

  const profile = await getProfile(user.id)
  const { data: credits } = await admin()
    .from('user_credits')
    .select('photo_credits, cv_enhance_credits, motivation_credits')
    .eq('user_id', user.id)
    .maybeSingle()
  const { data: unlocks } = await admin()
    .from('user_unlocks')
    .select('kind, key')
    .eq('user_id', user.id)

  return {
    id: user.id,
    email: user.email ?? '',
    is_admin: !!profile?.is_admin,
    is_premium: !!profile?.is_premium,
    premium_until: profile?.premium_until ?? null,
    motivation_free_used: !!(profile as any)?.motivation_free_used,
    credits: {
      photo: credits?.photo_credits ?? 0,
      cv: credits?.cv_enhance_credits ?? 0,
      motivation: credits?.motivation_credits ?? 0,
    },
    unlocks: (unlocks ?? []).map(u => ({ kind: u.kind as 'template' | 'german_level', key: u.key })),
  }
}

/** List all users with their entitlement snapshots. Returns up to `limit`
 *  users (default 200) ordered by signup date desc. Server-rendered for
 *  the admin users dashboard. */
export async function listAllUsers(limit = 200) {
  // Paginate auth.users until we have `limit` rows or we hit the last
  // page. The previous version only fetched page 1 — Supabase listUsers
  // pages at 1000 per call, so accounts past row #1000 silently never
  // appeared in the admin user list (and therefore in its email search).
  const a = admin()
  const PER_PAGE = 1000
  const MAX_PAGES = 10 // safety cap = 10k users
  const users: any[] = []
  for (let page = 1; page <= MAX_PAGES && users.length < limit; page++) {
    const { data } = await a.auth.admin.listUsers({ page, perPage: PER_PAGE })
    const got = data?.users ?? []
    users.push(...got)
    if (got.length < PER_PAGE) break // reached the last page
  }
  // Trim to requested limit (we may have over-fetched on the final page).
  if (users.length > limit) users.length = limit

  if (users.length === 0) return []

  const ids = users.map(u => u.id)

  // Batch-fetch profiles
  const { data: profiles } = await admin()
    .from('profiles')
    .select('user_id, is_admin, is_premium, premium_until, motivation_free_used, status')
    .in('user_id', ids)
  const profilesById: Record<string, any> = {}
  for (const p of profiles ?? []) profilesById[p.user_id] = p

  // Batch-fetch credits
  const { data: credits } = await admin()
    .from('user_credits')
    .select('user_id, photo_credits, cv_enhance_credits, motivation_credits')
    .in('user_id', ids)
  const creditsById: Record<string, any> = {}
  for (const c of credits ?? []) creditsById[c.user_id] = c

  // Batch-fetch unlocks
  const { data: unlocks } = await admin()
    .from('user_unlocks')
    .select('user_id, kind, key')
    .in('user_id', ids)
  const unlocksById: Record<string, { kind: 'template' | 'german_level'; key: string }[]> = {}
  for (const u of unlocks ?? []) {
    if (!unlocksById[u.user_id]) unlocksById[u.user_id] = []
    unlocksById[u.user_id].push({ kind: u.kind as 'template' | 'german_level', key: u.key })
  }

  return users.map(u => {
    const p = profilesById[u.id] || {}
    const c = creditsById[u.id] || {}
    return {
      id: u.id,
      email: u.email ?? '',
      created_at: u.created_at ?? null,
      last_sign_in_at: u.last_sign_in_at ?? null,
      banned_until: (u as any).banned_until ?? null,
      is_admin: !!p.is_admin,
      is_premium: !!p.is_premium,
      premium_until: p.premium_until ?? null,
      motivation_free_used: !!p.motivation_free_used,
      status: p.status ?? null,
      credits: {
        photo: c.photo_credits ?? 0,
        cv: c.cv_enhance_credits ?? 0,
        motivation: c.motivation_credits ?? 0,
      },
      unlocks: unlocksById[u.id] ?? [],
    }
  }).sort((a, b) => {
    const ad = a.created_at ? new Date(a.created_at).getTime() : 0
    const bd = b.created_at ? new Date(b.created_at).getTime() : 0
    return bd - ad
  })
}

/** Admin-only: ban or unban a user. duration in hours, 0 to unban,
 *  Number.POSITIVE_INFINITY for permanent. */
export async function setBan(userId: string, hours: number) {
  if (!hours || hours <= 0) {
    await admin().auth.admin.updateUserById(userId, { ban_duration: 'none' as any })
    return
  }
  if (!Number.isFinite(hours)) {
    // ~100 years
    await admin().auth.admin.updateUserById(userId, { ban_duration: '876000h' as any })
    return
  }
  await admin().auth.admin.updateUserById(userId, { ban_duration: `${Math.round(hours)}h` as any })
}

/** Admin-only: hard-delete a user (cascades through profiles/credits/etc). */
export async function deleteUser(userId: string) {
  await admin().auth.admin.deleteUser(userId)
}

/** Admin-only: restore the one-time free motivation letter try. */
export async function resetMotivationFreeTry(userId: string) {
  await admin()
    .from('profiles')
    .update({ motivation_free_used: false })
    .eq('user_id', userId)
}
