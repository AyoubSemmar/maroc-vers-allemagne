'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { createClient } from '@supabase/supabase-js'

// Anon-key client. Used only for Supabase Storage uploads where the
// bucket policy already controls access — reading the resulting public
// URL doesn't need elevated rights.
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

// Service-role client. Bypasses RLS, so it can write to articles,
// ausbildung_jobs, universities, listings, etc. — all of which now
// have RLS enabled with read-only public policies (see migration
// 2026-04-28_lock_down_articles_jobs_unis.sql). Every write action in
// this file MUST go through this client and MUST be preceded by a
// requireAdmin() cookie check, since the service-role key bypasses
// every database-level guard.
function adminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { persistSession: false, autoRefreshToken: false } },
  )
}

export async function login(formData) {
  const password = formData.get('password')
  if (password === process.env.ADMIN_PASSWORD) {
    const cookieStore = await cookies()
    // httpOnly: not readable by JS (anti-XSS).
    // secure: only sent over HTTPS.
    // sameSite: 'strict' — admin actions never need to be triggered by
    //           cross-site links, and nothing in the admin UI relies on
    //           inbound nav from external surfaces (Calendly etc. land
    //           on public pages, not /console-x7k9). Strict beats lax here.
    // maxAge: 4h. Was 24h; shorter window limits blast radius if the
    //         cookie ever leaks (XSS, shared device, browser extension).
    //         Re-login every working session is cheap.
    cookieStore.set('admin_auth', 'true', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 60 * 60 * 4,
    })
  }
  redirect('/console-x7k9')
}

export async function logout() {
  const cookieStore = await cookies()
  cookieStore.delete('admin_auth')
  redirect('/console-x7k9')
}

async function uploadImage(imageFile, bucket = 'article-images') {
  if (!imageFile || typeof imageFile === 'string' || imageFile.size === 0) return null
  // Sanitize filename — spaces / non-ascii break Supabase storage keys
  const safeName = imageFile.name
    .normalize('NFKD')
    .replace(/[^\w.\-]+/g, '-')
    .replace(/-+/g, '-')
  const filename = `${Date.now()}-${safeName}`
  const arrayBuffer = await imageFile.arrayBuffer()
  const buffer = new Uint8Array(arrayBuffer)
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(filename, buffer, { contentType: imageFile.type })
  if (error) {
    console.error('uploadImage failed:', error)
    return null
  }
  const { data: urlData } = supabase.storage
    .from(bucket)
    .getPublicUrl(data.path)
  return urlData.publicUrl
}

/** Throw a redirect to the admin login if the caller doesn't have the
 *  admin_auth cookie. Used to gate every server action below — Next.js
 *  server actions are RPC endpoints reachable by anyone who knows the
 *  internal hash, so cookie auth must be checked inside each one. */
async function requireAdmin() {
  const cookieStore = await cookies()
  if (cookieStore.get('admin_auth')?.value !== 'true') {
    redirect('/console-x7k9')
  }
}

export async function addArticle(formData) {
  await requireAdmin()
  const title = formData.get('title')
  const summary = formData.get('summary')
  const content = formData.get('content')
  const category = formData.get('category')
  const date = formData.get('date')
  const imageFile = formData.get('image')
  const faqsRaw = formData.get('faqs')
  const faqs = faqsRaw ? JSON.parse(faqsRaw) : []
  const featured = formData.get('featured') === 'true'

  const image_url = await uploadImage(imageFile)

  await adminClient().from('articles').insert([{ title, summary, content, category, date, image_url, faqs, featured }])
  redirect('/console-x7k9')
}

export async function updateArticle(formData) {
  await requireAdmin()
  const id = formData.get('id')
  const title = formData.get('title')
  const summary = formData.get('summary')
  const content = formData.get('content')
  const category = formData.get('category')
  const date = formData.get('date')
  const imageFile = formData.get('image')
  const faqsRaw = formData.get('faqs')
  const faqs = faqsRaw ? JSON.parse(faqsRaw) : []
  const featured = formData.get('featured') === 'true'

  const updates = { title, summary, content, category, date, faqs, featured }

  const newImageUrl = await uploadImage(imageFile)
  if (newImageUrl) updates.image_url = newImageUrl

  const { error } = await adminClient().from('articles').update(updates).eq('id', id)
  if (error) {
    console.error('updateArticle failed:', error)
    throw new Error(`فشل تحديث المقال: ${error.message}`)
  }
  revalidatePath(`/articles/${id}`)
  revalidatePath(`/articles`)
  revalidatePath('/console-x7k9')
  redirect('/console-x7k9')
}

