import type { ComponentProps, ReactNode } from 'react';
import { cn } from '@/lib/cn';

export type Tone = 'white' | 'foil' | 'yellow' | 'blue' | 'red';

export const TONE_CLASSES: Record<Tone, string> = {
  white: 'bg-white text-blue on-light',
  foil: 'bg-foil text-blue on-light',
  yellow: 'bg-yellow text-blue on-yellow',
  blue: 'bg-blue text-white on-blue',
  red: 'bg-red text-white on-red',
};

/**
 * Full-bleed colour block (§3.5, §8). Sets the shadow/ink/focus context so
 * children flip correctly (§3.3). Grain only on saturated sections (§3.11).
 */
export function Section({
  tone = 'white',
  grain,
  pad = true,
  className,
  children,
  ...rest
}: { tone?: Tone; grain?: boolean; pad?: boolean; children: ReactNode } & ComponentProps<'section'>) {
  return (
    <section className={cn(TONE_CLASSES[tone], grain && 'grain', pad && 'section-pad', className)} {...rest}>
      {children}
    </section>
  );
}
