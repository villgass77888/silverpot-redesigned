import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { Catalogue } from '@/components/catalogue/Catalogue';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { JsonLd } from '@/components/seo/JsonLd';
import { faqSchema, itemListSchema } from '@/components/seo/schemas';
import { HandNote } from '@/components/primitives/HandNote';
import { richTags } from '@/components/primitives/Pending';
import { FaqAccordion } from '@/components/primitives/FaqAccordion';
import { Link } from '@/i18n/navigation';
import { categories, categoryBySlug, isCategorySlug } from '@/data/categories';
import { productsIn } from '@/data/products';
import { familyFaqIds } from '@/data/faq';
import { toCard } from '@/lib/catalog';
import { faqEntries, faqSchemaItems } from '@/lib/faq';
import { tx } from '@/lib/l10n';
import { pageMetadata } from '@/lib/seo';
import { FooterBand } from '@/components/catalogue/FooterBand';

// Only the known families/products exist: anything else is a real 404 (not a soft 200).
export const dynamicParams = false;

export function generateStaticParams() {
  return routing.locales.flatMap((locale) => categories.map((c) => ({ locale, category: c.slug })));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; category: string }>;
}): Promise<Metadata> {
  const { locale, category } = await params;
  if (!isCategorySlug(category)) return {};
  const t = await getTranslations({ locale, namespace: `meta.${category}` });
  return pageMetadata({
    locale,
    path: `/products/${category}`,
    title: t('title'),
    description: t('description'),
  });
}

/** Category pages (§7.3): §7.2 template with the family pre-selected, intro, family FAQ. */
export default async function CategoryPage({
  params,
}: {
  params: Promise<{ locale: string; category: string }>;
}) {
  const { locale, category } = await params;
  if (!isCategorySlug(category)) notFound();
  setRequestLocale(locale);
  const t = await getTranslations('catalogue');
  const tc = await getTranslations('common');
  const cat = categoryBySlug.get(category)!;
  const list = productsIn(category);
  const items = list.map((p) => toCard(p, locale));
  const faqIds = familyFaqIds[category];
  const faqItems = faqEntries(faqIds, locale);
  const schemaFaqs = faqSchemaItems(faqIds);

  return (
    <>
      <JsonLd data={itemListSchema(locale, list)} />
      {schemaFaqs.length > 0 && <JsonLd data={faqSchema(locale, schemaFaqs)} />}
      <Catalogue
        items={items}
        fixedFamily={category}
        headerTone={cat.tone}
        header={
          <div className="grid gap-8 lg:grid-cols-12">
            <div className="lg:col-span-8">
              <Breadcrumbs
                items={[
                  { name: tc('products'), path: '/products' },
                  { name: tx(cat.shortName, locale), path: `/products/${category}` },
                ]}
                className="mb-6"
              />
              <h1 className="max-w-[16ch] type-display">{t(`${category}.h1`)}</h1>
              <p className="mt-6 max-w-[62ch] type-body-l">
                {t(`${category}.intro`)}
                {category === 'platters' && <> {t.rich('platters.lidsTemp', richTags())}</>}
              </p>
              <p className="mt-5 flex flex-wrap gap-x-6 gap-y-2 font-bold">
                <Link href="/size-finder" className="underline decoration-2 underline-offset-4">
                  {t('finderLink')}
                </Link>
                <Link href="/wholesale" className="underline decoration-2 underline-offset-4">
                  {t('wholesaleLink')}
                </Link>
              </p>
            </div>
            <div className="hidden items-end justify-end lg:col-span-4 lg:flex">
              <HandNote rotate={-6} arrow="curve-down-left" arrowFirst className="text-[1.6rem]">
                {t(`${category}.note`)}
              </HandNote>
            </div>
          </div>
        }
      />
      {faqItems.length > 0 && (
        <section className="on-light bg-white pb-16 text-blue lg:pb-24">
          <div className="shell grid gap-8 lg:grid-cols-12">
            <h2 className="type-h2 lg:col-span-4">{t('familyFaq')}</h2>
            <FaqAccordion items={faqItems} className="lg:col-span-8" />
          </div>
        </section>
      )}
      <FooterBand label={t('footerBand')} cta={tc('chatWhatsApp')} />
    </>
  );
}
