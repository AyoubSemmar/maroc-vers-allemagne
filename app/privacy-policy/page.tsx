import StaticPage, { Section, SectionText } from '@/components/StaticPage'

export default function PrivacyPolicyPage() {
  return (
    <StaticPage
      title="سياسة الخصوصية"
      subtitle="كيف نتعامل مع بياناتك الشخصية"
    >
      <Section heading="ما البيانات التي نجمعها؟">
        <SectionText>
          نجمع البريد الإلكتروني عند التسجيل، وبيانات الاستخدام الأساسية مثل الصفحات التي تزورها والإجراءات التي تقوم بها داخل الموقع.
        </SectionText>
      </Section>

      <Section heading="كيف نستخدم بياناتك؟">
        <SectionText>
          نستخدم بياناتك لتحسين تجربتك على الموقع وإرسال تحديثات مفيدة إذا اشتركت في النشرة البريدية. لن نستخدم بياناتك لأي غرض آخر دون موافقتك.
        </SectionText>
      </Section>

      <Section heading="هل نشارك بياناتك؟">
        <SectionText>
          لا. لا نبيع بياناتك ولا نشاركها مع أطراف ثالثة لأغراض تجارية. بياناتك تبقى محفوظة لدينا فقط.
        </SectionText>
      </Section>

      <Section heading="التخزين والأمان">
        <SectionText>
          نستخدم Supabase لتخزين البيانات بشكل آمن. تخضع البيانات لتشفير قياسي ويتم التعامل معها وفق أفضل ممارسات الأمن المعلوماتي.
        </SectionText>
      </Section>

      <Section heading="حقوقك">
        <SectionText>
          يمكنك طلب حذف حسابك وبياناتك في أي وقت بالتواصل معنا عبر البريد الإلكتروني. سنعالج طلبك خلال مدة معقولة.
        </SectionText>
      </Section>
    </StaticPage>
  )
}
