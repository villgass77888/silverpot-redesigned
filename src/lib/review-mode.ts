/**
 * Review mode (§0.1.2). On preview deployments NEXT_PUBLIC_REVIEW_MODE=true.
 * It now only adds the "AR draft" badges, the legal draft banner and /dev/kit.
 */
export const REVIEW_MODE = process.env.NEXT_PUBLIC_REVIEW_MODE === 'true';

/**
 * Reveal unconfirmed facts with "Needs client confirmation" chips in review mode?
 * Off since design feedback round 2 (docs/DECISIONS.md §8.2): review mode renders
 * unconfirmed facts exactly like production (hidden) and stand-ins without highlights.
 * The open items live in docs/PLACEHOLDERS.md (`pnpm check:placeholders`).
 */
export const SHOW_UNCONFIRMED = false;

/** Show something that is unconfirmed? */
export function showUnconfirmed(confirmed: boolean) {
  return confirmed || SHOW_UNCONFIRMED;
}
