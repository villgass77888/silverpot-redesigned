import type { Metadata } from 'next';
import { AboutHeroScene, FactorySkyline } from '@/components/about/AboutHeroScene';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { Odometer } from '@/components/primitives/Odometer';
import { Pending, Placeholder, richTags } from '@/components/primitives/Pending';
import { DataPlate } from '@/components/primitives/DataPlate';
import { Button } from '@/components/primitives/Button';
import { ProcessStory } from '@/components/about/ProcessStory';
import { PressMachine } from '@/components/illustrations/objects';
import { FactoryIcon, PalletIcon, PeopleIcon, TruckIcon } from '@/components/illustrations/segments';
import { JsonLd } from '@/components/seo/JsonLd';
import { aboutPageSchema } from '@/components/seo/schemas';
import { products } from '@/data/products';
import { categories } from '@/data/categories';
import { site } from '@/data/site';
import { SHOW_UNCONFIRMED } from '@/lib/review-mode';
import { pageMetadata } from '@/lib/seo';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta.about' });
  return pageMetadata({ locale, path: '/about', title: t('title'), description: t('description') });
}

/** About (§7.7). */
export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('about');
  const tc = await getTranslations('common');
  const tn = await getTranslations('nav');
  const tk = await getTranslations('crinkle');
  const tf = await getTranslations('footer');
  const steps = (['1', '2', '3', '4', '5', '6'] as const).map((n) => ({
    title: t(`steps.${n}.title`),
    line: t(`steps.${n}.line`),
    note: t(`steps.${n}.note`),
  }));
  const stand = [
    { k: 'heat', Icon: TruckIcon, body: t.rich('stand.heat.body', richTags(t('stand.heat.note'))) },
    { k: 'stacks', Icon: PalletIcon, body: t('stand.stacks.body') },
    { k: 'planet', Icon: FactoryIcon, body: t('stand.planet.body') },
    { k: 'phone', Icon: PeopleIcon, body: t('stand.phone.body') },
  ] as const;
  const numbers = [
    { value: '1997', label: t('numbers.founded'), confirmed: true },
    { value: String(products.length), label: t('numbers.products'), confirmed: true },
    { value: String(categories.length), label: t('numbers.families'), confirmed: true },
    { value: null, label: t('numbers.capacity'), confirmed: false },
    { value: null, label: t('numbers.team'), confirmed: false },
    { value: null, label: t('numbers.countries'), confirmed: false },
  ].filter((n) => n.confirmed || SHOW_UNCONFIRMED);

  return (
    <>
      <JsonLd data={aboutPageSchema(locale)} />

      {/* 1. Hero */}
      <section className="on-blue grain relative overflow-hidden bg-blue text-white">
        <FactorySkyline className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-[55%] w-full" />
        <div className="relative z-[2] shell grid items-end gap-10 pt-10 pb-16 md:pt-14 lg:grid-cols-12 lg:pb-24">
          <div className="lg:col-span-6">
            <Breadcrumbs items={[{ name: tn('about'), path: '/about' }]} className="mb-8 text-white/90" />
            <h1 className="max-w-[14ch] type-display text-yellow">{t('h1')}</h1>
            <div className="mt-10 inline-flex flex-col rounded-tile bg-yellow px-6 py-5 text-blue">
              <span className="type-small">{t('founded')}</span>
              <Odometer
                value="1997"
                className="font-display text-[clamp(4rem,9vw,7rem)] leading-none font-black tabular"
              />
            </div>
          </div>
          <div className="lg:col-span-6">
            <AboutHeroScene speech={t('heroSpeech')} label={tk('label')} />
          </div>
        </div>
      </section>

      {/* 2. Our story */}
      <section className="on-light bg-white section-pad text-blue">
        <div className="shell grid items-center gap-12 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <h2 className="type-h2">{t('storyH2')}</h2>
            <div className="mt-6 max-w-[62ch] space-y-5 type-body-l">
              <p>{t('story1')}</p>
              <p>{t('story2')}</p>
            </div>
          </div>
          <figure className="lg:col-span-5">
            <div className="rim relative aspect-[6/5] overflow-hidden bg-foil bg-blueprint p-[8%]">
              <PressMachine />
            </div>
            <figcaption className="mt-3">
              <Placeholder note={t('photoNeeded')} />
            </figcaption>
          </figure>
        </div>
      </section>

      {/* 3. From coil to container */}
      <section className="on-light bg-foil bg-blueprint section-pad text-blue">
        <div className="shell">
          <h2 className="type-h2">{t('processH2')}</h2>
          <div className="mt-3">
            <Placeholder note={t('processNote')} />
          </div>
          <div className="mt-10">
            <ProcessStory steps={steps} />
          </div>
        </div>
      </section>

      {/* 4. What we stand for */}
      <section className="on-light bg-white section-pad text-blue">
        <div className="shell">
          <h2 className="type-h2">{t('standH2')}</h2>
          <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4" data-reveal-stagger="deal">
            {stand.map(({ k, Icon, body }) => (
              <li key={k} className="rim bg-white p-6">
                <span className="block w-20">
                  <Icon />
                </span>
                <h3 className="mt-5 type-h4">{t(`stand.${k}.title`)}</h3>
                <p className="mt-2 type-body text-blue/85">{body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 5. Numbers */}
      <section className="on-yellow grain bg-yellow py-14 text-blue">
        <ul
          className="relative z-[2] shell grid grid-cols-2 gap-8 md:grid-cols-3 lg:flex lg:justify-between"
          data-reveal-stagger="stamp"
        >
          {numbers.map((n) => (
            <li key={n.label}>
              {n.value ? (
                <span className="block font-display text-[clamp(3.5rem,7vw,6rem)] leading-none font-black tabular">
                  {n.value}
                </span>
              ) : (
                <Pending note={n.label} />
              )}
              <span className="mt-2 block font-semibold">{n.label}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* 6–7. Certifications and factory gallery stay off until supplied */}
      {site.flags.showCerts && (
        <section className="on-light bg-white section-pad text-blue">
          <div className="shell">
            <h2 className="type-h2">{t('certsH2')}</h2>
          </div>
        </section>
      )}

      {/* 8. Company details */}
      <section className="on-light bg-white section-pad text-blue">
        <div className="shell grid gap-8 lg:grid-cols-12">
          <h2 className="type-h2 lg:col-span-5">{t('detailsH2')}</h2>
          <DataPlate
            className="lg:col-span-7"
            valueClassName="font-sans text-base font-bold"
            rows={[
              { label: t('details.legal'), value: site.legalName, confirmed: true },
              { label: t('details.brand'), value: 'Silverpot', confirmed: true },
              { label: t('details.founded'), value: String(site.founded), confirmed: true },
              { label: t('details.location'), value: tf('location'), confirmed: true },
              { label: t('details.licence'), value: null, confirmed: false, note: t('details.licence') },
            ]}
          />
        </div>
      </section>

      {/* 9. CTA */}
      <section className="on-red grain bg-red py-16 text-white">
        <div className="relative z-[2] shell flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <h2 className="type-h2">{t('ctaH2')}</h2>
          <div className="flex flex-wrap gap-3">
            <Button href="/products" variant="yellow" size="lg" raised>
              {tc('browseProducts')}
            </Button>
            <Button href="/contact" variant="secondary" size="lg">
              {tc('contactUs')}
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
