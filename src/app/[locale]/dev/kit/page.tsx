import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { Button } from '@/components/primitives/Button';
import { Chip, StaticChip } from '@/components/primitives/Chip';
import { Sticker } from '@/components/primitives/Sticker';
import { RimFrame } from '@/components/primitives/RimFrame';
import { DataPlate } from '@/components/primitives/DataPlate';
import { HandNote } from '@/components/primitives/HandNote';
import { CartonLabel, HazardTape, Stamp } from '@/components/primitives/Motifs';
import { Odometer } from '@/components/primitives/Odometer';
import { Section, type Tone } from '@/components/primitives/Section';
import { Pending } from '@/components/primitives/Pending';
import { Logo, LogoStar } from '@/components/brand/Logo';
import { Crinkle, type CrinklePose } from '@/components/brand/Crinkle';
import * as Objects from '@/components/illustrations/objects';
import { PROCESS_FRAMES } from '@/components/illustrations/process';
import {
  SEGMENT_ICONS,
  FactoryIcon,
  PalletIcon,
  PeopleIcon,
  TruckIcon,
} from '@/components/illustrations/segments';
import { Arrow, type ArrowKind } from '@/components/illustrations/arrows';
import { ProductCard } from '@/components/catalogue/ProductCard';
import { products } from '@/data/products';
import { toCard } from '@/lib/catalog';
import { REVIEW_MODE } from '@/lib/review-mode';

export const metadata: Metadata = {
  title: { absolute: 'Kit | Silverpot' },
  robots: { index: false, follow: false },
};

const POSES: CrinklePose[] = [
  'perched',
  'wave',
  'deadpan',
  'hard-hat',
  'clipboard',
  'sleeping',
  'peek',
  'flattened',
  'thumbs-up',
];
const ARROWS: ArrowKind[] = [
  'curve-down-left',
  'curve-down-right',
  'curve-up-left',
  'curve-up-right',
  'loop',
  'swoosh',
];
const SWATCHES = [
  ['Signal Yellow', '#FFD21F', 'bg-yellow'],
  ['Blueprint Blue', '#0E2A8C', 'bg-blue'],
  ['Oven Red', '#B8322A', 'bg-red'],
  ['White', '#FFFFFF', 'bg-white'],
  ['Foil Grey', '#E9ECF1', 'bg-foil'],
  ['Black', '#000000', 'bg-black'],
];

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="border-t-2 border-blue py-10">
      <h2 className="mb-6 type-h3">{title}</h2>
      {children}
    </section>
  );
}

