import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Hero } from '@/components/home/Hero';
import { Conveyor, type ConveyorItem } from '@/components/home/Conveyor';
import { Manifesto } from '@/components/home/Manifesto';
import { Bento } from '@/components/home/Bento';
import {
  Families,
  Featured,
  FinderTeaser,
  QuickAnswers,
  RecycleBand,
  WhoWePackFor,
  WhyFactory,
} from '@/components/home/Sections';
import { BulkCta } from '@/components/home/BulkCta';
import { JsonLd } from '@/components/seo/JsonLd';
import { websiteSchema } from '@/components/seo/schemas';
import { productById, productHref } from '@/data/products';
import { pageMetadata } from '@/lib/seo';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta.home' });
  return pageMetadata({ locale, path: '/', title: t('title'), description: t('description') });
}

/** Conveyor strip (§7.1 H2): what we make, by product type. Thumb = a representative product; null href → its page. */
const CONVEYOR = [
  ['containers', '/products/containers', 'c-8342'],
  ['compartments', null, 'c-8576-3'], // the 8576 page toggles 2 ↔ 3 compartments
  ['platters', '/products/platters', 'p-6586'],
  ['household', '/products/foil?type=household', 'f-30-75'],
  ['catering', '/products/foil?type=catering', 'f-30-cat'],
  ['promo', '/products/foil?type=promo', 'f-promo-3'],
] as const;

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations('home.conveyor');
  const conveyor: ConveyorItem[] = CONVEYOR.map(([key, href, id]) => {
    const p = productById.get(id);
    return {
      label: t(key),
      href: href ?? (p ? productHref(p) : '/products'),
      thumb: p?.images[0]?.src ?? null,
    };
  });

  return (
    <>
      <JsonLd data={websiteSchema()} />
      <Hero />
      <Conveyor items={conveyor} />
      <Manifesto />
      <Bento />
      <Families />
      <Featured />
      <FinderTeaser />
      <WhoWePackFor />
      <RecycleBand />
      <WhyFactory />
      <QuickAnswers />
      <BulkCta />
    </>
  );
}
