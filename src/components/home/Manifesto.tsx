import { useTranslations } from 'next-intl';
import { RoughMark } from '../primitives/RoughMark';

/** H3 Manifesto (§7.1): the quiet paragraph between loud blocks. Centred, 34rem. */
export function Manifesto() {
  const t = useTranslations('home.manifesto');
  return (
    <section className="on-light bg-white py-24 text-blue">
      <div className="shell">
        <div className="mx-auto max-w-[34rem] text-center type-body-l">
          <p>
            {t.rich('p1', {
              b: (chunks) => (
                <RoughMark>
                  <strong className="font-bold">{chunks}</strong>
                </RoughMark>
              ),
            })}
          </p>
          <p className="mt-5">{t('p2')}</p>
        </div>
      </div>
    </section>
  );
}
