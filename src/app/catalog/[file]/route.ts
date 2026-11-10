import { routing } from '@/i18n/routing';
import { catalogIndex } from '@/lib/catalog';

// Static catalogue index per locale (/catalog/en.json, /catalog/ar.json), loaded lazily
// by the search palette and the quote list (src/components/catalog-context.tsx).
export const dynamic = 'force-static';
export const dynamicParams = false;

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ file: `${locale}.json` }));
}

export async function GET(_request: Request, { params }: { params: Promise<{ file: string }> }) {
  const { file } = await params;
  return Response.json(catalogIndex(file.replace(/\.json$/, '')));
}
