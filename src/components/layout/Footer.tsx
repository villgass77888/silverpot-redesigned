import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { Logo, LOGO_PEEK, LOGO_PLAQUE_TOP } from '../brand/Logo';
import { FooterPeek } from '../brand/MascotHandoff';
import { FooterColumn } from './FooterColumn';
import { LanguageToggle } from './LanguageToggle';
import { Pending, Placeholder, richTags } from '../primitives/Pending';
import {
  IconEmail,
  IconFacebook,
  IconInstagram,
  IconPhone,
  IconPinterest,
  IconWhatsApp,
  IconYoutube,
  IconPin,
} from '../icons';
import { mailHref, site, telHref } from '@/data/site';
import { waHref } from '@/lib/whatsapp';
import { SHOW_UNCONFIRMED } from '@/lib/review-mode';

const SOCIAL_ICONS = {
  instagram: IconInstagram,
  facebook: IconFacebook,
  pinterest: IconPinterest,
  youtube: IconYoutube,
} as const;
const SOCIAL_NAMES = {
  instagram: 'Instagram',
  facebook: 'Facebook',
  pinterest: 'Pinterest',
  youtube: 'YouTube',
} as const;

export async function Footer() {
  const t = await getTranslations('footer');
  const nav = await getTranslations('nav');
  const year = new Date().getFullYear();
  const socials = (Object.keys(site.socials) as (keyof typeof site.socials)[]).filter((k) => site.socials[k]);
  const showFollow = socials.length > 0 || SHOW_UNCONFIRMED;
  const link = 'inline-flex min-h-11 items-center underline-offset-4 hover:underline';

  return (
    <footer className="on-light bg-white text-blue cv-auto">
      <div className="shell grid gap-x-8 border-t-2 border-blue pt-10 pb-6 md:grid-cols-2 md:gap-y-8 md:pt-16 lg:grid-cols-4">
        <FooterColumn title={t('products')}>
          <ul>
            <li>
              <Link className={link} href="/products/containers">
                {t('containers')}
              </Link>
            </li>
            <li>
              <Link className={link} href="/products/platters">
                {t('platters')}
              </Link>
            </li>
            <li>
              <Link className={link} href="/products/foil">
                {t('foil')}
              </Link>
            </li>
            <li>
              <Link className={link} href="/products">
                {t('allProducts')}
              </Link>
            </li>
            <li>
              <Link className={link} href="/size-finder">
                {t('sizeFinder')}
              </Link>
            </li>
          </ul>
        </FooterColumn>
        <FooterColumn title={t('company')}>
          <ul>
            <li>
              <Link className={link} href="/about">
                {nav('about')}
              </Link>
            </li>
            <li>
              <Link className={link} href="/wholesale">
                {nav('wholesale')}
              </Link>
            </li>
            <li>
              <Link className={link} href="/sustainability">
                {nav('sustainability')}
              </Link>
            </li>
            <li>
              <Link className={link} href="/faq">
                {nav('faq')}
              </Link>
            </li>
            <li>
              <Link className={link} href="/contact">
                {nav('contact')}
              </Link>
            </li>
          </ul>
        </FooterColumn>
        <FooterColumn title={t('contact')}>
          <ul className="space-y-0.5">
            <li>
              <a
                className={`${link} gap-2`}
                href={telHref(site.phones.landline.e164)}
                data-track="call_click"
                data-track-location="footer"
              >
                <IconPhone size={18} />
                <bdi dir="ltr">{site.phones.landline.display}</bdi>
              </a>
            </li>
            <li>
              <a
                className={`${link} gap-2`}
                href={waHref()}
                target="_blank"
                rel="noopener noreferrer"
                data-track="whatsapp_click"
                data-track-location="footer"
              >
                <IconWhatsApp size={18} />
                <span>
                  <Placeholder note="WhatsApp number">
                    <bdi dir="ltr">{site.phones.mobile.display}</bdi>
                  </Placeholder>{' '}
                  {t('whatsappSuffix')}
                </span>
              </a>
            </li>
            <li>
              <a
                className={`${link} gap-2`}
                href={mailHref()}
                data-track="email_click"
                data-track-location="footer"
              >
                <IconEmail size={18} />
                {site.email}
              </a>
            </li>
            <li className="flex min-h-11 items-start gap-2 pt-2.5">
              <IconPin size={18} className="mt-0.5 shrink-0" />
              <span>
                {t('location')}
                {site.address.street ? (
                  <span className="block">{site.address.street}</span>
                ) : (
                  <span className="mt-1 block">
                    <Pending note={t('street')} />
                  </span>
                )}
                {!site.hours && <span className="mt-1 block">{t.rich('hoursTemp', richTags())}</span>}
              </span>
            </li>
          </ul>
        </FooterColumn>
        {showFollow && (
          <FooterColumn title={t('follow')}>
            <ul className="flex flex-wrap gap-2 pt-1">
              {(Object.keys(site.socials) as (keyof typeof site.socials)[]).map((k) => {
                const url = site.socials[k];
                const Icon = SOCIAL_ICONS[k];
                if (url)
                  return (
                    <li key={k}>
                      <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="grid size-12 press place-items-center rounded-full border-2 border-blue bg-white"
                        aria-label={SOCIAL_NAMES[k]}
                      >
                        <Icon size={22} />
                      </a>
                    </li>
                  );
                return (
                  <li key={k} className="w-full">
                    <Pending note={t('social', { network: SOCIAL_NAMES[k] })} />
                  </li>
                );
              })}
            </ul>
          </FooterColumn>
        )}
      </div>

      {/* The logo badge, Aloom peeking over the plaque's top edge beside the stars.
          The badge is wider on phones (and he's drawn larger, --peek) so he reads. */}
      <div
        className="relative shell overflow-x-clip pt-10 pb-8 [--peek:0.2] md:pt-12 md:[--peek:0.16]"
        aria-hidden
      >
        <div className="relative mx-auto w-[86%] max-w-[560px] md:w-[56%]">
          <Logo symbol decorative className="h-auto w-full" />
          <FooterPeek
            style={{
              left: `calc(${LOGO_PEEK.x * 100}% - 50% * var(--peek))`,
              width: `calc(100% * var(--peek))`,
              bottom: `${(1 - LOGO_PLAQUE_TOP) * 100}%`,
              marginBottom: '-0.4%',
            }}
          />
        </div>
      </div>

      <div className="on-blue bg-blue text-white">
        <div className="shell flex flex-col gap-3 py-5 type-small md:flex-row md:items-center md:justify-between">
          <p>
            {t('copyright', { year })} {t.rich('tradingName', richTags())}
          </p>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-1">
            <Link className={link} href="/privacy">
              {t('privacy')}
            </Link>
            <Link className={link} href="/terms">
              {t('terms')}
            </Link>
            <LanguageToggle tone="dark" />
          </div>
        </div>
      </div>
    </footer>
  );
}
