'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import { useTranslations } from 'next-intl';
import { Crinkle } from '../brand/Crinkle';
import { richTags } from '../primitives/Pending';

/** Success state (§7.6, §7.11): Crinkle thumbs-up, title, subline, reply time (once confirmed). */
export function FormSuccess({
  title,
  sub,
  responseTimeHours,
  children,
}: {
  title: string;
  sub?: string;
  responseTimeHours: number | null;
  children?: ReactNode;
}) {
  const t = useTranslations('quote');
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    ref.current?.focus();
  }, []);
  return (
    <div
      ref={ref}
      tabIndex={-1}
      role="status"
      className="flex flex-col items-center py-10 text-center outline-none"
    >
      <div className="w-36">
        <Crinkle pose="thumbs-up" />
      </div>
      <p className="mt-6 type-h2">{title}</p>
      {sub && (
        <p className="mt-3 max-w-[40ch] type-body-l">
          {sub}{' '}
          {responseTimeHours
            ? t('responseTime', { hours: responseTimeHours })
            : t.rich('replyTimeTemp', richTags())}
        </p>
      )}
      {children && <div className="mt-8 flex flex-wrap justify-center gap-3">{children}</div>}
    </div>
  );
}
