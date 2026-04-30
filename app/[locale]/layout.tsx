import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { notFound } from "next/navigation";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages, getTranslations } from "next-intl/server";
import "../globals.css";
import RihlaNav from "@/components/RihlaNav";
import RihlaFooter from "@/components/RihlaFooter";
import LanguagePicker from "@/components/LanguagePicker";
import AnnouncementBanner from "@/components/AnnouncementBanner";
import HideOnDashboard from "@/components/HideOnDashboard";
import { GoogleAnalytics } from "@next/third-parties/google";
import { routing, dirFor, type AppLocale } from "@/i18n/routing";

const geist = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    return {};
  }
  const t = await getTranslations({ locale, namespace: "common" });
  const title = t("appName");
  const description = t("tagline");
  return {
    metadataBase: new URL("https://gogermany.ma"),
    title,
    description,
    alternates: {
      // NOTE: do NOT set `canonical` here — it would cascade to every
      // child page and tell Google "every page is a duplicate of the
      // locale homepage", which is exactly what was causing 'Page with
      // redirect / duplicate canonical' errors in Search Console for
      // hundreds of URLs. Without this line, each page gets its actual
      // URL as its canonical, which is what we want.
      languages: {
        ar: "/ar",
        fr: "/fr",
        en: "/en",
        de: "/de",
      },
    },
    openGraph: {
      type: "website",
      url: `https://gogermany.ma/${locale}`,
      title,
      description,
      siteName: "GoGermany",
      locale,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    verification: {
      google: "6nkUvguFw7fx5-A9jtaKpAT6L9bcllDaYR6ACntlfKI",
    },
  };
}

const themeInitScript = `
(function(){try{
  var t = localStorage.getItem('theme');
  if(!t){ t = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'; }
  document.documentElement.dataset.theme = t;
}catch(e){}
})();
`;

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  const typedLocale = locale as AppLocale;
  const messages = await getMessages();
  const dir = dirFor(typedLocale);

  return (
    <html
      lang={typedLocale}
      dir={dir}
      className={`${geist.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="min-h-full flex flex-col">
        <NextIntlClientProvider locale={typedLocale} messages={messages}>
          <HideOnDashboard><AnnouncementBanner /></HideOnDashboard>
          <HideOnDashboard><RihlaNav /></HideOnDashboard>
          <main className="flex-1">{children}</main>
          <HideOnDashboard><RihlaFooter /></HideOnDashboard>
          <LanguagePicker />
        </NextIntlClientProvider>
      </body>
      {process.env.NODE_ENV === "production" && (
        <GoogleAnalytics gaId="G-4E4HLM5JHJ" />
      )}
    </html>
  );
}
