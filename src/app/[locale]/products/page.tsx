import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Catalogue } from '@/components/catalogue/Catalogue';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { JsonLd } from '@/components/seo/JsonLd';
import { itemListSchema } from '@/components/seo/schemas';
import { FooterBand } from '@/components/catalogue/FooterBand';
import { products } from '@/data/products';
import { toCard } from '@/lib/catalog';
import { pageMetadata } from '@/lib/seo';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta.products' });
  return pageMetadata({ locale, path: '/products', title: t('title'), description: t('description') });
}

/** All products (§7.2). */
export default async function ProductsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('catalogue');
  const tc = await getTranslations('common');
  const items = products.map((p) => toCard(p, locale));

  return (
    <>
      <JsonLd data={itemListSchema(locale, products)} />
      <Catalogue
        items={items}
        header={
          <>
            <Breadcrumbs items={[{ name: tc('products'), path: '/products' }]} className="mb-6" />
            <h1 className="type-display">{t('h1')}</h1>
            <p className="mt-4 max-w-[52ch] type-body-l">{t('sub')}</p>
          </>
        }
      />
      <FooterBand label={t('footerBand')} cta={tc('chatWhatsApp')} />
    </>
  );
}
