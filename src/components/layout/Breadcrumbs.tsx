import { getLocale, getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { JsonLd } from '../seo/JsonLd';
import { breadcrumbSchema } from '../seo/schemas';
import { cn } from '@/lib/cn';

export type Crumb = { name: string; path: string };

/** Visible breadcrumbs + BreadcrumbList JSON-LD (§7.4, §11.4). Last item is the current page. */
export async function Breadcrumbs({ items, className }: { items: Crumb[]; className?: string }) {
  const locale = await getLocale();
  const t = await getTranslations('common');
  const all = [{ name: t('home'), path: '/' }, ...items];
  return (
    <>
      <JsonLd data={breadcrumbSchema(locale, all)} />
      <nav aria-label={t('breadcrumb')} className={cn('type-small', className)}>
        <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
          {all.map((c, i) => {
            const last = i === all.length - 1;
            return (
              <li key={c.path} className="inline-flex items-center gap-2">
                {last ? (
                  <span aria-current="page" className="font-bold">
                    <bdi>{c.name}</bdi>
                  </span>
                ) : (
                  <>
                    <Link href={c.path} className="underline-offset-4 hover:underline">
                      {c.name}
                    </Link>
                    <span aria-hidden className="opacity-50">
                      /
                    </span>
                  </>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
