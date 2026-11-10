'use client';

import { useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Crinkle } from '@/components/brand/Crinkle';
import { Button } from '@/components/primitives/Button';
import { waHref } from '@/lib/whatsapp';

/** Error boundary (§7.13): "Try again" calls reset(); WhatsApp as the human fallback. */
export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const t = useTranslations('error');
  const tc = useTranslations('common');
  useEffect(() => {
    console.error(error);
  }, [error]);
  return (
    <section className="on-light bg-white py-24 text-center text-blue">
      <div className="shell">
        <div className="mx-auto w-36">
          <Crinkle pose="deadpan" />
        </div>
        <h1 className="type-h2 mx-auto mt-8 max-w-[18ch]">{t('h1')}</h1>
        <p className="mx-auto mt-5 max-w-[48ch] type-body-l">{t('body')}</p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Button onClick={reset} size="lg" raised>
            {t('retry')}
          </Button>
          <Button href={waHref()} variant="whatsapp" size="lg" track="whatsapp_click" trackLocation="error">
            {tc('chatWhatsApp')}
          </Button>
        </div>
      </div>
    </section>
  );
}
