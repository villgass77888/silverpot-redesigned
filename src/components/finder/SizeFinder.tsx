'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import type { CardProduct } from '@/lib/catalog';
import { ProductCard } from '../catalogue/ProductCard';
import { Chip } from '../primitives/Chip';
import { Button } from '../primitives/Button';
import { waHref } from '@/lib/whatsapp';
import { track } from '@/lib/analytics';
import { cn } from '@/lib/cn';

type Opt = { id: string; label: string };
export type FinderOutcome = { productIds: string[]; reason: string; needsConfirm: boolean };
type Answers = { food?: string; servings?: string; comp?: string };

/**
 * Size finder (§7.5): three stamped steps on a conveyor track, URL-synced so results
 * can be shared and Back works. Outcomes are precomputed on the server from §9.6.
 */
export function SizeFinder({
  foods,
  servings,
  comps,
  outcomes,
  catalog,
  skipCompFor,
}: {
  foods: Opt[];
  servings: Opt[];
  comps: Opt[];
  outcomes: Record<string, FinderOutcome>;
  catalog: Record<string, CardProduct>;
  skipCompFor: string[];
}) {
  const t = useTranslations('finder');
  const [a, setA] = useState<Answers>({});

  useEffect(() => {
    const read = () => {
      const sp = new URLSearchParams(window.location.search);
      const pick = (k: string, opts: Opt[]) =>
        opts.some((o) => o.id === sp.get(k)) ? sp.get(k)! : undefined;
      setA({ food: pick('food', foods), servings: pick('servings', servings), comp: pick('comp', comps) });
    };
    read();
    window.addEventListener('popstate', read);
    return () => window.removeEventListener('popstate', read);
  }, [foods, servings, comps]);

  const skipComp = !!a.food && skipCompFor.includes(a.food);
  const step = !a.food ? 0 : !a.servings ? 1 : !a.comp && !skipComp ? 2 : 3;
  const total = skipComp ? 2 : 3;
  const key = `${a.food}|${a.servings}|${skipComp ? 'no' : a.comp}`;
  const outcome = step === 3 ? outcomes[key] : undefined;

  const set = (patch: Answers) => {
    const next = { ...a, ...patch };
    setA(next);
    const sp = new URLSearchParams();
    if (next.food) sp.set('food', next.food);
    if (next.servings) sp.set('servings', next.servings);
    if (next.comp) sp.set('comp', next.comp);
    window.history.pushState(null, '', `${window.location.pathname}${sp.size ? `?${sp}` : ''}`);
    const done = next.food && next.servings && (next.comp || skipCompFor.includes(next.food));
    if (done) {
      const o =
        outcomes[`${next.food}|${next.servings}|${skipCompFor.includes(next.food!) ? 'no' : next.comp}`];
      track('size_finder_complete', {
        food: next.food!,
        servings: next.servings!,
        compartments: next.comp ?? 'no',
        resultCount: o?.productIds.length ?? 0,
      });
    }
  };
  const restart = () => {
    setA({});
    window.history.pushState(null, '', window.location.pathname);
  };

  const label = (opts: Opt[], id?: string) => opts.find((o) => o.id === id)?.label ?? '—';
  const stations = [t('stations.food'), t('stations.servings'), t('stations.comp')].slice(0, total);
  const waMsg = t('answersMsg', {
    food: label(foods, a.food),
    servings: label(servings, a.servings),
    comp: skipComp ? label(comps, 'no') : label(comps, a.comp),
  });

  return (
    <div className="mx-auto max-w-[760px]">
      <div className="rounded-tile border-2 border-blue bg-foil p-5 sm:p-8">
        {/* Progress conveyor: a real sequence, so the stations are numbered */}
        <ol
          className="relative mb-8 grid"
          style={{ gridTemplateColumns: `repeat(${total}, 1fr)` }}
          aria-label={t('progressLabel')}
        >
          <span aria-hidden className="absolute inset-x-[16%] top-5 h-1 rounded-full bg-blue/20" />
          {stations.map((s, i) => {
            const state = i < step ? 'done' : i === step ? 'current' : 'todo';
            return (
              <li
                key={s}
                className="relative flex flex-col items-center gap-2 text-center"
                aria-current={state === 'current' ? 'step' : undefined}
              >
                <span
                  className={cn(
                    'relative z-[1] grid size-10 place-items-center rounded-full border-2 border-blue font-display text-xl font-black tabular transition-colors',
                    state === 'done' && 'bg-blue text-white',
                    state === 'current' && 'bg-yellow',
                    state === 'todo' && 'bg-white',
                  )}
                  style={state === 'current' ? { animation: 'sp-stamp 380ms var(--ease-stamp)' } : undefined}
                >
                  {i + 1}
                </span>
                <span className="type-small font-semibold">{s}</span>
              </li>
            );
          })}
        </ol>

        {step < 3 && (
          <p className="mb-2 type-small font-semibold text-blue/80">{t('stepOf', { n: step + 1, total })}</p>
        )}

        {step === 0 && (
          <Step title={t('step1')}>
            {foods.map((f) => (
              <Chip key={f.id} size="lg" onClick={() => set({ food: f.id })}>
                {f.label}
              </Chip>
            ))}
          </Step>
        )}
        {step === 1 && (
          <Step title={t('step2')} onBack={() => set({ food: undefined })} back={t('change')}>
            {servings.map((s) => (
              <Chip
                key={s.id}
                size="lg"
                onClick={() => set({ servings: s.id })}
                className="min-w-16 justify-center tabular"
              >
                {s.label}
              </Chip>
            ))}
          </Step>
        )}
        {step === 2 && (
          <Step title={t('step3')} onBack={() => set({ servings: undefined })} back={t('change')}>
            {comps.map((c) => (
              <Chip key={c.id} size="lg" onClick={() => set({ comp: c.id })}>
                {c.label}
              </Chip>
            ))}
          </Step>
        )}

        {step === 3 && (
          <div>
            <p className="type-small font-semibold">{t('yourAnswers')}</p>
            <ul className="mt-2 flex flex-wrap gap-2">
              <li>
                <Chip selected onClick={() => set({ food: undefined, servings: undefined, comp: undefined })}>
                  {label(foods, a.food)}
                </Chip>
              </li>
              <li>
                <Chip selected onClick={() => set({ servings: undefined, comp: undefined })}>
                  {t('people', { label: label(servings, a.servings) })}
                </Chip>
              </li>
              {!skipComp && (
                <li>
                  <Chip selected onClick={() => set({ comp: undefined })}>
                    {label(comps, a.comp)}
                  </Chip>
                </li>
              )}
            </ul>
          </div>
        )}
      </div>

      {outcome && (
        <section className="mt-12" aria-live="polite">
          <h2 className="type-h2">{t('result')}</h2>
          <p className="mt-3 type-hand text-[1.4rem] text-red">{outcome.reason}</p>
          <ul className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6">
            {outcome.productIds
              .map((id) => catalog[id])
              .filter(Boolean)
              .map((p) => (
                <li key={p.id}>
                  <ProductCard product={p} />
                </li>
              ))}
          </ul>
          {outcome.needsConfirm && (
            <div className="on-yellow mt-10 flex flex-col items-start gap-4 rounded-tile border-2 border-blue bg-yellow p-6 sm:flex-row sm:items-center sm:justify-between">
              <p className="type-h4">{t('confirmLine')}</p>
              <Button
                href={waHref(waMsg)}
                variant="whatsapp"
                track="whatsapp_click"
                trackLocation="size-finder"
              >
                {t('sendAnswers')}
              </Button>
            </div>
          )}
          <Button variant="ghost" onClick={restart} className="mt-6 px-0">
            {t('startAgain')}
          </Button>
        </section>
      )}
    </div>
  );
}

function Step({
  title,
  children,
  onBack,
  back,
}: {
  title: string;
  children: React.ReactNode;
  onBack?: () => void;
  back?: string;
}) {
  return (
    <fieldset>
      <legend className="type-h3">{title}</legend>
      <div className="mt-5 flex flex-wrap gap-2.5">{children}</div>
      {onBack && (
        <button
          type="button"
          onClick={onBack}
          className="mt-6 min-h-11 font-semibold underline underline-offset-4"
        >
          {back}
        </button>
      )}
    </fieldset>
  );
}
