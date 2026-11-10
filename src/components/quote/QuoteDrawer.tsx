'use client';

import { useEffect, useRef } from 'react';
import { Dialog } from 'radix-ui';
import { useReturnFocus } from '../useReturnFocus';
import { useTranslations } from 'next-intl';
import { usePathname } from '@/i18n/navigation';
import { useUI } from '../ui-store';
import { useQuote } from './store';
import { QuoteList, useQuoteWhatsApp } from './QuoteList';
import { Crinkle } from '../brand/Crinkle';
import { Button } from '../primitives/Button';
import { IconClose } from '../icons';
import { waHref } from '@/lib/whatsapp';
import { track } from '@/lib/analytics';

/**
 * Quote drawer (§4.4): slides from the right on desktop (left in RTL), bottom sheet with a
 * drag handle on mobile. Backdrop Blue at 40%.
 */
export function QuoteDrawer({ open }: { open: boolean }) {
  const returnFocus = useReturnFocus();
  const t = useTranslations('quote');
  const tc = useTranslations('common');
  const setOpen = useUI((s) => s.setQuoteOpen);
  const items = useQuote((s) => s.items);
  const buildWa = useQuoteWhatsApp();
  const pathname = usePathname();
  const sheet = useRef<HTMLDivElement>(null);
  const drag = useRef<{ y: number; dy: number } | null>(null);
  const lastPath = useRef(pathname);

  // Close on navigation (not on mount: this component mounts lazily on first open).
  useEffect(() => {
    if (lastPath.current !== pathname) {
      lastPath.current = pathname;
      setOpen(false);
    }
  }, [pathname, setOpen]);

  const count = items.length;

  // Drag-to-dismiss on the mobile handle.
  const onPointerDown = (e: React.PointerEvent) => {
    drag.current = { y: e.clientY, dy: 0 };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!drag.current || !sheet.current) return;
    drag.current.dy = Math.max(0, e.clientY - drag.current.y);
    sheet.current.style.transform = `translateY(${drag.current.dy}px)`;
  };
  const onPointerUp = () => {
    if (!drag.current || !sheet.current) return;
    const close = drag.current.dy > 90;
    sheet.current.style.transform = '';
    drag.current = null;
    if (close) setOpen(false);
  };

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Portal>
        <Dialog.Overlay className="quote-overlay fixed inset-0 z-[75] bg-blue/40" />
        <Dialog.Content
          {...returnFocus}
          ref={sheet}
          className="quote-drawer on-light fixed inset-x-0 bottom-0 z-[76] flex max-h-[88svh] flex-col rounded-t-[22px] border-2 border-b-0 border-blue bg-white text-blue md:inset-y-0 md:start-auto md:end-0 md:max-h-none md:w-[440px] md:rounded-none md:border-y-0 md:border-e-0"
          aria-describedby={undefined}
        >
          <div
            className="flex h-7 shrink-0 cursor-grab touch-none items-center justify-center md:hidden"
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
            aria-hidden
          >
            <span className="h-1.5 w-12 rounded-full bg-blue/30" />
          </div>
          <div className="flex shrink-0 items-center justify-between border-b-2 border-blue px-5 pb-3 md:h-[var(--header-h)] md:pb-0">
            <Dialog.Title className="type-h3">
              {t('drawerTitle')} <span className="text-blue/80 tabular">({count})</span>
            </Dialog.Title>
            <Dialog.Close
              className="grid size-11 place-items-center rounded-full hover:bg-foil"
              aria-label={tc('close')}
            >
              <IconClose size={22} />
            </Dialog.Close>
          </div>

          {count === 0 ? (
            <div className="flex flex-1 flex-col items-center justify-center px-6 py-10 text-center">
              <div className="w-40">
                <Crinkle pose="sleeping" />
              </div>
              <p className="mt-6 type-h3">{t('empty')}</p>
              <p className="mt-2 max-w-[30ch] type-body text-blue/80">{t('emptySub')}</p>
              <Button href="/products" className="mt-6" onClick={() => setOpen(false)}>
                {tc('browseProducts')}
              </Button>
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-y-auto overscroll-contain px-5">
                <QuoteList variant="compact" />
              </div>
              <div className="grid shrink-0 gap-2.5 border-t-2 border-blue bg-foil px-5 pt-4 pb-[calc(16px+env(safe-area-inset-bottom))]">
                <Button href="/quote" full size="lg" onClick={() => setOpen(false)}>
                  {t('review')}
                </Button>
                <Button
                  href={waHref(buildWa())}
                  variant="whatsapp"
                  full
                  onClick={() => track('quote_whatsapp', { itemCount: count })}
                >
                  {t('sendWhatsApp')}
                </Button>
              </div>
            </>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
