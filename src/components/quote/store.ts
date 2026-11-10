'use client';

import { useSyncExternalStore } from 'react';
import { create } from 'zustand';
import { createJSONStorage, persist, type StateStorage } from 'zustand/middleware';
import { clampQty } from '@/lib/format';

export type QuoteUnit = 'cartons' | 'pieces';
export type QuoteItem = { productId: string; qty: number; unit: QuoteUnit; note?: string };

type QuoteState = {
  items: QuoteItem[];
  add(productId: string, qty?: number, unit?: QuoteUnit, note?: string): void; // increments if already present
  setQty(productId: string, qty: number): void; // min 1, max 9999
  setUnit(productId: string, unit: QuoteUnit): void;
  setNote(productId: string, note: string): void;
  remove(productId: string): void;
  clear(): void;
};

/** localStorage wrapped in try/catch, falling back to memory (private mode, blocked storage). */
const memory = new Map<string, string>();
const safeStorage: StateStorage = {
  getItem: (k) => {
    try {
      return window.localStorage.getItem(k);
    } catch {
      return memory.get(k) ?? null;
    }
  },
  setItem: (k, v) => {
    try {
      window.localStorage.setItem(k, v);
    } catch {
      memory.set(k, v);
    }
  },
  removeItem: (k) => {
    try {
      window.localStorage.removeItem(k);
    } catch {
      memory.delete(k);
    }
  },
};

export const useQuote = create<QuoteState>()(
  persist(
    (set) => ({
      items: [],
      add: (productId, qty = 1, unit = 'cartons', note) =>
        set((s) => {
          const existing = s.items.find((i) => i.productId === productId);
          if (existing) {
            return {
              items: s.items.map((i) =>
                i.productId === productId
                  ? { ...i, qty: clampQty(i.qty + qty), note: note && !i.note?.includes(note) ? [i.note, note].filter(Boolean).join(' · ') : i.note }
                  : i,
              ),
            };
          }
          return { items: [...s.items, { productId, qty: clampQty(qty), unit, ...(note ? { note } : {}) }] };
        }),
      setQty: (productId, qty) =>
        set((s) => ({ items: s.items.map((i) => (i.productId === productId ? { ...i, qty: clampQty(qty) } : i)) })),
      setUnit: (productId, unit) =>
        set((s) => ({ items: s.items.map((i) => (i.productId === productId ? { ...i, unit } : i)) })),
      setNote: (productId, note) =>
        set((s) => ({ items: s.items.map((i) => (i.productId === productId ? { ...i, note: note.slice(0, 300) } : i)) })),
      remove: (productId) => set((s) => ({ items: s.items.filter((i) => i.productId !== productId) })),
      clear: () => set({ items: [] }),
    }),
    {
      name: 'silverpot-quote-v1',
      storage: createJSONStorage(() => safeStorage),
      skipHydration: true,
      partialize: (s) => ({ items: s.items }),
    },
  ),
);

export const useQuoteCount = () => useQuote((s) => s.items.length);

/** True once the persisted list has been read from storage (avoids flashing the empty state). */
export function useQuoteHydrated() {
  return useSyncExternalStore(
    (cb) => useQuote.persist.onFinishHydration(cb),
    () => useQuote.persist.hasHydrated(),
    () => false,
  );
}
