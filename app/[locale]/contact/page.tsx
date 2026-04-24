import StaticPage, { Section, SectionText } from '@/components/StaticPage'

export default function ContactPage() {
  return (
    <StaticPage
      title="تواصل معنا"
      subtitle="نحن هنا للمساعدة"
    >
      <Section heading="البريد الإلكتروني">
        <SectionText>
          للاستفسارات العامة: contact@maroc-vers-allemagne.com
        </SectionText>
      </Section>

      <Section heading="للمحتوى والمقالات">
        <SectionText>
          هل لديك تجربة تود مشاركتها أو مقال تريد نشره؟ راسلنا على: content@maroc-vers-allemagne.com — نرحب بكل المساهمات الجادة والمفيدة.
        </SectionText>
      </Section>

      <Section heading="للشراكات">
        <SectionText>
          إذا كنت مدرسة، مؤسسة، أو خدمة تود التعاون معنا: partners@maroc-vers-allemagne.com — نسعد بمناقشة فرص الشراكة المثمرة.
        </SectionText>
      </Section>

      <Section heading="وقت الرد">
        <SectionText>
          نرد عادةً خلال 2–3 أيام عمل. إذا لم تتلقَّ رداً خلال هذه المدة، تحقق من مجلد البريد العشوائي.
        </SectionText>
      </Section>

      <Section heading="ملاحظة">
        <SectionText>
          نحن فريق صغير نعمل بشغف. شكراً لصبرك وتفهمك!
        </SectionText>
      </Section>
    </StaticPage>
  )
}
