import { useTranslations } from 'next-intl';
import { Crinkle } from '../brand/Crinkle';
import { MascotJumpOut } from '../brand/MascotHandoff';
import { Button } from '../primitives/Button';
import { HazardTape } from '../primitives/Motifs';
import { QuoteAwareLink } from '../quote/QuoteAwareLink';
import { IconPhone } from '../icons';
import { site, telHref } from '@/data/site';
import { waHref } from '@/lib/whatsapp';

/** H13 Bulk CTA (§7.1): hazard-tape seam, then Signal Yellow. Crinkle in a hard hat. */
export function BulkCta({ crinkle = true }: { crinkle?: boolean }) {
  const t = useTranslations('home.bulk');
  const tc = useTranslations('common');
  return (
    <>
      <HazardTape />
      <section className="on-yellow grain relative overflow-hidden bg-yellow section-pad text-blue cv-auto">
        <div className="relative z-[2] shell grid items-center gap-10 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <h2 className="max-w-[13ch] type-display">{t('h2')}</h2>
            <p className="mt-6 max-w-[48ch] type-body-l">{t('body')}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
              <QuoteAwareLink raised>{tc('getQuote')}</QuoteAwareLink>
              <Button href={waHref()} variant="whatsapp" size="lg" track="whatsapp_click" trackLocation="cta">
                {tc('chatWhatsApp')}
              </Button>
              <a
                href={telHref(site.phones.landline.e164)}
                className="inline-flex min-h-12 items-center gap-2 px-2 font-bold underline decoration-2 underline-offset-4"
                data-track="call_click"
                data-track-location="cta"
              >
                <IconPhone size={20} />
                {tc('call', { phone: '' })}
                <bdi dir="ltr">{site.phones.landline.display}</bdi>
              </a>
            </div>
          </div>
          {crinkle && (
            <MascotJumpOut className="mx-auto w-44 sm:w-52 lg:col-span-4 lg:w-64">
              <Crinkle pose="hard-hat" />
            </MascotJumpOut>
          )}
        </div>
      </section>
    </>
  );
}
