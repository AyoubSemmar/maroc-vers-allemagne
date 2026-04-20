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
  if (!imageFile || imageFile.size === 0) return null
  const filename = `${Date.now()}-${imageFile.name}`
  const arrayBuffer = await imageFile.arrayBuffer()
  const buffer = new Uint8Array(arrayBuffer)
  const { data, error } = await supabase.storage
    .from('article-images')
    .upload(filename, buffer, { contentType: imageFile.type })
  if (error) return null
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

  await supabase.from('articles').update(updates).eq('id', id)
  revalidatePath(`/articles/${id}`)
  revalidatePath('/admin')
  redirect('/admin')
}

export async function deleteArticle(formData) {
  const id = formData.get('id')
  await supabase.from('articles').delete().eq('id', id)
  redirect('/admin')
}
