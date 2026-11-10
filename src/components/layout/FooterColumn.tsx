'use client';

import { useId, useState, type ReactNode } from 'react';
import { IconPlus } from '../icons';
import { cn } from '@/lib/cn';

/** Footer column: an accordion on mobile, always open from md up (§6.3). */
export function FooterColumn({ title, children }: { title: string; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const id = useId();
  return (
    <div className="border-b-2 border-blue/15 md:border-0">
      <h2 className="type-h4">
        <button
          type="button"
          className="flex min-h-14 w-full items-center justify-between text-start md:pointer-events-none md:min-h-0 md:pb-3"
          aria-expanded={open}
          aria-controls={id}
          onClick={() => setOpen((o) => !o)}
        >
          {title}
          <IconPlus
            size={18}
            className={cn('transition-transform duration-200 md:hidden', open && 'rotate-45')}
          />
        </button>
      </h2>
      {/* Padding lives inside the clipped box so a collapsed row is truly 0 high; `invisible`
          keeps collapsed links out of the tab order (visibility transitions, so it waits for the close). */}
      <div
        id={id}
        className={cn(
          'grid transition-[grid-template-rows,visibility] duration-200 md:visible md:grid-rows-[1fr]! md:transition-none',
          open ? 'visible grid-rows-[1fr]' : 'invisible grid-rows-[0fr]',
        )}
      >
        <div className="min-h-0 overflow-hidden">
          <div className="pb-4 md:pb-0">{children}</div>
        </div>
      </div>
    </div>
  );
}
