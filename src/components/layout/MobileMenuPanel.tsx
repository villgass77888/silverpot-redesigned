'use client';

import { useEffect, useRef, useState } from 'react';
import { Dialog } from 'radix-ui';
import { useReturnFocus } from '../useReturnFocus';
import { useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/navigation';
import { useUI } from '../ui-store';
import { IconCaretDown, IconClose, IconPhone } from '../icons';
import { Crinkle } from '../brand/Crinkle';
import { LanguageToggle } from './LanguageToggle';
import { buttonClasses } from '../primitives/Button';
import { waHref } from '@/lib/whatsapp';
import { site, telHref } from '@/data/site';
import { cn } from '@/lib/cn';
import { IconWhatsApp } from '../icons';
import type { MegaColumn } from './MegaMenu';

/**
 * Mobile menu (§6.2): full-screen Yellow overlay, giant links stamping in with a 45ms
 * stagger, Products expands into the three families, Call + WhatsApp at the bottom,
 * Crinkle peeking from the corner. Focus trapped, Esc closes (Radix Dialog).
 * Loaded on first open (see MobileMenu.tsx) so Radix stays out of first-load JS.
 */
export function MobileMenuPanel({
  columns,
  navLinks,
}: {
  columns: MegaColumn[];
  navLinks: { href: string; label: string }[];
}) {
  const returnFocus = useReturnFocus();
  const t = useTranslations('nav');
  const tc = useTranslations('common');
  const open = useUI((s) => s.menuOpen);
  const setOpen = useUI((s) => s.setMenuOpen);
  const [productsOpen, setProductsOpen] = useState(false);
  const pathname = usePathname();
  const lastPath = useRef(pathname);
  // Close on navigation (not on mount: this panel mounts lazily on first open).
  useEffect(() => {
    if (lastPath.current !== pathname) {
      lastPath.current = pathname;
      setOpen(false);
    }
  }, [pathname, setOpen]);

  const big =
    'block py-1.5 font-[family-name:var(--font-heading)] text-[2.75rem] leading-[1.02] font-extrabold tracking-[-0.03em]';
  const stamp = (i: number) => ({ animation: `sp-link-stamp 320ms var(--ease-stamp) ${80 + i * 45}ms both` });

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Portal>
        <Dialog.Content
          {...returnFocus}
          className="on-yellow grain fixed inset-0 z-[80] flex flex-col overflow-y-auto bg-yellow text-blue"
          style={{ animation: 'sp-overlay-in 160ms linear both' }}
          aria-describedby={undefined}
        >
          <Dialog.Title className="sr-only">{t('menu')}</Dialog.Title>
          <div className="shell flex h-[var(--header-h)] shrink-0 items-center justify-between border-b-2 border-blue">
            <span className="font-display text-2xl font-black tracking-tight">SILVERPOT</span>
            <Dialog.Close className="inline-flex min-h-11 press items-center gap-1.5 rounded-btn border-2 border-blue bg-white px-3.5 font-bold">
              <IconClose size={18} />
              {t('closeMenu')}
            </Dialog.Close>
          </div>

          <nav aria-label={t('main')} className="relative z-[2] shell flex-1 py-6">
            <ul>
              <li style={stamp(0)}>
                <button
                  type="button"
                  className={cn(big, 'flex w-full items-center justify-between text-start')}
                  aria-expanded={productsOpen}
                  onClick={() => setProductsOpen((o) => !o)}
                >
                  {t('products')}
                  <IconCaretDown
                    size={30}
                    className={cn('transition-transform', productsOpen && 'rotate-180')}
                  />
                </button>
                <div
                  className="grid transition-[grid-template-rows] duration-200"
                  style={{ gridTemplateRows: productsOpen ? '1fr' : '0fr' }}
                >
                  <ul className="overflow-hidden" aria-label={t('families')}>
                    {columns.map((c) => (
                      <li key={c.slug}>
                        <Link
                          href={`/products/${c.slug}`}
                          className="flex min-h-12 items-center justify-between border-b border-blue/20 py-2 text-xl font-bold"
                        >
                          {c.name}
                          <span className="type-small">{c.countLabel}</span>
                        </Link>
                      </li>
                    ))}
                    <li>
                      <Link
                        href="/products"
                        className="flex min-h-12 items-center py-2 text-xl font-bold underline underline-offset-4"
                      >
                        {t('allProducts')}
                      </Link>
                    </li>
                  </ul>
                </div>
              </li>
              {navLinks.map((l, i) => (
                <li key={l.href} style={stamp(i + 1)}>
                  <Link href={l.href} className={big}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="relative z-[2] shell grid gap-3 pb-[calc(24px+env(safe-area-inset-bottom))]">
            <a
              href={telHref(site.phones.landline.e164)}
              className={buttonClasses({ variant: 'secondary', size: 'lg', full: true })}
              data-track="call_click"
              data-track-location="menu"
            >
              <IconPhone size={20} />
              <span>
                {tc('call', { phone: '' })}
                <bdi dir="ltr">{site.phones.landline.display}</bdi>
              </span>
            </a>
            <a
              href={waHref()}
              target="_blank"
              rel="noopener noreferrer"
              className={buttonClasses({ variant: 'primary', size: 'lg', full: true })}
              data-track="whatsapp_click"
              data-track-location="menu"
            >
              <IconWhatsApp size={20} />
              {tc('chatWhatsApp')}
            </a>
            <div className="flex items-center justify-between pt-2">
              <LanguageToggle />
            </div>
          </div>
          <span className="pointer-events-none absolute end-4 bottom-0 z-[1] w-28 translate-y-[38%]">
            <Crinkle pose="peek" />
          </span>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
