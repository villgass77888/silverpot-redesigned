'use client';

import { useEffect } from 'react';

/** Marks the hero sequence as played for this session (read before paint in the layout). */
export function HeroPlayedFlag() {
  useEffect(() => {
    try {
      sessionStorage.setItem('sp-hero', '1');
    } catch {
      /* storage may be blocked: the sequence just plays again */
    }
  }, []);
  return null;
}
