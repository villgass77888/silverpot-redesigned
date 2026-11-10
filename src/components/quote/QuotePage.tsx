'use client';

import { useTranslations } from 'next-intl';
import { useQuote, useQuoteHydrated } from './store';
import { QuoteList } from './QuoteList';
import { LeadForm } from '../forms/LeadForm';
import { Crinkle } from '../brand/Crinkle';
import { Button } from '../primitives/Button';

/** /quote body (§7.11): editable list + form, or the sleeping-Crinkle empty state. */
export function QuotePage({
  turnstileSiteKey,
  responseTimeHours,
}: {
  turnstileSiteKey?: string;
  responseTimeHours: number | null;
}) {
  const t = useTranslations('quote');
  const tc = useTranslations('common');
  const hydrated = useQuoteHydrated();
  const count = useQuote((s) => s.items.length);

  // The list lives in localStorage, so only it waits for hydration; the skeleton holds the
  // empty state's height and the form renders straight away, so nothing below it shifts.
  return (
    <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
      <section aria-labelledby="quote-list" className="lg:col-span-6">
        <h2 id="quote-list" className="type-h3">
          {t('listHeading')} <span className="text-blue/80 tabular">({count})</span>
        </h2>
        {!hydrated ? (
          <div
            className="shimmer mt-6 min-h-[26rem] rounded-tile"
            aria-busy="true"
            aria-label={tc('loading')}
          />
        ) : count === 0 ? (
          <div className="mt-6 flex min-h-[26rem] flex-col items-center justify-center rounded-tile border-2 border-blue/15 bg-foil px-6 py-12 text-center">
            <div className="w-40">
              <Crinkle pose="sleeping" />
            </div>
            <p className="mt-6 type-h3">{t('empty')}</p>
            <p className="mt-2 max-w-[34ch] type-body">{t('emptySub')}</p>
            <Button href="/products" className="mt-6" raised>
              {tc('browseProducts')}
            </Button>
          </div>
        ) : (
          <QuoteList variant="full" className="mt-2" />
        )}
      </section>
      <section aria-labelledby="quote-details" className="lg:col-span-6">
        <div className="rounded-tile border-2 border-blue bg-white p-5 sm:p-8">
          <h2 id="quote-details" className="mb-6 type-h3">
            {t('detailsHeading')}
          </h2>
          <LeadForm mode="quote" turnstileSiteKey={turnstileSiteKey} responseTimeHours={responseTimeHours} />
        </div>
      </section>
    </div>
  );
}
