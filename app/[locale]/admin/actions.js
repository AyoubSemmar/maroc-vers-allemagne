'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export async function login(formData) {
  const password = formData.get('password')
  if (password === process.env.ADMIN_PASSWORD) {
    const cookieStore = await cookies()
    cookieStore.set('admin_auth', 'true', { httpOnly: true, maxAge: 60 * 60 * 24 })
  }
  redirect('/admin')
}

export async function logout() {
  const cookieStore = await cookies()
  cookieStore.delete('admin_auth')
  redirect('/admin')
}

async function uploadImage(imageFile) {
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
    .from('article-images')
    .upload(filename, buffer, { contentType: imageFile.type })
  if (error) {
    console.error('uploadImage failed:', error)
    return null
  }
  const { data: urlData } = supabase.storage
    .from('article-images')
    .getPublicUrl(data.path)
  return urlData.publicUrl
}

export async function addArticle(formData) {
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

  await supabase.from('articles').insert([{ title, summary, content, category, date, image_url, faqs, featured }])
  redirect('/admin')
}

export async function updateArticle(formData) {
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

  const { error } = await supabase.from('articles').update(updates).eq('id', id)
  if (error) {
    console.error('updateArticle failed:', error)
    throw new Error(`فشل تحديث المقال: ${error.message}`)
  }
  revalidatePath(`/articles/${id}`)
  revalidatePath(`/articles`)
  revalidatePath('/admin')
  redirect('/admin')
}

export async function deleteArticle(formData) {
  const id = formData.get('id')
  await supabase.from('articles').delete().eq('id', id)
  redirect('/admin')
}

export async function deleteListing(formData) {
  const cookieStore = await cookies()
  if (cookieStore.get('admin_auth')?.value !== 'true') redirect('/admin')

  const id = formData.get('id')
  // Use service role key to bypass RLS and delete any user's listing
  const adminClient = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  )
  await adminClient.from('listings').delete().eq('id', id)
  revalidatePath('/admin')
  revalidatePath('/admin/content')
  redirect('/admin/content')
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
  if (cookieStore.get('admin_auth')?.value !== 'true') redirect('/admin')

  const adminClient = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
  )

  const title       = (formData.get('title')       || '').toString().trim()
  const description = (formData.get('description') || '').toString().trim()
  const city        = (formData.get('city')        || '').toString().trim()
  const type        = (formData.get('type')        || 'شقة').toString().trim()
  const priceRaw    = (formData.get('price')       || '').toString().trim()
  const whatsappRaw = (formData.get('whatsapp')    || '').toString().trim()

  if (!title || !description || !city || !whatsappRaw) {
    redirect('/admin/content?err=missing')
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

  await adminClient.from('listings').insert([{
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
  }])

  revalidatePath('/admin/content')
  revalidatePath('/listings')
  redirect('/admin/content')
}
