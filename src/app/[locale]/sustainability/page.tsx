import type { Metadata } from 'next';
import { AfterlifeLoop } from '@/components/illustrations/AfterlifeLoop';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { Crinkle } from '@/components/brand/Crinkle';
import { Button } from '@/components/primitives/Button';
import { Pending } from '@/components/primitives/Pending';
import { Rivets } from '@/components/primitives/Motifs';
import { IconCheck } from '@/components/icons';
import { site } from '@/data/site';
import { pageMetadata } from '@/lib/seo';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta.sustainability' });
  return pageMetadata({ locale, path: '/sustainability', title: t('title'), description: t('description') });
}

/** Sustainability (§7.8). General, true statements about aluminium only; no company claims. */
export default async function SustainabilityPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('sustainability');
  const tc = await getTranslations('common');
  const tn = await getTranslations('nav');

  return (
    <>
      {/* 1. Hero */}
      <section className="on-red grain relative overflow-hidden bg-red text-white">
        <div className="relative z-[2] shell grid items-end gap-10 pt-10 pb-16 md:pt-14 lg:grid-cols-12 lg:pb-24">
          <div className="lg:col-span-8">
            <Breadcrumbs
              items={[{ name: tn('sustainability'), path: '/sustainability' }]}
              className="mb-8 text-white/90"
            />
            <h1 className="max-w-[12ch] type-display">
              {t.rich('h1', { hl: (c) => <span className="text-yellow">{c}</span> })}
            </h1>
            <p className="mt-6 max-w-[54ch] type-body-l">{t('sub')}</p>
          </div>
          {/* Off-centre on phones so the speech bubble (which grows to his left) stays on screen */}
          <div className="ms-auto me-4 w-44 pt-16 sm:mx-auto sm:w-56 lg:col-span-4">
            <Crinkle
              pose="wave"
              halo
              track
              talkOn={1}
              className="crinkle-hop cursor-pointer"
              speech={t('bubble')}
              speechSide="start"
            />
          </div>
        </div>
      </section>

      {/* 2. The afterlife of a container — a real cycle, numbered 1–5 */}
      <section className="on-light bg-white section-pad text-blue">
        <div className="shell grid items-center gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <h2 className="type-h2">{t('afterlifeH2')}</h2>
            <ol className="mt-8 space-y-4" data-reveal-stagger="start">
              {(['1', '2', '3', '4', '5'] as const).map((n) => (
                <li key={n} className="flex items-baseline gap-4 border-b-2 border-blue/15 pb-4">
                  <span className="font-display text-5xl leading-none font-black tabular" aria-hidden>
                    {n}
                  </span>
                  <span className="type-h4">{t(`afterlife.${n}`)}</span>
                </li>
              ))}
            </ol>
            <p className="mt-4 -rotate-2 type-hand text-red">↻ {t('loopNote')}</p>
          </div>
          <div className="mx-auto w-full max-w-xl lg:col-span-7">
            <AfterlifeLoop className="block h-auto w-full overflow-visible" />
          </div>
        </div>
      </section>

      {/* 3. How to recycle us properly — a checklist styled as a DataPlate */}
      <section className="on-light bg-foil section-pad text-blue">
        <div className="shell grid gap-10 lg:grid-cols-12">
          <h2 className="type-h2 lg:col-span-5">{t('howH2')}</h2>
          <div className="relative rounded-plate bg-white px-6 pt-6 pb-4 shadow-[inset_0_0_0_1px_rgb(14_42_140/0.12)] lg:col-span-7">
            <Rivets />
            <ul className="divide-y divide-blue-12">
              {(['1', '2', '3', '4'] as const).map((n) => (
                <li key={n} className="flex gap-4 py-4">
                  <span
                    className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-full border-2 border-blue bg-yellow"
                    aria-hidden
                  >
                    <IconCheck size={14} />
                  </span>
                  <p className="type-body-l">
                    {t(`how.${n}`)}
                    {n === '2' && (
                      <>
                        {' '}
                        <Pending note={t('how.2note')} />
                      </>
                    )}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* 4. What we're doing (flag off until the client supplies initiatives) */}
      {site.flags.showSustainabilityActions && (
        <section className="on-light bg-white section-pad text-blue">
          <div className="shell">
            <h2 className="type-h2">{t('doingH2')}</h2>
          </div>
        </section>
      )}

      {/* 5. CTA */}
      <section className="on-yellow grain bg-yellow py-16 text-blue">
        <div className="relative z-[2] shell flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <h2 className="max-w-[18ch] type-h2">{t('ctaH2')}</h2>
          <Button href="/contact" size="lg" raised>
            {tc('askUs')}
          </Button>
        </div>
      </section>
    </>
  );
}
