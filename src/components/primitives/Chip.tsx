import type { ComponentProps, ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { IconCheck } from '@/components/icons';

const BASE =
  'inline-flex min-h-11 items-center gap-2 rounded-full border-2 border-blue px-4 font-sans text-[0.9375rem] font-semibold leading-none whitespace-nowrap';

/** A pressable chip (filter, answer). Selected = Yellow, pressed in, with a check (never colour alone). */
export function Chip({
  selected,
  count,
  children,
  className,
  size = 'md',
  ...rest
}: ComponentProps<'button'> & { selected?: boolean; count?: number; size?: 'md' | 'lg' }) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      className={cn(
        BASE,
        'press bg-white text-blue',
        selected && 'pressed-in bg-yellow',
        size === 'lg' && 'min-h-14 px-5 text-base',
        className,
      )}
      {...rest}
    >
      {selected && <IconCheck size={16} className="-ms-1" />}
      {children}
      {count !== undefined && (
        <span className="rounded-full bg-blue px-1.5 py-0.5 text-[0.75rem] font-bold text-white tabular">
          {count}
        </span>
      )}
    </button>
  );
}

/** A static chip (tags like "Good for"): no shadow, because it can't be pressed. */
export function StaticChip({
  children,
  className,
  icon,
}: {
  children: ReactNode;
  className?: string;
  icon?: ReactNode;
}) {
  return (
    <span
      className={cn(BASE, 'min-h-9 border-blue/30 bg-white px-3 text-sm font-medium text-blue', className)}
    >
      {icon}
      {children}
    </span>
  );
}
