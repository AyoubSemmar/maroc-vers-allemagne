'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
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

export async function addArticle(formData) {
  const title = formData.get('title')
  const summary = formData.get('summary')
  const content = formData.get('content')
  const category = formData.get('category')
  const date = formData.get('date')

  await supabase.from('articles').insert([{ title, summary, content, category, date }])
  redirect('/admin')
}

export async function deleteArticle(formData) {
  const id = formData.get('id')
  await supabase.from('articles').delete().eq('id', id)
  redirect('/admin')
}
