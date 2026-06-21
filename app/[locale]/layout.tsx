import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages, getTranslations } from "next-intl/server";
import "../globals.css";
import RihlaNav from "@/components/RihlaNav";
import RihlaFooter from "@/components/RihlaFooter";
import AnnouncementBanner from "@/components/AnnouncementBanner";
import HideOnDashboard from "@/components/HideOnDashboard";
import { GoogleAnalytics } from "@next/third-parties/google";
import { Analytics } from "@vercel/analytics/next";
import { routing, dirFor, type AppLocale } from "@/i18n/routing";
import JsonLd from "@/components/seo/JsonLd";

// Public AdSense publisher id (permanent, safe to commit — it's in the page
// source for every visitor). The loader script below makes the site verifiable
// and review-ready; actual ad units only render once their slot ids are set
// (see AdSlot). Overridable via env if the account ever changes.
const ADSENSE_CLIENT = process.env.NEXT_PUBLIC_ADSENSE_CLIENT || "ca-pub-4265650830157827";

// Hosts that should serve ONLY the StudyBuddy tracker — mirrors the
// allow-list in proxy.ts. Keep these in sync.
const STUDYBUDDY_HOSTS = new Set<string>([
  'studybuddy-sprinttracker.vercel.app',
]);

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
  // The layout only declares site-level fallbacks. Each page builds
  // its own full metadata via lib/seo/buildLocaleMetadata so that
  // og:title, og:description, canonical, and hreflang are page-
  // specific. Without this split, the layout's openGraph.title /
  // description cascaded as defaults to every child page and every
  // social-share preview said "GoGermany / Votre guide..." regardless
  // of the actual page.
  return {
    metadataBase: new URL("https://gogermany.ma"),
    title,
    description,
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

  // Detect the StudyBuddy host server-side. The middleware in proxy.ts
  // REWRITES traffic from studybuddy-sprinttracker.vercel.app to
  // /ar/studybuddy internally, but usePathname() in client components
  // still sees the original URL ('/'), so HideOnDashboard alone can't
  // tell us we're on the tracker host. Reading the Host header here
  // and gating the chrome on it is the reliable signal.
  const hostHeader = (await headers()).get('host') ?? '';
  const isTrackerHost = STUDYBUDDY_HOSTS.has(hostHeader.toLowerCase().split(':')[0]);

  return (
    <html
      lang={typedLocale}
      dir={dir}
      className={`${geist.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        {/* AdSense loader — emitted as a literal <script> in <head> (React 19
            hoists it) so AdSense's verifier finds the exact snippet. next/script
            only renders a preload + JS injector, which the crawler doesn't
            recognise. Skipped on the StudyBuddy host. */}
        {ADSENSE_CLIENT && !isTrackerHost && (
          // eslint-disable-next-line @next/next/no-sync-scripts
          <script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`}
            crossOrigin="anonymous"
          />
        )}
        {/* Site-wide Organization schema. Skipped entirely on the
            StudyBuddy host so the internal tool doesn't carry brand
            schema for gogermany.ma. */}
        {!isTrackerHost && (
          <JsonLd
            data={{
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'GoGermany',
              url: 'https://gogermany.ma',
              logo: 'https://gogermany.ma/icon.svg',
              sameAs: [
                'https://www.facebook.com/gogermanyma',
                'https://www.instagram.com/gogermany.ma',
                'https://www.tiktok.com/@gogermany.ma',
              ],
              inLanguage: ['ar', 'fr', 'en', 'de'],
              areaServed: 'Worldwide',
              description:
                'GoGermany helps people from anywhere move to Germany — Ausbildung apprenticeships, university Studium, work and visa, all in one place.',
            }}
          />
        )}
      </head>
      <body className="min-h-full flex flex-col">
        <NextIntlClientProvider locale={typedLocale} messages={messages}>
          {!isTrackerHost && (
            <>
              <HideOnDashboard><AnnouncementBanner /></HideOnDashboard>
              <HideOnDashboard><RihlaNav /></HideOnDashboard>
            </>
          )}
          <main className="flex-1">{children}</main>
          {!isTrackerHost && (
            <HideOnDashboard><RihlaFooter /></HideOnDashboard>
          )}
          <Analytics />
        </NextIntlClientProvider>
      </body>
      {/* Skip gogermany's Google Analytics on the tracker host — the
          internal tool isn't part of the marketing funnel. */}
      {process.env.NODE_ENV === "production" && !isTrackerHost && (
        <GoogleAnalytics gaId="G-4E4HLM5JHJ" />
      )}
    </html>
  );
}
