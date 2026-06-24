// Lightweight per-locale strings for the live-classes feature. It targets a
// Moroccan audience, so we cover ar/fr/en/de inline instead of adding a key to
// all 12 message files; anything else falls back to English.
export type ClassesStrings = typeof EN

const EN = {
  title: 'Live German classes',
  subtitle: 'Join a small A1 group taught live online.',
  level: 'Level A1',
  perMonth: 'MAD/month',
  seatsLeft: 'seats',
  full: 'Full',
  starting: 'Full — starting',
  book: 'Reserve my seat',
  booking: 'Reserving…',
  yourGroup: 'You are enrolled',
  enterClass: 'Enter the classroom',
  cancel: 'Cancel my seat',
  loginToBook: 'Log in to reserve',
  payNote: 'Payment is arranged off-site after you reserve (200 MAD/month).',
  alreadyMsg: 'You already hold a seat in another group — cancel it first.',
  fullMsg: 'This group just filled up. Pick another.',
  errMsg: 'Something went wrong. Try again.',
}

const FR: ClassesStrings = {
  title: 'Cours d’allemand en direct',
  subtitle: 'Rejoignez un petit groupe A1 en cours direct en ligne.',
  level: 'Niveau A1',
  perMonth: 'DH/mois',
  seatsLeft: 'places',
  full: 'Complet',
  starting: 'Complet — démarre',
  book: 'Réserver ma place',
  booking: 'Réservation…',
  yourGroup: 'Vous êtes inscrit',
  enterClass: 'Accéder à la classe',
  cancel: 'Annuler ma place',
  loginToBook: 'Connectez-vous pour réserver',
  payNote: 'Le paiement se fait hors site après réservation (200 DH/mois).',
  alreadyMsg: 'Vous avez déjà une place dans un autre groupe — annulez-la d’abord.',
  fullMsg: 'Ce groupe vient d’être complet. Choisissez-en un autre.',
  errMsg: 'Une erreur est survenue. Réessayez.',
}

const AR: ClassesStrings = {
  title: 'دروس الألمانية المباشرة',
  subtitle: 'انضم إلى مجموعة صغيرة من المستوى A1 في دروس مباشرة عبر الإنترنت.',
  level: 'المستوى A1',
  perMonth: 'درهم/شهر',
  seatsLeft: 'مقاعد',
  full: 'مكتمل',
  starting: 'مكتمل — يبدأ',
  book: 'احجز مقعدي',
  booking: 'جارٍ الحجز…',
  yourGroup: 'أنت مسجَّل',
  enterClass: 'ادخل إلى الحصة',
  cancel: 'إلغاء مقعدي',
  loginToBook: 'سجّل الدخول للحجز',
  payNote: 'يتم الدفع خارج الموقع بعد الحجز (200 درهم/شهر).',
  alreadyMsg: 'لديك مقعد في مجموعة أخرى — ألغِه أولاً.',
  fullMsg: 'اكتملت هذه المجموعة للتو. اختر مجموعة أخرى.',
  errMsg: 'حدث خطأ ما. حاول مرة أخرى.',
}

const DE: ClassesStrings = {
  title: 'Deutschkurse live',
  subtitle: 'Tritt einer kleinen A1-Gruppe im Live-Onlinekurs bei.',
  level: 'Niveau A1',
  perMonth: 'MAD/Monat',
  seatsLeft: 'Plätze',
  full: 'Ausgebucht',
  starting: 'Ausgebucht — startet',
  book: 'Platz reservieren',
  booking: 'Reservierung…',
  yourGroup: 'Du bist angemeldet',
  enterClass: 'Zum Klassenraum',
  cancel: 'Platz stornieren',
  loginToBook: 'Zum Reservieren anmelden',
  payNote: 'Die Zahlung erfolgt nach der Reservierung außerhalb der Website (200 MAD/Monat).',
  alreadyMsg: 'Du hast bereits einen Platz in einer anderen Gruppe — storniere ihn zuerst.',
  fullMsg: 'Diese Gruppe ist gerade voll geworden. Wähle eine andere.',
  errMsg: 'Etwas ist schiefgelaufen. Bitte erneut versuchen.',
}

const MAP: Record<string, ClassesStrings> = { en: EN, fr: FR, ar: AR, de: DE }

export function classesStrings(locale: string): ClassesStrings {
  return MAP[locale] ?? EN
}
