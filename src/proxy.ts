import createMiddleware from 'next-intl/middleware';
import { NextResponse, type NextRequest } from 'next/server';
import { routing } from './i18n/routing';
import { resolveLegacy, isLegacyWordPressPath } from './lib/legacy';

const intl = createMiddleware(routing);

function gone() {
  return new NextResponse(
    '<!doctype html><meta charset="utf-8"><title>Gone</title><p>This page no longer exists. <a href="/">Go to silverpot.org</a></p>',
    { status: 410, headers: { 'content-type': 'text/html; charset=utf-8', 'x-robots-tag': 'noindex' } },
  );
}

export function proxy(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  // Old WordPress endpoints and spam paths → 410 Gone (§11.5), with or without a trailing slash.
  if (isLegacyWordPressPath(pathname)) return gone();

  // Trailing-slash normalisation lives here (skipTrailingSlashRedirect) so the 410s above
  // answer in one hop; everything else gets a clean single 308 to the slash-less URL.
  if (pathname.length > 1 && pathname.endsWith('/')) {
    // A plain URL: NextURL remembers the original trailing slash and would re-add it.
    const url = new URL(request.url);
    url.pathname = pathname.replace(/\/+$/, '');
    return NextResponse.redirect(url, 308);
  }

  // Old query-string URLs on "/" → clean 308s, unknown values → 410.
  if (pathname === '/' && [...searchParams.keys()].length > 0) {
    const result = resolveLegacy(searchParams);
    if (result.type === 'redirect') {
      const url = new URL(result.to, request.url);
      return NextResponse.redirect(url, 308);
    }
    if (result.type === 'gone') return gone();
  }

  // Static files (sitemap.xml, robots.txt, icons, images) skip locale handling.
  if (/\.[a-z0-9]+$/i.test(pathname)) return NextResponse.next();

  const response = intl(request);
  // Filtered/searched product lists: noindex, follow (canonical stays the unfiltered page, §6.1).
  if (/^(\/ar)?\/products(\/(containers|platters|foil))?$/.test(pathname) && [...searchParams.keys()].length > 0) {
    response.headers.set('x-robots-tag', 'noindex, follow');
  }
  return response;
}

export const config = {
  matcher: ['/((?!_next|_vercel|images/|brand/).*)'],
};
