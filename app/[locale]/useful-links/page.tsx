import StaticPage, { Section, SectionText, SectionList } from '@/components/StaticPage'

export default function UsefulLinksPage() {
  return (
    <StaticPage
      title="روابط مفيدة"
      subtitle="مواقع رسمية وموارد مهمة للمقيمين والوافدين"
    >
      <Section heading="الجهات الرسمية الألمانية">
        <SectionList
          items={[
            'Make-it-in-Germany.com — البوابة الرسمية للعمل والهجرة إلى ألمانيا',
            'BAMF.de — المكتب الاتحادي للهجرة واللاجئين',
            'Arbeitsagentur.de — وكالة العمل الاتحادية',
            'DAAD.de — منح الدراسة في ألمانيا للطلاب الأجانب',
          ]}
        />
      </Section>

      <Section heading="السكن">
        <SectionList
          items={[
            'ImmobilienScout24.de — الموقع الأشهر للشقق والمنازل',
            'WG-Gesucht.de — الأفضل للغرف في الشقق المشتركة',
            'eBay Kleinanzeigen — إعلانات مباشرة من الملاك والأفراد',
          ]}
        />
      </Section>

      <Section heading="تعلم الألمانية">
        <SectionList
          items={[
            'Goethe Institut (goethe.de) — مراكز رسمية لتعلم الألمانية وإجراء الامتحانات',
            'Deutsche Welle (dw.com/ar) — موارد تعليمية باللغة العربية',
            'DuoLingo وBabbel — تطبيقات مفيدة للمبتدئين',
          ]}
        />
      </Section>

      <Section heading="مواقع العمل والأوزبيلدونغ">
        <SectionList
          items={[
            'Ausbildung.de — أكبر موقع للبحث عن مناصب الأوزبيلدونغ',
            'StepStone.de — من أكبر بوابات العمل في ألمانيا',
            'Indeed.de — محرك بحث شامل للوظائف',
            'LinkedIn — شبكة مهنية عالمية',
          ]}
        />
      </Section>

      <Section heading="التأمين الصحي">
        <SectionList
          items={[
            'TK (tk.de) — Techniker Krankenkasse، من أفضل صناديق التأمين',
            'AOK (aok.de) — منتشرة في جميع الولايات الألمانية',
            'Barmer (barmer.de) — خيار شائع للطلاب والموظفين',
          ]}
        />
      </Section>

      <Section heading="المجتمعات العربية">
        <SectionText>
          ابحث عن مجموعات "مغاربة في ألمانيا" على Facebook وWhatsApp — مجتمعات رائعة للمساعدة والنصائح العملية من أشخاص مروا بنفس التجربة. التواصل مع من سبقوك يوفّر عليك الكثير.
        </SectionText>
      </Section>
    </StaticPage>
  )
}