export async function deleteArticle(formData) {
  await requireAdmin()
  const id = formData.get('id')
  await adminClient().from('articles').delete().eq('id', id)
  redirect('/console-x7k9')
}

export async function deleteListing(formData) {
  const cookieStore = await cookies()
  if (cookieStore.get('admin_auth')?.value !== 'true') redirect('/console-x7k9')

  const id = formData.get('id')
  // service_role bypasses RLS so we can delete any user's listing.
  await adminClient().from('listings').delete().eq('id', id)
  revalidatePath('/console-x7k9')
  revalidatePath('/console-x7k9/content')
  redirect('/console-x7k9/content')
}

/**
 * Add an apartment listing from the admin panel. Unlike the public
 * /listings/new flow (which uses the user's profile.whatsapp), the
 * admin form lets you type any WhatsApp number — useful when posting
 * on behalf of a third party.
 *
 * Service role bypasses RLS; user_id is set to ADMIN_LISTING_USER_ID
 * env var or null. Images are uploaded to the article-images bucket.
 */
export async function addListing(formData) {
  const cookieStore = await cookies()
  if (cookieStore.get('admin_auth')?.value !== 'true') redirect('/console-x7k9')

  // Outer try/catch surfaces ANY pre-insert error (uploadImage throw,
  // adminClient init failure, formData parsing, env var missing, etc.)
  // to the page banner instead of letting it hit the generic Next.js
  // error boundary ("Something went wrong"), which hides the cause.
  // We re-throw NEXT_REDIRECT digests so legitimate redirect() calls
  // (success path, validation failures) keep working.
  try {
    const db = adminClient()

    const title       = (formData.get('title')       || '').toString().trim()
    const description = (formData.get('description') || '').toString().trim()
    const city        = (formData.get('city')        || '').toString().trim()
    const type        = (formData.get('type')        || 'شقة').toString().trim()
    const priceRaw    = (formData.get('price')       || '').toString().trim()
    const whatsappRaw = (formData.get('whatsapp')    || '').toString().trim()
    // Anmeldung is a tri-state in storage (true / false / null = unknown)
    // but the form is a tri-state radio with explicit yes/no/skip options
    // so admin / power users can leave it blank if they don't know.
    const anmeldungRaw = (formData.get('with_anmeldung') || '').toString().trim()
    const with_anmeldung =
      anmeldungRaw === 'true'  ? true  :
      anmeldungRaw === 'false' ? false :
                                 null
    // Gender preference — male/female/any (null = unspecified). Validated
    // here AND at the DB layer (check constraint in the migration).
    const genderRaw = (formData.get('gender_target') || '').toString().trim()
    const gender_target =
      genderRaw === 'male' || genderRaw === 'female' || genderRaw === 'any'
        ? genderRaw
        : null

    if (!title || !description || !city || !whatsappRaw) {
      redirect('/console-x7k9/content?err=missing')
    }

    // Normalise WhatsApp: strip everything except digits + leading +.
    const whatsapp = whatsappRaw.replace(/[^\d+]/g, '')

    // Upload images (multiple supported).
    const imageUrls = []
    const files = formData.getAll('images').filter((f) => f && typeof f !== 'string' && f.size > 0)
    for (const file of files) {
      const url = await uploadImage(file)
      if (url) imageUrls.push(url)
    }

    const adminUserId = process.env.ADMIN_LISTING_USER_ID || null

    // Build the row and only include the new columns if they have a value.
    // Defensive: if the SQL migration for with_anmeldung or gender_target
    // hasn't been run yet in this Supabase project, sending those keys
    // makes Postgres reject the whole INSERT with "column does not exist".
    // Skipping null values lets the action keep working on a DB that's
    // a migration behind, while still saving the value when set.
    const row = {
      user_id: adminUserId,
      title,
      description,
      city,
      type,
      price: priceRaw ? Number(priceRaw) : null,
      whatsapp,
      image_url: imageUrls[0] || '',
      images: imageUrls,
      available: true,
      expires_at: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(), // 60 days
    }
    if (with_anmeldung !== null) row.with_anmeldung = with_anmeldung
    if (gender_target  !== null) row.gender_target  = gender_target

    const { error } = await db.from('listings').insert([row])
    if (error) {
      console.error('[admin/addListing] insert failed:', error)
      // Throwing hits the error boundary (generic "Something went wrong"
      // page) and hides the actual reason. Redirect with the message
      // in a query param so the form page can render it as a banner.
      const msg = `${error.message}${error.details ? ' — ' + error.details : ''}${error.hint ? ' (hint: ' + error.hint + ')' : ''}`
      redirect('/console-x7k9/content?err=' + encodeURIComponent(msg))
    }

    revalidatePath('/console-x7k9/content')
    revalidatePath('/listings')
    redirect('/console-x7k9/content')
  } catch (e) {
    // Next.js redirect() throws a special error with digest starting
    // with NEXT_REDIRECT — those are control flow, not failures, so we
    // re-throw to let the framework handle them.
    if (e?.digest?.startsWith?.('NEXT_REDIRECT')) throw e
    console.error('[admin/addListing] uncaught:', e)
    const msg = e?.message || (typeof e === 'string' ? e : JSON.stringify(e))
    redirect('/console-x7k9/content?err=' + encodeURIComponent(msg))
  }
}

