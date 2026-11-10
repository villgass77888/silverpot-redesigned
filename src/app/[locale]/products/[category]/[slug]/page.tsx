import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { Link } from '@/i18n/navigation';
import { getProduct, productById, productHref, products } from '@/data/products';
import { categoryBySlug } from '@/data/categories';
import { familyFaqIds } from '@/data/faq';
import { useCaseLabels } from '@/data/usecases';
import { site } from '@/data/site';
import {
  productDescription,
  productName,
  productTagline,
  plainDescription,
  productCopyPending,
  productCopyPlaceholder,
  tx,
  isArDraft,
} from '@/lib/l10n';
import { toCard } from '@/lib/catalog';
import { faqEntries, faqSchemaItems } from '@/lib/faq';
import { pageMetadata } from '@/lib/seo';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { Gallery } from '@/components/catalogue/Gallery';
import { ProductPurchase } from '@/components/catalogue/ProductPurchase';
import { ProductSpecs } from '@/components/catalogue/ProductSpecs';
import { ProductCard } from '@/components/catalogue/ProductCard';
import { Sticker } from '@/components/primitives/Sticker';
import { StaticChip } from '@/components/primitives/Chip';
import { Pending, Placeholder, ArDraftBadge } from '@/components/primitives/Pending';
import { FaqAccordion } from '@/components/primitives/FaqAccordion';
import { Button } from '@/components/primitives/Button';
import { ViewQuoteButton } from '@/components/quote/QuoteAwareLink';
import { JsonLd } from '@/components/seo/JsonLd';
import { faqSchema, productSchema } from '@/components/seo/schemas';
import { IconDownload } from '@/components/icons';
import { cn } from '@/lib/cn';

// Only the known families/products exist: anything else is a real 404 (not a soft 200).
export const dynamicParams = false;

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    products.map((p) => ({ locale, category: p.category, slug: p.slug })),
  );
}

