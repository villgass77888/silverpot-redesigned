import { useLocale, useTranslations } from 'next-intl';
import { RecycleCycle } from './RecycleCycle';
import { Link } from '@/i18n/navigation';
import { categories, categoryCount } from '@/data/categories';
import { productById, products } from '@/data/products';
import { segments } from '@/data/segments';
import { teaserFoods } from '@/data/usecases';
import { site } from '@/data/site';
import { tx } from '@/lib/l10n';
import { toCard } from '@/lib/catalog';
import { SHOW_UNCONFIRMED } from '@/lib/review-mode';
import { faqEntries, homeTeaserIds } from '@/lib/faq';
import { CategoryTile } from '../catalogue/CategoryTile';
import { FeaturedRail } from './FeaturedRail';
import { StickerWall } from './StickerWall';
import { Button } from '../primitives/Button';
import { Pending, Placeholder, richTags } from '../primitives/Pending';
import { FaqAccordion } from '../primitives/FaqAccordion';
import { ClipboardIll } from '../illustrations/objects';
import { FactoryIcon, PalletIcon, PeopleIcon, TruckIcon } from '../illustrations/segments';

/* H5 — Pick your family */
export function Families() {
  const t = useTranslations('home.families');
  const tc = useTranslations('common');
  const locale = useLocale();
  return (
    <section className="on-light bg-white pt-8 pb-16 text-blue cv-auto lg:pb-32">
      <div className="shell">
        <h2 className="type-h2">{t('h2')}</h2>
        <div className="mt-10 grid gap-5 md:grid-cols-3 lg:gap-8" data-reveal-stagger="deal">
          {categories.map((c, i) => {
            const hero = productById.get(c.heroProductId)!;
            const img = hero.images[0];
            const count = categoryCount(c.slug);
            return (
              <CategoryTile
                key={c.slug}
                index={i}
                slug={c.slug}
                tone={c.tone}
                title={t(`${c.slug}.title`)}
                line={t(`${c.slug}.line`)}
                countLabel={c.slug === 'foil' ? tc('productsCount', { count }) : tc('modelsCount', { count })}
                image={img ? { src: img.src, alt: tx(img.alt, locale) } : null}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* H6 — Start with these */
export function Featured() {
  const t = useTranslations('home.featured');
  const locale = useLocale();
  const items = products.filter((p) => p.featured).map((p) => toCard(p, locale));
  return (
    <section className="on-light bg-foil section-pad text-blue cv-auto">
      <div className="shell">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="type-h2">{t('h2')}</h2>
            <p className="mt-3 type-body-l">
              {site.bestsellersConfirmed ? t('sub') : t.rich('subSafe', richTags())}
            </p>
          </div>
          <Link
            href="/products"
            className="hidden min-h-11 items-center font-bold underline decoration-2 underline-offset-4 md:inline-flex"
          >
            {t('seeAll', { count: products.length })}
          </Link>
        </div>
        <div className="mt-10">
          <FeaturedRail items={items} />
        </div>
        <Link
          href="/products"
          className="mt-6 inline-flex min-h-11 items-center font-bold underline decoration-2 underline-offset-4 md:hidden"
        >
          {t('seeAll', { count: products.length })}
        </Link>
      </div>
    </section>
  );
}

/* H7 — Size finder teaser */
export function FinderTeaser() {
  const t = useTranslations('home.finder');
  const locale = useLocale();
  return (
    <section className="on-light bg-white section-pad text-blue cv-auto">
      <div className="shell">
        <div className="on-yellow grain relative overflow-hidden rounded-tile border-2 border-blue bg-yellow p-6 sm:p-10 lg:p-14">
          <div className="relative z-[2] grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-8">
              <h2 className="type-h2">{t('h2')}</h2>
              <p className="mt-4 max-w-[52ch] type-body-l">{t('body')}</p>
              <p className="mt-8 mb-3 font-bold" id="finder-chips">
                {t('chipsLabel')}
              </p>
              <ul
                className="flex flex-wrap gap-2.5"
                aria-labelledby="finder-chips"
                data-reveal-stagger="stamp"
              >
                {teaserFoods.map((f) => (
                  <li key={f.id}>
                    <Link
                      href={`/size-finder?food=${f.id}`}
                      className="inline-flex min-h-11 press items-center rounded-full border-2 border-blue bg-white px-4 font-semibold"
                    >
                      {tx(f.label, locale)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="mx-auto w-40 rotate-3 sm:w-48 lg:col-span-4 lg:mx-0 lg:ms-auto lg:w-56 lg:self-center">
              <ClipboardIll />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* H8 — Who we pack for */
export function WhoWePackFor() {
  const t = useTranslations('home.segments');
  const locale = useLocale();
  const items = segments
    .filter((s) => s.confirmed || s.placeholder || SHOW_UNCONFIRMED)
    .map((s) => ({
      id: s.id,
      label: tx(s.label, locale),
      line: tx(s.line, locale),
      pending: s.confirmed ? undefined : s.placeholder ? (
        <Placeholder note={s.note} className="mt-2 !text-[0.6875rem]" />
      ) : (
        <Pending note={s.note} className="mt-2 !text-[0.6875rem]" />
      ),
    }));
  return (
    <section className="on-light bg-white pb-16 text-blue cv-auto lg:pb-32">
      <div className="shell">
        <h2 className="type-h2">{t('h2')}</h2>
        <div className="mt-12">
          <StickerWall items={items} hint={t('dragHint')} />
        </div>
        <div className="mt-10">
          <Button href="/wholesale" variant="secondary">
            {t('cta')}
          </Button>
        </div>
      </div>
    </section>
  );
}

/* H9 — Use once. Recycle forever. */
export function RecycleBand() {
  const t = useTranslations('home.recycle');
  return (
    <section className="on-red grain relative overflow-hidden bg-red section-pad text-white cv-auto">
      <div className="relative z-[2] shell grid items-center gap-12 lg:grid-cols-12">
        <div className="lg:col-span-6">
          <h2 className="type-h2">{t('h2')}</h2>
          <p className="mt-5 max-w-[46ch] type-body-l">{t('body')}</p>
          <Button href="/sustainability" variant="yellow" size="lg" raised className="mt-8">
            {t('cta')}
          </Button>
        </div>
        <div className="pt-8 lg:col-span-6 lg:pt-0" data-reveal-skip>
          <RecycleCycle note={t('bubble')} />
        </div>
      </div>
    </section>
  );
}

/* H10 — Why order from the factory? */
export function WhyFactory() {
  const t = useTranslations('home.why');
  const cards = [
    { k: 'factory', Icon: FactoryIcon, body: t('factory.body') },
    { k: 'delivered', Icon: TruckIcon, body: t.rich('delivered.body', richTags(t('delivered.note'))) },
    {
      k: 'bulk',
      Icon: PalletIcon,
      body: t.rich('bulk.body', richTags()),
    },
    { k: 'people', Icon: PeopleIcon, body: t('people.body') },
  ] as const;
  return (
    <section className="on-light bg-white section-pad text-blue cv-auto">
      <div className="shell">
        <h2 className="type-h2">{t('h2')}</h2>
        <ul
          className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6"
          data-reveal-stagger="zoom"
        >
          {cards.map(({ k, Icon, body }) => (
            <li key={k} className="rim bg-white p-6">
              <span className="block w-20">
                <Icon />
              </span>
              <h3 className="mt-5 type-h4">{t(`${k}.title`)}</h3>
              <p className="mt-2 type-body text-blue/85">{body}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* H12 — Quick answers */
export function QuickAnswers() {
  const t = useTranslations('home.faq');
  const locale = useLocale();
  const items = faqEntries(homeTeaserIds, locale);
  return (
    <section className="on-light bg-white pb-16 text-blue cv-auto lg:pb-32">
      <div className="shell grid gap-10 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <h2 className="type-h2">{t('h2')}</h2>
          <Link
            href="/faq"
            className="mt-6 inline-flex min-h-11 items-center font-bold underline decoration-2 underline-offset-4"
          >
            {t('all')}
          </Link>
        </div>
        <div className="lg:col-span-8">
          <FaqAccordion items={items} />
        </div>
      </div>
    </section>
  );
}
