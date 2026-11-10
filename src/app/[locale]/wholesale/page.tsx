import type { Metadata } from 'next';
import { Crinkle } from '@/components/brand/Crinkle';
import { SlideInMascot } from '@/components/brand/SlideInMascot';
import { PalletStack } from '@/components/illustrations/PalletStack';
import { getLocale, getTranslations, setRequestLocale } from 'next-intl/server';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { LeadForm } from '@/components/forms/LeadForm';
import { Button } from '@/components/primitives/Button';
import { Pending, Placeholder, richTags } from '@/components/primitives/Pending';
import { DataPlate } from '@/components/primitives/DataPlate';
import { Sticker } from '@/components/primitives/Sticker';
import { SEGMENT_ICONS } from '@/components/illustrations/segments';
import { segments } from '@/data/segments';
import { site } from '@/data/site';
import { SHOW_UNCONFIRMED } from '@/lib/review-mode';
import { stickerRotation } from '@/lib/format';
import { tx } from '@/lib/l10n';
import { waHref } from '@/lib/whatsapp';
import { pageMetadata } from '@/lib/seo';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta.wholesale' });
  return pageMetadata({ locale, path: '/wholesale', title: t('title'), description: t('description') });
}

/** Terms at a glance (§7.6-4): every value [CONFIRM]; production hides it until ≥ 3 are confirmed. */
const TERMS: { key: 'moq' | 'lead' | 'areas' | 'payment' | 'samples'; value: string | null }[] = [
  { key: 'moq', value: null },
  { key: 'lead', value: null },
  { key: 'areas', value: null },
  { key: 'payment', value: null },
  { key: 'samples', value: null },
];

/** Wholesale (§7.6). */
export default async function WholesalePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('wholesale');
  const tc = await getTranslations('common');
  const tn = await getTranslations('nav');
  const loc = await getLocale();
  const confirmedTerms = TERMS.filter((x) => x.value).length;
  const showTerms = site.flags.showWholesaleTerms || confirmedTerms >= 3 || SHOW_UNCONFIRMED;
  const supply = segments.filter(
    (s) => s.wholesaleLine && (s.confirmed || s.placeholder || SHOW_UNCONFIRMED),
  );

  return (
    <>
      {/* 1. Hero */}
      <section className="on-blue grain relative overflow-hidden bg-blue text-white">
        <div className="relative z-[2] shell grid items-center gap-10 pt-10 pb-16 md:pt-14 lg:grid-cols-12 lg:pb-24">
          <div className="lg:col-span-8">
            <Breadcrumbs
              items={[{ name: tn('wholesale'), path: '/wholesale' }]}
              className="mb-8 text-white/90"
            />
            <h1 className="max-w-[15ch] type-display text-yellow">{t('h1')}</h1>
            <p className="mt-6 max-w-[52ch] type-body-l">{t.rich('sub', richTags())}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button href="#quote" variant="yellow" size="lg" raised>
                {t('send')}
              </Button>
              <Button
                href={waHref()}
                variant="whatsapp"
                size="lg"
                track="whatsapp_click"
                trackLocation="wholesale"
              >
                {tc('chatWhatsApp')}
              </Button>
            </div>
          </div>
          <div className="mx-auto w-72 sm:w-80 lg:col-span-4 lg:w-full">
            <PalletStack day={t('heroDay')} className="block h-auto w-full overflow-visible" />
          </div>
        </div>
      </section>

      {/* 2. How ordering works — a real sequence, so numbered */}
      <section className="on-light bg-white section-pad text-blue">
        <div className="shell">
          <h2 className="type-h2">{t('howH2')}</h2>
          <ol className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4" data-reveal-stagger="start">
            {(['1', '2', '3', '4'] as const).map((n) => (
              <li key={n} className="border-t-2 border-blue pt-5">
                <span
                  className="font-display text-[5.5rem] leading-[0.8] font-black text-blue tabular"
                  aria-hidden
                >
                  {n}
                </span>
                <h3 className="mt-4 type-h3">{t(`steps.${n}.title`)}</h3>
                <p className="mt-2 type-body">{t.rich(`steps.${n}.body`, richTags())}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* 3. Who we supply (static sticker grid) */}
      <section className="on-light bg-foil section-pad text-blue">
        <div className="shell">
          <h2 className="type-h2">{t('whoH2')}</h2>
          <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3" data-reveal-stagger="deal">
            {supply.map((s, i) => {
              const Icon = SEGMENT_ICONS[s.id];
              return (
                <li
                  key={s.id}
                  className="flex gap-4 rounded-[22px] border-[3px] border-white bg-white p-5"
                  style={{ transform: `rotate(${stickerRotation(i, 2)}deg)` }}
                >
                  <span className="w-16 shrink-0" aria-hidden>
                    <Icon />
                  </span>
                  <span>
                    <h3 className="type-h4">{tx(s.label, loc)}</h3>
                    <p className="mt-1 type-body">{tx(s.wholesaleLine, loc)}</p>
                    {!s.confirmed &&
                      (s.placeholder ? (
                        <Placeholder note={s.note} className="mt-2" />
                      ) : (
                        <Pending note={s.note} className="mt-2" />
                      ))}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* 4. Terms at a glance */}
      {showTerms && (
        <section className="on-light bg-white section-pad text-blue">
          <div className="shell grid gap-8 lg:grid-cols-12">
            <h2 className="type-h2 lg:col-span-5">{t('termsH2')}</h2>
            <DataPlate
              className="lg:col-span-7"
              rows={TERMS.map((x) => ({
                label: t(`terms.${x.key}`),
                value: x.value,
                confirmed: !!x.value,
                note: t(`terms.${x.key}`),
              }))}
            />
          </div>
        </section>
      )}

      {/* 5. Private label (flag off) */}
      {site.flags.privateLabel && (
        <section className="on-yellow bg-yellow section-pad text-blue">
          <div className="shell">
            <h2 className="type-h2">{t('privateH2')}</h2>
          </div>
        </section>
      )}

      {/* 6. Quote / distributor form */}
      <section
        id="quote"
        className="on-light relative scroll-mt-24 overflow-hidden bg-foil section-pad text-blue"
      >
        <div className="shell grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <h2 className="type-h2">{t('formH2')}</h2>
            <Sticker tone="yellow" hand rotate={-5} className="mt-6 text-lg">
              {tc('getBulkQuote')}
            </Sticker>
            <SlideInMascot className="mt-8 w-32 sm:w-40 lg:mt-12 lg:w-52">
              <Crinkle pose="clipboard" />
            </SlideInMascot>
          </div>
          <div className="lg:col-span-8">
            <div className="rounded-tile border-2 border-blue bg-white p-5 sm:p-8">
              <LeadForm
                mode="wholesale"
                turnstileSiteKey={process.env.TURNSTILE_SITE_KEY || undefined}
                responseTimeHours={site.responseTimeHours}
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
