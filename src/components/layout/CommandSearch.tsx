'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import { Dialog } from 'radix-ui';
import { useReturnFocus } from '../useReturnFocus';
import { Command } from 'cmdk';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/navigation';
import { useCatalog } from '../catalog-context';
import { useUI } from '../ui-store';
import { useQuote } from '../quote/store';
import { IconSearch, IconWhatsApp } from '../icons';
import { ProductThumbFallback } from '../catalogue/PhotoComingSoon';
import { waHref } from '@/lib/whatsapp';
import { track } from '@/lib/analytics';
import type { CardProduct } from '@/lib/catalog';
import { searchCatalog } from '@/lib/search';
import { makeFuse } from '@/lib/fuse';

export function CommandSearch({ open }: { open: boolean }) {
  const returnFocus = useReturnFocus();
  const t = useTranslations('search');
  const tq = useTranslations('quote');
  const { list, ready } = useCatalog();
  const router = useRouter();
  const setOpen = useUI((s) => s.setSearchOpen);
  const [q, setQ] = useState('');
  const [active, setActive] = useState('');
  const fuse = useMemo(() => makeFuse(list), [list]);
  const results = useMemo(
    () => (q.trim() ? searchCatalog(list, fuse, q) : list.filter((p) => p.featured)),
    [q, list, fuse],
  );

  const finish = (nextOpen: boolean) => {
    if (!nextOpen && q.trim()) {
      const r = results;
      track('search_used', {
        queryLength: q.trim().length,
        resultCount: r.length,
        hitModelCode: r.some((p) => p.code?.toUpperCase() === q.trim().toUpperCase()),
      });
    }
    setOpen(nextOpen);
    if (!nextOpen) setQ('');
  };

  const go = (p: CardProduct) => {
    finish(false);
    router.push(p.href);
  };
  const addActive = () => {
    const p = results.find((r) => r.id === active) ?? results[0];
    if (!p) return;
    useQuote.getState().add(p.id);
    const ui = useUI.getState();
    ui.bumpQuote();
    ui.announce(tq('announceAdded', { code: p.code ?? p.name }));
    ui.toast(tq('toastAdded'), 'success');
    track('add_to_quote', { productId: p.id, modelCode: p.code, category: p.category, source: 'search' });
  };

  return (
    <Dialog.Root open={open} onOpenChange={finish}>
      <Dialog.Portal>
        <Dialog.Overlay className="search-overlay fixed inset-0 z-[85] bg-blue/40" />
        <Dialog.Content
          {...returnFocus}
          className="search-panel on-light fixed inset-x-3 top-3 z-[86] mx-auto max-w-[640px] overflow-hidden rounded-[18px] border-2 border-blue bg-white text-blue shadow-hard-lg md:top-[12vh]"
          aria-describedby={undefined}
        >
          <Dialog.Title className="sr-only">{t('label')}</Dialog.Title>
          <Command
            label={t('label')}
            shouldFilter={false}
            loop
            value={active}
            onValueChange={setActive}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && e.shiftKey) {
                e.preventDefault();
                addActive();
              }
            }}
          >
            <div className="flex items-center gap-3 border-b-2 border-blue px-4">
              <IconSearch size={24} className="shrink-0" />
              <Command.Input
                value={q}
                onValueChange={setQ}
                placeholder={t('placeholder')}
                className="h-16 w-full bg-transparent text-lg font-semibold outline-none placeholder:text-blue/45"
              />
              <kbd className="hidden shrink-0 rounded-[5px] border border-blue/30 bg-foil px-1.5 py-0.5 text-[0.6875rem] font-bold sm:inline">
                Esc
              </kbd>
            </div>
            <Command.List className="max-h-[min(60vh,520px)] overflow-y-auto overscroll-contain p-2">
              {!ready && (
                <Command.Loading>
                  <div className="space-y-2 p-2" aria-hidden>
                    {[0, 1, 2].map((i) => (
                      <div key={i} className="shimmer h-14 rounded-[12px]" />
                    ))}
                  </div>
                </Command.Loading>
              )}
              {ready && (
                <Command.Empty className="px-4 py-8 text-center">
                  <p className="type-body">{t('empty', { q })}</p>
                  <a
                    href={waHref(q)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex min-h-11 press items-center gap-2 rounded-btn border-2 border-blue bg-white px-4 font-bold"
                    data-track="whatsapp_click"
                    data-track-location="search"
                  >
                    <IconWhatsApp size={20} />
                    WhatsApp
                  </a>
                </Command.Empty>
              )}
              {results.length > 0 && (
                <Command.Group heading={q.trim() ? t('results') : t('suggested')} className="search-group">
                  {results.map((p) => (
                    <Command.Item
                      key={p.id}
                      value={p.id}
                      onSelect={() => go(p)}
                      className="flex cursor-pointer items-center gap-3 rounded-[12px] px-2 py-2 data-[selected=true]:bg-yellow"
                    >
                      <span className="rim relative size-12 shrink-0 overflow-hidden bg-foil">
                        {p.image ? (
                          <Image
                            src={p.image.src}
                            alt=""
                            fill
                            sizes="48px"
                            className="object-contain product-cutout"
                            quality={78}
                          />
                        ) : (
                          <ProductThumbFallback category={p.category} />
                        )}
                      </span>
                      <span className="min-w-0 flex-1">
                        {p.code && (
                          <span className="block font-display text-[1.375rem] leading-none font-extrabold tabular">
                            <bdi dir="ltr">{p.code}</bdi>
                          </span>
                        )}
                        <span className="block truncate text-sm font-semibold">{p.name}</span>
                      </span>
                      <span className="hidden shrink-0 rounded-full border-2 border-blue/25 px-2 py-0.5 text-xs font-bold sm:inline">
                        {p.familyLabel}
                      </span>
                    </Command.Item>
                  ))}
                </Command.Group>
              )}
            </Command.List>
            <p className="border-t-2 border-blue/10 bg-foil px-4 py-2.5 text-xs font-semibold text-blue/80">
              {t('hint')}
            </p>
          </Command>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
