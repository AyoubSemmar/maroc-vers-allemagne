const fs = require('fs')
const path = require('path')

const edit = {
  ar: {
    loading: 'جاري التحميل...',
    noPermission: 'ليس لديك صلاحية لتعديل هذا الإعلان',
    backToListing: '→ العودة للإعلان',
    title: 'تعديل إعلان السكن',
    available: 'الإعلان متاح',
    existingImages: 'الصور الحالية:',
    newImages: 'الصور الجديدة:',
    saveErr: 'حدث خطأ أثناء الحفظ: {msg}',
    saving: 'جاري الحفظ...',
    save: 'حفظ التعديلات',
  },
  fr: {
    loading: 'Chargement...',
    noPermission: 'Vous n\'avez pas la permission de modifier cette annonce',
    backToListing: '← Retour à l\'annonce',
    title: 'Modifier l\'annonce de logement',
    available: 'Annonce disponible',
    existingImages: 'Photos actuelles :',
    newImages: 'Nouvelles photos :',
    saveErr: 'Erreur lors de l\'enregistrement : {msg}',
    saving: 'Enregistrement...',
    save: 'Enregistrer les modifications',
  },
  en: {
    loading: 'Loading...',
    noPermission: 'You do not have permission to edit this listing',
    backToListing: '← Back to listing',
    title: 'Edit housing listing',
    available: 'Listing available',
    existingImages: 'Current photos:',
    newImages: 'New photos:',
    saveErr: 'Error saving: {msg}',
    saving: 'Saving...',
    save: 'Save changes',
  },
  de: {
    loading: 'Wird geladen...',
    noPermission: 'Du hast keine Berechtigung, diese Anzeige zu bearbeiten',
    backToListing: '← Zurück zur Anzeige',
    title: 'Wohnungsanzeige bearbeiten',
    available: 'Anzeige verfügbar',
    existingImages: 'Aktuelle Fotos:',
    newImages: 'Neue Fotos:',
    saveErr: 'Fehler beim Speichern: {msg}',
    saving: 'Wird gespeichert...',
    save: 'Änderungen speichern',
  },
}

for (const loc of ['ar', 'fr', 'en', 'de']) {
  const p = path.join(__dirname, '..', 'messages', `${loc}.json`)
  const j = JSON.parse(fs.readFileSync(p, 'utf8'))
  j.listings.edit = edit[loc]
  fs.writeFileSync(p, JSON.stringify(j, null, 2) + '\n', 'utf8')
  console.log(`✓ ${loc}.json`)
}
