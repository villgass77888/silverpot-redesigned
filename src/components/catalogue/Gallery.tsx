'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { useTranslations } from 'next-intl';
import { RegistrationMarks } from '../primitives/Motifs';
import { PhotoComingSoon } from './PhotoComingSoon';
import { IconExpand } from '../icons';
import { cn } from '@/lib/cn';
import type { CategorySlug } from '@/data/types';

const ZoomDialog = dynamic(() => import('./ZoomDialog').then((m) => m.ZoomDialog), { ssr: false });

export type GalleryImage = { src: string; width: number; height: number; alt: string; blur?: string };

/**
 * PDP gallery (§7.4): RimFrame on a Foil Grey blueprint grid, registration marks, a huge
 * 6% Blue watermark of the model code behind the photo. Click to zoom (dialog, pinch-zoom
 * on mobile). Thumbnails on desktop; scroll-snap carousel with dots on mobile.
 * "Show dimensions" only renders once dimensions are confirmed (none yet).
 */
export function Gallery({
  images,
  code,
  name,
  category,
}: {
  images: GalleryImage[];
  code: string | null;
  name: string;
  category: CategorySlug;
}) {
  const t = useTranslations('product');
  const [active, setActive] = useState(0);
  const [zoom, setZoom] = useState(false);
  const [zoomLoaded, setZoomLoaded] = useState(false);
  const rail = useRef<HTMLDivElement>(null);

  const onRailScroll = () => {
    const el = rail.current;
    if (!el) return;
    setActive(Math.round(Math.abs(el.scrollLeft) / el.clientWidth));
  };

  const frame = (img: GalleryImage | null, i: number, priority: boolean) => (
    <div className="@container rim relative aspect-square w-full shrink-0 snap-center overflow-hidden bg-foil bg-blueprint">
      <RegistrationMarks inset={14} size={18} />
      {code && (
        <span
          aria-hidden
          dir="ltr"
          className="pointer-events-none absolute inset-x-0 bottom-0 flex translate-y-[14%] justify-center overflow-hidden font-display text-[30cqw] leading-none font-black tracking-tight text-blue/[0.08] select-none"
        >
          {code}
        </span>
      )}
      {img ? (
        <button
          type="button"
          onClick={() => {
            setActive(i);
            setZoomLoaded(true);
            setZoom(true);
          }}
          className="group absolute inset-0 cursor-zoom-in"
          aria-label={t('zoom')}
        >
          <Image
            src={img.src}
            alt={img.alt}
            fill
            priority={priority}
            sizes="(min-width:1024px) 52vw, 100vw"
            quality={78}
            placeholder={img.blur ? 'blur' : 'empty'}
            blurDataURL={img.blur}
            className="object-contain p-[7%] product-cutout"
          />
          <span className="absolute end-4 bottom-4 z-[4] grid size-11 place-items-center rounded-full border-2 border-blue bg-white opacity-0 shadow-hard-sm transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
            <IconExpand size={20} />
          </span>
        </button>
      ) : (
        <PhotoComingSoon category={category} />
      )}
    </div>
  );

  if (images.length === 0) return frame(null, 0, false);

  return (
    <div>
      {/* Desktop: single frame + thumbnails. Mobile: swipe rail. */}
      <div className="hidden md:block">{frame(images[active], active, active === 0)}</div>
      <div
        ref={rail}
        onScroll={onRailScroll}
        className="scrollbar-none flex snap-x snap-mandatory gap-3 overflow-x-auto md:hidden"
      >
        {images.map((img, i) => (
          <div
            key={img.src}
            className="w-full shrink-0 snap-center"
            aria-label={t('photoOf', { n: i + 1, total: images.length })}
          >
            {frame(img, i, i === 0)}
          </div>
        ))}
      </div>

      {images.length > 1 && (
        <>
          <div className="mt-3 flex justify-center gap-2 md:hidden" aria-hidden>
            {images.map((img, i) => (
              <span
                key={img.src}
                className={cn(
                  'size-2.5 rounded-full border-2 border-blue',
                  i === active ? 'bg-blue' : 'bg-white',
                )}
              />
            ))}
          </div>
          <div className="mt-4 hidden gap-3 md:flex">
            {images.map((img, i) => (
              <button
                key={img.src}
                type="button"
                onClick={() => setActive(i)}
                aria-label={t('photoOf', { n: i + 1, total: images.length })}
                aria-pressed={i === active}
                className={cn(
                  'relative size-20 press overflow-hidden rounded-[10px] border-2 border-blue bg-foil',
                  i === active && 'pressed-in bg-yellow',
                )}
              >
                <Image
                  src={img.src}
                  alt=""
                  fill
                  sizes="80px"
                  quality={78}
                  className="object-contain p-1.5 product-cutout"
                />
              </button>
            ))}
          </div>
        </>
      )}

      {zoomLoaded && <ZoomDialog open={zoom} onOpenChange={setZoom} image={images[active]} name={name} />}
    </div>
  );
}
