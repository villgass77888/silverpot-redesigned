'use client';

import Image from 'next/image';
import { Dialog } from 'radix-ui';
import { useReturnFocus } from '../useReturnFocus';
import { useTranslations } from 'next-intl';
import { IconClose } from '../icons';
import type { GalleryImage } from './Gallery';

/** Full-screen photo zoom (§7.4), pinch-zoom on mobile. Loaded on first open. */
export function ZoomDialog({
  open,
  onOpenChange,
  image,
  name,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  image: GalleryImage;
  name: string;
}) {
  const returnFocus = useReturnFocus();
  const t = useTranslations('product');
  const tc = useTranslations('common');
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="search-overlay fixed inset-0 z-[85] bg-blue/60" />
        <Dialog.Content
          {...returnFocus}
          className="search-panel fixed inset-3 z-[86] flex flex-col overflow-hidden rounded-[18px] border-2 border-blue bg-foil md:inset-10"
          aria-describedby={undefined}
        >
          <Dialog.Title className="sr-only">{t('zoomTitle', { name })}</Dialog.Title>
          <div className="relative flex-1 touch-pinch-zoom bg-blueprint">
            <Image
              src={image.src}
              alt={image.alt}
              fill
              sizes="100vw"
              quality={78}
              className="object-contain p-6 product-cutout"
            />
          </div>
          <Dialog.Close
            className="absolute end-4 top-4 grid size-12 press place-items-center rounded-full border-2 border-blue bg-white"
            aria-label={tc('close')}
          >
            <IconClose size={22} />
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
