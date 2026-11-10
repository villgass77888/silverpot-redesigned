'use client';

import { useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import { FaqAccordion, type FaqEntry } from '../primitives/FaqAccordion';
import { IconSearch } from '../icons';

export type FaqGroupData = { id: string; title: string; items: FaqEntry[] };

/** FAQ page body (§7.9): search filters questions live; one open item per group. */
export function FaqBrowser({ groups }: { groups: FaqGroupData[] }) {
  const t = useTranslations('faqPage');
  const [q, setQ] = useState('');
  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return groups;
    return groups
      .map((g) => ({
        ...g,
        items: g.items.filter((i) =>
          `${i.q} ${typeof i.a === 'string' ? i.a : ''}`.toLowerCase().includes(needle),
        ),
      }))
      .filter((g) => g.items.length);
  }, [groups, q]);
  const count = filtered.reduce((s, g) => s + g.items.length, 0);

  return (
    <>
      <div className="relative max-w-2xl text-blue">
        <label htmlFor="faq-search" className="sr-only">
          {t('searchLabel')}
        </label>
        <IconSearch size={24} className="pointer-events-none absolute start-5 top-1/2 -translate-y-1/2" />
        <input
          id="faq-search"
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={t('searchPlaceholder')}
          className="h-16 w-full rounded-[14px] border-[3px] border-blue bg-white ps-14 pe-4 text-lg font-semibold shadow-hard-md outline-none placeholder:text-blue/45"
        />
      </div>
      <div className="sr-only" aria-live="polite">
        {q ? count : ''}
      </div>
      <div data-faq-results className="mt-14 space-y-14">
        {count === 0 ? (
          <p className="type-h3">{t('noResults', { q })}</p>
        ) : (
          filtered.map((g) => (
            <section key={g.id} aria-labelledby={`faq-${g.id}`} className="grid gap-6 lg:grid-cols-12">
              <h2 id={`faq-${g.id}`} className="type-h3 lg:col-span-4">
                {g.title}
              </h2>
              <FaqAccordion items={g.items} className="lg:col-span-8" />
            </section>
          ))
        )}
      </div>
    </>
  );
}
