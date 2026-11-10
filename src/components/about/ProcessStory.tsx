'use client';

import { useEffect, useRef, useState } from 'react';
import { PROCESS_FRAMES } from '../illustrations/process';
import { cn } from '@/lib/cn';

export type ProcessStep = { title: string; line: string; note: string };

/**
 * Coil to container (§4.3-10): desktop is a sticky two-column story — the illustration
 * frame swaps as each step passes the middle of the viewport. Mobile is a plain
 * vertical list with each frame inline (no pinning).
 */
export function ProcessStory({ steps }: { steps: ProcessStep[] }) {
  const [active, setActive] = useState(0);
  const refs = useRef<(HTMLLIElement | null)[]>([]);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.index));
        }
      },
      { rootMargin: '-45% 0px -45% 0px' },
    );
    refs.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <div className="lg:grid lg:grid-cols-12 lg:gap-12">
      <div className="hidden lg:col-span-6 lg:block">
        <div className="sticky top-[calc(var(--header-h)+40px)]">
          <div className="rim relative aspect-[4/3] overflow-hidden bg-white bg-blueprint">
            {PROCESS_FRAMES.map((Frame, i) => (
              <div
                key={i}
                aria-hidden
                className="absolute inset-[8%] transition-[opacity,transform] duration-300"
                style={{
                  opacity: i === active ? 1 : 0,
                  transform: i === active ? 'none' : `translateY(${i < active ? -12 : 12}px) scale(.97)`,
                }}
              >
                <Frame />
              </div>
            ))}
          </div>
        </div>
      </div>

      <ol className="lg:col-span-6">
        {steps.map((s, i) => {
          const Frame = PROCESS_FRAMES[i];
          return (
            <li
              key={s.title}
              ref={(el) => {
                refs.current[i] = el;
              }}
              data-index={i}
              className="border-t-2 border-blue py-8 lg:flex lg:min-h-[52vh] lg:flex-col lg:justify-center lg:py-10"
              aria-current={i === active ? 'step' : undefined}
            >
              <div className="mb-5 w-full max-w-sm lg:hidden">
                <div className="rim relative aspect-[4/3] overflow-hidden bg-white bg-blueprint p-[6%]">
                  <Frame />
                </div>
              </div>
              <span
                className={cn(
                  'w-fit rounded-[10px] px-2 pt-2 font-display text-7xl leading-[0.8] font-black tabular transition-colors duration-200',
                  i === active ? 'lg:bg-yellow' : 'lg:bg-transparent',
                )}
                aria-hidden
              >
                {i + 1}
              </span>
              <h3 className="mt-3 type-h3">{s.title}</h3>
              <p className="mt-2 max-w-[42ch] type-body-l">{s.line}</p>
              {s.note && <p className="mt-3 -rotate-2 type-hand text-red">{s.note}</p>}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
