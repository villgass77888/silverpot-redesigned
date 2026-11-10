import type { SegmentId } from '@/data/segments';
import { Ill, type IllProps } from './Ill';

/* Segment icons (§3.8): "Who we pack for". viewBox 0 0 120 120. */

function Restaurant(p: IllProps) {
  return (
    <Ill
      viewBox="0 0 120 120"
      {...p}
      shapes={[
        ['M18 82C18 42 102 42 102 82Z', 'foil'],
        ['M8 82H112V90H8Z', 'c'],
        ['M54 40a6 6 0 1 0 12 0a6 6 0 1 0 -12 0Z', 'a'],
      ]}
      thin={['M34 70q4-14 18-20', 'M60 100V112M44 112H76']}
    />
  );
}

function CloudKitchen(p: IllProps) {
  return (
    <Ill
      viewBox="0 0 120 120"
      {...p}
      shapes={[
        ['M28 46c-12 0-12-16 0-16c2-12 20-14 26-4c6-10 26-6 24 8c12 0 12 12 0 12Z', 'c'],
        ['M30 62H86V108H30Z', 'b'],
        ['M86 62L100 52V96L86 108Z', 'a'],
        ['M30 62L44 52H100L86 62Z', 'foil'],
      ]}
      thin={['M50 84a8 8 0 1 0 16 0a8 8 0 1 0 -16 0', 'M6 80H20M10 92H24']}
    />
  );
}

function Caterer(p: IllProps) {
  return (
    <Ill
      viewBox="0 0 120 120"
      {...p}
      shapes={[
        ['M8 78C8 60 112 60 112 78C112 96 8 96 8 78Z', 'foil'],
        ['M24 74C30 54 54 54 58 72Z', 'a'],
        ['M56 74C62 50 92 52 96 74Z', 'b'],
      ]}
      thin={['M34 40q4-6 0-12M60 36q4-6 0-12M86 40q4-6 0-12', 'M20 80C30 88 90 88 100 80']}
    />
  );
}

function Hotel(p: IllProps) {
  return (
    <Ill
      viewBox="0 0 120 120"
      {...p}
      shapes={[
        ['M24 84C24 46 96 46 96 84Z', 'a'],
        ['M14 84H106V94H14Z', 'foil'],
        ['M54 38H66V46H54Z', 'c'],
      ]}
      thin={['M40 66q6-10 16-12', 'M60 30V38', 'M24 30l8 6M96 30l-8 6']}
    />
  );
}

function Bakery(p: IllProps) {
  return (
    <Ill
      viewBox="0 0 120 120"
      {...p}
      shapes={[
        ['M10 76C10 56 110 56 110 76C110 96 10 96 10 76Z', 'foil'],
        ['M24 72C24 60 96 60 96 72C96 84 24 84 24 72Z', 'a'],
        ['M76 46L102 28L108 42Z', 'a'],
      ]}
      thin={['M36 70q4 3 8 0t8 0t8 0t8 0t8 0', 'M80 60q4-6 2-12M88 60q6-8 6-16']}
    />
  );
}

function Distributor(p: IllProps) {
  return (
    <Ill
      viewBox="0 0 120 120"
      {...p}
      shapes={[
        ['M18 54H58V92H18Z', 'a'],
        ['M62 54H102V92H62Z', 'c'],
        ['M40 18H80V54H40Z', 'b'],
        ['M10 92H110V102H10Z', 'foil'],
      ]}
      thin={['M38 54V66M82 54V66M60 18V30', 'M20 102V108M60 102V108M100 102V108']}
    />
  );
}

function Home(p: IllProps) {
  return (
    <Ill
      viewBox="0 0 120 120"
      {...p}
      shapes={[
        ['M18 58L60 22L102 58V104H18Z', 'c'],
        ['M48 76H72V104H48Z', 'a'],
        ['M26 50H58A6 12 0 0 1 58 74H26Z', 'foil'],
      ]}
      thin={['M26 50A6 12 0 0 0 26 74', 'M80 70H94V84H80Z']}
    />
  );
}

export const SEGMENT_ICONS: Record<SegmentId, (p: IllProps) => React.ReactElement> = {
  restaurants: Restaurant,
  'cloud-kitchens': CloudKitchen,
  caterers: Caterer,
  hotels: Hotel,
  bakeries: Bakery,
  distributors: Distributor,
  home: Home,
};

/* "Why order from the factory?" icons. */
export function FactoryIcon(p: IllProps) {
  return (
    <Ill
      viewBox="0 0 120 100"
      {...p}
      shapes={[
        ['M10 90V50L36 64V50L62 64V50L88 64V30H104V90Z', 'foil'],
        ['M88 30H104V18H88Z', 'b'],
      ]}
      thin={['M22 76H34M48 76H60M74 76H86', 'M92 12q4-6 0-12M100 12q4-6 0-12']}
    />
  );
}
export function TruckIcon(p: IllProps) {
  return (
    <Ill
      viewBox="0 0 120 100"
      {...p}
      shapes={[
        ['M8 30H74V76H8Z', 'a'],
        ['M74 44H98L112 60V76H74Z', 'c'],
        ['M18 78a10 10 0 1 0 20 0a10 10 0 1 0 -20 0Z', 'foil'],
        ['M80 78a10 10 0 1 0 20 0a10 10 0 1 0 -20 0Z', 'foil'],
      ]}
      thin={['M82 50H96L104 60H82Z', 'M20 44H50M20 54H40']}
    />
  );
}
export function PalletIcon(p: IllProps) {
  return (
    <Ill
      viewBox="0 0 120 100"
      {...p}
      shapes={[
        ['M14 40H58V78H14Z', 'a'],
        ['M62 40H106V78H62Z', 'a'],
        ['M36 8H84V40H36Z', 'c'],
        ['M8 78H112V88H8Z', 'foil'],
      ]}
      thin={['M36 40V52M84 40V52M60 8V20', 'M18 88V94M60 88V94M102 88V94']}
    />
  );
}
export function PeopleIcon(p: IllProps) {
  return (
    <Ill
      viewBox="0 0 120 100"
      {...p}
      shapes={[
        ['M10 14H74V54H40L26 66V54H10Z', 'c'],
        ['M50 42H110V80H96V92L82 80H50Z', 'a'],
      ]}
      thin={['M22 30H62M22 40H50', 'M62 58H98M62 68H86']}
    />
  );
}
