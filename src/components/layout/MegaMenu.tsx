'use client';

import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/navigation';
import { cn } from '@/lib/cn';
import { IconCaretDown } from '../icons';
import { BiryaniTray, ClipboardIll, KunafaTray, ShawarmaWrap } from '../illustrations/objects';
import type { CategorySlug } from '@/data/types';

export type MegaColumn = {
  slug: CategorySlug;
  name: string;
  tone: 'yellow' | 'red' | 'blue';
  countLabel: string;
  links: { href: string; label: string }[];
};

const ART: Record<CategorySlug, (p: { className?: string }) => React.ReactElement> = {
  containers: BiryaniTray,
  platters: KunafaTray,
  foil: ShawarmaWrap,
};
const TONE_BG: Record<MegaColumn['tone'], string> = {
  yellow: 'bg-yellow on-yellow',
  red: 'bg-red text-white on-red',
  blue: 'bg-blue text-white on-blue',
};

/** Products mega menu (§6.2): click or 150ms hover intent; Esc closes; focus trapped while open. */
export function MegaMenu({ label, columns }: { label: string; columns: MegaColumn[] }) {
  const t = useTranslations('nav');
  const [open, setOpen] = useState(false);
  const id = useId();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const intent = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pathname = usePathname();

  const close = useCallback((refocus = false) => {
    setOpen(false);
    if (refocus) triggerRef.current?.focus();
  }, []);

  // eslint-disable-next-line react-hooks/set-state-in-effect -- close on route change
  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        close(true);
      }
      if (e.key === 'Tab' && panelRef.current) {
        const nodes = [
          triggerRef.current,
          ...panelRef.current.querySelectorAll<HTMLElement>('a[href], button:not([disabled])'),
        ].filter(Boolean) as HTMLElement[];
        const first = nodes[0];
        const last = nodes[nodes.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    const onDown = (e: PointerEvent) => {
      const target = e.target as Node;
      if (!panelRef.current?.contains(target) && !triggerRef.current?.contains(target)) close();
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onDown);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('pointerdown', onDown);
    };
  }, [open, close]);

  const hoverOpen = () => {
    if (intent.current) clearTimeout(intent.current);
    intent.current = setTimeout(() => setOpen(true), 150);
  };
  const hoverClose = () => {
    if (intent.current) clearTimeout(intent.current);
    intent.current = setTimeout(() => setOpen(false), 220);
  };

  return (
    <div
      onPointerEnter={(e) => e.pointerType === 'mouse' && hoverOpen()}
      onPointerLeave={(e) => e.pointerType === 'mouse' && hoverClose()}
    >
      <button
        ref={triggerRef}
        type="button"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen((o) => !o)}
        className={cn(
          'nav-link inline-flex h-11 items-center gap-1 rounded-full px-3 font-semibold xl:px-3.5',
          open && 'is-active',
        )}
      >
        {label}
        <IconCaretDown size={14} className={cn('transition-transform duration-200', open && 'rotate-180')} />
      </button>

      <div
        ref={panelRef}
        id={id}
        hidden={!open}
        className="absolute inset-x-0 top-full border-b-2 border-blue bg-white"
        style={{ animation: open ? 'sp-pop-in 200ms var(--ease-out-quint) both' : undefined }}
      >
        <div className="shell grid grid-cols-4 gap-6 py-8">
          {columns.map((c) => {
            const Art = ART[c.slug];
            const wide = c.links.some((l) => l.label.length > 8);
            return (
              <div key={c.slug} className="flex flex-col">
                <Link
                  href={`/products/${c.slug}`}
                  className={cn(
                    'group relative flex min-h-44 press flex-col justify-between overflow-hidden rounded-tile border-2 border-blue p-4',
                    TONE_BG[c.tone],
                  )}
                >
                  {/* Art sits in its own row above the title, so long names never run under it */}
                  <span className="pointer-events-none -me-1 -mt-2 h-20 w-24 self-end transition-transform duration-300 group-hover:-rotate-3 [&>svg]:h-full [&>svg]:w-full">
                    <Art />
                  </span>
                  <span className="relative mt-2">
                    <span className="block type-h4">{c.name}</span>
                    <span className="type-small opacity-90">{c.countLabel}</span>
                  </span>
                </Link>
                {/* Model codes fit two per row; long foil sizes get a row each */}
                <ul className={cn('mt-4 grid gap-x-3 gap-y-1', wide ? 'grid-cols-1' : 'grid-cols-2')}>
                  {c.links.map((l) => (
                    <li key={l.href}>
                      <Link
                        href={l.href}
                        className={cn(
                          'inline-flex items-center rounded-md px-1 font-display leading-none font-extrabold whitespace-nowrap tabular hover:bg-yellow',
                          wide ? 'min-h-8 text-[1.125rem]' : 'min-h-9 text-[1.375rem]',
                        )}
                      >
                        <bdi dir="ltr">{l.label}</bdi>
                      </Link>
                    </li>
                  ))}
                </ul>
                <Link
                  href={`/products/${c.slug}`}
                  className="mt-3 type-small font-semibold underline underline-offset-4"
                >
                  {t('megaAll', { name: c.name.toLowerCase() })}
                </Link>
              </div>
            );
          })}
          <div className="on-yellow relative flex flex-col justify-between overflow-hidden rounded-tile border-2 border-blue bg-yellow p-5">
            <div>
              <p className="type-h3">{t('megaFinderTitle')}</p>
              <p className="mt-2 type-body">{t('megaFinderBody')}</p>
            </div>
            <span className="pointer-events-none absolute end-2 -bottom-3 w-20 rotate-6">
              <ClipboardIll />
            </span>
            <Link
              href="/size-finder"
              className="relative mt-6 inline-flex min-h-11 w-fit press items-center rounded-btn border-2 border-blue bg-white px-4 font-bold"
            >
              {t('megaFinderCta')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
