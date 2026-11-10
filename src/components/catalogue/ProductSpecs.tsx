import { getLocale, getTranslations } from 'next-intl/server';
import type { Product } from '@/data/types';
import { categoryBySlug } from '@/data/categories';
import { DataPlate, type PlateRow } from '../primitives/DataPlate';
import { Button } from '../primitives/Button';
import { tx } from '@/lib/l10n';
import { waHref } from '@/lib/whatsapp';
import { SHOW_UNCONFIRMED } from '@/lib/review-mode';

/**
 * Spec plate rows (§7.4), in spec order, only the rows relevant to the family.
 * Values are straight-faced. Unconfirmed → hidden in production, highlighted in review.
 */
export async function ProductSpecs({ product: p }: { product: Product }) {
  const t = await getTranslations('product');
  const locale = await getLocale();
  const s = p.specs;
  const yesNo = (v: boolean | null) => (v === null ? null : v ? t('yes') : t('no'));
  const mm = (n: number | null) => (n === null ? null : t('mm', { n }));
  const rows: (PlateRow & { show: boolean })[] = [
    {
      show: !!p.modelCode,
      label: t('modelCode'),
      value: <bdi dir="ltr">{p.modelCode}</bdi>,
      confirmed: true,
    },
    {
      show: true,
      label: t('family'),
      value: (
        <span className="font-sans text-base font-semibold">
          {tx(categoryBySlug.get(p.category)!.shortName, locale)}
        </span>
      ),
      confirmed: true,
    },
    {
      show: p.category === 'containers',
      label: t('compartments'),
      value: s.compartments.value,
      confirmed: s.compartments.confirmed,
      note: s.compartments.note,
      placeholder: s.compartments.placeholder,
    },
    {
      show: p.category !== 'foil',
      label: t('lid'),
      value: s.lidIncluded.value ? (
        <span className="font-sans text-base font-semibold">{t('lidIncluded')}</span>
      ) : null,
      confirmed: s.lidIncluded.confirmed,
      note: s.lidIncluded.note,
    },
    {
      show: p.category !== 'foil',
      label: t('capacity'),
      value: s.capacityMl.value ? t('ml', { n: s.capacityMl.value }) : null,
      confirmed: s.capacityMl.confirmed,
      note: s.capacityMl.note,
    },
    {
      show: p.category !== 'foil',
      label: t('topDims'),
      value: s.topDimensionsMm.value
        ? `${s.topDimensionsMm.value.length} × ${s.topDimensionsMm.value.width} mm`
        : null,
      confirmed: s.topDimensionsMm.confirmed,
      note: s.topDimensionsMm.note,
    },
    {
      show: p.category !== 'foil',
      label: t('depth'),
      value: mm(s.depthMm.value),
      confirmed: s.depthMm.confirmed,
      note: s.depthMm.note,
    },
    {
      show: p.category === 'foil',
      label: t('rollWidth'),
      value: s.rollWidthCm.value ? <bdi dir="ltr">{t('cm', { n: s.rollWidthCm.value })}</bdi> : null,
      confirmed: s.rollWidthCm.confirmed,
    },
    {
      show: p.category === 'foil',
      label: t('rollLength'),
      value: s.rollLengths.value ? (
        <bdi dir="ltr">
          {s.rollLengths.value
            .map((l) => (l.unit === 'm' ? t('m', { n: l.value }) : t('sqft', { n: l.value })))
            .join(' / ')}
        </bdi>
      ) : null,
      confirmed: s.rollLengths.confirmed,
      placeholder: s.rollLengths.placeholder,
    },
    {
      show: true,
      label: t('piecesPerPack'),
      value: s.piecesPerPack.value,
      confirmed: s.piecesPerPack.confirmed,
      note: s.piecesPerPack.note,
    },
    {
      show: true,
      label: t('packsPerCarton'),
      value: s.packsPerCarton.value,
      confirmed: s.packsPerCarton.confirmed,
      note: s.packsPerCarton.note,
    },
    {
      show: true,
      label: t('piecesPerCarton'),
      value: s.piecesPerCarton.value,
      confirmed: s.piecesPerCarton.confirmed,
      note: s.piecesPerCarton.note,
    },
    {
      show: p.category !== 'foil',
      label: t('ovenSafe'),
      value: yesNo(s.ovenSafe.value),
      confirmed: s.ovenSafe.confirmed,
      note: s.ovenSafe.note,
    },
    {
      show: p.category !== 'foil',
      label: t('freezerSafe'),
      value: yesNo(s.freezerSafe.value),
      confirmed: s.freezerSafe.confirmed,
      note: s.freezerSafe.note,
    },
    {
      show: p.category !== 'foil' && s.microwaveSafe.value !== null,
      label: t('microwave'),
      value: (
        <span className="font-sans text-base font-semibold">
          {s.microwaveSafe.value ? t('yes') : t('notRecommended')}
        </span>
      ),
      confirmed: s.microwaveSafe.confirmed,
      note: s.microwaveSafe.note,
      placeholder: s.microwaveSafe.placeholder,
    },
    {
      show: true,
      label: t('material'),
      value: <span className="font-sans text-base font-semibold">{t('aluminium')}</span>,
      confirmed: s.material.confirmed,
    },
  ];
  const visible = rows.filter((r) => r.show);
  const hidden = visible.filter((r) => !r.confirmed && !r.placeholder).length;
  const collapsed = hidden > visible.length / 2;
  const askLabel = p.modelCode ?? tx(p.shortName, locale);

  return (
    <section aria-labelledby="specs-heading">
      <h2 id="specs-heading" className="sr-only">
        {t('specs')}
      </h2>
      <DataPlate
        rows={visible}
        collapseUnconfirmed
        collapsedLabel={t('moreSpecs')}
        footer={
          (collapsed || SHOW_UNCONFIRMED) && (
            <Button
              href={waHref(t('askSpecsMsg', { code: askLabel }))}
              variant="whatsapp"
              size="sm"
              track="whatsapp_click"
              trackLocation="pdp-specs"
            >
              {t('askAbout', { code: askLabel })}
            </Button>
          )
        }
      />
    </section>
  );
}
