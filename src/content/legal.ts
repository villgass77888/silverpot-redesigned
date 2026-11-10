/**
 * Privacy and Terms drafts (§7.14). Plain-language drafts written for the build;
 * they require legal review before launch ([CONFIRM] register #23). Arabic is a
 * machine-quality draft pending native review.
 */
export type LegalDoc = { title: string; updated: string; intro: string; sections: { h: string; p: string[] }[] };

const UPDATED = '2026-10-18';

export const privacy: Record<'en' | 'ar', LegalDoc> = {
  en: {
    title: 'Privacy policy.',
    updated: UPDATED,
    intro:
      'This policy explains what happens to the details you send us through silverpot.org. Silverpot is a brand of Al Mohamadi Light Industries Co. LLC, Ajman, United Arab Emirates.',
    sections: [
      {
        h: 'What we collect',
        p: [
          'Only what you type into our quote, wholesale and contact forms: your name, company, email address, phone number, business type, delivery emirate, the products and quantities on your quote list, and your message.',
          'Your quote list itself is stored in your own browser until you send it. We don’t see it until you do.',
        ],
      },
      {
        h: 'Why we collect it',
        p: ['To answer your request: to prepare a quote, reply to your question, or follow up on a wholesale enquiry. We don’t sell your details or use them for unrelated marketing.'],
      },
      {
        h: 'Where it goes',
        p: [
          'Form submissions are sent to our sales inbox by email through our email delivery provider. If you choose to message us on WhatsApp instead, that conversation is handled by WhatsApp under its own terms.',
          'The map on our contact page only loads from Google when you ask for it.',
        ],
      },
      {
        h: 'Analytics and cookies',
        p: ['We use cookieless, privacy-friendly analytics to count visits and see which pages help people. They don’t identify you, and we don’t set advertising cookies.'],
      },
      {
        h: 'How long we keep it',
        p: ['We keep enquiry emails for as long as we need them to deal with your request and any order that follows, and to meet our legal and accounting obligations.'],
      },
      {
        h: 'Your rights',
        p: [
          'You can ask to see, correct or delete the personal data we hold about you, in line with the UAE Personal Data Protection Law (Federal Decree-Law No. 45 of 2021) and other applicable law.',
        ],
      },
      {
        h: 'Contact',
        p: ['Questions about this policy: email info@silverpot.org or call +971 6 743 1314.'],
      },
    ],
  },
  ar: {
    title: 'سياسة الخصوصية.',
    updated: UPDATED,
    intro:
      'توضح هذه السياسة ما يحدث للبيانات التي ترسلها إلينا عبر silverpot.org. سيلفربوت علامة تجارية لشركة Al Mohamadi Light Industries Co. LLC، عجمان، الإمارات العربية المتحدة.',
    sections: [
      {
        h: 'ما الذي نجمعه',
        p: [
          'فقط ما تكتبه في نماذج عرض السعر والجملة والتواصل: اسمك، والشركة، والبريد الإلكتروني، ورقم الهاتف، ونوع النشاط، وإمارة التوصيل، والمنتجات والكميات في قائمة عرض السعر، ورسالتك.',
          'تُحفظ قائمة عرض السعر في متصفحك حتى ترسلها. لا نراها قبل ذلك.',
        ],
      },
      { h: 'لماذا نجمعها', p: ['للرد على طلبك: لإعداد عرض سعر، أو الإجابة عن سؤالك، أو متابعة استفسار الجملة. لا نبيع بياناتك ولا نستخدمها لتسويق غير مرتبط.'] },
      {
        h: 'إلى أين تذهب',
        p: [
          'تُرسل النماذج إلى بريد المبيعات لدينا عبر مزوّد خدمة البريد الإلكتروني. وإذا اخترت مراسلتنا عبر واتساب، فتخضع المحادثة لشروط واتساب.',
          'لا تُحمَّل الخريطة في صفحة التواصل من Google إلا عندما تطلبها.',
        ],
      },
      { h: 'التحليلات وملفات تعريف الارتباط', p: ['نستخدم تحليلات تحترم الخصوصية ولا تعتمد على ملفات تعريف الارتباط لعدّ الزيارات. لا تحدد هويتك، ولا نضع ملفات إعلانية.'] },
      { h: 'مدة الاحتفاظ', p: ['نحتفظ برسائل الاستفسار طالما احتجنا إليها لمعالجة طلبك وأي طلب شراء يليه، وللوفاء بالتزاماتنا القانونية والمحاسبية.'] },
      { h: 'حقوقك', p: ['يمكنك طلب الاطلاع على بياناتك الشخصية لدينا أو تصحيحها أو حذفها، وفقاً لقانون حماية البيانات الشخصية في دولة الإمارات (المرسوم بقانون اتحادي رقم 45 لسنة 2021) والقوانين المعمول بها.'] },
      { h: 'التواصل', p: ['لأي سؤال حول هذه السياسة: راسلنا على info@silverpot.org أو اتصل على ‎+971 6 743 1314.'] },
    ],
  },
};

