'use client'

import { useMemo, useState } from 'react'
import { Link } from '@/i18n/navigation'
import { dirFor, type AppLocale } from '@/i18n/routing'
import { pick3, type L3 } from '@/lib/toolStrings'

// Modified Bavarian Formula (modifizierte bayerische Formel) — the conversion
// German universities and uni-assist use:
//   x = 1 + 3 · (Nmax − Nd) / (Nmax − Nmin)
// Nmax = best grade of the foreign system, Nmin = minimum pass, Nd = yours.
// Result: 1.0 (best) … 4.0 (minimum pass); below pass = failed (5.0).

type Preset = { key: string; flag: string; label: L3; max: number; pass: number; note?: L3 }

const M = (en: string, fr: string, ar: string): L3 => ({ en, fr, ar })

const PRESETS: Preset[] = [
  { key: 'ma20', flag: '🇲🇦', label: M('Morocco / France / Tunisia / Algeria (0–20)', 'Maroc / France / Tunisie / Algérie (0–20)', 'المغرب / فرنسا / تونس / الجزائر (0–20)'), max: 20, pass: 10 },
  { key: 'iran20', flag: '🇮🇷', label: M('Iran (0–20)', 'Iran (0–20)', 'إيران (0–20)'), max: 20, pass: 10 },
  { key: 'pct40', flag: '🇮🇳', label: M('India / Pakistan — percentage (pass 40%)', 'Inde / Pakistan — pourcentage (seuil 40 %)', 'الهند / باكستان — نسبة مئوية (نجاح 40%)'), max: 100, pass: 40 },
  { key: 'cgpa10', flag: '🇮🇳', label: M('India — CGPA out of 10', 'Inde — CGPA sur 10', 'الهند — معدل من 10'), max: 10, pass: 4 },
  { key: 'gpa4', flag: '🇺🇸', label: M('USA / Canada — GPA 4.0', 'USA / Canada — GPA 4.0', 'أمريكا / كندا — GPA 4.0'), max: 4, pass: 2,
    note: M('Some universities count D (1.0) as the pass mark — edit the pass field if yours does.', 'Certaines universités prennent D (1,0) comme seuil — modifiez le champ si c’est votre cas.', 'بعض الجامعات تعتبر D (1.0) عتبة النجاح — عدّل الحقل إن كان ذلك ينطبق عليك.') },
  { key: 'uk70', flag: '🇬🇧', label: M('UK — percentage (First = 70)', 'Royaume-Uni — pourcentage (First = 70)', 'بريطانيا — نسبة مئوية (First = 70)'), max: 70, pass: 40,
    note: M('UK marks above 70 are rare, so 70 is used as the best grade — a First converts to 1.0.', 'Au-dessus de 70 les notes UK sont rares : 70 sert de note maximale — un First devient 1,0.', 'النقاط فوق 70 نادرة في بريطانيا، لذا تُعتمد 70 كأفضل علامة — درجة First تعادل 1.0.') },
  { key: 'tr4', flag: '🇹🇷', label: M('Turkey — GPA 4.0', 'Turquie — GPA 4.0', 'تركيا — GPA 4.0'), max: 4, pass: 2 },
  { key: 'cn100', flag: '🇨🇳', label: M('China (100, pass 60)', 'Chine (100, seuil 60)', 'الصين (100، نجاح 60)'), max: 100, pass: 60 },
  { key: 'ru5', flag: '🇷🇺', label: M('Russia / Ukraine / CIS (5-point)', 'Russie / Ukraine / CEI (sur 5)', 'روسيا / أوكرانيا (من 5)'), max: 5, pass: 3 },
  { key: 'br10', flag: '🇧🇷', label: M('Brazil / Spain / LatAm (0–10)', 'Brésil / Espagne / AmLat (0–10)', 'البرازيل / إسبانيا / أمريكا اللاتينية (0–10)'), max: 10, pass: 5 },
  { key: 'eg100', flag: '🇪🇬', label: M('Egypt / MENA — percentage (pass 50)', 'Égypte / MENA — pourcentage (seuil 50)', 'مصر / الشرق الأوسط — نسبة مئوية (نجاح 50)'), max: 100, pass: 50 },
  { key: 'custom', flag: '⚙️', label: M('Custom system', 'Système personnalisé', 'نظام مخصص'), max: 100, pass: 50 },
]

