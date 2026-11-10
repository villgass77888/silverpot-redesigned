'use client';

import type { ReactNode } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { useQuoteCount } from './store';
import { buttonClasses, type ButtonSize, type ButtonVariant } from '../primitives/Button';

/** "Get a quote": /quote when the list has items, otherwise the wholesale form (§7.1 H13). */
export function QuoteAwareLink({
  children,
  variant = 'primary',
  size = 'lg',
  raised,
  className,
}: {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  raised?: boolean;
  className?: string;
}) {
  const count = useQuoteCount();
  return (
    <Link
      href={count > 0 ? '/quote' : '/wholesale#quote'}
      prefetch={false}
      className={buttonClasses({ variant, size, raised, className })}
    >
      {children}
    </Link>
  );
}

/** "View your quote (n)" with a live count. */
export function ViewQuoteButton() {
  const count = useQuoteCount();
  const t = useTranslations('product');
  return (
    <Link href="/quote" className={buttonClasses({ variant: 'secondary', size: 'md' })}>
      {t('viewQuote', { count })}
    </Link>
  );
}
