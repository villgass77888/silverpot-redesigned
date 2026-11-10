import { useTranslations } from 'next-intl';
import { waHref } from '@/lib/whatsapp';
import { IconWhatsApp } from '../icons';

/** Blue 36px top bar, Yellow text, static (§6.2). Mobile shows only the WhatsApp line, centred. */
export function TopBar() {
  const t = useTranslations('topbar');
  return (
    <div className="on-blue bg-blue text-yellow">
      <div className="shell flex h-9 items-center justify-center type-small md:justify-between">
        <p className="hidden md:block">{t('left')}</p>
        <a
          href={waHref()}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 font-semibold underline-offset-4 hover:underline"
          data-track="whatsapp_click"
          data-track-location="topbar"
        >
          <IconWhatsApp size={18} />
          {t('right')}
        </a>
      </div>
    </div>
  );
}
