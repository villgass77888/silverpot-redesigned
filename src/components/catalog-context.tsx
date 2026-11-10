'use client';

import { useEffect, useMemo, useState } from 'react';
import { useLocale } from 'next-intl';
import type { CardProduct } from '@/lib/catalog';

/**
 * The catalogue index (search palette, quote list) is a static JSON file per locale,
 * fetched the first time something needs it, instead of riding in every page's
 * RSC payload (§12.1). One request per locale per session.
 */
const loaded = new Map<string, CardProduct[]>();
const pending = new Map<string, Promise<CardProduct[]>>();

function load(locale: string) {
  let p = pending.get(locale);
  if (!p) {
    p = fetch(`/catalog/${locale}.json`)
      .then((r) => {
        if (!r.ok) throw new Error(`catalog ${r.status}`);
        return r.json() as Promise<CardProduct[]>;
      })
      .then((list) => {
        loaded.set(locale, list);
        return list;
      })
      .catch((err: unknown) => {
        pending.delete(locale); // let the next caller retry
        throw err;
      });
    pending.set(locale, p);
  }
  return p;
}

export function useCatalog() {
  const locale = useLocale();
  const [list, setList] = useState<CardProduct[] | undefined>(() => loaded.get(locale));

  useEffect(() => {
    if (list) return;
    let live = true;
    load(locale).then(
      (l) => live && setList(l),
      () => undefined,
    );
    return () => {
      live = false;
    };
  }, [list, locale]);

  const byId = useMemo(() => new Map((list ?? []).map((p) => [p.id, p])), [list]);
  return { list: list ?? [], byId, ready: Boolean(list) };
}
