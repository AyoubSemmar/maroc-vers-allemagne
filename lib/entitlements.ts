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

// ── Daily cap for free users (ausbildung reveal only) ──────────
export const FREE_DAILY_LIMITS = {
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

async function bumpDailyUsage(userId: string, table: string): Promise<number> {
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

  // 2. Free lifetime quota (motivation only — every account gets 1 free use)
  if (paid === 'motivation' && !(profile as any)?.motivation_free_used) {
    await admin()
      .from('profiles')
      .update({ motivation_free_used: true })
      .eq('user_id', userId)
    await bumpDailyUsage(userId, USAGE_TABLE.motivation)
    return { allowed: true, source: 'free_lifetime' }
  }

  // 3. Free daily quota (ausbildung_reveal only)
  if (paid === 'ausbildung_reveal') {
    const limit = FREE_DAILY_LIMITS.ausbildung_reveal
    const used = await getDailyUsage(userId, USAGE_TABLE.ausbildung_reveal)
    if (used >= limit) {
      return { allowed: false, reason: 'free_daily_limit', remaining: 0 }
    }
    const next = await bumpDailyUsage(userId, USAGE_TABLE.ausbildung_reveal)
    return { allowed: true, source: 'free_daily', remaining: Math.max(0, limit - next) }
  }

  // 3. Pay-per-use credits
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

  // Credit-based
  const column = CREDIT_COLUMN[feature as Exclude<PaidFeature, 'ausbildung_reveal'>]
  const { data } = await admin()
    .from('user_credits')
    .select(column)
    .eq('user_id', userId)
    .maybeSingle()
  const credits = (data as unknown as Record<string, number> | null)?.[column] ?? 0
  return { tier: 'free' as const, credits, used }
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
  // Supabase admin listUsers doesn't support filtering by email directly in v2;
  // we paginate the first page (up to 1000) and match client-side.
  // For a small user base this is fine.
  const { data } = await admin().auth.admin.listUsers({ page: 1, perPage: 1000 })
  const needle = email.trim().toLowerCase()
  const user = data?.users.find(u => (u.email ?? '').toLowerCase() === needle)
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

/** Admin-only: restore the one-time free motivation letter try. */
export async function resetMotivationFreeTry(userId: string) {
  await admin()
    .from('profiles')
    .update({ motivation_free_used: false })
    .eq('user_id', userId)
}
