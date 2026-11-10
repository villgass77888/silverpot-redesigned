import type { ReactNode } from 'react';
import { SHOW_UNCONFIRMED } from '@/lib/review-mode';
import { cn } from '@/lib/cn';
import { Pending, Placeholder } from './Pending';
import { Rivets } from './Motifs';

/** placeholder: a LIKELY/TEMP value that shows in production until the client answers. */
export type PlateRow = {
  label: string;
  value: ReactNode;
  confirmed: boolean;
  note?: string;
  placeholder?: boolean;
};

/**
 * DataPlate (§3.7-1): riveted machine nameplate. Foil Grey, 4px corners,
 * labels in Bricolage 500, values in Big Shoulders 800. Specs are always straight-faced.
 * Production hides unconfirmed rows (placeholders excepted); review mode shows them highlighted.
 * `collapseUnconfirmed`: if more than half the rows are unconfirmed, production shows
 * the confirmed ones plus a single "More specs on request" row (§7.4).
 */
export function DataPlate({
  rows,
  title,
  collapseUnconfirmed,
  collapsedLabel,
  footer,
  className,
  valueClassName,
}: {
  rows: PlateRow[];
  title?: ReactNode;
  collapseUnconfirmed?: boolean;
  collapsedLabel?: string;
  footer?: ReactNode;
  className?: string;
  valueClassName?: string;
}) {
  const hidden = rows.filter((r) => !r.confirmed && !r.placeholder).length;
  const collapsed = collapseUnconfirmed && hidden > rows.length / 2;
  const visible = SHOW_UNCONFIRMED ? rows : rows.filter((r) => r.confirmed || r.placeholder);

  return (
    <div
      className={cn(
        'relative rounded-plate bg-foil px-5 pt-5 pb-4 text-blue shadow-[inset_0_0_0_1px_rgb(14_42_140/0.12)]',
        className,
      )}
    >
      <Rivets />
      {title && <div className="mb-1 px-1">{title}</div>}
      <dl className="divide-y divide-blue-12">
        {visible.map((r) => (
          <div key={r.label} className="flex items-baseline justify-between gap-4 px-1 py-2.5">
            <dt className="type-small text-blue/80">{r.label}</dt>
            <dd
              className={cn(
                'text-end font-display text-[1.375rem] leading-none font-extrabold tabular',
                valueClassName,
              )}
            >
              {r.confirmed ? (
                r.value
              ) : r.placeholder ? (
                <Placeholder note={r.note}>{r.value}</Placeholder>
              ) : (
                <Pending note={r.note}>{r.value ?? '—'}</Pending>
              )}
            </dd>
          </div>
        ))}
        {collapsed && collapsedLabel && (
          <div className="flex items-baseline justify-between gap-4 px-1 py-2.5">
            <dt className="type-small font-semibold">{collapsedLabel}</dt>
          </div>
        )}
      </dl>
      {footer && <div className="mt-3 px-1">{footer}</div>}
    </div>
  );
}
