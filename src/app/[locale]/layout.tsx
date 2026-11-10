import '../globals.css';
import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import { notFound } from 'next/navigation';
import { hasLocale, NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations, setRequestLocale } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { fontVariables } from '@/lib/fonts';
import { Providers } from '@/components/Providers';
import { TopBar } from '@/components/layout/TopBar';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { FloatingWhatsApp } from '@/components/layout/FloatingWhatsApp';
import { SvgSprite } from '@/components/brand/SvgSprite';
import { VercelInsights } from '@/components/VercelInsights';
import { RevealOnScroll } from '@/components/RevealOnScroll';
import { JsonLd } from '@/components/seo/JsonLd';
import { organizationSchema } from '@/components/seo/schemas';
import { site } from '@/data/site';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta' });
  return {
    metadataBase: new URL(site.url),
    applicationName: 'Silverpot',
    title: { default: t('home.title'), template: '%s | Silverpot' },
    description: t('home.description'),
    keywords: t('keywords'),
    authors: [{ name: site.legalName }],
    creator: site.legalName,
    formatDetection: { telephone: false, email: false, address: false },
    openGraph: {
      type: 'website',
      siteName: 'Silverpot',
      locale: locale === 'ar' ? 'ar_AE' : 'en_AE',
      alternateLocale: locale === 'ar' ? ['en_AE'] : ['ar_AE'],
    },
    twitter: { card: 'summary_large_image' },
  };
}

export const viewport: Viewport = {
  themeColor: '#FFD21F',
  width: 'device-width',
  initialScale: 1,
};

/** Runs before paint: skip the hero stamp sequence if it already played this session (§4.3-1). */
const HERO_REPLAY = `try{if(sessionStorage.getItem('sp-hero'))document.documentElement.setAttribute('data-hero-played','')}catch(e){}`;

/** Client components only get the namespaces they use. */
const CLIENT_NAMESPACES = [
  'common',
  'review',
  'crinkle',
  'nav',
  'quote',
  'forms',
  'catalogue',
  'product',
  'finder',
  'search',
  'faqPage',
  'contact',
  'error',
  'footer',
] as const;

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const messages = await getMessages();
  const clientMessages = Object.fromEntries(
    CLIENT_NAMESPACES.filter((ns) => ns in messages).map((ns) => [ns, messages[ns]]),
  );
  const t = await getTranslations('common');

  return (
    <html
      lang={locale}
      dir={locale === 'ar' ? 'rtl' : 'ltr'}
      className={fontVariables(locale)}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: HERO_REPLAY }} />
      </head>
      <body className="min-h-svh bg-white text-blue">
        <SvgSprite />
        <NextIntlClientProvider messages={clientMessages}>
          <Providers>
            <a
              href="#main"
              className="sr-only z-[100] rounded-btn border-2 border-blue bg-yellow px-4 py-3 font-bold focus:not-sr-only focus:fixed focus:start-3 focus:top-3"
            >
              {t('skip')}
            </a>
            <TopBar />
            <Header />
            <main id="main" tabIndex={-1} className="outline-none">
              {children}
            </main>
            <Footer />
            <FloatingWhatsApp />
          </Providers>
        </NextIntlClientProvider>
        <JsonLd data={organizationSchema()} />
        <RevealOnScroll />
        {process.env.VERCEL && <VercelInsights />}
      </body>
    </html>
  );
}
