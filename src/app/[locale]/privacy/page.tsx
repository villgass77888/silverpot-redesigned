import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { LegalPage } from '@/components/legal/LegalPage';
import { privacy } from '@/content/legal';
import { pageMetadata } from '@/lib/seo';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta.privacy' });
  return pageMetadata({ locale, path: '/privacy', title: t('title'), description: t('description') });
}

export default async function PrivacyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('footer');
  const doc = privacy[locale === 'ar' ? 'ar' : 'en'];
  return (
    <LegalPage
      doc={doc}
      breadcrumbs={<Breadcrumbs items={[{ name: t('privacy'), path: '/privacy' }]} className="mb-8" />}
    />
  );
}
