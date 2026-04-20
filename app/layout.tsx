import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const geist = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "المغرب إلى ألمانيا",
  description: "دليلك للانتقال إلى ألمانيا",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" className={`${geist.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <Navbar />
        {children}
      </body>
    </html>
  );
}
