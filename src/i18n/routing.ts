import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['en', 'ar'],
  defaultLocale: 'en',
  // English lives at the root, Arabic under /ar (§5.6).
  localePrefix: 'as-needed',
  // Keep "/" stable for crawlers and shared links; visitors switch with the toggle.
  localeDetection: false,
});

export type AppLocale = (typeof routing.locales)[number];
