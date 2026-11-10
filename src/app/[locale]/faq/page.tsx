import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { FaqBrowser } from '@/components/faq/FaqBrowser';
import { Button } from '@/components/primitives/Button';
import { JsonLd } from '@/components/seo/JsonLd';
import { faqSchema } from '@/components/seo/schemas';
import { faqGroups, faqs, mainFaqIds } from '@/data/faq';
import { faqEntries, faqSchemaItems } from '@/lib/faq';
import { tx } from '@/lib/l10n';
import { site, telHref } from '@/data/site';
import { waHref } from '@/lib/whatsapp';
import { pageMetadata } from '@/lib/seo';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta.faq' });
  return pageMetadata({ locale, path: '/faq', title: t('title'), description: t('description') });
}

/** FAQ (§7.9). Production renders only general/confirmed answers; JSON-LD covers exactly those. */
export default async function FaqPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('faqPage');
  const tc = await getTranslations('common');
  const tn = await getTranslations('nav');
  const groups = faqGroups.map((g) => ({
    id: g.id,
    title: tx(g.title, locale),
    items: faqEntries(
      faqs.filter((f) => f.group === g.id && mainFaqIds.includes(f.id)).map((f) => f.id),
      locale,
    ),
  }));
  const schemaItems = faqSchemaItems(mainFaqIds);

  return (
    <>
      <JsonLd data={faqSchema(locale, schemaItems)} />
      <section className="on-yellow grain border-b-2 border-blue bg-yellow text-blue">
        <div className="relative z-[2] shell pt-12 pb-12 md:pt-16 lg:pb-16">
          <Breadcrumbs items={[{ name: tn('faq'), path: '/faq' }]} className="mb-6" />
          <h1 className="type-display">{t('h1')}</h1>
        </div>
      </section>
      <section className="on-light bg-white pt-10 pb-20 text-blue">
        <div className="shell">
          <FaqBrowser groups={groups.filter((g) => g.items.length)} />
        </div>
      </section>
      <section className="on-blue grain bg-blue py-14 text-white">
        <div className="relative z-[2] shell flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <h2 className="max-w-[16ch] type-h2 text-yellow">{t('stuckH2')}</h2>
          <div className="flex flex-wrap gap-3">
            <Button
              href={waHref()}
              variant="yellow"
              size="lg"
              raised
              track="whatsapp_click"
              trackLocation="faq"
            >
              {tc('chatWhatsApp')}
            </Button>
            <Button
              href={telHref(site.phones.landline.e164)}
              variant="secondary"
              size="lg"
              track="call_click"
              trackLocation="faq"
            >
              {tc('callUs')}
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
