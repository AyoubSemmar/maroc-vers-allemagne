import StaticPage, { Section, SectionText } from '@/components/StaticPage'

export default function AboutPage() {
  return (
    <StaticPage
      title="عن المشروع"
      subtitle="من نحن وما الذي نقدمه"
    >
      <Section heading="فكرة المشروع">
        <SectionText>
          مغرب نحو ألمانيا هو دليل رقمي أُنشئ لمساعدة المغاربة الراغبين في الانتقال إلى ألمانيا، سواء للعمل أو الدراسة أو الاستقرار. نسعى إلى تقديم معلومات موثوقة وعملية تُسهّل هذا المسار.
        </SectionText>
      </Section>

      <Section heading="لماذا هذا المشروع؟">
        <SectionText>
          الانتقال إلى ألمانيا يمكن أن يكون معقداً: وثائق كثيرة، لغة جديدة، ونظام مختلف كلياً. هدفنا تبسيط هذه الرحلة بمعلومات واضحة وعملية، تجنّبك الضياع وتوفّر عليك الوقت والجهد.
        </SectionText>
      </Section>

      <Section heading="من يستفيد من الموقع؟">
        <SectionText>
          يستهدف الموقع الطلاب الراغبين في الدراسة في ألمانيا، الباحثين عن عمل، المتقدمين للأوزبيلدونغ (التدريب المهني المزدوج)، والمقيمين الجدد الذين يحتاجون توجيهاً عملياً في بداية مسيرتهم.
        </SectionText>
      </Section>

      <Section heading="رسالتنا">
        <div id="mission">
          <SectionText>
            تبسيط الإجراءات المعقدة وتقديم معلومات موثوقة ومحدّثة باللغة العربية، لأن كل مغربي يستحق فرصة حقيقية في ألمانيا.
          </SectionText>
        </div>
      </Section>

      <Section heading="تواصل معنا">
        <SectionText>
          لديك سؤال أو اقتراح؟ راسلنا على contact@maroc-vers-allemagne.com — نسعد بسماعك والرد على استفساراتك.
        </SectionText>
      </Section>
    </StaticPage>
  )
}
