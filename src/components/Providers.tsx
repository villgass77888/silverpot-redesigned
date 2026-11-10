'use client';

import { useEffect, type ReactNode } from 'react';
import dynamic from 'next/dynamic';
import { useQuote } from './quote/store';
import { useUI } from './ui-store';
import { Toaster } from './layout/Toaster';
import { track, type AnalyticsEvent } from '@/lib/analytics';

// Heavy, interaction-only islands load on demand (§12.1).
const CommandSearch = dynamic(() => import('./layout/CommandSearch').then((m) => m.CommandSearch), {
  ssr: false,
});
const QuoteDrawer = dynamic(() => import('./quote/QuoteDrawer').then((m) => m.QuoteDrawer), { ssr: false });

export function Providers({ children }: { children: ReactNode }) {
  const searchOpen = useUI((s) => s.searchOpen);
  const quoteOpen = useUI((s) => s.quoteOpen);
  const searchEverOpened = useUI((s) => s.searchOpen || s.searchLoaded);
  const quoteEverOpened = useUI((s) => s.quoteOpen || s.quoteLoaded);

  // Quote list lives in localStorage; hydrate after mount to avoid SSR mismatch.
  useEffect(() => {
    void useQuote.persist.rehydrate();
  }, []);

  // ⌘K / Ctrl K / "/" open search (§6.4).
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const typing =
        target && (target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName));
      if ((e.key === 'k' || e.key === 'K') && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        useUI.getState().setSearchOpen(true);
      } else if (e.key === '/' && !typing && !e.metaKey && !e.ctrlKey && !e.altKey) {
        e.preventDefault();
        useUI.getState().setSearchOpen(true);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // Delegated analytics for links marked data-track (tel:, mailto:, wa.me) (§5.9).
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const el = (e.target as HTMLElement | null)?.closest<HTMLElement>('[data-track]');
      if (!el) return;
      track(el.dataset.track as AnalyticsEvent, { location: el.dataset.trackLocation || 'unknown' });
    };
    document.addEventListener('click', onClick, { capture: true });
    return () => document.removeEventListener('click', onClick, { capture: true });
  }, []);

  return (
    <>
      {children}
      <Toaster />
      <Announcer />
      {searchEverOpened && <CommandSearch open={searchOpen} />}
      {quoteEverOpened && <QuoteDrawer open={quoteOpen} />}
    </>
  );
}

/** Single polite live region for announcements like "Added 8325 to your quote" (§4.3-3). */
function Announcer() {
  const message = useUI((s) => s.announcement);
  return (
    <div aria-live="polite" aria-atomic="true" className="sr-only">
      {message}
    </div>
  );
}
