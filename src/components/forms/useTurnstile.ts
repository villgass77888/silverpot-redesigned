'use client';

import { useCallback, useEffect, useRef } from 'react';

type TurnstileApi = {
  render(el: HTMLElement, opts: Record<string, unknown>): string;
  reset(id?: string): void;
  remove(id?: string): void;
};
declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

let scriptPromise: Promise<void> | null = null;
function loadScript() {
  if (window.turnstile) return Promise.resolve();
  if (!scriptPromise) {
    scriptPromise = new Promise((resolve, reject) => {
      const s = document.createElement('script');
      s.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
      s.async = true;
      s.defer = true;
      s.onload = () => resolve();
      s.onerror = () => reject(new Error('turnstile'));
      document.head.appendChild(s);
    });
  }
  return scriptPromise;
}

/**
 * Cloudflare Turnstile, invisible ("interaction-only"), loaded on first interaction with
 * the form so there are zero third-party requests on first view (§12.1). No site key → no-op.
 * Returns only callbacks: `container` is a callback ref for the widget slot.
 */
export function useTurnstile(siteKey?: string) {
  const slot = useRef<HTMLDivElement | null>(null);
  const widget = useRef<string | null>(null);
  const token = useRef('');

  const container = useCallback((el: HTMLDivElement | null) => {
    slot.current = el;
  }, []);

  const activate = useCallback(() => {
    if (!siteKey || widget.current || !slot.current) return;
    widget.current = 'pending';
    loadScript()
      .then(() => {
        if (!slot.current || !window.turnstile) return;
        widget.current = window.turnstile.render(slot.current, {
          sitekey: siteKey,
          appearance: 'interaction-only',
          callback: (t: string) => {
            token.current = t;
          },
          'expired-callback': () => {
            token.current = '';
          },
          'error-callback': () => {
            token.current = '';
          },
        });
      })
      .catch(() => {
        widget.current = null;
      });
  }, [siteKey]);

  useEffect(
    () => () => {
      if (widget.current && widget.current !== 'pending') window.turnstile?.remove(widget.current);
    },
    [],
  );

  /** Wait (briefly) for a token before submitting. */
  const getToken = useCallback(async () => {
    if (!siteKey) return undefined;
    activate();
    for (let i = 0; i < 40 && !token.current; i++) await new Promise((r) => setTimeout(r, 150));
    return token.current || undefined;
  }, [siteKey, activate]);

  const reset = useCallback(() => {
    token.current = '';
    if (widget.current && widget.current !== 'pending') window.turnstile?.reset(widget.current);
  }, []);

  return { container, activate, getToken, reset };
}
