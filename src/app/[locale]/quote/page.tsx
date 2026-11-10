import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { QuotePage } from '@/components/quote/QuotePage';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { pageMetadata } from '@/lib/seo';
import { site } from '@/data/site';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta.quote' });
  return pageMetadata({
    locale,
    path: '/quote',
    title: t('title'),
    description: t('description'),
    noindex: true,
  });
}

/** Your quote (§7.11). noindex. */
export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('quote');
  return (
    <section className="on-light bg-white pt-8 pb-24 text-blue md:pt-12">
      <div className="shell">
        <Breadcrumbs items={[{ name: t('drawerTitle'), path: '/quote' }]} className="mb-6" />
        <h1 className="mb-10 type-display">{t('title')}</h1>
        <QuotePage
          turnstileSiteKey={process.env.TURNSTILE_SITE_KEY || undefined}
          responseTimeHours={site.responseTimeHours}
        />
      </div>
    </section>
  );
}
