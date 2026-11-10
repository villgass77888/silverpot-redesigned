import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import type { CardProduct } from '@/lib/catalog';
import { cn } from '@/lib/cn';
import { Sticker, type StickerTone } from '../primitives/Sticker';
import { RegistrationMarks } from '../primitives/Motifs';
import { Pending, Placeholder } from '../primitives/Pending';
import { AddToQuote } from '../quote/AddToQuote';
import { PhotoComingSoon } from './PhotoComingSoon';

const FAMILY_TONE: Record<CardProduct['category'], StickerTone> = {
  containers: 'yellow',
  platters: 'red',
  foil: 'blue',
};
export const CARD_SIZES = '(min-width:1280px) 22vw, (min-width:768px) 30vw, 46vw';

/**
 * ProductCard (§8). One stretched link (no nested interactives except Add to quote).
 * Container query: compact layout under 260px. Hover runs a QC scan line (no lift).
 */
export function ProductCard({
  product: p,
  priority,
  className,
}: {
  product: CardProduct;
  priority?: boolean;
  className?: string;
}) {
  const t = useTranslations('product');
  return (
    <article
      className={cn(
        'product-card group/card @container relative flex h-full flex-col rounded-rim border-2 border-blue bg-white shadow-hard-sm transition-[transform,box-shadow] duration-[120ms]',
        'has-[a.card-link:active]:translate-x-[3px] has-[a.card-link:active]:translate-y-[3px] has-[a.card-link:active]:shadow-hard-none',
        'has-[a.card-link:focus-visible]:outline-3 has-[a.card-link:focus-visible]:outline-offset-2 has-[a.card-link:focus-visible]:outline-yellow',
        className,
      )}
    >
      {/* Image: 1:1 RimFrame on a blueprint grid, photo multiplied into it */}
      <div className="relative m-1.5 aspect-square overflow-hidden rounded-[10px] bg-foil bg-blueprint-fine @[260px]:bg-blueprint">
        <span
          aria-hidden
          className="pointer-events-none absolute inset-[5px] z-[2] rounded-[6px] border border-blue/35"
        />
        <span className="hidden @[260px]:contents">
          <RegistrationMarks inset={10} size={12} />
        </span>
        {p.image ? (
          <Image
            src={p.image.src}
            alt={p.image.alt}
            fill
            sizes={CARD_SIZES}
            quality={78}
            priority={priority}
            placeholder={p.image.blur ? 'blur' : 'empty'}
            blurDataURL={p.image.blur}
            className="object-contain p-[6%] product-cutout transition-transform duration-300 group-hover/card:scale-[1.03]"
          />
        ) : (
          <PhotoComingSoon category={p.category} compact />
        )}
        {/* QC scan line on hover (no dimensions confirmed yet → scan, §4.3-5) */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 z-[3] -translate-y-full opacity-0 [background:linear-gradient(to_bottom,transparent_calc(100%-3px),var(--color-yellow)_calc(100%-3px)),linear-gradient(to_bottom,transparent_70%,rgb(255_210_31/0.22))] group-hover/card:[animation:sp-scan-y_260ms_linear_both]"
        />
        <div className="absolute start-2 top-2 z-[4] flex flex-col items-start gap-1.5">
          <Sticker
            tone={FAMILY_TONE[p.category]}
            rotate={-4}
            className="px-2 py-1 text-[0.6875rem] @[260px]:text-xs"
          >
            {p.familyShort}
          </Sticker>
          {p.compartmentSticker && (
            <Sticker tone="white" rotate={3} className="px-2 py-1 text-[0.6875rem] @[260px]:text-xs">
              {t('compartmentSticker', { count: p.compartmentSticker })}
            </Sticker>
          )}
          {p.subtype === 'specialty' && (
            <Sticker tone="white" rotate={3} className="px-2 py-1 text-[0.6875rem] @[260px]:text-xs">
              {t('broast')}
            </Sticker>
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col px-3 pt-1.5 pb-3 @[260px]:px-4 @[260px]:pb-4">
        <h3 className="line-clamp-2 text-[0.9375rem] leading-snug font-semibold @[260px]:text-base">
          <Link
            href={p.href}
            className="card-link outline-none after:absolute after:inset-0 after:z-[1] after:rounded-rim"
          >
            {p.namePending ? (
              <Pending>{p.name}</Pending>
            ) : p.namePlaceholder ? (
              <Placeholder>{p.name}</Placeholder>
            ) : (
              p.name
            )}
          </Link>
        </h3>
        <p className="mt-1 hidden truncate font-[family-name:var(--font-note)] text-[1.0625rem] leading-tight text-red @[260px]:block">
          {p.tagline}
        </p>
        <div className="mt-auto pt-3">
          <AddToQuote
            productId={p.id}
            code={p.code}
            name={p.name}
            source="card"
            thumb={p.image?.src}
            size="sm"
            full
            className="@max-[259px]:text-sm"
            labelClassName="@max-[179px]:sr-only"
          />
        </div>
      </div>
    </article>
  );
}
