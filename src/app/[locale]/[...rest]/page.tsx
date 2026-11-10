import { notFound } from 'next/navigation';

// Any unmatched path inside a locale renders the branded [locale]/not-found.tsx.
export default function CatchAll() {
  notFound();
}
