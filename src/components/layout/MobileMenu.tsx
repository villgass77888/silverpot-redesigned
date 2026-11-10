'use client';

import dynamic from 'next/dynamic';
import { useTranslations } from 'next-intl';
import { useUI } from '../ui-store';
import type { MegaColumn } from './MegaMenu';

// The full-screen panel (Radix Dialog) only loads once someone opens the menu (§12.1).
const MobileMenuPanel = dynamic(() => import('./MobileMenuPanel').then((m) => m.MobileMenuPanel), {
  ssr: false,
});

/** Mobile "Menu" button (Yellow fill, Blue outline, shadow-sm) + lazily loaded panel (§6.2). */
export function MobileMenu({
  columns,
  navLinks,
}: {
  columns: MegaColumn[];
  navLinks: { href: string; label: string }[];
}) {
  const t = useTranslations('nav');
  const open = useUI((s) => s.menuOpen);
  const loaded = useUI((s) => s.menuOpen || s.menuLoaded);
  const setOpen = useUI((s) => s.setMenuOpen);
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        aria-expanded={open}
        className="inline-flex min-h-11 press items-center rounded-btn border-2 border-blue bg-yellow px-3 font-bold min-[400px]:px-3.5 lg:hidden"
      >
        {t('menu')}
      </button>
      {loaded && <MobileMenuPanel columns={columns} navLinks={navLinks} />}
    </>
  );
}
