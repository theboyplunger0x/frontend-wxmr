import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { DesignEffects } from "@/components/DesignEffects";
import "./globals.css";
import "@wxmr/shared/styles/metal-tokens.css";
import "./metal.css";
import { Providers } from "./providers";
import { AnonymousAnalytics } from "@/components/AnonymousAnalytics";
import { SITE_URL, SITE_TITLE, SITE_DESCRIPTION, pageMetadata } from "@/lib/site-metadata";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist-sans" });
const mono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono" });

export const metadata: Metadata = {
  ...pageMetadata("/", SITE_TITLE, SITE_DESCRIPTION),
  metadataBase: new URL(SITE_URL),
  robots: { index: true, follow: true },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
    other: process.env.BING_SITE_VERIFICATION
      ? { "msvalidate.01": process.env.BING_SITE_VERIFICATION }
      : undefined,
  },
  icons: {
    icon: "/wxmr-icon-v1.png",
    shortcut: "/wxmr-icon-v1.png",
    apple: "/wxmr-touch-v1.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${geist.variable} ${mono.variable}`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            "@id": `${SITE_URL}/#website`,
            name: "wXMR",
            alternateName: ["Wrapped XMR", "Wrapped Monero on Solana"],
            url: SITE_URL,
            description: SITE_DESCRIPTION,
            inLanguage: "en",
          }).replace(/</g, "\\u003c") }}
        />
        <AnonymousAnalytics />
        <Providers><DesignEffects>{children}</DesignEffects></Providers>
      </body>
    </html>
  );
}
