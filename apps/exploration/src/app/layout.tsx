import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./exploration.css";
const sans = Geist({ subsets: ["latin"], variable: "--study-sans" });
const mono = Geist_Mono({ subsets: ["latin"], variable: "--study-mono" });
export const metadata: Metadata = {
  title: "wXMR — Design exploration",
  description:
    "Three independent visual directions for wXMR. Demonstration only.",
  robots: { index: false, follow: false },
  icons: { icon: "/wxmr-icon-v1.png", apple: "/wxmr-touch-v1.png" },
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${sans.variable} ${mono.variable}`}>{children}</body>
    </html>
  );
}
