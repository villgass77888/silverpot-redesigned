import type { ReactNode } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { Logo, LOGO_PERCH } from '../brand/Logo';
import { Crinkle } from '../brand/Crinkle';
import { Button } from '../primitives/Button';
import { RegistrationMarks } from '../primitives/Motifs';
import { Arrow } from '../illustrations/arrows';
import { HeroPlayedFlag } from './HeroPlayedFlag';
import { HeroProducts, type HeroProduct } from './HeroProducts';
import { TapPress } from './TapPress';
import { categories } from '@/data/categories';
import { productById } from '@/data/products';
import { tx } from '@/lib/l10n';

/** One representative cutout per family for the hero fan. */
const FAN: Record<string, { id: string; tone: HeroProduct['tone'] }> = {
  containers: { id: 'c-8342', tone: 'white' },
  platters: { id: 'p-6586', tone: 'red' },
  foil: { id: 'f-30-cat', tone: 'blue' },
};

/** Three steam squiggles that rise off "heat" (static under reduced motion). */
function Steam() {
  return (
    <svg
      viewBox="0 0 60 40"
      aria-hidden
      focusable="false"
      className="hero-steam pointer-events-none absolute start-1/2 bottom-[84%] h-[0.5em] w-[0.85em] -translate-x-1/2 overflow-visible max-md:start-[104%] max-md:bottom-[40%] max-md:h-[0.42em] max-md:w-[0.6em] max-md:translate-x-0"
      fill="none"
      stroke="currentColor"
      strokeWidth="3.5"
      strokeLinecap="round"
    >
      <path d="M14 38c-7-8 7-12 0-20s7-12 0-17" />
      <path d="M30 38c-7-8 7-12 0-20s7-12 0-17" />
      <path d="M46 38c-7-8 7-12 0-20s7-12 0-17" />
    </svg>
  );
}

/**
 * H1 Hero (§7.1, §8.9). Yellow, full-bleed. The H1 is the LCP element: never at opacity 0,
 * it only settles 12px. The logo badge builds itself (plaque, letters, stars), Aloom jumps
 * onto the plaque, the arrow draws, the product cards deal in, all in CSS so it runs before
 * hydration; skipped on repeat visits this session. Interactive after that: letters squash
 * and stars spin under the pointer or a tap, Aloom hops and talks on click, the fan drifts.
 */
export function Hero() {
  const t = useTranslations('home.hero');
  const tc = useTranslations('common');
  const tk = useTranslations('crinkle');
  const locale = useLocale();

  const fan: HeroProduct[] = categories.map((c) => {
    const pick = FAN[c.slug];
    return {
      href: `/products/${c.slug}`,
      src: productById.get(pick.id)?.images[0]?.src ?? '',
      label: tx(c.shortName, locale),
      tone: pick.tone,
    };
  });

  return (
    <section
      data-reveal-skip
      className="on-yellow grain relative isolate overflow-hidden bg-yellow text-blue lg:min-h-[min(calc(100svh-var(--header-h)-36px),920px)]"
    >
      <HeroPlayedFlag />
      <RegistrationMarks inset={14} size={18} />

      <div className="relative z-[2] shell grid gap-8 pt-24 pb-14 md:pt-28 lg:grid-cols-12 lg:gap-x-10 lg:pt-24 lg:pb-16">
        {/* The logo badge; Aloom jumps up and sits on the plaque's top edge, right of the stars */}
        <div className="lg:col-span-5 lg:row-start-1 lg:self-center">
          <div className="relative w-[76%] max-w-[520px] sm:w-[58%] lg:w-full" dir="ltr">
            <TapPress>
              <Logo animated sticker decorative className="wm-press h-auto w-full" />
            </TapPress>
            <span
              className="absolute z-[3] w-[15%]"
              style={{
                left: `${LOGO_PERCH.x * 100}%`,
                top: `${LOGO_PERCH.y * 100}%`,
                transform: 'translate(-50%, -66%)',
              }}
            >
              <span className="hero-crinkle block">
                <Crinkle
                  pose="perched"
                  track
                  talkOn={1}
                  speechSide="side"
                  label={tk('label')}
                  className="crinkle-hop cursor-pointer"
                />
              </span>
            </span>
            {/* Hand note above the badge, its arrow curling down to Aloom */}
            <span
              className="hero-note absolute bottom-[94%] flex items-end gap-1 md:gap-2"
              style={{ right: `${(1 - LOGO_PERCH.x) * 100 - 6}%` }}
            >
              <span className="-rotate-[4deg] text-end whitespace-nowrap" dir="auto">
                <span className="block type-hand text-[0.95rem] md:text-[1.25rem] lg:text-[1.45rem]">
                  {t('note')}
                </span>
                <span className="block pe-6 type-hand text-[0.75rem] opacity-80 md:text-base">
                  {t('noteSmall')}
                </span>
              </span>
              <Arrow
                kind="curve-down-right"
                className="hero-arrow w-9 shrink-0 translate-y-5 md:w-12 lg:w-14"
              />
            </span>
          </div>
        </div>

        <div className="order-last lg:order-none lg:col-span-7 lg:col-start-6 lg:row-start-1 lg:self-center lg:ps-6">
          <HeroProducts items={fan} />
        </div>

        <h1 className="hero-h1 type-display lg:col-span-12 lg:row-start-2 lg:mt-4">
          {t.rich('h1', {
            hot: (chunks: ReactNode) => (
              <span className="relative inline-block text-red">
                {chunks}
                <Steam />
              </span>
            ),
          })}
        </h1>

        <p className="max-w-[46ch] type-body-l lg:col-span-6 lg:row-start-3">{t('sub')}</p>
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap lg:col-span-6 lg:row-start-3 lg:items-end lg:justify-end">
          <Button href="/products" size="lg" raised>
            {tc('browseProducts')}
          </Button>
          <Button href="/wholesale#quote" variant="secondary" size="lg" prefetch={false}>
            {tc('getBulkQuote')}
          </Button>
        </div>
      </div>
    </section>
  );
}
