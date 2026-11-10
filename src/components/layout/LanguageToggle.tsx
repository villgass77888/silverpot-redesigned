'use client';

import { useLocale, useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/navigation';
import { cn } from '@/lib/cn';

/** "EN | عربي" (§6.2). Keeps the current path; slugs are shared across locales. */
export function LanguageToggle({
  className,
  tone = 'light',
}: {
  className?: string;
  tone?: 'light' | 'dark';
}) {
  const locale = useLocale();
  const pathname = usePathname();
  const t = useTranslations('nav');
  const item = 'inline-flex min-h-11 min-w-11 items-center justify-center rounded-full px-2.5 font-bold';
  const current = cn(item, tone === 'light' ? 'bg-blue text-white' : 'bg-white text-blue');
  const other = cn(item, 'underline-offset-4 hover:underline');
  return (
    <span
      className={cn('inline-flex items-center gap-0.5', className)}
      role="group"
      aria-label={t('language')}
    >
      {locale === 'en' ? (
        <span className={current} aria-current="true">
          EN
        </span>
      ) : (
        <Link
          href={pathname}
          locale="en"
          className={other}
          hrefLang="en"
          lang="en"
          aria-label="Read this page in English"
        >
          EN
        </Link>
      )}
      <span aria-hidden className="opacity-40">
        |
      </span>
      {locale === 'ar' ? (
        <span className={cn(current, 'font-[family-name:var(--font-ar)]')} aria-current="true">
          عربي
        </span>
      ) : (
        <Link
          href={pathname}
          locale="ar"
          className={cn(other, 'font-[family-name:var(--font-ar)]')}
          hrefLang="ar"
          lang="ar"
          aria-label="اقرأ هذه الصفحة بالعربية"
        >
          عربي
        </Link>
      )}
    </span>
  );
}
