'use client';

import { useEffect, useRef } from 'react';
import { useUI, type Toast } from '../ui-store';
import { Crinkle } from '../brand/Crinkle';
import { IconClose } from '../icons';
import { useTranslations } from 'next-intl';

/**
 * Toasts (§4.4): bottom-left on desktop, above the bottom bar on mobile, stamp in,
 * tiny Crinkle, auto-dismiss after 4 s, pause on hover. Announcements go through the
 * Announcer live region, so this stack itself is not a live region.
 */
export function Toaster() {
  const toasts = useUI((s) => s.toasts);
  return (
    <div className="pointer-events-none fixed inset-x-3 bottom-[calc(84px+env(safe-area-inset-bottom))] z-[70] flex flex-col items-start gap-2 md:inset-x-auto md:start-6 md:bottom-6">
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} />
      ))}
    </div>
  );
}

function ToastItem({ toast }: { toast: Toast }) {
  const dismiss = useUI((s) => s.dismissToast);
  const t = useTranslations('common');
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const remaining = useRef(4000);
  const started = useRef(0);

  const start = () => {
    started.current = Date.now();
    timer.current = setTimeout(() => dismiss(toast.id), remaining.current);
  };
  const pause = () => {
    if (timer.current) clearTimeout(timer.current);
    remaining.current -= Date.now() - started.current;
  };

  useEffect(() => {
    start();
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      className="pointer-events-auto flex items-center gap-3 rounded-[14px] border-2 border-blue bg-white py-2 ps-2 pe-2 text-blue shadow-hard-md"
      style={{ animation: 'sp-toast-in 320ms var(--ease-stamp) both' }}
      onMouseEnter={pause}
      onMouseLeave={start}
    >
      <span className="w-9 shrink-0">
        <Crinkle pose={toast.tone === 'success' ? 'thumbs-up' : 'deadpan'} />
      </span>
      <span className="font-semibold">{toast.message}</span>
      <button
        type="button"
        onClick={() => dismiss(toast.id)}
        className="grid size-9 place-items-center rounded-full hover:bg-foil pointer-coarse:size-11"
        aria-label={t('close')}
      >
        <IconClose size={16} />
      </button>
    </div>
  );
}
