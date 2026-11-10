// Verified facts (§1.2) and unknowns modelled as null / confirmed:false (§9.2).
export const site = {
  brand: 'Silverpot',
  wordmark: 'SILVERPOT',
  legalName: 'Al Mohamadi Light Industries Co. LLC',
  founded: 1997,
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://silverpot.org',
  canonicalUrl: 'https://silverpot.org',
  emirate: 'Ajman',
  country: 'United Arab Emirates',
  countryCode: 'AE',
  phones: {
    landline: { e164: '+97167431314', display: '+971 6 743 1314', schema: '+971-6-743-1314' },
    mobile: { e164: '+971508494521', display: '+971 50 849 4521', schema: '+971-50-849-4521' },
  },
  // LIKELY (Q3): listed under "Call Us" on the old site, never labelled WhatsApp. Used for every WhatsApp link.
  whatsapp: {
    number: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '971508494521',
    confirmed: false,
    placeholder: true,
    clientQ: 3,
  },
  email: 'info@silverpot.org',
  address: {
    street: null as string | null,
    area: null as string | null,
    poBox: null as string | null,
    city: 'Ajman',
    country: 'AE',
    confirmed: false,
  }, // [CONFIRM]
  geo: { lat: null as number | null, lng: null as number | null }, // [CONFIRM] from Google Business Profile
  mapsQuery: 'Al Mohamadi Light Industries Co LLC - Ajman',
  // Confirmed hours go here (they feed JSON-LD openingHours). Until then the TEMP wording in
  // messages footer.hoursTemp shows on the page (Q6) and nothing goes into JSON-LD.
  hours: null as null | { days: string; open: string; close: string }[],
  responseTimeHours: null as null | number, // [CONFIRM]
  socials: { instagram: null, facebook: null, pinterest: null, youtube: null } as Record<
    'instagram' | 'facebook' | 'pinterest' | 'youtube',
    string | null
  >, // [CONFIRM]
  trademarkRegistered: false, // [CONFIRM] controls ®
  bestsellersConfirmed: false, // [CONFIRM] "Start with these" list
  flags: {
    showWildGrid: false,
    privateLabel: false,
    specSheets: false,
    showCerts: false,
    showFactoryGallery: false,
    showSustainabilityActions: false,
    showWholesaleTerms: false,
  },
} as const;

export type Site = typeof site;

export const telHref = (e164: string) => `tel:${e164}`;
export const mailHref = (email: string = site.email) => `mailto:${email}`;
export const mapsDirectionsHref = () =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(site.mapsQuery)}`;
export const mapsEmbedSrc = () =>
  `https://www.google.com/maps?q=${encodeURIComponent(site.mapsQuery)}&output=embed`;
