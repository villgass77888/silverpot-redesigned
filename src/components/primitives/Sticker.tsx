import type { CSSProperties, ReactNode } from 'react';
import { cn } from '@/lib/cn';

export type StickerTone = 'yellow' | 'red' | 'blue' | 'white';
const TONES: Record<StickerTone, string> = {
  yellow: 'bg-yellow text-blue',
  red: 'bg-red text-white',
  blue: 'bg-blue text-white',
  white: 'bg-white text-blue',
};
const FILL: Record<StickerTone, string> = {
  yellow: 'var(--color-yellow)',
  red: 'var(--color-red)',
  blue: 'var(--color-blue)',
  white: 'var(--color-white)',
};

/**
 * Die-cut sticker (§3.6): white 2px outline + blue shadow-sm, rotated −7°…+7°.
 * Rotation is passed in (deterministic per index), never random at render.
 * A sticker is information or a joke, never empty decoration.
 */
export function Sticker({
  children,
  shape = 'rounded',
  tone = 'yellow',
  rotate = 0,
  hand,
  className,
  style,
}: {
  children: ReactNode;
  shape?: 'circle' | 'burst' | 'rounded' | 'ticket';
  tone?: StickerTone;
  rotate?: number;
  hand?: boolean;
  className?: string;
  style?: CSSProperties;
}) {
  const font = hand
    ? 'font-[family-name:var(--font-note)] text-[1.05rem] leading-none'
    : 'font-sans text-[0.8125rem] font-bold leading-none';
  const transform = { transform: `rotate(${rotate}deg)`, ...style };

  if (shape === 'burst') {
    return (
      <span
        className={cn('relative inline-grid size-24 place-items-center text-center', font, className)}
        style={transform}
      >
        <svg viewBox="0 0 100 100" className="absolute inset-0 size-full overflow-visible" aria-hidden>
          <path d={BURST} fill="var(--color-blue)" transform="translate(3 3)" />
          <path d={BURST} fill={FILL[tone]} stroke="#fff" strokeWidth="3" strokeLinejoin="round" />
        </svg>
        <span
          className={cn(
            'relative max-w-[70%]',
            tone === 'yellow' || tone === 'white' ? 'text-blue' : 'text-white',
          )}
        >
          {children}
        </span>
      </span>
    );
  }

  const shapeCls =
    shape === 'circle'
      ? 'aspect-square rounded-full p-3 text-center'
      : shape === 'ticket'
        ? 'rounded-[6px] px-4 py-2 [mask:radial-gradient(circle_6px_at_0_50%,#0000_98%,#000)_left/51%_100%_no-repeat,radial-gradient(circle_6px_at_100%_50%,#0000_98%,#000)_right/51%_100%_no-repeat]'
        : 'rounded-[12px] px-3 py-2';

  return (
    <span
      className={cn(
        'inline-flex items-center justify-center gap-1.5 border-2 border-white shadow-hard-sm',
        TONES[tone],
        shapeCls,
        font,
        className,
      )}
      style={transform}
    >
      {children}
    </span>
  );
}

const BURST = (() => {
  const pts: string[] = [];
  const n = 14;
  for (let i = 0; i < n * 2; i++) {
    const r = i % 2 === 0 ? 49 : 40;
    const a = (Math.PI * i) / n - Math.PI / 2;
    pts.push(`${(50 + r * Math.cos(a)).toFixed(1)} ${(50 + r * Math.sin(a)).toFixed(1)}`);
  }
  return `M${pts.join('L')}Z`;
})();
