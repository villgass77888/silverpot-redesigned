export type ClassValue = string | false | null | undefined | 0;

/** Tiny className joiner (no runtime merging; we never fight our own utilities). */
export function cn(...parts: ClassValue[]) {
  return parts.filter(Boolean).join(' ');
}
