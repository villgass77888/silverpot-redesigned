import { Button } from '../primitives/Button';
import { waHref } from '@/lib/whatsapp';

/** Catalogue footer band (§7.2): "Can't find your size? Tell us what you need." */
export function FooterBand({ label, cta }: { label: string; cta: string }) {
  return (
    <section className="on-blue grain bg-blue py-14 text-white">
      <div className="relative z-[2] shell flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
        <p className="max-w-[24ch] type-h3 text-yellow">{label}</p>
        <Button
          href={waHref()}
          variant="yellow"
          size="lg"
          raised
          track="whatsapp_click"
          trackLocation="catalogue-band"
        >
          {cta}
        </Button>
      </div>
    </section>
  );
}