const S = {
  title: { en: 'German Grade Calculator (Bavarian Formula)', fr: 'Convertisseur de notes allemandes (formule bavaroise)', ar: 'حاسبة المعدل الألماني (المعادلة البافارية)' } as L3,
  sub: {
    en: 'Convert your grades from any system into the German 1.0–4.0 scale — the exact Modified Bavarian Formula that uni-assist and universities use.',
    fr: 'Convertissez vos notes de n’importe quel système vers l’échelle allemande 1,0–4,0 — la formule bavaroise modifiée utilisée par uni-assist et les universités.',
    ar: 'حوّل معدلك من أي نظام إلى السلم الألماني 1.0–4.0 — بنفس المعادلة البافارية المعدلة التي تعتمدها uni-assist والجامعات.',
  } as L3,
  system: { en: 'Your grading system', fr: 'Votre système de notation', ar: 'نظام التنقيط لديك' } as L3,
  max: { en: 'Best possible grade', fr: 'Meilleure note possible', ar: 'أعلى علامة ممكنة' } as L3,
  pass: { en: 'Minimum passing grade', fr: 'Note minimale de réussite', ar: 'أدنى علامة نجاح' } as L3,
  yours: { en: 'Your grade / average', fr: 'Votre note / moyenne', ar: 'علامتك / معدلك' } as L3,
  result: { en: 'German grade', fr: 'Note allemande', ar: 'المعدل الألماني' } as L3,
  scaleNote: { en: 'German scale: 1.0 is the best, 4.0 the minimum pass.', fr: 'Échelle allemande : 1,0 est la meilleure note, 4,0 le minimum.', ar: 'السلم الألماني: 1.0 هي الأفضل و4.0 حد النجاح الأدنى.' } as L3,
  labels: {
    en: { sehr: 'sehr gut (excellent)', gut: 'gut (good)', bef: 'befriedigend (satisfactory)', aus: 'ausreichend (sufficient)', fail: 'nicht bestanden (failed)' },
    fr: { sehr: 'sehr gut (excellent)', gut: 'gut (bien)', bef: 'befriedigend (assez bien)', aus: 'ausreichend (passable)', fail: 'nicht bestanden (échec)' },
    ar: { sehr: 'sehr gut (ممتاز)', gut: 'gut (جيد)', bef: 'befriedigend (مقبول جداً)', aus: 'ausreichend (كافٍ)', fail: 'nicht bestanden (راسب)' },
  } as L3<{ sehr: string; gut: string; bef: string; aus: string; fail: string }>,
  ctx13: { en: 'Strong grade: competitive for scholarships (DAAD, Deutschlandstipendium) and selective programs.', fr: 'Excellente note : compétitive pour les bourses (DAAD, Deutschlandstipendium) et les cursus sélectifs.', ar: 'معدل قوي: منافس للمنح (DAAD وDeutschlandstipendium) والبرامج الانتقائية.' } as L3,
  ctx25: { en: 'Solid grade: meets the bar for most university programs and Blue Card recognition.', fr: 'Bonne note : suffisante pour la plupart des cursus universitaires.', ar: 'معدل جيد: يفي بمتطلبات معظم البرامج الجامعية.' } as L3,
  ctx40: { en: 'Passing grade: admission depends on the program — NC-free programs remain open.', fr: 'Note de passage : l’admission dépend du cursus — les filières sans NC restent ouvertes.', ar: 'معدل نجاح: القبول يعتمد على التخصص — البرامج بدون NC تبقى متاحة.' } as L3,
  ctxFail: { en: 'Below the German pass threshold — check whether your system’s pass mark was entered correctly.', fr: 'Sous le seuil de réussite allemand — vérifiez la note minimale saisie.', ar: 'تحت عتبة النجاح الألمانية — تأكد من صحة أدنى علامة نجاح المدخلة.' } as L3,
  disclaimer: {
    en: 'Indicative conversion. Universities and uni-assist compute the official grade (VPD) themselves and may weight subjects differently — always rely on their statement.',
    fr: 'Conversion indicative. Les universités et uni-assist calculent la note officielle (VPD) eux-mêmes — fiez-vous toujours à leur attestation.',
    ar: 'تحويل استرشادي. الجامعات وuni-assist تحسب المعدل الرسمي (VPD) بنفسها وقد تزن المواد بشكل مختلف — اعتمد دائماً على وثيقتها.',
  } as L3,
  formula: { en: 'Formula: 1 + 3 × (best − yours) / (best − pass)', fr: 'Formule : 1 + 3 × (max − note) / (max − seuil)', ar: 'المعادلة: 1 + 3 × (الأعلى − علامتك) / (الأعلى − حد النجاح)' } as L3,
  ctaAnerkennung: { en: 'Get your degree recognised →', fr: 'Faites reconnaître votre diplôme →', ar: 'اعترف بشهادتك ←' } as L3,
  ctaChecklist: { en: 'Document checklist →', fr: 'Checklist documents →', ar: 'قائمة الوثائق ←' } as L3,
  ctaUnis: { en: 'Browse German universities →', fr: 'Explorer les universités allemandes →', ar: 'تصفح الجامعات الألمانية ←' } as L3,
}

function germanGrade(max: number, pass: number, grade: number): number | null {
  if (!(max > pass)) return null
  if (grade > max || grade < 0) return null
  if (grade < pass) return 5
  return Math.min(4, Math.max(1, 1 + 3 * ((max - grade) / (max - pass))))
}

