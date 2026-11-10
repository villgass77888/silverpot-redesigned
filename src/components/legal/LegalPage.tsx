import { useTranslations } from 'next-intl';
import type { LegalDoc } from '@/content/legal';
import { REVIEW_MODE } from '@/lib/review-mode';

/** Plain, readable legal layout (§7.14): White, max 70ch, review-mode draft banner. */
export function LegalPage({ doc, breadcrumbs }: { doc: LegalDoc; breadcrumbs: React.ReactNode }) {
  const t = useTranslations('review');
  return (
    <section className="on-light bg-white pt-8 pb-24 text-blue md:pt-12">
      <div className="shell">
        {breadcrumbs}
        {REVIEW_MODE && (
          <p className="review-mark mb-8 inline-block px-3 py-2 font-semibold" role="note">
            {t('legalDraft')}
          </p>
        )}
        <article className="max-w-[70ch]">
          <h1 className="type-h2">{doc.title}</h1>
          <p className="mt-3 type-small text-blue/80">
            <time dateTime={doc.updated}>{doc.updated}</time>
          </p>
          <p className="mt-6 type-body-l">{doc.intro}</p>
          {doc.sections.map((s) => (
            <section key={s.h} className="mt-10">
              <h2 className="type-h3">{s.h}</h2>
              {s.p.map((p) => (
                <p key={p.slice(0, 24)} className="mt-3 type-body">
                  {p}
                </p>
              ))}
            </section>
          ))}
        </article>
      </div>
    </section>
  );
}
