import type { Metadata } from 'next';
import { Instrument_Serif, Outfit, Geist_Mono } from 'next/font/google';
import { SiteShell } from '@/components/site-shell';
import { ThemeProvider } from '@/components/theme-provider';
import { site } from '@/lib/site';
import './globals.css';

const instrument = Instrument_Serif({
  variable: '--font-instrument',
  subsets: ['latin'],
  weight: '400',
  style: ['normal', 'italic'],
});

const outfit = Outfit({
  variable: '--font-outfit',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: {
    default: site.title,
    template: `%s · ${site.name}`,
  },
  description: site.description,
  metadataBase: new URL(site.url),
  icons: {
    icon: [{ url: site.avatar, type: 'image/png' }],
    apple: [{ url: site.avatar, type: 'image/png' }],
  },
  openGraph: {
    title: site.title,
    description: site.description,
    url: site.url,
    siteName: site.name,
    type: 'website',
    images: [{ url: site.avatar }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${instrument.variable} ${outfit.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col font-sans">
        <ThemeProvider>
          <SiteShell>{children}</SiteShell>
        </ThemeProvider>
      </body>
    </html>
  );
}
