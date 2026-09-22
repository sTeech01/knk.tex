import type { Metadata, Viewport } from "next";
import { Onest } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { MobileTabBar } from "@/components/layout/mobile-tab-bar";
import { ConsultationProvider } from "@/components/shared/consultation-provider";
import { MotionProvider } from "@/components/shared/motion-provider";
import { organizationJsonLd } from "@/lib/schema";
import { SITE_URL } from "@/lib/site";
import { siteKeywords } from "@/lib/seo";
import { homeCopy } from "@/data/copy";

/**
 * Один гротеск на весь сайт - Onest: он изначально рисовался под
 * кириллицу, поэтому русский текст выглядит ровно, а не как латиница с
 * дорисованными буквами. Заголовки отличаются от текста жирностью, а не
 * сменой шрифта. Прежняя пара Manrope + Playfair Display читалась вычурно
 * из-за контрастной антиквы в заголовках — заказчику не понравилась.
 */
const fontSans = Onest({
  variable: "--font-sans",
  subsets: ["latin", "cyrillic"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: homeCopy.metaTitleHome,
    template: "%s — KNK TEX",
  },
  description: homeCopy.metaDescriptionHome,
  keywords: [...siteKeywords],
  openGraph: {
    type: "website",
    locale: "ru_RU",
    siteName: "KNK TEX",
    title: homeCopy.metaTitleHome,
    description: homeCopy.metaDescriptionHome,
  },
  twitter: {
    card: "summary_large_image",
    title: homeCopy.metaTitleHome,
    description: homeCopy.metaDescriptionHome,
  },
  alternates: {
    canonical: "/",
  },
};

export const viewport: Viewport = {
  themeColor: "#13314e",
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = organizationJsonLd();

  return (
    <html
      lang="ru"
      className={`${fontSans.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col pb-16 md:pb-0">
        <noscript>
          <style>{`[style*="opacity:0"]{opacity:1 !important;transform:none !important;}`}</style>
        </noscript>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <MotionProvider>
          <ConsultationProvider>
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
            <MobileTabBar />
          </ConsultationProvider>
        </MotionProvider>
      </body>
    </html>
  );
}
