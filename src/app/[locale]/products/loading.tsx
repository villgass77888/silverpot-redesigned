import { LogoStar } from '@/components/brand/Logo';

/**
 * Route loading (§7.13): foil-shimmer skeletons in the shape of a page band + card grid,
 * and a tiny spinning foil spiral that only appears after 300ms.
 */
export default function Loading() {
  return (
    <div aria-busy="true" aria-live="polite">
      <span className="sr-only">Loading</span>
      <span
        aria-hidden
        className="fixed top-[calc(var(--header-h)+48px)] left-1/2 z-[55] -translate-x-1/2 text-blue opacity-0"
        style={{ animation: 'sp-fade-in 120ms linear 300ms both' }}
      >
        <LogoStar className="size-7" spin />
      </span>
      <div className="shimmer h-[320px] md:h-[380px]" />
      <div className="shell grid grid-cols-2 gap-4 py-10 md:grid-cols-3 md:gap-6 xl:grid-cols-4">
        {Array.from({ length: 8 }, (_, i) => (
          <div key={i} className="shimmer aspect-[3/4] rounded-rim" />
        ))}
      </div>
    </div>
  );
}