type Params = { params: Promise<{ locale: string; category: string; slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { locale, category, slug } = await params;
  const p = getProduct(category, slug);
  if (!p) return {};
  const t = await getTranslations({ locale, namespace: 'meta' });
  const name = productName(p, locale);
  const full = t('productTitle', { name });
  const title = full.length > 60 && p.seoTitle && locale === 'en' ? p.seoTitle : full;
  const first = plainDescription(p, locale).split(/(?<=\.)\s/)[0];
  let description = `${first} ${t('productSuffix')}`;
  if (description.length > 155) description = description.slice(0, 152).replace(/\s+\S*$/, '') + '…';
  return pageMetadata({ locale, path: productHref(p), title, description });
}

const STICKER_TONE = { containers: 'yellow', platters: 'red', foil: 'blue' } as const;

/** Product detail (§7.4). */
export default async function ProductPage({ params }: Params) {
  const { locale, category, slug } = await params;
  const p = getProduct(category, slug);
  if (!p) notFound();
  setRequestLocale(locale);
  const t = await getTranslations('product');
  const tc = await getTranslations('common');
  const tcat = await getTranslations('catalogue');
  const cat = categoryBySlug.get(p.category)!;
  const name = productName(p, locale);
  const tagline = productTagline(p, locale);
  const pending = productCopyPending(p);
  const nameTemp = productCopyPlaceholder(p, 'name');
  const taglineTemp = productCopyPlaceholder(p, 'tagline');
  const desc = productDescription(p, locale);
  const faqIds = familyFaqIds[p.category];
  const faqItems = faqEntries(faqIds, locale);
  const schemaFaqs = faqSchemaItems(faqIds);
  const siblings = (p.siblings ?? []).map((id) => productById.get(id)!).filter(Boolean);
  const pairs = (p.pairsWith ?? [])
    .map((id) => productById.get(id))
    .filter((x): x is NonNullable<typeof x> => !!x)
    .slice(0, 3);
  const lengths =
    p.subtype === 'catering-roll'
      ? (p.specs.rollLengths.value ?? []).map((l) => (l.unit === 'm' ? `${l.value} m` : `${l.value} sq ft`))
      : [];
  const images = p.images.map((img) => ({
    src: img.src,
    width: img.width ?? 2000,
    height: img.height ?? 2000,
    alt: tx(img.alt, locale),
    blur: img.blurDataURL,
  }));

  return (
    <>
      <JsonLd data={productSchema(locale, p)} />
      {schemaFaqs.length > 0 && <JsonLd data={faqSchema(locale, schemaFaqs)} />}

      <section className="on-light bg-white pt-6 pb-16 text-blue md:pt-8 lg:pb-24">
        <div className="shell">
          <Breadcrumbs
            className="mb-6"
            items={[
              { name: tc('products'), path: '/products' },
              { name: tx(cat.shortName, locale), path: `/products/${p.category}` },
              { name: p.modelCode ?? name, path: productHref(p) },
            ]}
          />
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-12 lg:gap-12">
            <div className="lg:col-span-7">
              <div className="lg:sticky lg:top-[calc(var(--header-h)+24px)]">
                <Gallery images={images} code={p.modelCode} name={name} category={p.category} />
              </div>
            </div>

            <div className="lg:col-span-5">
              <Sticker tone={STICKER_TONE[p.category]} rotate={-3}>
                {tx(cat.shortName, locale)}
              </Sticker>
              {p.modelCode && (
                <>
                  <p className="mt-6 type-small">{t('model')}</p>
                  <p className="type-code-xl" aria-hidden>
                    <bdi dir="ltr">{p.modelCode}</bdi>
                  </p>
                </>
              )}
              <h1 className={cn('mt-3 max-w-[22ch] type-h3', !p.modelCode && 'mt-6 type-h2')}>
                {pending ? (
                  <Pending note={p.fallback?.note}>{name}</Pending>
                ) : nameTemp ? (
                  <Placeholder note={nameTemp}>{name}</Placeholder>
                ) : (
                  name
                )}
                <ArDraftBadge show={isArDraft(p.name, locale)} />
              </h1>
              <p className="mt-3 type-hand text-[1.5rem] text-red">
                {taglineTemp ? <Placeholder note={taglineTemp}>{tagline}</Placeholder> : tagline}
              </p>
              <p className="mt-5 max-w-[60ch] type-body-l">
                {desc.map((s, i) =>
                  s.pending ? (
                    <Pending key={i} note={s.pending}>
                      {s.text}
                    </Pending>
                  ) : s.placeholder ? (
                    <Placeholder key={i} note={s.placeholder}>
                      {s.text}
                    </Placeholder>
                  ) : (
                    <span key={i}>{s.text}</span>
                  ),
                )}
              </p>

              {p.goodFor.length > 0 && (
                <div className="mt-6">
                  <p className="mb-2.5 type-small font-bold">
                    {t('goodFor')} <Placeholder note="Editorial suggestions" />
                  </p>
                  <ul className="flex flex-wrap gap-2">
                    {p.goodFor.map((g) => (
                      <li key={g}>
                        <StaticChip>{tx(useCaseLabels[g], locale)}</StaticChip>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {siblings.length > 0 && (
                <nav aria-label={t('variants')} className="mt-6">
                  <p className="mb-2.5 type-small font-bold">{t('variants')}</p>
                  <div className="inline-flex rounded-full border-2 border-blue bg-white p-1">
                    {[p, ...siblings]
                      .sort((a, b) => a.sortKey - b.sortKey)
                      .map((s) => (
                        <Link
                          key={s.id}
                          href={productHref(s)}
                          aria-current={s.id === p.id ? 'page' : undefined}
                          className={cn(
                            'inline-flex min-h-11 items-center rounded-full px-4 font-semibold transition-colors',
                            s.id === p.id ? 'bg-blue text-white' : 'hover:bg-yellow',
                          )}
                        >
                          {s.siblingLabel ? tx(s.siblingLabel, locale) : s.modelCode}
                        </Link>
                      ))}
                  </div>
                </nav>
              )}

              <ProductPurchase
                productId={p.id}
                code={p.modelCode}
                name={name}
                thumb={p.images[0]?.src ?? null}
                lengths={lengths}
              />

              <div className="mt-8">
                <ProductSpecs product={p} />
              </div>

              {site.flags.specSheets && (
                <Button href="#" variant="ghost" icon={<IconDownload />} className="mt-4">
                  {t('specSheet')}
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>

      {pairs.length > 0 && (
        <section className="on-light bg-foil section-pad text-blue">
          <div className="shell">
            <h2 className="type-h2">{t('pairs')}</h2>
            <ul className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6" data-reveal-stagger="deal">
              {pairs.map((x) => (
                <li key={x.id}>
                  <ProductCard product={toCard(x, locale)} />
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {faqItems.length > 0 && (
        <section className="on-light bg-white section-pad text-blue">
          <div className="shell grid gap-8 lg:grid-cols-12">
            <h2 className="type-h2 lg:col-span-4">{tcat('familyFaq')}</h2>
            <FaqAccordion items={faqItems} className="lg:col-span-8" />
          </div>
        </section>
      )}

      <section className="on-yellow grain border-t-2 border-blue bg-yellow py-10 text-blue">
        <div className="relative z-[2] shell flex flex-col items-start justify-between gap-5 md:flex-row md:items-center">
          <p className="max-w-[30ch] type-h3">{t('bulkBand')}</p>
          <ViewQuoteButton />
        </div>
      </section>
    </>
  );
}
