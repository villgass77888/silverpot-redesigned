'use client';

import { useRef } from 'react';

/**
 * Radix Dialog only returns focus to its own `Dialog.Trigger`. Our dialogs open from
 * store state or lazy mounts, so remember whatever had focus when the dialog opened and
 * give it back on close (§12.2: "trap focus and restore it on close").
 * Spread the result onto `Dialog.Content`.
 */
export function useReturnFocus() {
  const opener = useRef<HTMLElement | null>(null);
  return {
    onOpenAutoFocus: () => {
      opener.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    },
    onCloseAutoFocus: (event: Event) => {
      event.preventDefault();
      const el = opener.current;
      const target = el && el.isConnected && el !== document.body ? el : document.getElementById('main');
      target?.focus({ preventScroll: true });
    },
  };
}
