import StaticPage, { Section, SectionText, SectionList } from '@/components/StaticPage'

export default function HousingPage() {
  return (
    <StaticPage
      title="دليل السكن في ألمانيا"
      subtitle="كيف تجد شقة أو غرفة في ألمانيا"
    >
      <Section heading="أنواع السكن المتاح">
        <SectionList
          items={[
            'شقة مستقلة (Wohnung): تستأجر الشقة كاملاً لنفسك.',
            'غرفة في شقة مشتركة (WG - Wohngemeinschaft): تتشارك الشقة مع أشخاص آخرين وتدفع فقط تكلفة غرفتك.',
            'سكن الطلبة (Studentenwohnheim): خاص بالطلاب المسجلين في الجامعات، أسعاره مدعومة في الغالب.',
          ]}
        />
      </Section>

      <Section heading="WG أم شقة مستقلة؟">
        <SectionText>
          WG أرخص وأسهل للحصول عليها كوافد جديد. الشقة المستقلة تتطلب تاريخ ائتمان (Schufa) وضمانات أكثر، مما يجعلها أصعب على من وصل حديثاً إلى ألمانيا.
        </SectionText>
      </Section>

      <Section heading="أهم مواقع البحث">
        <SectionList
          items={[
            'ImmobilienScout24.de — الموقع الأشهر للشقق المستقلة',
            'WG-Gesucht.de — الأفضل للبحث عن غرف في شقق مشتركة',
            'eBay Kleinanzeigen — إعلانات متنوعة ومباشرة من الملاك',
            'Studenten-WG.de — مخصص للطلاب',
          ]}
        />
      </Section>

      <Section heading="الوثائق المطلوبة عادةً">
        <SectionList
          items={[
            'جواز السفر أو بطاقة الإقامة',
            'آخر 3 كشوفات راتب (أو خطاب قبول جامعي للطلاب)',
            'Schufa-Auskunft (تقرير الجدارة الائتمانية)',
            'Mietschuldenfreiheitsbescheinigung (شهادة عدم وجود ديون إيجار سابقة)',
          ]}
        />
      </Section>

      <Section heading="تحذيرات من الاحتيال">
        <SectionList
          items={[
            'لا تدفع إيداعاً (Kaution) قبل رؤية الشقة شخصياً.',
            'تجنب العروض الرخيصة جداً مقارنة بأسعار السوق.',
            'لا ترسل بياناتك الشخصية أو صور وثائقك لغرباء عبر الإنترنت.',
          ]}
        />
      </Section>

      <Section heading="بعد العثور على الشقة">
        <SectionText>
          يجب التسجيل في بلدية الإقامة (Anmeldung) خلال أسبوعين من الانتقال. هذا الإجراء إلزامي وضروري لفتح حساب بنكي والتعامل مع الجهات الرسمية في ألمانيا.
        </SectionText>
      </Section>
    </StaticPage>
  )
}
