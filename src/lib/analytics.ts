'use client';

import { track as vercelTrack } from '@vercel/analytics';

/** Analytics events (§5.9). Cookieless (Vercel Analytics), so no banner. */
export type AnalyticsEvent =
  | 'add_to_quote'
  | 'quote_submit'
  | 'quote_whatsapp'
  | 'whatsapp_click'
  | 'call_click'
  | 'email_click'
  | 'filter_change'
  | 'search_used'
  | 'size_finder_complete'
  | 'contact_submit'
  | 'wholesale_submit'
  | 'crinkle_click';

type Props = Record<string, string | number | boolean | null>;

export function track(event: AnalyticsEvent, props?: Props) {
  try {
    vercelTrack(event, props);
  } catch {
    /* analytics must never break the UI */
  }
  if (process.env.NODE_ENV === 'development') console.debug('[track]', event, props ?? {});
}
