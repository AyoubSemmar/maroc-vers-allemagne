import StaticPage, { Section, SectionText } from '@/components/StaticPage'

export default function TermsOfUsePage() {
  return (
    <StaticPage
      title="شروط الاستخدام"
      subtitle="يرجى قراءة هذه الشروط قبل استخدام الموقع"
    >
      <Section heading="قبول الشروط">
        <SectionText>
          باستخدامك لهذا الموقع، فأنت توافق على هذه الشروط. إذا كنت لا توافق على أي جزء منها، يُرجى التوقف عن استخدام الموقع.
        </SectionText>
      </Section>

      <Section heading="طبيعة المحتوى">
        <SectionText>
          المعلومات المقدمة هنا لأغراض إرشادية فقط. لا تُعدّ استشارة قانونية أو رسمية. يجب على المستخدم الرجوع إلى الجهات الرسمية المختصة قبل اتخاذ أي قرار.
        </SectionText>
      </Section>

      <Section heading="مسؤولية المستخدم">
        <SectionText>
          أنت مسؤول عن التحقق من صحة المعلومات من المصادر الرسمية قبل اتخاذ أي قرار. لا يتحمل الموقع أي مسؤولية عن أي تبعات ناجمة عن الاعتماد على المحتوى المنشور.
        </SectionText>
      </Section>

      <Section heading="الملكية الفكرية">
        <SectionText>
          جميع محتويات الموقع محمية بحقوق الملكية الفكرية. لا يجوز نسخها أو إعادة نشرها أو توزيعها دون إذن صريح من إدارة الموقع.
        </SectionText>
      </Section>

      <Section heading="التعديلات">
        <SectionText>
          نحتفظ بالحق في تعديل هذه الشروط في أي وقت دون إشعار مسبق. استمرارك في استخدام الموقع بعد أي تعديل يُعدّ قبولاً للشروط الجديدة.
        </SectionText>
      </Section>
    </StaticPage>
  )
}
