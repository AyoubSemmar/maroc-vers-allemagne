import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { notFound } from "next/navigation";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages, getTranslations } from "next-intl/server";
import "../globals.css";
import RihlaNav from "@/components/RihlaNav";
import RihlaFooter from "@/components/RihlaFooter";
import CookieConsent from "@/components/CookieConsent";
import AnnouncementBanner from "@/components/AnnouncementBanner";
import HideOnDashboard from "@/components/HideOnDashboard";
import NonTrackerHost from "@/components/NonTrackerHost";
import { GoogleAnalytics } from "@next/third-parties/google";
import { Analytics } from "@vercel/analytics/next";
import { routing, dirFor, type AppLocale } from "@/i18n/routing";
import JsonLd from "@/components/seo/JsonLd";
import AnalyticsBeacon from "@/components/analytics/AnalyticsBeacon";
import MetaPixel from "@/components/analytics/MetaPixel";
import { omitNamespaces, HEAVY_NAMESPACES } from "@/lib/i18n-heavy";

// Public AdSense publisher id (permanent, safe to commit — it's in the page
// source for every visitor). The loader script below makes the site verifiable
// and review-ready; actual ad units only render once their slot ids are set
// (see AdSlot). Overridable via env if the account ever changes.
const ADSENSE_CLIENT = process.env.NEXT_PUBLIC_ADSENSE_CLIENT || "ca-pub-4265650830157827";

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
    metadataBase: new URL("https://www.gogermany.ma"),
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

// Google Consent Mode v2 defaults — MUST run before gtag.js/AdSense load.
// Storage-based consent starts "denied"; the CookieConsent banner (or a
// previously stored choice) upgrades it via consent update. Returning
// visitors who accepted get "granted" restored here synchronously so
// analytics starts consented from the first event.
const consentInitScript = `
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
(function(){try{
  var stored = localStorage.getItem('cookie-consent');
  var v = stored === 'all' ? 'granted' : 'denied';
  gtag('consent', 'default', {
    ad_storage: v, ad_user_data: v, ad_personalization: v,
    analytics_storage: v, wait_for_update: 500
  });
}catch(e){
  gtag('consent', 'default', {
    ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied',
    analytics_storage: 'denied'
  });
}})();
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
  // Big page-specific namespaces are stripped from the global client bundle
  // and re-provided on their own route (see lib/i18n-heavy). This keeps every
  // page from shipping ~300 KB of JSON it never uses.
  const messages = omitNamespaces(await getMessages(), HEAVY_NAMESPACES);
  const dir = dirFor(typedLocale);

  // NOTE: this layout is intentionally STATIC (no headers()/cookies()) so the
  // whole site can be CDN/ISR-cached. The StudyBuddy-tracker exclusion that used
  // to read the Host header here now lives in <NonTrackerHost> (client-side host
  // check) — see that component for why. The head scripts below (consent /
  // AdSense loader / brand JSON-LD) render on every host; that's harmless on the
  // internal tracker (not indexed, no ad slots) and keeps AdSense verification
  // working on the real domain.

  return (
    <html
      lang={typedLocale}
      dir={dir}
      className={`${geist.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <script dangerouslySetInnerHTML={{ __html: consentInitScript }} />
        {/* AdSense loader — emitted as a literal <script> in <head> (React 19
            hoists it) so AdSense's verifier finds the exact snippet. next/script
            only renders a preload + JS injector, which the crawler doesn't
            recognise. Rendered on every host (harmless on the internal tracker:
            it's not indexed and has no ad slots). */}
        {ADSENSE_CLIENT && (
          // eslint-disable-next-line @next/next/no-sync-scripts
          <script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`}
            crossOrigin="anonymous"
          />
        )}
        {/* Site-wide Organization + WebSite schema. The WebSite node's
            SearchAction makes the site eligible for a Google sitelinks search
            box. Rendered on every host — harmless on the internal tracker, which
            is not indexed. */}
        {(
          <JsonLd
            data={[
              {
                '@context': 'https://schema.org',
                '@type': 'Organization',
                name: 'GoGermany',
                url: 'https://www.gogermany.ma',
                logo: 'https://www.gogermany.ma/icon.svg',
                sameAs: [
                  'https://www.facebook.com/gogermanyma',
                  'https://www.instagram.com/gogermany.ma',
                  'https://www.tiktok.com/@gogermany.ma',
                ],
                inLanguage: ['ar', 'fr', 'en', 'de'],
                areaServed: 'Worldwide',
                description:
                  'GoGermany helps people from anywhere move to Germany — Ausbildung apprenticeships, university Studium, work and visa, all in one place.',
              },
              {
                '@context': 'https://schema.org',
                '@type': 'WebSite',
                name: 'GoGermany',
                url: `https://www.gogermany.ma/${typedLocale}`,
                inLanguage: typedLocale,
                potentialAction: {
                  '@type': 'SearchAction',
                  target: {
                    '@type': 'EntryPoint',
                    urlTemplate: `https://www.gogermany.ma/${typedLocale}/search?q={search_term_string}`,
                  },
                  'query-input': 'required name=search_term_string',
                },
              },
            ]}
          />
        )}
      </head>
      <body className="min-h-full flex flex-col">
        <NextIntlClientProvider locale={typedLocale} messages={messages}>
          {/* Marketing chrome — rendered on the real site, hidden on the
              StudyBuddy tracker host (NonTrackerHost) and on dashboard/embedded
              views (HideOnDashboard). */}
          <NonTrackerHost>
            <HideOnDashboard><AnnouncementBanner /></HideOnDashboard>
            <HideOnDashboard><RihlaNav /></HideOnDashboard>
          </NonTrackerHost>
          <main className="flex-1">{children}</main>
          <NonTrackerHost>
            <HideOnDashboard><RihlaFooter /></HideOnDashboard>
          </NonTrackerHost>
          {/* Tracking — `deferred` so it never fires on the tracker host. */}
          <NonTrackerHost deferred><CookieConsent /></NonTrackerHost>
          <Analytics />
          <NonTrackerHost deferred><AnalyticsBeacon /></NonTrackerHost>
          {/* Meta Pixel — self-gates on cookie consent; off on the tracker host
              and outside production. */}
          {process.env.NODE_ENV === "production" && (
            <NonTrackerHost deferred><MetaPixel /></NonTrackerHost>
          )}
          {/* Google Analytics — off on the tracker host (not part of the
              marketing funnel) and outside production. */}
          {process.env.NODE_ENV === "production" && (
            <NonTrackerHost deferred><GoogleAnalytics gaId="G-4E4HLM5JHJ" /></NonTrackerHost>
          )}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
