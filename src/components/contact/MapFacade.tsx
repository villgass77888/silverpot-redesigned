'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { MapIll } from '../illustrations/objects';
import { Button } from '../primitives/Button';
import { mapsEmbedSrc } from '@/data/site';

/** Click-to-load map (§7.10): an illustrated card until the visitor asks for Google Maps. */
export function MapFacade() {
  const t = useTranslations('contact');
  const [loaded, setLoaded] = useState(false);
  return (
    <div className="rim relative aspect-[4/3] overflow-hidden bg-foil sm:aspect-[16/9]">
      {loaded ? (
        <iframe
          src={mapsEmbedSrc()}
          title={t('mapTitle')}
          className="absolute inset-0 size-full border-0"
          loading="lazy"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      ) : (
        <>
          <div className="absolute inset-0 bg-blueprint" />
          <div className="absolute inset-x-[6%] top-[6%]">
            <MapIll />
          </div>
          <p className="absolute start-[8%] top-[44%] type-hand text-[1.5rem]" aria-hidden>
            Ajman
          </p>
          <div className="absolute inset-x-0 bottom-0 flex flex-col items-center gap-2 bg-gradient-to-t from-foil via-foil/90 to-transparent px-4 pt-10 pb-6">
            <Button onClick={() => setLoaded(true)} variant="secondary" raised>
              {t('loadMap')}
            </Button>
            <p className="type-small text-blue/80">{t('mapNote')}</p>
          </div>
        </>
      )}
    </div>
  );
}
