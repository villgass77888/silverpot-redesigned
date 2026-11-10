import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import type { CategorySlug } from '@/data/types';
import { cn } from '@/lib/cn';
import { Sticker } from '../primitives/Sticker';
import { BiryaniTray, KunafaTray, ShawarmaWrap } from '../illustrations/objects';

const ART: Record<CategorySlug, (p: { className?: string }) => React.ReactElement> = {
  containers: BiryaniTray,
  platters: KunafaTray,
  foil: ShawarmaWrap,
};
const TONE = {
  yellow: { bg: 'bg-yellow text-blue on-yellow', sticker: 'white' as const },
  red: { bg: 'bg-red text-white on-red', sticker: 'yellow' as const },
  blue: { bg: 'bg-blue text-white on-blue', sticker: 'yellow' as const },
};

/** CategoryTile (§7.1 H5): one pressable link, shadow-md, press only (no hover lift). */
export function CategoryTile({
  slug,
  tone,
  title,
  line,
  countLabel,
  image,
  index,
}: {
  slug: CategorySlug;
  tone: 'yellow' | 'red' | 'blue';
  title: string;
  line: string;
  countLabel: string;
  image: { src: string; alt: string } | null;
  index: number;
}) {
  const Art = ART[slug];
  const c = TONE[tone];
  return (
    <Link
      href={`/products/${slug}`}
      className={cn(
        'group grain relative flex aspect-[16/11] flex-col overflow-hidden rounded-tile border-2 border-blue p-5 shadow-hard-md transition-[transform,box-shadow] duration-[120ms] active:translate-x-[3px] active:translate-y-[3px] active:shadow-hard-none md:aspect-[3/4] lg:aspect-[4/5] lg:p-7',
        c.bg,
      )}
    >
      <Sticker
        tone={c.sticker}
        rotate={index % 2 ? 6 : -6}
        hand
        className="absolute end-4 top-4 z-[3] text-lg"
      >
        {countLabel}
      </Sticker>
      <div className="relative z-[2] mx-auto mt-2 flex w-full flex-1 items-center justify-center">
        {image && (
          <div className="rim relative aspect-square w-[46%] -rotate-3 overflow-hidden bg-white bg-blueprint-fine transition-transform duration-300 group-hover:rotate-0 md:w-[64%] lg:w-[62%]">
            <Image
              src={image.src}
              alt={image.alt}
              fill
              sizes="(min-width:1024px) 20vw, (min-width:768px) 22vw, 40vw"
              quality={78}
              className="object-contain p-[8%] product-cutout"
            />
          </div>
        )}
        <div className="absolute end-[4%] bottom-0 w-[28%] md:bottom-[2%] md:w-[46%]">
          <Art />
        </div>
      </div>
      <div className="relative z-[3] mt-3">
        <h3 className="type-h3">{title}</h3>
        <p className="mt-1 type-hand">{line}</p>
      </div>
    </Link>
  );
}
