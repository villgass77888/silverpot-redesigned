'use client';

import { create } from 'zustand';

export type Toast = { id: number; message: string; tone?: 'default' | 'success' };

type UIState = {
  searchOpen: boolean;
  quoteOpen: boolean;
  /** stay mounted after first open so close animations can run */
  searchLoaded: boolean;
  quoteLoaded: boolean;
  menuLoaded: boolean;
  menuOpen: boolean;
  /** increments on every add-to-quote; QuoteButton watches it to stamp-bounce its badge */
  quoteBump: number;
  toasts: Toast[];
  announcement: string;
  setSearchOpen(open: boolean): void;
  setQuoteOpen(open: boolean): void;
  setMenuOpen(open: boolean): void;
  bumpQuote(): void;
  toast(message: string, tone?: Toast['tone']): void;
  dismissToast(id: number): void;
  announce(message: string): void;
};

let toastId = 0;

export const useUI = create<UIState>()((set) => ({
  searchOpen: false,
  quoteOpen: false,
  searchLoaded: false,
  quoteLoaded: false,
  menuLoaded: false,
  menuOpen: false,
  quoteBump: 0,
  toasts: [],
  announcement: '',
  setSearchOpen: (searchOpen) => set(searchOpen ? { searchOpen, searchLoaded: true } : { searchOpen }),
  setQuoteOpen: (quoteOpen) => set(quoteOpen ? { quoteOpen, quoteLoaded: true } : { quoteOpen }),
  setMenuOpen: (menuOpen) => set(menuOpen ? { menuOpen, menuLoaded: true } : { menuOpen }),
  bumpQuote: () => set((s) => ({ quoteBump: s.quoteBump + 1 })),
  toast: (message, tone = 'default') =>
    set((s) => ({ toasts: [...s.toasts.slice(-2), { id: ++toastId, message, tone }] })),
  dismissToast: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
  announce: (message) => {
    // Clear first so repeated identical messages are re-announced.
    set({ announcement: '' });
    requestAnimationFrame(() => set({ announcement: message }));
  },
}));
