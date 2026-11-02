import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import '@wxmr/shared/styles/metal-tokens.css';
import './metal.css';
import { AppProviders } from './providers';

const inter = Geist({ subsets: ['latin'], variable: '--font-geist-sans' });
const jetbrainsMono = Geist_Mono({ subsets: ['latin'], variable: '--font-geist-mono' });

export const metadata: Metadata = {
  title: 'Swap to native XMR',
  description: 'Move Mayan-supported tokens from source chains into native XMR',
  icons: {
    icon: '/wxmr-icon-v1.png',
    shortcut: '/wxmr-icon-v1.png',
    apple: '/wxmr-touch-v1.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} ${inter.variable} ${jetbrainsMono.variable}`}>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
