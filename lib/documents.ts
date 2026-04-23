import { createClient } from '@/lib/supabase-browser'

// ── Document types ────────────────────────────────────────────
export type DocumentType =
  | 'lebenslauf'
  | 'motivationsschreiben'
  | 'praktikumsbescheinigung'
  | 'arbeitsbescheinigung'
  | 'sprachzertifikat'
  | 'akademisches_zertifikat'

export type DocumentSource = 'generated' | 'upload'

export const DOC_TYPE_LABELS: Record<DocumentType, { de: string; ar: string; icon: string }> = {
  lebenslauf:               { de: 'Lebenslauf',               ar: 'السيرة الذاتية',   icon: '📄' },
  motivationsschreiben:     { de: 'Motivationsschreiben',     ar: 'رسالة تحفيزية',    icon: '✍️' },
  praktikumsbescheinigung:  { de: 'Praktikumsbescheinigung',  ar: 'شهادة تدريب',      icon: '🏢' },
  arbeitsbescheinigung:     { de: 'Arbeitsbescheinigung',     ar: 'شهادة عمل',        icon: '💼' },
  sprachzertifikat:         { de: 'Sprachzertifikat',         ar: 'شهادة اللغة',      icon: '🗣' },
  akademisches_zertifikat:  { de: 'Akademisches Zertifikat', ar: 'شهادة دراسية',     icon: '🎓' },
}

export const UPLOAD_TYPES: DocumentType[] = [
  'lebenslauf',
  'motivationsschreiben',
  'praktikumsbescheinigung',
  'arbeitsbescheinigung',
  'sprachzertifikat',
  'akademisches_zertifikat',
]

export type UserDocument = {
  id: string
  user_id: string
  doc_type: DocumentType
  source: DocumentSource
  title: string
  cv_data?: Record<string, unknown> | null
  letter_text?: string | null
  file_path?: string | null
  file_url?: string | null
  created_at: string
}

// ── Fetch all documents for the current user ──────────────────
export async function fetchDocuments(): Promise<UserDocument[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('user_documents')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return (data ?? []) as UserDocument[]
}

// ── Save a generated CV ───────────────────────────────────────
export async function saveCvDocument(
  title: string,
  cvData: Record<string, unknown>
): Promise<UserDocument> {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { data, error } = await supabase
    .from('user_documents')
    .insert({
      user_id: user.id,
      doc_type: 'lebenslauf',
      source: 'generated',
      title,
      cv_data: cvData,
    })
    .select()
    .single()
  if (error) throw error
  return data as UserDocument
}

// ── Save a generated Anschreiben ─────────────────────────────
export async function saveAnschreibenDocument(
  title: string,
  letterText: string
): Promise<UserDocument> {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { data, error } = await supabase
    .from('user_documents')
    .insert({
      user_id: user.id,
      doc_type: 'motivationsschreiben',
      source: 'generated',
      title,
      letter_text: letterText,
    })
    .select()
    .single()
  if (error) throw error
  return data as UserDocument
}

// ── Upload a user's own file ──────────────────────────────────
export async function uploadDocument(
  file: File,
  title: string,
  docType: DocumentType
): Promise<UserDocument> {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const ext = file.name.split('.').pop() || 'pdf'
  const path = `${user.id}/${Date.now()}.${ext}`

  const { error: uploadError } = await supabase.storage
    .from('user-documents')
    .upload(path, file, { contentType: file.type, upsert: false })
  if (uploadError) throw uploadError

  const { data: urlData } = supabase.storage.from('user-documents').getPublicUrl(path)

  const { data, error } = await supabase
    .from('user_documents')
    .insert({
      user_id: user.id,
      doc_type: docType,
      source: 'upload',
      title,
      file_path: path,
      file_url: urlData.publicUrl,
    })
    .select()
    .single()
  if (error) throw error
  return data as UserDocument
}

// ── Delete a document (and its storage file if applicable) ───
export async function deleteDocument(doc: UserDocument): Promise<void> {
  const supabase = createClient()

  if (doc.source === 'upload' && doc.file_path) {
    await supabase.storage.from('user-documents').remove([doc.file_path])
  }

  const { error } = await supabase
    .from('user_documents')
    .delete()
    .eq('id', doc.id)
  if (error) throw error
}
