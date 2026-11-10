'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { usePathname } from '@/i18n/navigation';
import { waHref } from '@/lib/whatsapp';
import { IconWhatsApp } from '../icons';
import { cn } from '@/lib/cn';

/**
 * Floating WhatsApp sticker (§6.4): round, Yellow, Blue outline, shadow-md, 56px,
 * bottom-end; appears after 30% scroll; hidden on product/category pages (bottom bar).
 */
export function FloatingWhatsApp() {
  const t = useTranslations('common');
  const pathname = usePathname();
  const [show, setShow] = useState(false);
  const suppressed = pathname.startsWith('/products') || pathname.startsWith('/quote');

  useEffect(() => {
    if (suppressed) return;
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setShow(max > 0 && window.scrollY / max > 0.3);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [suppressed]);

  if (suppressed) return null;
  return (
    <a
      href={waHref()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={t('chatWhatsApp')}
      data-track="whatsapp_click"
      data-track-location="float"
      tabIndex={show ? 0 : -1}
      aria-hidden={!show}
      className={cn(
        'fixed end-4 bottom-[calc(16px+env(safe-area-inset-bottom))] z-[60] grid size-14 press place-items-center rounded-full border-2 border-blue bg-yellow text-blue transition-[opacity,transform] press-md md:end-6 md:bottom-6',
        show ? 'opacity-100' : 'pointer-events-none translate-y-4 opacity-0',
      )}
    >
      <IconWhatsApp size={28} />
    </a>
  );
}
