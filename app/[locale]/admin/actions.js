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
  redirect('/admin')
}
