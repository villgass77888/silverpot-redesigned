import type { ReactNode } from 'react';
import { useTranslations } from 'next-intl';
import { REVIEW_MODE, SHOW_UNCONFIRMED } from '@/lib/review-mode';
import { cn } from '@/lib/cn';

/**
 * ReviewHighlight (§0.1.2, §8). Wraps an unconfirmed fact.
 *  - SHOW_UNCONFIRMED: yellow highlighter + dashed outline + "Needs client confirmation".
 *  - Otherwise (production and, since §8.2, review mode): renders nothing.
 * With no children it renders a placeholder slot naming what's missing.
 */
export function Pending({
  children,
  note,
  className,
  block,
}: {
  children?: ReactNode;
  note?: string;
  className?: string;
  block?: boolean;
}) {
  const t = useTranslations('review');
  if (!SHOW_UNCONFIRMED) return null;
  const label = t('needs');
  if (!children) {
    const Tag = block ? 'div' : 'span';
    return (
      <Tag
        className={cn(
          'review-mark inline-flex flex-wrap items-center gap-1.5 px-1.5 py-0.5 type-small',
          block && 'flex w-full',
          className,
        )}
        title={label}
      >
        <span className="review-label">{label}</span>
        {note && <span>{note}</span>}
      </Tag>
    );
  }
  return (
    <mark
      className={cn('review-mark', className)}
      title={note ? `${label}: ${note}` : label}
      data-review={note ?? ''}
    >
      {children}
      <span className="review-label ms-1.5 inline-block align-middle">{label}</span>
    </mark>
  );
}

/**
 * Placeholder (docs/PLACEHOLDERS.md). A LIKELY or TEMP stand-in the client hasn't answered yet.
 * Unlike Pending, it always renders its children, unmarked; SHOW_UNCONFIRMED marks it
 * "Placeholder: needs client answer". With no children it's a marker-only label.
 */
export function Placeholder({
  children,
  note,
  className,
}: {
  children?: ReactNode;
  note?: string;
  className?: string;
}) {
  const t = useTranslations('review');
  if (!SHOW_UNCONFIRMED) return children ? <>{children}</> : null;
  const label = t('temp');
  if (!children)
    return (
      <span
        className={cn(
          'review-mark inline-flex flex-wrap items-center gap-1.5 px-1.5 py-0.5 type-small',
          className,
        )}
        title={label}
      >
        <span className="review-label">{label}</span>
        {note && <span>{note}</span>}
      </span>
    );
  return (
    <mark
      className={cn('review-mark', className)}
      title={note ? `${label}: ${note}` : label}
      data-placeholder={note ?? ''}
    >
      {children}
      <span className="review-label ms-1.5 inline-block align-middle">{label}</span>
    </mark>
  );
}

/** Rich-text tag handlers for next-intl: `<confirm>…</confirm>`, `<temp>…</temp>` and `<b>…</b>`. */
export function richTags(note?: string) {
  return {
    confirm: (chunks: ReactNode) => <Pending note={note}>{chunks}</Pending>,
    temp: (chunks: ReactNode) => <Placeholder>{chunks}</Placeholder>,
    b: (chunks: ReactNode) => <strong className="font-bold">{chunks}</strong>,
  };
}

/** Small "AR draft" badge for machine-translated Arabic copy (review mode only, §5.6). */
export function ArDraftBadge({ show }: { show: boolean }) {
  const t = useTranslations('review');
  if (!REVIEW_MODE || !show) return null;
  return (
    <span className="ms-2 inline-block rounded-full border border-current px-1.5 align-middle font-sans text-[0.625rem] leading-4 font-bold">
      {t('arDraft')}
    </span>
  );
}
