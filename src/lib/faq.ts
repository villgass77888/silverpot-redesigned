import { faqById, faqs, type FaqItem } from '@/data/faq';
import { SHOW_UNCONFIRMED } from './review-mode';
import { tx } from './l10n';

/** Production renders 'general', 'confirmed' and 'placeholder' answers (§7.9); review mode shows all, flagged. */
export function isFaqVisible(f: FaqItem) {
  return f.status !== 'confirm' || SHOW_UNCONFIRMED;
}

export function faqEntries(ids: string[], locale: string) {
  return ids
    .map((id) => faqById.get(id))
    .filter((f): f is FaqItem => !!f && isFaqVisible(f))
    .map((f) => ({
      id: f.id,
      q: tx(f.q, locale),
      a: tx(f.a, locale),
      pending: f.status === 'confirm',
      placeholder: f.status === 'placeholder',
    }));
}

/** Items that may go into FAQPage JSON-LD: confirmed/general only, never review extras or placeholders. */
export function faqSchemaItems(ids: string[]) {
  return ids
    .map((id) => faqById.get(id))
    .filter((f): f is FaqItem => !!f && (f.status === 'general' || f.status === 'confirmed'));
}

export const homeTeaserIds = faqs.filter((f) => f.homeTeaser).map((f) => f.id);
