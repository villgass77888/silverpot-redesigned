import type { Metadata } from 'next';
import { Crinkle } from '@/components/brand/Crinkle';
import { MascotJumpOut } from '@/components/brand/MascotHandoff';
import type { ReactNode } from 'react';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { ContactForm } from '@/components/forms/ContactForm';
import { MapFacade } from '@/components/contact/MapFacade';
import { Pending, Placeholder, richTags } from '@/components/primitives/Pending';
import { JsonLd } from '@/components/seo/JsonLd';
import { contactPageSchema } from '@/components/seo/schemas';
import { IconDirections, IconEmail, IconPhone, IconWhatsApp } from '@/components/icons';
import { mailHref, mapsDirectionsHref, site, telHref } from '@/data/site';
import { waHref } from '@/lib/whatsapp';
import { pageMetadata } from '@/lib/seo';
import { cn } from '@/lib/cn';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta.contact' });
  return pageMetadata({ locale, path: '/contact', title: t('title'), description: t('description') });
}

function ChannelCard({
  href,
  tone,
  icon,
  title,
  children,
  track,
  external,
}: {
  href: string;
  tone: 'yellow' | 'blue' | 'white' | 'red';
  icon: ReactNode;
  title: string;
  children: ReactNode;
  track?: string;
  external?: boolean;
}) {
  const toneCls = {
    yellow: 'on-yellow bg-yellow text-blue',
    blue: 'on-blue bg-blue text-white',
    white: 'on-light bg-white text-blue',
    red: 'on-red bg-red text-white',
  }[tone];
  return (
    <a
      href={href}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      {...(track ? { 'data-track': track, 'data-track-location': 'contact' } : {})}
      className={cn('flex min-h-56 press flex-col rounded-tile border-2 border-blue p-6 press-md', toneCls)}
    >
      <span className="grid size-12 place-items-center rounded-full border-2 border-current">{icon}</span>
      <span className="mt-auto pt-8 type-h3">{title}</span>
      <span className="mt-2 block">{children}</span>
    </a>
  );
}

/** Contact (§7.10). */
export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('contact');
  const tf = await getTranslations('footer');
  const tn = await getTranslations('nav');
  return (
    <>
      <JsonLd data={contactPageSchema(locale)} />
      <section className="on-light bg-white pt-8 pb-16 text-blue md:pt-12 lg:pb-24">
        <div className="shell">
          <Breadcrumbs items={[{ name: tn('contact'), path: '/contact' }]} className="mb-6" />
          <h1 className="max-w-[14ch] type-display">{t('h1')}</h1>
          <p className="mt-5 max-w-[52ch] type-body-l">{t('sub')}</p>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <ChannelCard
              href={telHref(site.phones.landline.e164)}
              tone="yellow"
              icon={<IconPhone size={24} />}
              title={t('call')}
              track="call_click"
            >
              <bdi dir="ltr" className="block text-lg font-bold">
                {site.phones.landline.display}
              </bdi>
              <span className="type-small">
                {t('mobile', { phone: '' })}
                <bdi dir="ltr">{site.phones.mobile.display}</bdi>
              </span>
            </ChannelCard>
            <ChannelCard
              href={waHref()}
              tone="blue"
              icon={<IconWhatsApp size={24} />}
              title={t('whatsapp')}
              track="whatsapp_click"
              external
            >
              <Placeholder note="WhatsApp number">
                <bdi dir="ltr" className="block text-lg font-bold">
                  {site.phones.mobile.display}
                </bdi>
              </Placeholder>
              <span className="type-small">
                <Placeholder note={t('whatsappNote')}>{t('whatsappLine')}</Placeholder>
              </span>
            </ChannelCard>
            <ChannelCard
              href={mailHref()}
              tone="white"
              icon={<IconEmail size={24} />}
              title={t('email')}
              track="email_click"
            >
              <span className="block text-lg font-bold break-all">{site.email}</span>
            </ChannelCard>
            <ChannelCard
              href={mapsDirectionsHref()}
              tone="red"
              icon={<IconDirections size={24} />}
              title={t('visit')}
              external
            >
              <span className="block font-bold">{t('location')}</span>
              {site.address.street ? (
                <span className="type-small">{site.address.street}</span>
              ) : (
                <span className="mt-1 block">
                  <Pending note={tf('street')} />
                </span>
              )}
              {!site.hours && (
                <span className="mt-1 block type-small">{tf.rich('hoursTemp', richTags())}</span>
              )}
              <span className="mt-2 inline-block type-small font-semibold underline underline-offset-2">
                {t('directions')}
              </span>
            </ChannelCard>
          </div>
        </div>
      </section>

      <section className="on-light relative overflow-hidden bg-foil section-pad text-blue">
        <div className="shell grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <div className="rounded-tile border-2 border-blue bg-white p-5 sm:p-8">
              <h2 className="mb-6 type-h2">{t('formH2')}</h2>
              <ContactForm
                turnstileSiteKey={process.env.TURNSTILE_SITE_KEY || undefined}
                responseTimeHours={site.responseTimeHours}
              />
            </div>
          </div>
          <div className="lg:col-span-5">
            <h2 className="mb-5 type-h3">{t('mapH2')}</h2>
            <MapFacade />
            {/* Same hand-off as the home page: hops out scrolling down, lands back scrolling up */}
            <MascotJumpOut className="mx-auto mt-12 w-40 lg:mt-16 lg:w-56">
              <Crinkle pose="hard-hat" />
            </MascotJumpOut>
          </div>
        </div>
      </section>
    </>
  );
}
