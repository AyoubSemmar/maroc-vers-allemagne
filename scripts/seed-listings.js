const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(
  'https://mydvffilmfysqrjvipik.supabase.co',
  'sb_publishable_NrcWDSTtTXfOwemXJLzwqg_zdXeMMvf'
)

async function seed() {
  // Use the first real user in profiles table
  const { data: profiles } = await supabase.from('profiles').select('user_id').limit(1)
  const userId = profiles?.[0]?.user_id

  if (!userId) {
    console.error('No user found. Make sure you have created an account on the site first.')
    return
  }

  console.log('Using user_id:', userId)

  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()

  const listings = [
    {
      user_id: userId,
      title: 'غرفة مفروشة في قلب برلين — شاملة جميع الخدمات',
      description: 'غرفة واسعة ومفروشة بالكامل في شقة مشتركة مع شخصين آخرين. الشقة في حي Mitte قريبة من المترو وكل وسائل الراحة. الإيجار شامل الكهرباء والإنترنت والتدفئة. مناسبة جداً لطلاب الأوسبيلدونغ أو العمل. البيئة هادئة وودودة.',
      city: 'Berlin',
      type: 'غرفة',
      whatsapp: '+4915123456789',
      image_url: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80',
      images: [
        'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80',
        'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&q=80',
        'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&q=80',
      ],
      available: true,
      expires_at: expiresAt,
    },
    {
      user_id: userId,
      title: 'شقة كاملة في ميونخ — غرفتان ومطبخ وحمام',
      description: 'شقة مريحة وهادئة في حي Schwabing بميونخ. تتكون من غرفتين وصالة ومطبخ مجهز وحمام. قريبة من الجامعة التقنية TUM وخط المترو U6. مناسبة لشخصين أو عائلة صغيرة. الإيجار 1100 يورو شهرياً غير شامل الخدمات.',
      city: 'Munich',
      type: 'شقة',
      whatsapp: '+4917698765432',
      image_url: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80',
      images: [
        'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80',
        'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80',
      ],
      available: true,
      expires_at: expiresAt,
    },
    {
      user_id: userId,
      title: 'غرفة في شقة مشتركة بهامبورغ — قريبة من الميناء',
      description: 'غرفة مفروشة في شقة مشتركة مع شخص واحد فقط في حي Altona الشهير. الغرفة تطل على الحديقة وهادئة جداً. المطبخ والحمام مشتركان. الإيجار 550 يورو شامل كل شيء. المكان مثالي لمن يعمل في مينا هامبورغ أو يدرس في الجامعة.',
      city: 'Hamburg',
      type: 'غرفة',
      whatsapp: '+4916012345678',
      image_url: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80',
      images: [
        'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80',
        'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80',
      ],
      available: true,
      expires_at: expiresAt,
    },
    {
      user_id: userId,
      title: 'شقة استوديو أنيقة في فرانكفورت — للإيجار الفوري',
      description: 'استوديو حديث ومجهز بالكامل في حي Sachsenhausen الراقي بفرانكفورت. المساحة 35 متر مربع. المطبخ مجهز بكل الأدوات. قريب جداً من المستشفى الجامعي ومحطة المترو. مناسب لشخص واحد. الإيجار 850 يورو شهرياً شاملاً.',
      city: 'Frankfurt',
      type: 'شقة',
      whatsapp: '+4915987654321',
      image_url: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&q=80',
      images: [
        'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&q=80',
        'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&q=80',
        'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80',
      ],
      available: true,
      expires_at: expiresAt,
    },
    {
      user_id: userId,
      title: 'غرفة مشمسة في كولونيا — مقابل الجامعة مباشرة',
      description: 'غرفة كبيرة ومشمسة في شقة مشتركة مع طلاب مغاربة في حي Sülz بكولونيا. أجواء عائلية وودودة. الإيجار 480 يورو شامل الإنترنت السريع والتدفئة. المطبخ كبير ومجهز. على بُعد دقيقتين سيراً من جامعة كولونيا.',
      city: 'Cologne',
      type: 'غرفة',
      whatsapp: '+212612345678',
      image_url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80',
      images: [
        'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80',
        'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80',
        'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&q=80',
      ],
      available: true,
      expires_at: expiresAt,
    },
  ]

  const { error } = await supabase.from('listings').insert(listings)

  if (error) {
    console.error('Error:', error.message)
  } else {
    console.log('Done! 5 listings inserted.')
  }
}

seed()
