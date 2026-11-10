import { getTranslations } from 'next-intl/server';
import { Crinkle } from '@/components/brand/Crinkle';
import { Button } from '@/components/primitives/Button';
import { HazardTape } from '@/components/primitives/Motifs';
import { RoughMark } from '@/components/primitives/RoughMark';
import { OpenSearchButton } from '@/components/layout/OpenSearchButton';
import { ScribbleRed } from '@/components/illustrations/objects';

/** 404 (§7.13): Yellow, centred, Crinkle flattened back into a sheet, hazard tape. */
export default async function NotFound() {
  const t = await getTranslations('notFound');
  const tc = await getTranslations('common');
  const tm = await getTranslations('meta.notFound');
  const tk = await getTranslations('crinkle');
  return (
    <>
      <title>{tm('title')}</title>
      <meta name="robots" content="noindex" />
      <HazardTape />
      <section className="on-yellow grain relative overflow-hidden bg-yellow pt-16 pb-24 text-center text-blue">
        <ScribbleRed className="pointer-events-none absolute -end-10 top-10 w-72 rotate-12 opacity-50" />
        <div className="shell relative z-[2]">
          <div className="mx-auto w-64 sm:w-80">
            <Crinkle pose="flattened" track label={tk('label')} />
          </div>
          <h1 className="type-display mx-auto mt-10 max-w-[14ch]">{t('h1')}</h1>
          <p className="mx-auto mt-6 max-w-[46ch] type-body-l">
            {t.rich('body', {
              mark: (chunks) => (
                <RoughMark type="circle" padding={6} delay={300}>
                  {chunks}
                </RoughMark>
              ),
            })}
          </p>
          <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
            <Button href="/" size="lg" raised>
              {t('home')}
            </Button>
            <Button href="/products" variant="secondary" size="lg">
              {tc('browseProducts')}
            </Button>
            <OpenSearchButton>{t('search')}</OpenSearchButton>
          </div>
        </div>
      </section>
    </>
  );
}
