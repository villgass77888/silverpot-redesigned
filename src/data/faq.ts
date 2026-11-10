import type { CategorySlug, L10n } from './types';

export type FaqGroup = 'products' | 'ordering' | 'recycling' | 'about';
export type FaqStatus = 'general' | 'confirm' | 'confirmed' | 'placeholder';

export interface FaqItem {
  id: string;
  group: FaqGroup;
  q: L10n;
  a: L10n;
  /**
   * 'general' = safe now · 'confirm' = hidden in production until approved · 'confirmed' = approved ·
   * 'placeholder' = TEMP/LIKELY answer shown until the client answers question `clientQ` (docs/PLACEHOLDERS.md).
   */
  status: FaqStatus;
  clientQ?: number;
  homeTeaser?: boolean;
}

const l = (en: string, ar: string): L10n => ({ en, ar, arReviewed: false });

export const faqGroups: { id: FaqGroup; title: L10n }[] = [
  { id: 'products', title: l('Products and use', 'المنتجات والاستخدام') },
  { id: 'ordering', title: l('Ordering and delivery', 'الطلب والتوصيل') },
  { id: 'recycling', title: l('Recycling', 'إعادة التدوير') },
  { id: 'about', title: l('About Silverpot', 'عن سيلفربوت') },
];

export const faqs: FaqItem[] = [
  {
    id: 'oven',
    group: 'products',
    q: l('Can aluminium containers go in the oven?', 'هل يمكن وضع علب الألمنيوم في الفرن؟'),
    a: l(
      'Aluminium containers can generally go in a conventional oven. Remove paper or board lids before heating. Ask us about a specific model.',
      'يمكن عادةً وضع علب الألمنيوم في الفرن التقليدي. أزل الأغطية الورقية أو الكرتونية قبل التسخين. اسألنا عن موديل محدد.',
    ),
    status: 'placeholder',
    clientQ: 26,
    homeTeaser: true,
  },
  {
    id: 'freeze',
    group: 'products',
    q: l('Can I freeze food in them?', 'هل يمكنني تجميد الطعام فيها؟'),
    a: l(
      'Yes, aluminium containers are commonly used for freezing. Let food cool, close the lid and label it.',
      'نعم، تُستخدم علب الألمنيوم كثيراً للتجميد. اترك الطعام يبرد، ثم أغلق الغطاء واكتب عليه.',
    ),
    status: 'placeholder',
    clientQ: 27,
    homeTeaser: true,
  },
  {
    id: 'microwave',
    group: 'products',
    q: l('Can I use them in the microwave?', 'هل يمكنني استخدامها في الميكروويف؟'),
    a: l(
      'We don’t recommend putting aluminium in a microwave unless the appliance manufacturer says it’s safe. Move food to a microwave-safe dish.',
      'لا ننصح بوضع الألمنيوم في الميكروويف إلا إذا ذكرت الشركة المصنّعة للجهاز أن ذلك آمن. انقل الطعام إلى طبق مناسب للميكروويف.',
    ),
    status: 'placeholder',
    clientQ: 28,
  },
  {
    id: 'food-safe',
    group: 'products',
    q: l('Are your products food-safe?', 'هل منتجاتكم آمنة لملامسة الطعام؟'),
    a: l(
      'Our containers and foil are made for food packaging. Ask us if you need compliance documents for your business.',
      'علبنا وورق الألمنيوم لدينا مصنوعة لتغليف الطعام. اسألنا إذا كنت تحتاج إلى مستندات المطابقة لنشاطك التجاري.',
    ),
    status: 'placeholder',
    clientQ: 29,
  },
  {
    id: 'model-codes',
    group: 'products',
    q: l('What do the model codes mean?', 'ماذا تعني أرقام الموديلات؟'),
    a: l(
      'Each product has a model code, for example 8325. It’s the fastest way to search the catalogue and to order. Type it into the search bar.',
      'لكل منتج رقم موديل، مثل 8325. إنه أسرع طريقة للبحث في الكتالوج وللطلب. اكتبه في شريط البحث.',
    ),
    status: 'general',
  },
  {
    id: 'foil-widths',
    group: 'products',
    q: l('What’s the difference between 30 cm and 45 cm foil?', 'ما الفرق بين ورق 30 سم و45 سم؟'),
    a: l(
      'It’s the width of the roll. 30 cm suits everyday kitchen jobs; 45 cm covers large trays and catering pans in one sheet.',
      'إنه عرض الرول. عرض 30 سم يناسب أعمال المطبخ اليومية، وعرض 45 سم يغطي الصواني الكبيرة وأواني الضيافة بورقة واحدة.',
    ),
    status: 'general',
  },
  {
    id: 'custom-lids',
    group: 'products',
    q: l('Do you make custom or printed lids?', 'هل تصنعون أغطية مخصصة أو مطبوعة؟'),
    a: l(
      'Ask us about custom or printed packaging for larger orders.',
      'اسألنا عن التغليف المخصص أو المطبوع للطلبات الكبيرة.',
    ),
    status: 'placeholder',
    clientQ: 30,
  },
  {
    id: 'price',
    group: 'ordering',
    q: l('How do I get a price?', 'كيف أحصل على السعر؟'),
    a: l(
      'Add products to your quote and send it, or message us on WhatsApp with the model codes and quantities. We’ll reply with price, stock and timing.',
      'أضف المنتجات إلى عرض السعر وأرسله، أو راسلنا على واتساب بأرقام الموديلات والكميات. سنرد عليك بالسعر والمخزون والمواعيد.',
    ),
    status: 'general',
    homeTeaser: true,
  },
  {
    id: 'moq',
    group: 'ordering',
    q: l('Is there a minimum order?', 'هل هناك حد أدنى للطلب؟'),
    a: l(
      'Small and bulk orders welcome. Your quote confirms the details.',
      'نرحّب بالطلبات الصغيرة والكبيرة. ويؤكد عرض السعر التفاصيل.',
    ),
    status: 'placeholder',
    clientQ: 31,
  },
  {
    id: 'delivery',
    group: 'ordering',
    q: l('Do you deliver across the UAE?', 'هل توصلون إلى جميع أنحاء الإمارات؟'),
    a: l(
      'We deliver across the UAE. Lead times are confirmed with your quote.',
      'نوصل إلى جميع أنحاء الإمارات. وتُؤكَّد مدة التوريد مع عرض السعر.',
    ),
    status: 'placeholder',
    clientQ: 32,
  },
  {
    id: 'export',
    group: 'ordering',
    q: l('Do you export outside the UAE?', 'هل تصدّرون خارج الإمارات؟'),
    a: l(
      'Outside the UAE? Send us your location and we’ll let you know what’s possible.',
      'خارج الإمارات؟ أرسل لنا موقعك وسنخبرك بما هو ممكن.',
    ),
    status: 'placeholder',
    clientQ: 33,
  },
  {
    id: 'samples',
    group: 'ordering',
    q: l('Can I order samples?', 'هل يمكنني طلب عينات؟'),
    a: l('Ask us about samples when you request a quote.', 'اسألنا عن العينات عند طلب عرض السعر.'),
    status: 'placeholder',
    clientQ: 34,
  },
  {
    id: 'households',
    group: 'ordering',
    q: l('Do you sell to households?', 'هل تبيعون للأفراد والمنازل؟'),
    a: l('Yes. Message us on WhatsApp with what you need.', 'نعم. راسلنا على واتساب بما تحتاجه.'),
    status: 'placeholder',
    clientQ: 35,
  },
  {
    id: 'recyclable',
    group: 'recycling',
    q: l('Are aluminium containers recyclable?', 'هل علب الألمنيوم قابلة لإعادة التدوير؟'),
    a: l(
      'Yes. Aluminium can be recycled again and again without losing its quality. Scrape off food, give it a quick rinse, and put it in your recycling bin.',
      'نعم. يمكن إعادة تدوير الألمنيوم مرة بعد مرة دون أن يفقد جودته. أزل بقايا الطعام واشطفها سريعاً، ثم ضعها في حاوية إعادة التدوير.',
    ),
    status: 'general',
    homeTeaser: true,
  },
  {
    id: 'used-foil',
    group: 'recycling',
    q: l('What should I do with used foil?', 'ماذا أفعل بورق الألمنيوم المستعمل؟'),
    a: l(
      'Clean off any food, then scrunch it into a ball about the size of your fist so it’s easier to sort, and recycle it.',
      'نظّفه من بقايا الطعام، ثم كوّره بحجم قبضة اليد تقريباً ليسهل فرزه، وأعد تدويره.',
    ),
    status: 'general',
  },
  {
    id: 'where',
    group: 'about',
    q: l('Where are you based?', 'أين مقركم؟'),
    a: l(
      'Our facility is in the Emirate of Ajman, United Arab Emirates. We’ve been making aluminium packaging there since 1997.',
      'منشأتنا في إمارة عجمان، الإمارات العربية المتحدة. نصنع فيها عبوات الألمنيوم منذ 1997.',
    ),
    status: 'general',
  },
  {
    id: 'who',
    group: 'about',
    q: l('Who is behind Silverpot?', 'من يقف وراء سيلفربوت؟'),
    a: l(
      'Silverpot is the brand of Al Mohamadi Light Industries Co. LLC, founded in Ajman in 1997.',
      'سيلفربوت هي العلامة التجارية لشركة Al Mohamadi Light Industries Co. LLC، التي تأسست في عجمان عام 1997.',
    ),
    status: 'general',
  },
  // Family-only items
  {
    id: 'platter-lids',
    group: 'products',
    q: l('Do the platters come with lids?', 'هل تأتي الصواني مع أغطية؟'),
    a: l('Ask us about matching lids.', 'اسألنا عن الأغطية المناسبة.'),
    status: 'placeholder',
    clientQ: 21,
  },
  {
    id: 'platter-use',
    group: 'products',
    q: l('What are the platters used for?', 'لماذا تُستخدم الصواني؟'),
    a: l(
      'Platters are made for buffets, catering trays and family-style serving.',
      'الصواني مصنوعة للبوفيهات وصواني الضيافة والتقديم العائلي.',
    ),
    status: 'general',
  },
  {
    id: 'catering-rolls',
    group: 'products',
    q: l('What are catering rolls?', 'ما هي رولات المطاعم؟'),
    a: l(
      'Catering rolls are long-length rolls, 150 m or 300 m, for professional kitchens.',
      'رولات المطاعم رولات طويلة، بطول 150 م أو 300 م، للمطابخ الاحترافية.',
    ),
    status: 'general',
  },
];

export const faqById = new Map(faqs.map((f) => [f.id, f]));

/** Items shown on /faq (the family-only extras are excluded from the main page). */
export const mainFaqIds = faqs
  .filter((f) => !['platter-lids', 'platter-use', 'catering-rolls'].includes(f.id))
  .map((f) => f.id);

export const familyFaqIds: Record<CategorySlug, string[]> = {
  containers: ['oven', 'freeze', 'model-codes'],
  platters: ['platter-lids', 'platter-use', 'price'],
  foil: ['foil-widths', 'catering-rolls', 'used-foil'],
};