/** /dev/kit — every primitive in every state (Phase 1 exit check). Dev + review mode only. */
export default async function KitPage({ params }: { params: Promise<{ locale: string }> }) {
  if (process.env.NODE_ENV === 'production' && !REVIEW_MODE) notFound();
  const { locale } = await params;
  setRequestLocale(locale);
  const card = toCard(products[0], locale);
  const comingSoon = toCard(
    products.find((p) => p.images.length === 0)!,
    locale,
  );
  const objects = Object.entries(Objects).filter(
    ([k]) => !['ScribbleRed', 'CompIcon', 'SpiralMark'].includes(k),
  ) as [string, (p: object) => React.ReactElement][];

  return (
    <div className="shell py-12 text-blue">
      <h1 className="type-display">Kit.</h1>
      <p className="mt-3 type-body-l">Every primitive, every state. Not in the sitemap or production.</p>

      <Block title="Colour">
        <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {SWATCHES.map(([name, hex, cls]) => (
            <li key={hex} className="rim overflow-hidden">
              <div className={`h-24 ${cls}`} />
              <p className="px-3 py-2 type-small">
                {name} <span className="tabular">{hex}</span>
              </p>
            </li>
          ))}
        </ul>
      </Block>

      <Block title="Type">
        <div className="space-y-4">
          <p className="type-code-xl">8325</p>
          <p className="type-display">Display headline</p>
          <p className="type-h2">Heading two</p>
          <p className="type-h3">Heading three</p>
          <p className="type-h4">Heading four</p>
          <p className="type-body-l">Body large. Pressed in Ajman since 1997.</p>
          <p className="type-body">Body. Lids on. Drama off.</p>
          <p className="type-small">Small. 26 products in 3 families.</p>
          <p className="type-code-s">83120E</p>
          <p className="type-hand">a handwritten note</p>
        </div>
      </Block>

      <Block title="Buttons">
        <div className="flex flex-wrap items-center gap-4">
          {(['primary', 'secondary', 'yellow', 'blue', 'whatsapp', 'ghost'] as const).map((v) => (
            <Button key={v} variant={v}>
              {v}
            </Button>
          ))}
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-4">
          <Button size="sm">Small</Button>
          <Button size="md">Medium</Button>
          <Button size="lg" raised>
            Large raised
          </Button>
          <Button disabled>Disabled</Button>
          <Button loading>Loading</Button>
        </div>
      </Block>

      <Block title="Chips">
        <div className="flex flex-wrap gap-3">
          <Chip>Default</Chip>
          <Chip selected>Selected</Chip>
          <Chip count={13}>With count</Chip>
          <Chip size="lg">Large</Chip>
          <StaticChip>Static (no shadow)</StaticChip>
        </div>
      </Block>

      <Block title="Stickers">
        <div className="flex flex-wrap items-center gap-6">
          {(['yellow', 'red', 'blue', 'white'] as const).map((tone, i) => (
            <Sticker key={tone} tone={tone} rotate={[-6, 4, -3, 6][i]}>
              {tone}
            </Sticker>
          ))}
          <Sticker shape="circle" tone="yellow" hand rotate={-4} className="size-24">
            13 models
          </Sticker>
          <Sticker shape="burst" tone="red" hand>
            New
          </Sticker>
          <Sticker shape="ticket" tone="blue" rotate={3}>
            Photo coming soon
          </Sticker>
        </div>
      </Block>

      <Block title="RimFrame · DataPlate · Carton label">
        <div className="grid gap-6 md:grid-cols-3">
          <RimFrame className="aspect-square" />
          <DataPlate
            rows={[
              { label: 'Model code', value: '8325', confirmed: true },
              { label: 'Lid', value: 'Included', confirmed: true },
              { label: 'Capacity', value: null, confirmed: false, note: 'Capacity (ml)' },
            ]}
            collapseUnconfirmed
            collapsedLabel="More specs on request"
          />
          <div className="flex items-start gap-4">
            <CartonLabel code="8325" />
            <CartonLabel code="83120E" />
          </div>
        </div>
      </Block>

      <Block title="Hand notes and arrows">
        <div className="flex flex-wrap items-end gap-8">
          {ARROWS.map((a) => (
            <HandNote key={a} arrow={a} drawClass="">
              {a}
            </HandNote>
          ))}
        </div>
        <div className="mt-6 flex gap-6">
          {ARROWS.map((a) => (
            <Arrow key={a} kind={a} className="w-16" />
          ))}
        </div>
      </Block>

      <Block title="Stamp · Odometer · Hazard tape · Foil spiral">
        <div className="flex flex-wrap items-center gap-10">
          <Stamp text="MADE IN AJMAN · SINCE 1997 ·" className="w-44 rotate-[8deg]" />
          <Odometer value="1997" className="font-display text-7xl font-black tabular" />
          <LogoStar className="size-16" spin />
        </div>
        <div className="mt-8">
          <HazardTape />
        </div>
      </Block>

      <Block title="Sections (tone contexts)">
        <div className="grid gap-4 md:grid-cols-5">
          {(['white', 'foil', 'yellow', 'blue', 'red'] as Tone[]).map((tone) => (
            <Section
              key={tone}
              tone={tone}
              grain={tone !== 'white' && tone !== 'foil'}
              pad={false}
              className="rounded-tile border-2 border-blue p-5"
            >
              <p className="relative z-[2] type-h4">{tone}</p>
              <Button
                size="sm"
                variant={tone === 'yellow' ? 'secondary' : 'yellow'}
                className="relative z-[2] mt-4"
              >
                Press
              </Button>
            </Section>
          ))}
        </div>
      </Block>

      <Block title="Review mode">
        <p>
          Confirmed sentence. <Pending note="Example">An unconfirmed claim.</Pending>{' '}
          <Pending note="Empty slot" />
        </p>
        {!REVIEW_MODE && (
          <p className="mt-2 type-small">(Review mode is off, so nothing above is highlighted.)</p>
        )}
      </Block>

      <Block title="Logo">
        <Logo className="h-auto w-full max-w-md" />
        <Logo sticker decorative className="mt-6 h-16 w-auto" />
      </Block>

      <Block title="Aloom (9 poses)">
        <ul className="grid grid-cols-3 gap-6 sm:grid-cols-5 lg:grid-cols-9">
          {POSES.map((p) => (
            <li key={p} className="text-center">
              <div className="mx-auto w-24">
                <Crinkle pose={p} />
              </div>
              <p className="mt-2 type-small">{p}</p>
            </li>
          ))}
        </ul>
      </Block>

      <Block title="Illustrations">
        <ul className="grid grid-cols-2 gap-6 sm:grid-cols-4 lg:grid-cols-6">
          {[
            ...objects,
            ['Factory', FactoryIcon],
            ['Truck', TruckIcon],
            ['Pallet', PalletIcon],
            ['People', PeopleIcon],
          ].map(([name, C]) => {
            const Comp = C as (p: object) => React.ReactElement;
            return (
              <li key={name as string} className="rim bg-white p-4">
                <Comp />
                <p className="mt-2 type-small">{name as string}</p>
              </li>
            );
          })}
          {PROCESS_FRAMES.map((F, i) => (
            <li key={i} className="rim bg-white p-4">
              <F />
              <p className="mt-2 type-small">Process {i + 1}</p>
            </li>
          ))}
          {Object.entries(SEGMENT_ICONS).map(([id, Icon]) => (
            <li key={id} className="rim bg-white p-4">
              <Icon />
              <p className="mt-2 type-small">{id}</p>
            </li>
          ))}
        </ul>
      </Block>

      <Block title="Product cards">
        <ul className="grid grid-cols-2 gap-6 md:grid-cols-4">
          <li>
            <ProductCard product={card} />
          </li>
          <li>
            <ProductCard product={comingSoon} />
          </li>
          <li className="max-w-[200px]">
            <ProductCard product={card} />
          </li>
        </ul>
      </Block>
    </div>
  );
}
