import './globals.css';
import Link from 'next/link';
import { bigShoulders, bricolage, gochi } from '@/lib/fonts';
import { Logo } from '@/components/brand/Logo';
import { HazardTape } from '@/components/primitives/Motifs';

// Fallback for requests outside the locale matcher. Locale-aware 404 is [locale]/not-found.tsx.
export default function RootNotFound() {
  return (
    <html lang="en" className={`${bigShoulders.variable} ${bricolage.variable} ${gochi.variable}`}>
      <body className="min-h-svh bg-yellow text-blue">
        <HazardTape />
        <main className="shell grid min-h-[80svh] place-items-center py-16 text-center">
          <div className="max-w-xl">
            <Logo sticker className="mx-auto mb-10 h-auto w-56" />
            <h1 className="type-display">This page got thrown out.</h1>
            <p className="mx-auto mt-5 max-w-[46ch] type-body-l">
              It’s probably being recycled into something useful. Meanwhile, try one of these:
            </p>
            <Link
              href="/"
              className="mt-8 inline-flex min-h-12 press items-center rounded-btn border-2 border-blue bg-red px-5 font-bold text-white"
            >
              Go to homepage
            </Link>
          </div>
        </main>
      </body>
    </html>
  );
}
