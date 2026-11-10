'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useUI } from '../ui-store';
import { IconSearch } from '../icons';

/** Header search trigger (§6.2): "Search" + ⌘K / Ctrl K hint on desktop, icon on mobile. */
export function SearchButton() {
  const t = useTranslations('nav');
  const open = useUI((s) => s.setSearchOpen);
  const [mac, setMac] = useState(false);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- platform only known on the client
    setMac(/Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent));
  }, []);
  return (
    <button
      type="button"
      onClick={() => open(true)}
      className="inline-flex size-11 items-center justify-center gap-2 rounded-full font-semibold hover:bg-foil lg:w-auto lg:rounded-btn lg:border-2 lg:border-blue/20 lg:px-3 lg:hover:border-blue"
      aria-label={t('search')}
      aria-keyshortcuts="Control+K Meta+K /"
    >
      <IconSearch size={22} />
      <span className="hidden lg:inline">{t('search')}</span>
      <kbd className="hidden rounded-[5px] border border-blue/30 bg-foil px-1.5 py-0.5 font-sans text-[0.6875rem] font-bold xl:inline">
        {mac ? '⌘K' : 'Ctrl K'}
      </kbd>
    </button>
  );
}
