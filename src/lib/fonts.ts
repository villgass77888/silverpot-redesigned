import localFont from 'next/font/local';

/*
 * Fonts are self-hosted subsets built by scripts/build-web-fonts.py: only the
 * glyphs the UI uses and only the axes it needs (169 KB → 87 KB on the first view, §12.1).
 * Arabic fonts get the same treatment (Arabic block only), so every font is self-hosted.
 */

/** Display / wordmark / model codes (§3.4): Big Shoulders Display (opsz 72), 800–900. */
export const bigShoulders = localFont({
  src: '../assets/fonts/web/BigShoulders-Display-800-900.woff2',
  weight: '800 900',
  variable: '--font-big-shoulders',
  display: 'swap',
  // Not needed for the LCP (the wordmark is SVG); don't compete with the H1's font.
  preload: false,
});

/** Stencil stamps. Not preloaded: only fetched where a stamp renders. */
export const bigShouldersStencil = localFont({
  src: '../assets/fonts/web/BigShouldersStencil-Display-900.woff2',
  weight: '900',
  variable: '--font-big-shoulders-stencil',
  display: 'swap',
  preload: false,
});

/** Headlines and body (the LCP font, so the only preload). Variable: wght 400–800 + opsz. */
export const bricolage = localFont({
  src: '../assets/fonts/web/BricolageGrotesque-400-800.woff2',
  weight: '400 800',
  variable: '--font-bricolage',
  display: 'swap',
});

/** Hand annotations (≤ 12 words). */
export const gochi = localFont({
  src: '../assets/fonts/web/GochiHand-400.woff2',
  weight: '400',
  variable: '--font-gochi',
  display: 'swap',
  preload: false,
});

/** Arabic display: Arabic block + ASCII. Variable class only applied on /ar. */
export const lalezar = localFont({
  src: '../assets/fonts/web/Lalezar-400.woff2',
  weight: '400',
  variable: '--font-lalezar',
  display: 'swap',
  preload: false,
});

/** Arabic text: Arabic block only; Latin in Arabic copy falls through to Bricolage. */
export const plexArabic = localFont({
  src: [
    { path: '../assets/fonts/web/IBMPlexSansArabic-400.woff2', weight: '400' },
    { path: '../assets/fonts/web/IBMPlexSansArabic-500.woff2', weight: '500' },
    { path: '../assets/fonts/web/IBMPlexSansArabic-700.woff2', weight: '700' },
  ],
  variable: '--font-plex-ar',
  display: 'swap',
  preload: false,
  declarations: [{ prop: 'unicode-range', value: 'U+0600-06FF, U+200C-200F' }],
});

export function fontVariables(locale: string) {
  const latin = [bigShoulders.variable, bigShouldersStencil.variable, bricolage.variable, gochi.variable];
  return (locale === 'ar' ? [...latin, lalezar.variable, plexArabic.variable] : latin).join(' ');
}