// ─────────────────────────────────────────────────────────────────
// Universities CRUD (admin panel)
//
// `id` on the universities table is a slug (text PK). For manual entries
// we derive the slug from name_de — same shape used by the import script.
// Logos go to the `university-logos` storage bucket; if the bucket is
// missing we fall back to article-images so the upload always succeeds.
// ─────────────────────────────────────────────────────────────────

function slugify(s) {
  return (s || '')
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)
}

async function uploadLogo(file) {
  // Try the dedicated bucket first — fall back to article-images so admins
  // never get a silent failure if the bucket hasn't been created yet.
  const url = await uploadImage(file, 'university-logos')
  if (url) return url
  return uploadImage(file, 'article-images')
}

function uniFromForm(formData) {
  const get = (k) => (formData.get(k) || '').toString().trim()
  const num = (k) => {
    const v = get(k)
    return v ? Number(v) : null
  }
  return {
    name_de: get('name_de'),
    name_en: get('name_en') || null,
    name_ar: get('name_ar') || null,
    name_fr: get('name_fr') || null,
    city: get('city') || null,
    state: get('state') || null,
    type: get('type') || null,
    is_public: formData.get('is_public') === 'true',
    founded: num('founded'),
    student_count: num('student_count'),
    website: get('website') || null,
    lat: num('lat'),
    lng: num('lng'),
    description_de: get('description_de') || null,
    description_en: get('description_en') || null,
    description_ar: get('description_ar') || null,
    description_fr: get('description_fr') || null,
  }
}

export async function addUniversity(formData) {
  await requireAdmin()
  const row = uniFromForm(formData)
  if (!row.name_de) redirect('/console-x7k9/unis?err=missing_name')

  // Stable slug; if a collision exists, suffix with a short timestamp.
  let id = slugify(row.name_de)
  if (!id) id = `uni-${Date.now()}`
  const db = adminClient()
  const { data: existing } = await db
    .from('universities').select('id').eq('id', id).maybeSingle()
  if (existing) id = `${id}-${Date.now().toString(36).slice(-4)}`

  const logoFile = formData.get('logo')
  const logo_url = await uploadLogo(logoFile)

  const { error } = await db.from('universities').insert([{ id, ...row, logo_url }])
  if (error) {
    console.error('addUniversity failed:', error)
    throw new Error(`فشل إضافة الجامعة: ${error.message}`)
  }
  revalidatePath('/console-x7k9/unis')
  revalidatePath('/universities')
  revalidatePath('/dashboard/universities')
  redirect('/console-x7k9/unis')
}

