import type { CSSProperties } from 'react';
import { LOGO } from './logo-data';
import { cn } from '@/lib/cn';

const B = LOGO.box;

/** Width ÷ height of the logo box (incl. the sticker-outline padding). */
export const LOGO_RATIO = B.w / B.h;
/** Where Aloom sits in the hero / peeks in the footer, as fractions of the logo box. */
export const LOGO_PERCH = { x: (LOGO.perch.x - B.x) / B.w, y: (LOGO.perch.y - B.y) / B.h };
export const LOGO_PEEK = { x: (LOGO.peek.x - B.x) / B.w, y: (LOGO.peek.y - B.y) / B.h };
/** The plaque's top edge, as a fraction of the logo box height from the top. */
export const LOGO_PLAQUE_TOP = (LOGO.plaque.top - B.y) / B.h;

/** Stars pop in left to right: red, yellow, blue. */
const STAR_ORDER = { red: 0, yellow: 1, blue: 2 } as const;
const OUTLINE = 16;

type Props = {
  className?: string;
  /** Hero: plaque stamps, letters drop in one by one, then the stars pop (CSS, §8.9). */
  animated?: boolean;
  /** White die-cut outline + blue offset shadow, for coloured backgrounds. */
  sticker?: boolean;
  /** Reference the shared <symbol> (SvgSprite) instead of inlining the paths. */
  symbol?: boolean;
  title?: string;
  decorative?: boolean;
};

const starStyle = (color: keyof typeof STAR_ORDER) => ({ '--si': STAR_ORDER[color] }) as CSSProperties;

/** The logo's shapes in their own colours (used inline and inside the sprite symbol). */
export function LogoShapes({ animated }: { animated?: boolean }) {
  return (
    <>
      <path className={animated ? 'hero-plaque' : undefined} d={LOGO.plaque.d} fill={LOGO.plaque.fill} />
      {LOGO.letters.map((l, i) => (
        <g
          key={l.id}
          className={animated ? 'hero-letter' : undefined}
          style={animated ? ({ '--i': i + 1, '--r': i % 2 ? '4deg' : '-4deg' } as CSSProperties) : undefined}
        >
          {l.paths.map((p) => (
            <path key={p.d.slice(0, 24)} d={p.d} fill={p.fill} />
          ))}
        </g>
      ))}
      {LOGO.stars.map((s) => (
        <path
          key={s.color}
          className={animated ? 'hero-star' : undefined}
          style={animated ? starStyle(s.color) : undefined}
          d={s.d}
          fill={s.fill}
        />
      ))}
    </>
  );
}

/**
 * The Silverpot logo: three stars over the blue plaque (designer's Illustrator file,
 * scripts/build-logo.ts). Always in its own colours.
 */
export function Logo({ className, animated, sticker, symbol, title = 'Silverpot', decorative }: Props) {
  const a11y = decorative ? { 'aria-hidden': true as const } : { role: 'img', 'aria-label': title };
  if (symbol)
    return (
      // <use> places the symbol's viewport at (0, 0), so the outer box must start there too.
      <svg viewBox={`0 0 ${B.w} ${B.h}`} className={cn('block', className)} {...a11y} focusable="false">
        <use href="#sp-logo" />
      </svg>
    );
  return (
    <svg
      viewBox={LOGO.viewBox}
      className={cn('block overflow-visible', className)}
      {...a11y}
      focusable="false"
    >
      {sticker && (
        // One outline layer behind everything, so overlapping stars never show seams.
        <g aria-hidden pointerEvents="none" strokeWidth={OUTLINE} strokeLinejoin="round">
          {[
            { fill: LOGO.plaque.fill, t: 'translate(7 7)' },
            { fill: '#fff', t: undefined },
          ].map((layer) => (
            <g key={layer.fill} transform={layer.t} fill={layer.fill} stroke={layer.fill}>
              <path className={animated ? 'hero-plaque' : undefined} d={LOGO.plaque.d} />
              {LOGO.stars.map((s) => (
                <path
                  key={s.color}
                  className={animated ? 'hero-star' : undefined}
                  style={animated ? starStyle(s.color) : undefined}
                  d={s.d}
                />
              ))}
            </g>
          ))}
        </g>
      )}
      <LogoShapes animated={animated} />
    </svg>
  );
}

const YELLOW = LOGO.stars.find((s) => s.color === 'yellow') ?? LOGO.stars[0];

/** One logo star in currentColor: loaders and spinners. */
export function LogoStar({ className, spin }: { className?: string; spin?: boolean }) {
  return (
    <svg
      viewBox={`${YELLOW.x - 128} ${YELLOW.y - 128} 256 256`}
      className={cn('block', className)}
      aria-hidden
      focusable="false"
    >
      <path
        d={YELLOW.d}
        fill="currentColor"
        style={
          spin
            ? {
                transformBox: 'fill-box',
                transformOrigin: 'center',
                animation: 'sp-spin 900ms linear infinite',
              }
            : undefined
        }
      />
    </svg>
  );
}
