'use client';

import { useEffect } from 'react';

/**
 * Vercel Analytics + Speed Insights (§5.1), injected after the page is idle so
 * neither library is part of first-load JS. Rendered only on Vercel, which serves
 * the scripts; elsewhere they would 404.
 */
export function VercelInsights() {
  useEffect(() => {
    const load = () => {
      void import('@vercel/analytics').then((a) => a.inject({ framework: 'next' }));
      void import('@vercel/speed-insights').then((s) => s.injectSpeedInsights({ framework: 'next' }));
    };
    if ('requestIdleCallback' in window) {
      const id = window.requestIdleCallback(load, { timeout: 4000 });
      return () => window.cancelIdleCallback(id);
    }
    const id = setTimeout(load, 2000);
    return () => clearTimeout(id);
  }, []);
  return null;
}
