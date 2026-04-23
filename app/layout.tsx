import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import RihlaNav from "@/components/RihlaNav";
import RihlaFooter from "@/components/RihlaFooter";

const geist = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "المغرب إلى ألمانيا",
  description: "دليلك للانتقال إلى ألمانيا",
};

const themeInitScript = `
(function(){try{
  var t = localStorage.getItem('theme');
  if(!t){ t = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'; }
  document.documentElement.dataset.theme = t;
}catch(e){}
})();
`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl" className={`${geist.variable} h-full antialiased`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="min-h-full flex flex-col">
        <RihlaNav />
        <main className="flex-1">{children}</main>
        <RihlaFooter />
      </body>
    </html>
  );
}