export async function updateUniversity(formData) {
  await requireAdmin()
  const id = (formData.get('id') || '').toString()
  if (!id) redirect('/console-x7k9/unis')
  const updates = uniFromForm(formData)

  const logoFile = formData.get('logo')
  const newLogo = await uploadLogo(logoFile)
  if (newLogo) updates.logo_url = newLogo

  const { error } = await adminClient().from('universities').update(updates).eq('id', id)
  if (error) {
    console.error('updateUniversity failed:', error)
    throw new Error(`فشل تحديث الجامعة: ${error.message}`)
  }
  revalidatePath('/console-x7k9/unis')
  revalidatePath(`/universities/${id}`)
  revalidatePath('/universities')
  revalidatePath('/dashboard/universities')
  redirect('/console-x7k9/unis')
}

export async function deleteUniversity(formData) {
  await requireAdmin()
  const id = (formData.get('id') || '').toString()
  if (!id) redirect('/console-x7k9/unis')
  const { error } = await adminClient().from('universities').delete().eq('id', id)
  if (error) {
    console.error('deleteUniversity failed:', error)
    throw new Error(`فشل حذف الجامعة: ${error.message}`)
  }
  revalidatePath('/console-x7k9/unis')
  revalidatePath('/universities')
  revalidatePath('/dashboard/universities')
  redirect('/console-x7k9/unis')
}

// ─────────────────────────────────────────────────────────────────
// Ausbildung jobs CRUD (admin panel)
//
// Manual entries get an external_id of the form `manual-<ts>-<rand>`
// so the unique-constraint scraper deduper never collides with them.
// `enrichment_json` is left null — the listing renders fine without it.
// ─────────────────────────────────────────────────────────────────

function jobFromForm(formData) {
  const get = (k) => {
    const v = formData.get(k)
    return v ? v.toString().trim() : ''
  }
  const requireOne = ['apply_url', 'contact_email', 'phone']
  const apply_url     = get('apply_url')     || null
  const contact_email = get('contact_email') || null
  const phone         = get('phone')         || null
  if (!apply_url && !contact_email && !phone) {
    throw new Error(`At least one of ${requireOne.join(' / ')} is required`)
  }
  const publishedRaw = get('published_at')
  return {
    title:          get('title'),
    company:        get('company'),
    location:       get('location') || null,
    description:    get('description') || null,
    category:       get('category'),
    anstellungsart: get('anstellungsart') || null,
    external_url:   get('external_url') || null,
    apply_url,
    contact_email,
    phone,
    published_at:   publishedRaw ? new Date(publishedRaw).toISOString() : null,
  }
}

export async function addJob(formData) {
  await requireAdmin()
  const row = jobFromForm(formData)
  if (!row.title || !row.company || !row.category) {
    redirect('/console-x7k9/jobs?err=missing')
  }
  const external_id = `manual-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
  const { error } = await adminClient()
    .from('ausbildung_jobs')
    .insert([{ ...row, external_id }])
  if (error) {
    console.error('addJob failed:', error)
    throw new Error(`فشل إضافة العرض: ${error.message}`)
  }
  revalidatePath('/console-x7k9/jobs')
  revalidatePath('/ausbildung-jobs')
  revalidatePath('/dashboard/browse')
  redirect('/console-x7k9/jobs')
}

export async function updateJob(formData) {
  await requireAdmin()
  const id = (formData.get('id') || '').toString()
  if (!id) redirect('/console-x7k9/jobs')
  const updates = jobFromForm(formData)
  const { error } = await adminClient()
    .from('ausbildung_jobs')
    .update(updates)
    .eq('id', id)
  if (error) {
    console.error('updateJob failed:', error)
    throw new Error(`فشل تحديث العرض: ${error.message}`)
  }
  revalidatePath('/console-x7k9/jobs')
  revalidatePath('/ausbildung-jobs')
  revalidatePath('/dashboard/browse')
  redirect('/console-x7k9/jobs')
}

export async function deleteJob(formData) {
  await requireAdmin()
  const id = (formData.get('id') || '').toString()
  if (!id) redirect('/console-x7k9/jobs')
  const { error } = await adminClient().from('ausbildung_jobs').delete().eq('id', id)
  if (error) {
    console.error('deleteJob failed:', error)
    throw new Error(`فشل حذف العرض: ${error.message}`)
  }
  revalidatePath('/console-x7k9/jobs')
  revalidatePath('/ausbildung-jobs')
  revalidatePath('/dashboard/browse')
  redirect('/console-x7k9/jobs')
}
