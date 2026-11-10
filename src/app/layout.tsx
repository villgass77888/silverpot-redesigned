import type { ReactNode } from 'react';

// The real root layout lives in [locale]/layout.tsx (it owns <html lang dir>).
// This pass-through exists because app/not-found.tsx needs a root layout.
export default function RootLayout({ children }: { children: ReactNode }) {
  return children;
}