export default function GradeCalculator({ locale }: { locale: AppLocale }) {
  const t = <T,>(v: L3<T>) => pick3(locale, v)
  const dir = dirFor(locale)

  const [presetKey, setPresetKey] = useState('ma20')
  const preset = PRESETS.find((p) => p.key === presetKey)!
  const [max, setMax] = useState(20)
  const [pass, setPass] = useState(10)
  const [grade, setGrade] = useState(14)

  function applyPreset(key: string) {
    setPresetKey(key)
    const p = PRESETS.find((x) => x.key === key)!
    setMax(p.max)
    setPass(p.pass)
    setGrade((g) => (g > p.max ? p.max : g))
  }

  const g = useMemo(() => germanGrade(max, pass, grade), [max, pass, grade])
  const L = t(S.labels)
  const verdict = g == null ? null
    : g > 4 ? { label: L.fail, color: 'text-red-600', bar: 'bg-red-400', ctx: t(S.ctxFail) }
    : g <= 1.5 ? { label: L.sehr, color: 'text-green-700', bar: 'bg-green-500', ctx: t(S.ctx13) }
    : g <= 2.5 ? { label: L.gut, color: 'text-green-600', bar: 'bg-green-500', ctx: g <= 2.0 ? t(S.ctx13) : t(S.ctx25) }
    : g <= 3.5 ? { label: L.bef, color: 'text-amber-600', bar: 'bg-amber-400', ctx: t(S.ctx25) }
    : { label: L.aus, color: 'text-amber-700', bar: 'bg-amber-500', ctx: t(S.ctx40) }

  const num = (v: number, set: (n: number) => void, step = 0.1) => (
    <input
      type="number" value={v} step={step} min={0}
      onChange={(e) => set(Number(e.target.value) || 0)}
      className="w-full border-2 border-gray-200 rounded-xl px-3 py-2.5 text-base font-bold text-gray-900 focus:outline-none focus:border-green-500"
      dir="ltr"
    />
  )

  return (
    <div className="min-h-screen bg-gray-50" dir={dir}>
      <div className="max-w-2xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-gray-900">🎓 {t(S.title)}</h1>
        <p className="mt-2 text-gray-600">{t(S.sub)}</p>

        <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wide mt-8 mb-3">{t(S.system)}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {PRESETS.map((p) => (
            <button key={p.key} onClick={() => applyPreset(p.key)}
              className={`rounded-xl border-2 px-4 py-2.5 text-sm text-start transition-colors ${presetKey === p.key ? 'border-green-500 bg-green-50 text-green-800 font-semibold' : 'border-gray-200 bg-white text-gray-700 hover:border-green-300'}`}>
              <span className="me-2">{p.flag}</span>{t(p.label)}
            </button>
          ))}
        </div>
        {preset.note && (
          <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 mt-2">💡 {t(preset.note)}</p>
        )}

        <div className="grid grid-cols-3 gap-3 mt-6">
          <label>
            <span className="block text-xs font-bold text-gray-400 uppercase mb-1">{t(S.max)}</span>
            {num(max, setMax)}
          </label>
          <label>
            <span className="block text-xs font-bold text-gray-400 uppercase mb-1">{t(S.pass)}</span>
            {num(pass, setPass)}
          </label>
          <label>
            <span className="block text-xs font-bold text-green-700 uppercase mb-1">{t(S.yours)}</span>
            {num(grade, setGrade)}
          </label>
        </div>

        {/* Result */}
        <div className="mt-8 rounded-2xl border-2 border-green-300 bg-white p-6 text-center">
          <p className="text-sm text-gray-500">{t(S.result)}</p>
          {g == null ? (
            <p className="text-2xl font-black text-gray-300 mt-1">—</p>
          ) : (
            <>
              <p className={`text-5xl font-black mt-1 ${verdict!.color}`} dir="ltr">{g > 4 ? '5,0' : g.toFixed(1).replace('.', ',')}</p>
              <p className={`font-bold mt-1 ${verdict!.color}`}>{verdict!.label}</p>
              {/* Scale bar 1.0 → 4.0 */}
              <div className="relative w-full bg-gray-100 rounded-full h-3 mt-4" dir="ltr">
                <div className={`${verdict!.bar} h-3 rounded-full transition-all`} style={{ width: `${g > 4 ? 100 : ((g - 1) / 3) * 100}%` }} />
              </div>
              <div className="flex justify-between text-[10px] text-gray-400 mt-1" dir="ltr">
                <span>1,0</span><span>2,0</span><span>3,0</span><span>4,0</span>
              </div>
              <p className="text-sm text-gray-600 mt-4">{verdict!.ctx}</p>
            </>
          )}
          <p className="text-xs text-gray-400 mt-3">{t(S.scaleNote)} · {t(S.formula)}</p>
        </div>

        <div className="flex gap-2 flex-wrap mt-6">
          <Link href="/tools/anerkennung-wizard" className="rounded-lg bg-green-600 hover:bg-green-700 text-white text-xs font-bold px-4 py-2">{t(S.ctaAnerkennung)}</Link>
          <Link href="/universities" className="rounded-lg border border-green-600 text-green-700 hover:bg-green-50 text-xs font-semibold px-4 py-2 bg-white">{t(S.ctaUnis)}</Link>
          <Link href="/tools/document-checklist" className="rounded-lg border border-green-600 text-green-700 hover:bg-green-50 text-xs font-semibold px-4 py-2 bg-white">{t(S.ctaChecklist)}</Link>
        </div>
        <p className="text-xs text-gray-400 mt-6">{t(S.disclaimer)}</p>
      </div>
    </div>
  )
}