export const terms: Record<'en' | 'ar', LegalDoc> = {
  en: {
    title: 'Terms of use.',
    updated: UPDATED,
    intro: 'These terms apply to your use of silverpot.org, run by Al Mohamadi Light Industries Co. LLC, Ajman, United Arab Emirates.',
    sections: [
      { h: 'Using this site', p: ['You may browse the site, build a quote list and contact us. Please don’t misuse the site, attempt to break it, or send automated requests through our forms.'] },
      {
        h: 'Product information',
        p: [
          'Product photos and descriptions are indicative. Final specifications, including sizes, capacities, pack quantities and materials, are confirmed in your quotation.',
        ],
      },
      {
        h: 'Quotes',
        p: ['Sending a quote request doesn’t create an order or a contract. A quote becomes binding only once we confirm it to you in writing and you accept it.'],
      },
      { h: 'Intellectual property', p: ['The Silverpot name, wordmark, illustrations, photos and text on this site belong to Al Mohamadi Light Industries Co. LLC. Please don’t reuse them without permission.'] },
      { h: 'Governing law', p: ['These terms are governed by the laws of the United Arab Emirates as applied in the Emirate of Ajman.'] },
      { h: 'Contact', p: ['Questions about these terms: email info@silverpot.org or call +971 6 743 1314.'] },
    ],
  },
  ar: {
    title: 'شروط الاستخدام.',
    updated: UPDATED,
    intro: 'تنطبق هذه الشروط على استخدامك لموقع silverpot.org الذي تديره Al Mohamadi Light Industries Co. LLC، عجمان، الإمارات العربية المتحدة.',
    sections: [
      { h: 'استخدام الموقع', p: ['يمكنك تصفح الموقع وإنشاء قائمة عرض سعر والتواصل معنا. نرجو عدم إساءة استخدام الموقع أو محاولة تعطيله أو إرسال طلبات آلية عبر النماذج.'] },
      { h: 'معلومات المنتجات', p: ['صور المنتجات وأوصافها استرشادية. تُؤكَّد المواصفات النهائية، بما فيها المقاسات والسعات وكميات التعبئة والمواد، في عرض السعر.'] },
      { h: 'عروض الأسعار', p: ['إرسال طلب عرض سعر لا يُنشئ طلب شراء أو عقداً. يصبح العرض ملزماً فقط بعد أن نؤكده لك كتابياً وتوافق عليه.'] },
      { h: 'الملكية الفكرية', p: ['اسم سيلفربوت وشعاره ورسوماته وصوره ونصوصه على هذا الموقع مملوكة لشركة Al Mohamadi Light Industries Co. LLC. نرجو عدم إعادة استخدامها دون إذن.'] },
      { h: 'القانون الحاكم', p: ['تخضع هذه الشروط لقوانين دولة الإمارات العربية المتحدة كما تُطبَّق في إمارة عجمان.'] },
      { h: 'التواصل', p: ['لأي سؤال حول هذه الشروط: راسلنا على info@silverpot.org أو اتصل على ‎+971 6 743 1314.'] },
    ],
  },
};
