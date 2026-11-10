'use client';

import type { ReactNode } from 'react';
import { useUI } from '../ui-store';
import { buttonClasses, type ButtonVariant } from '../primitives/Button';
import { IconSearch } from '../icons';

/** A button that opens the command palette (404 "Search", §7.13). */
export function OpenSearchButton({
  children,
  variant = 'secondary',
}: {
  children: ReactNode;
  variant?: ButtonVariant;
}) {
  const open = useUI((s) => s.setSearchOpen);
  return (
    <button type="button" onClick={() => open(true)} className={buttonClasses({ variant, size: 'lg' })}>
      <IconSearch size={20} />
      {children}
    </button>
  );
}
