// Adds learnGerman.level.videos.* strings (the per-level YouTube playlist
// card next to the daily reading/writing challenges) to all 12 message
// files. Hand-written translations — no API. Idempotent.
import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')

const VIDEOS = {
  en: {
    eyebrow: 'Watch',
    title: 'German videos — level {level}',
    sub: 'A video playlist matched to this level. Watch one video after each study session to train your ear with real spoken German.',
    play: 'Play the playlist',
    openPlaylist: 'Open the full playlist on YouTube',
  },
  fr: {
    eyebrow: 'Regarder',
    title: 'Vidéos en allemand — niveau {level}',
    sub: "Une playlist vidéo adaptée à ce niveau. Regardez une vidéo après chaque session d'étude pour habituer votre oreille à l'allemand parlé.",
    play: 'Lancer la playlist',
    openPlaylist: 'Ouvrir la playlist complète sur YouTube',
  },
  ar: {
    eyebrow: 'شاهد',
    title: 'فيديوهات بالألمانية — المستوى {level}',
    sub: 'قائمة فيديوهات مناسبة لهذا المستوى. شاهد فيديو واحداً بعد كل جلسة دراسة لتعويد أذنك على الألمانية المحكية.',
    play: 'تشغيل القائمة',
    openPlaylist: 'افتح القائمة الكاملة على يوتيوب',
  },
  de: {
    eyebrow: 'Ansehen',
    title: 'Deutsche Videos — Niveau {level}',
    sub: 'Eine Video-Playlist passend zu diesem Niveau. Schau nach jeder Lerneinheit ein Video, um dein Ohr an echtes gesprochenes Deutsch zu gewöhnen.',
    play: 'Playlist abspielen',
    openPlaylist: 'Ganze Playlist auf YouTube öffnen',
  },
  es: {
    eyebrow: 'Ver',
    title: 'Vídeos en alemán — nivel {level}',
    sub: 'Una playlist de vídeos adaptada a este nivel. Mira un vídeo después de cada sesión de estudio para acostumbrar tu oído al alemán hablado.',
    play: 'Reproducir la playlist',
    openPlaylist: 'Abrir la playlist completa en YouTube',
  },
  tr: {
    eyebrow: 'İzle',
    title: 'Almanca videolar — {level} seviyesi',
    sub: 'Bu seviyeye uygun bir video oynatma listesi. Kulağını gerçek konuşulan Almancaya alıştırmak için her çalışmadan sonra bir video izle.',
    play: 'Oynatma listesini başlat',
    openPlaylist: "Tüm oynatma listesini YouTube'da aç",
  },
  fa: {
    eyebrow: 'تماشا',
    title: 'ویدیوهای آلمانی — سطح {level}',
    sub: 'یک فهرست ویدیویی متناسب با این سطح. بعد از هر جلسه مطالعه یک ویدیو ببینید تا گوش‌تان به آلمانی گفتاری عادت کند.',
    play: 'پخش فهرست',
    openPlaylist: 'باز کردن فهرست کامل در یوتیوب',
  },
  pt: {
    eyebrow: 'Assistir',
    title: 'Vídeos em alemão — nível {level}',
    sub: 'Uma playlist de vídeos adequada a este nível. Assista a um vídeo após cada sessão de estudo para acostumar o ouvido ao alemão falado.',
    play: 'Reproduzir a playlist',
    openPlaylist: 'Abrir a playlist completa no YouTube',
  },
  ru: {
    eyebrow: 'Смотреть',
    title: 'Видео на немецком — уровень {level}',
    sub: 'Плейлист видео, подобранный под этот уровень. Смотрите по одному видео после каждого занятия, чтобы привыкнуть к живой немецкой речи.',
    play: 'Запустить плейлист',
    openPlaylist: 'Открыть весь плейлист на YouTube',
  },
  hi: {
    eyebrow: 'देखें',
    title: 'जर्मन वीडियो — स्तर {level}',
    sub: 'इस स्तर के अनुसार चुनी गई वीडियो प्लेलिस्ट। हर अध्ययन सत्र के बाद एक वीडियो देखें ताकि कान असली बोली जाने वाली जर्मन के अभ्यस्त हों।',
    play: 'प्लेलिस्ट चलाएँ',
    openPlaylist: 'पूरी प्लेलिस्ट YouTube पर खोलें',
  },
  ur: {
    eyebrow: 'دیکھیں',
    title: 'جرمن ویڈیوز — سطح {level}',
    sub: 'اس سطح کے مطابق ویڈیو پلے لسٹ۔ ہر مطالعے کے بعد ایک ویڈیو دیکھیں تاکہ کان حقیقی بولی جانے والی جرمن کے عادی ہوں۔',
    play: 'پلے لسٹ چلائیں',
    openPlaylist: 'مکمل پلے لسٹ یوٹیوب پر کھولیں',
  },
  zh: {
    eyebrow: '观看',
    title: '德语视频 — {level} 级',
    sub: '与本级别匹配的视频播放列表。每次学习后看一个视频，让耳朵习惯真实的德语口语。',
    play: '播放列表',
    openPlaylist: '在 YouTube 上打开完整播放列表',
  },
}

const locales = ['ar', 'fr', 'en', 'de', 'es', 'tr', 'fa', 'pt', 'ru', 'hi', 'ur', 'zh']

for (const loc of locales) {
  const file = join(root, 'messages', `${loc}.json`)
  const m = JSON.parse(readFileSync(file, 'utf8'))
  const c = VIDEOS[loc]
  if (!c) throw new Error(`missing content for ${loc}`)
  m.learnGerman = m.learnGerman || {}
  m.learnGerman.level = m.learnGerman.level || {}
  m.learnGerman.level.videos = c
  writeFileSync(file, JSON.stringify(m, null, 2) + '\n', 'utf8')
  console.log(`✓ ${loc}: learnGerman.level.videos`)
}
console.log('done')
