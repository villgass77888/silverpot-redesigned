'use client';

import type { ReactNode } from 'react';
import { Dialog } from 'radix-ui';
import { useReturnFocus } from '../useReturnFocus';
import { useTranslations } from 'next-intl';
import { Button } from '../primitives/Button';
import { IconClose } from '../icons';

/** Mobile filter bottom sheet (§7.2). Loaded on first open, so Radix isn't first-load JS. */
export function FilterSheet({
  open,
  onOpenChange,
  onClear,
  resultCount,
  children,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onClear: () => void;
  resultCount: number;
  children: ReactNode;
}) {
  const returnFocus = useReturnFocus();
  const t = useTranslations('catalogue');
  const tc = useTranslations('common');
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="quote-overlay fixed inset-0 z-[75] bg-blue/40" />
        <Dialog.Content
          {...returnFocus}
          className="quote-drawer on-light fixed inset-x-0 bottom-0 z-[76] flex max-h-[88svh] flex-col rounded-t-[22px] border-2 border-b-0 border-blue bg-white text-blue md:hidden"
          aria-describedby={undefined}
        >
          <div className="flex items-center justify-between border-b-2 border-blue px-5 py-3">
            <Dialog.Title className="type-h3">{t('filters')}</Dialog.Title>
            <Dialog.Close
              className="grid size-11 place-items-center rounded-full hover:bg-foil"
              aria-label={tc('close')}
            >
              <IconClose size={22} />
            </Dialog.Close>
          </div>
          <div className="flex-1 overflow-y-auto px-5 py-5">{children}</div>
          <div className="grid grid-cols-2 gap-3 border-t-2 border-blue bg-foil px-5 pt-4 pb-[calc(16px+env(safe-area-inset-bottom))]">
            <Button variant="secondary" onClick={onClear}>
              {t('clear')}
            </Button>
            <Button onClick={() => onOpenChange(false)}>{t('showResults', { count: resultCount })}</Button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
