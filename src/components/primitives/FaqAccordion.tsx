'use client';

import { useId, useState, type ReactNode } from 'react';
import { IconPlus } from '../icons';
import { Placeholder } from './Pending';
import { cn } from '@/lib/cn';

export type FaqEntry = { id: string; q: string; a: ReactNode; pending?: boolean; placeholder?: boolean };

/**
 * Accordion (§4.4): plus rotates into ×; height animates via grid-template-rows 0fr→1fr.
 * One open at a time. Closed panels are `inert`.
 */
export function FaqAccordion({
  items,
  className,
  headingLevel = 3,
}: {
  items: FaqEntry[];
  className?: string;
  headingLevel?: 2 | 3;
}) {
  const [open, setOpen] = useState<string | null>(null);
  const base = useId();
  const H = headingLevel === 2 ? 'h2' : 'h3';
  return (
    <div className={cn('divide-y-2 divide-blue border-y-2 border-blue', className)}>
      {items.map((it) => {
        const isOpen = open === it.id;
        const bid = `${base}-${it.id}-b`;
        const pid = `${base}-${it.id}-p`;
        return (
          <div key={it.id} className={cn(it.pending && 'review-mark !outline-offset-[-2px]')}>
            <H className="font-[family-name:var(--font-heading)]">
              <button
                id={bid}
                type="button"
                aria-expanded={isOpen}
                aria-controls={pid}
                onClick={() => setOpen(isOpen ? null : it.id)}
                className="flex min-h-16 w-full items-center justify-between gap-4 py-4 text-start text-lg leading-snug font-bold md:text-xl"
              >
                {it.q}
                <span
                  className={cn(
                    'grid size-10 shrink-0 place-items-center rounded-full border-2 border-blue transition-[transform,background-color] duration-200',
                    isOpen ? 'rotate-45 bg-yellow' : 'bg-white',
                  )}
                  aria-hidden
                >
                  <IconPlus size={18} />
                </span>
              </button>
            </H>
            <div
              id={pid}
              role="region"
              aria-labelledby={bid}
              inert={!isOpen}
              className="grid transition-[grid-template-rows] duration-[220ms] ease-[var(--ease-out-quint)]"
              style={{ gridTemplateRows: isOpen ? '1fr' : '0fr' }}
            >
              <div className="overflow-hidden">
                <div className="max-w-[65ch] pb-5 type-body">
                  {it.placeholder ? <Placeholder>{it.a}</Placeholder> : it.a}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
