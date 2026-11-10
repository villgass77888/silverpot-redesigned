import { useTranslations } from 'next-intl';
import { Odometer } from '../primitives/Odometer';
import { HandNote } from '../primitives/HandNote';
import { richTags } from '../primitives/Pending';
import { ContainerDeadlift } from '../illustrations/objects';
import { products } from '@/data/products';

/**
 * H4 Bento "Light metal. Heavy duty." (§7.1). Tiles are content, not buttons:
 * no shadows. 24px corners, 16px gaps. Only motion: the odometer.
 */
export function Bento() {
  const t = useTranslations('home.bento');
  return (
    <section className="on-light bg-white pb-16 text-blue lg:pb-32">
      <div className="shell grid gap-4 lg:grid-cols-12">
        <div className="on-blue grain relative overflow-hidden rounded-tile bg-blue p-7 text-white sm:p-10 lg:col-span-7 lg:row-span-2 lg:flex lg:min-h-[560px] lg:flex-col lg:justify-between lg:p-14">
          <h2 className="relative z-[2] type-h2 text-[clamp(2.8rem,6.4vw,5.95rem)] text-yellow">{t('h2')}</h2>
          <div className="relative z-[2] mt-8 lg:mt-0">
            <p className="max-w-[38ch] type-body">{t.rich('body', richTags(t('bodyNote')))}</p>
            {/* The illustration sits below this tile on phones/tablets and beside it on desktop */}
            <span className="mt-6 block lg:hidden">
              <HandNote
                arrow="curve-down-right"
                rotate={-5}
                className="text-yellow"
                arrowClassName="translate-y-4"
              >
                {t('note')}
              </HandNote>
            </span>
            <span className="hidden lg:absolute lg:end-0 lg:bottom-full lg:mb-10 lg:block">
              <HandNote arrow="curve-up-right" rotate={-5} className="text-yellow">
                {t('note')}
              </HandNote>
            </span>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-tile border-2 border-blue/15 bg-white bg-blueprint p-6 lg:col-span-5 lg:p-8">
          <div className="mx-auto w-52 sm:w-60">
            <ContainerDeadlift />
          </div>
          <p className="mt-4 -rotate-2 text-center type-hand text-[1.6rem]">{t('whiteNote')}</p>
          <p className="mt-2 text-center type-small text-blue/80">{t('footnote')}</p>
        </div>

        <div className="grid grid-cols-2 gap-4 lg:col-span-5" data-reveal-stagger="stamp">
          <div className="on-yellow grain flex flex-col justify-between rounded-tile bg-yellow p-5 sm:p-7">
            <span className="type-small">{t('yearLabel')}</span>
            <Odometer
              value="1997"
              className="mt-6 font-display text-[clamp(3.25rem,7vw,5.5rem)] leading-none font-black tabular"
            />
          </div>
          <div className="on-red grain flex flex-col justify-between rounded-tile bg-red p-5 text-white sm:p-7">
            <span className="font-display text-[clamp(3.25rem,7vw,5.5rem)] leading-none font-black tabular">
              {products.length}
            </span>
            <span className="mt-6 type-small">{t('countLabel')}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
