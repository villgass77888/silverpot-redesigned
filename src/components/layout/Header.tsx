import { getLocale, getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { Logo } from '../brand/Logo';
import { HeaderChrome } from './HeaderChrome';
import { MegaMenu, type MegaColumn } from './MegaMenu';
import { MobileMenu } from './MobileMenu';
import { QuoteButton } from './QuoteButton';
import { SearchButton } from './SearchButton';
import { LanguageToggle } from './LanguageToggle';
import { categories, categoryCount } from '@/data/categories';
import { productHref, productsIn } from '@/data/products';
import { tx } from '@/lib/l10n';

const NAV = ['wholesale', 'about', 'sustainability', 'faq', 'contact'] as const;

/** Main header (§6.2). Server-rendered shell; interactive parts are client leaves. */
export async function Header() {
  const locale = await getLocale();
  const t = await getTranslations('nav');
  const tc = await getTranslations('common');

  const columns: MegaColumn[] = categories.map((c) => {
    const items = productsIn(c.slug);
    return {
      slug: c.slug,
      name: tx(c.name, locale),
      tone: c.tone,
      countLabel:
        c.slug === 'foil'
          ? tc('productsCount', { count: categoryCount(c.slug) })
          : tc('modelsCount', { count: categoryCount(c.slug) }),
      links: items
        .filter((p, i, arr) => arr.findIndex((q) => (q.modelCode ?? q.id) === (p.modelCode ?? p.id)) === i)
        .slice(0, 6)
        .map((p) => ({
          href: productHref(p),
          label:
            p.modelCode ??
            `${p.specs.rollWidthCm.value} cm × ${p.specs.rollLengths.value
              ?.map((l) => `${l.value}${l.unit === 'm' ? ' m' : ''}`)
              .join(' / ')}${p.specs.rollLengths.value?.[0]?.unit === 'sqft' ? ' sq ft' : ''}`,
        })),
    };
  });

  const navLinks = NAV.map((k) => ({ href: `/${k}`, label: t(k) }));

  return (
    <HeaderChrome>
      <div className="shell flex h-full items-center gap-2 sm:gap-3 lg:gap-6">
        <Link
          href="/"
          aria-label={t('homeLabel')}
          className="header-logo -ms-1 shrink-0 rounded-[6px] p-1 text-blue"
        >
          <Logo symbol decorative className="h-11 w-[63px] lg:h-[54px] lg:w-[77px]" />
        </Link>

        <nav aria-label={t('main')} className="hidden flex-1 items-center justify-center lg:flex">
          <ul className="flex items-center gap-1 xl:gap-2">
            <li>
              <MegaMenu label={t('products')} columns={columns} />
            </li>
            {navLinks.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="nav-link relative inline-flex h-11 items-center rounded-full px-3 font-semibold xl:px-3.5"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="ms-auto flex shrink-0 items-center gap-1.5 min-[400px]:gap-2 lg:ms-0 lg:gap-3">
          <SearchButton />
          <span className="hidden lg:block">
            <LanguageToggle />
          </span>
          <QuoteButton />
          <MobileMenu columns={columns} navLinks={navLinks} />
        </div>
      </div>
    </HeaderChrome>
  );
}
