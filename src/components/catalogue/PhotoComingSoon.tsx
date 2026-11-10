import { useTranslations } from 'next-intl';
import type { CategorySlug } from '@/data/types';
import { BiryaniTray, FoilRollIll, KunafaTray, ScribbleRed } from '../illustrations/objects';
import { Sticker } from '../primitives/Sticker';
import { cn } from '@/lib/cn';

const ART: Record<CategorySlug, (p: { className?: string }) => React.ReactElement> = {
  containers: BiryaniTray,
  platters: KunafaTray,
  foil: FoilRollIll,
};

/** PhotoComingSoon (§7.4, §8): the product illustration + red scribble + sticker. */
export function PhotoComingSoon({
  category,
  className,
  compact,
}: {
  category: CategorySlug;
  className?: string;
  compact?: boolean;
}) {
  const t = useTranslations('common');
  const Art = ART[category];
  return (
    <div className={cn('absolute inset-0 grid place-items-center', className)}>
      <ScribbleRed className="absolute inset-x-[12%] top-[22%] w-[76%] opacity-70" />
      <div className="relative w-[64%]">
        <Art />
      </div>
      <Sticker
        tone="yellow"
        rotate={-6}
        hand
        className={cn('absolute', compact ? 'start-3 bottom-3 text-sm' : 'start-[10%] bottom-[12%]')}
      >
        {t('photoComingSoon')}
      </Sticker>
    </div>
  );
}

export function ProductThumbFallback({ category }: { category: CategorySlug }) {
  const Art = ART[category];
  return (
    <span className="absolute inset-[14%]">
      <Art />
    </span>
  );
}
