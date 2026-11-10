import type { L10n } from './types';

export type SegmentId =
  'restaurants' | 'cloud-kitchens' | 'caterers' | 'hotels' | 'bakeries' | 'distributors' | 'home';

export interface Segment {
  id: SegmentId;
  label: L10n;
  /** Home sticker wall one-liner (§7.1 H8). */
  line: L10n;
  /** Wholesale "Who we supply" line (§7.6). Null = not listed on wholesale. */
  wholesaleLine: L10n | null;
  /** Unconfirmed segments render only in review mode, unless they're placeholders. */
  confirmed: boolean;
  note?: string;
  /** LIKELY: shown until the client answers question `clientQ` (docs/PLACEHOLDERS.md). */
  placeholder?: boolean;
  clientQ?: number;
}

const l = (en: string, ar: string): L10n => ({ en, ar, arReviewed: false });

export const segments: Segment[] = [
  {
    id: 'restaurants',
    label: l('Restaurants and cafeterias', 'المطاعم والكافتيريات'),
    line: l('Takeaway that travels like dine-in.', 'طلبات خارجية تصل كأنها على الطاولة.'),
    wholesaleLine: l(
      'Everyday takeaway sizes, consistent from carton to carton.',
      'مقاسات يومية للطلبات الخارجية، ثابتة من كرتون إلى كرتون.',
    ),
    confirmed: true,
  },
  {
    id: 'cloud-kitchens',
    label: l('Cloud kitchens', 'المطابخ السحابية'),
    line: l('Built for the delivery bag.', 'مصنوعة لحقيبة التوصيل.'),
    wholesaleLine: l(
      'Containers that stack in the bag and arrive in one piece.',
      'علب تتراص في الحقيبة وتصل سليمة.',
    ),
    confirmed: true,
  },
  {
    id: 'caterers',
    label: l('Caterers and events', 'متعهدو الحفلات والمناسبات'),
    line: l('Platters for the main event.', 'صوانٍ للمناسبة الكبرى.'),
    wholesaleLine: l(
      'Platters and large containers for buffets and banquets.',
      'صوانٍ وعلب كبيرة للبوفيهات والولائم.',
    ),
    confirmed: true,
  },
  {
    id: 'hotels',
    label: l('Hotels and banquets', 'الفنادق وقاعات الولائم'),
    line: l('Back-of-house heavy lifting.', 'العمل الشاق خلف الكواليس.'),
    wholesaleLine: l('Back-of-house volume, delivered on schedule.', 'كميات للمطابخ الخلفية، تصل في موعدها.'),
    confirmed: true,
  },
  {
    id: 'bakeries',
    label: l('Bakeries and sweet shops', 'المخابز ومحلات الحلويات'),
    line: l('Kunafa’s favourite tray.', 'الصينية المفضلة للكنافة.'),
    wholesaleLine: l('Trays for kunafa, umm ali and anything baked.', 'صوانٍ للكنافة وأم علي وكل ما يُخبز.'),
    confirmed: true,
  },
  {
    id: 'distributors',
    label: l('Distributors and supermarkets', 'الموزعون والسوبرماركت'),
    line: l('Stock that keeps moving.', 'بضاعة لا تتوقف عن الحركة.'),
    wholesaleLine: l('Retail foil packs and trade cartons.', 'عبوات ورق للتجزئة وكراتين للتجار.'),
    confirmed: false,
    placeholder: true,
    clientQ: 13,
    note: 'Sells to distributors and supermarkets',
  },
  {
    id: 'home',
    label: l('Home kitchens', 'مطابخ البيوت'),
    line: l('Yes, the good foil is for you too.', 'نعم، الورق الجيد لك أيضاً.'),
    wholesaleLine: null,
    confirmed: false,
    placeholder: true,
    clientQ: 14,
    note: 'Sells to households',
  },
];
