import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { SizeFinder, type FinderOutcome } from '@/components/finder/SizeFinder';
import { ClipboardIll } from '@/components/illustrations/objects';
import { finderComps, finderFoods, finderServings, runFinder, skipsCompartments } from '@/data/sizeFinder';
import { products } from '@/data/products';
import { toCard } from '@/lib/catalog';
import { tx } from '@/lib/l10n';
import { pageMetadata } from '@/lib/seo';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta.sizeFinder' });
  return pageMetadata({ locale, path: '/size-finder', title: t('title'), description: t('description') });
}

/** Size finder (§7.5). All 144 answer combinations are resolved here, from the §9.6 rules. */
export default async function SizeFinderPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('finder');
  const tf = await getTranslations('footer');

  const outcomes: Record<string, FinderOutcome> = {};
  const used = new Set<string>();
  for (const f of finderFoods)
    for (const s of finderServings)
      for (const c of finderComps) {
        const comp = skipsCompartments(f.id) ? 'no' : c.id;
        const r = runFinder({ food: f.id, servings: s.id, comp });
        r.productIds.forEach((id) => used.add(id));
        outcomes[`${f.id}|${s.id}|${comp}`] = {
          productIds: r.productIds,
          reason: tx(r.reason, locale),
          needsConfirm: r.needsConfirm,
        };
      }
  const catalog = Object.fromEntries(
    products.filter((p) => used.has(p.id)).map((p) => [p.id, toCard(p, locale)]),
  );

  return (
    <section className="on-light bg-white pt-8 pb-24 text-blue md:pt-12">
      <div className="shell">
        <Breadcrumbs items={[{ name: tf('sizeFinder'), path: '/size-finder' }]} className="mb-6" />
        <div className="mb-12 grid items-end gap-8 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <h1 className="max-w-[13ch] type-display">{t('h1')}</h1>
            <p className="mt-5 max-w-[52ch] type-body-l">{t('sub')}</p>
          </div>
          <div className="hidden w-40 rotate-3 lg:col-span-4 lg:ms-auto lg:block">
            <ClipboardIll />
          </div>
        </div>
        <SizeFinder
          foods={finderFoods.map((f) => ({ id: f.id, label: tx(f.label, locale) }))}
          servings={finderServings.map((s) => ({ id: s.id, label: s.label }))}
          comps={finderComps.map((c) => ({ id: c.id, label: tx(c.label, locale) }))}
          outcomes={outcomes}
          catalog={catalog}
          skipCompFor={finderFoods.filter((f) => skipsCompartments(f.id)).map((f) => f.id)}
        />
      </div>
    </section>
  );
}
