import { Body, Column, Container, Head, Heading, Hr, Html, Preview, Row, Section, Text } from '@react-email/components';

export type EmailRow = { label: string; value: string };
export type EmailItem = { code: string | null; name: string; qty: number; unit: string; note?: string };

const BLUE = '#0E2A8C';
const YELLOW = '#FFD21F';
const FOIL = '#E9ECF1';

/** Silverpot-branded email for sales notifications and customer auto-replies (§5.5). */
export function LeadEmail({
  preview,
  title,
  intro,
  rows = [],
  items = [],
  dir = 'ltr',
  footer,
}: {
  preview: string;
  title: string;
  intro?: string;
  rows?: EmailRow[];
  items?: EmailItem[];
  dir?: 'ltr' | 'rtl';
  footer: string;
}) {
  return (
    <Html dir={dir} lang={dir === 'rtl' ? 'ar' : 'en'}>
      <Head />
      <Preview>{preview}</Preview>
      <Body style={{ background: FOIL, fontFamily: 'Arial, Helvetica, sans-serif', color: BLUE, margin: 0, padding: '24px 0' }}>
        <Container style={{ background: '#ffffff', border: `2px solid ${BLUE}`, borderRadius: 14, maxWidth: 600, overflow: 'hidden' }}>
          <Section style={{ background: YELLOW, borderBottom: `2px solid ${BLUE}`, padding: '18px 24px' }}>
            <Text style={{ fontSize: 26, fontWeight: 900, letterSpacing: 1, margin: 0, color: BLUE }}>SILVERPOT</Text>
          </Section>
          <Section style={{ padding: '24px' }}>
            <Heading as="h1" style={{ fontSize: 24, margin: '0 0 12px', color: BLUE }}>
              {title}
            </Heading>
            {intro && <Text style={{ fontSize: 15, lineHeight: '22px', margin: '0 0 16px' }}>{intro}</Text>}
            {rows.map((r) => (
              <Row key={r.label} style={{ borderBottom: `1px solid ${FOIL}` }}>
                <Column style={{ width: '38%', padding: '8px 0', fontSize: 13, color: '#4a5a9a', verticalAlign: 'top' }}>{r.label}</Column>
                <Column style={{ padding: '8px 0', fontSize: 15, fontWeight: 700, whiteSpace: 'pre-wrap' }}>{r.value}</Column>
              </Row>
            ))}
            {items.length > 0 && (
              <>
                <Hr style={{ borderColor: BLUE, margin: '20px 0 8px' }} />
                {items.map((it, i) => (
                  <Row key={i} style={{ borderBottom: `1px solid ${FOIL}` }}>
                    <Column style={{ padding: '8px 0', fontSize: 15 }}>
                      <strong style={{ fontSize: 18 }}>{it.code ?? ''}</strong> {it.name}
                      {it.note ? <span style={{ display: 'block', fontSize: 13, color: '#4a5a9a' }}>{it.note}</span> : null}
                    </Column>
                    <Column style={{ padding: '8px 0', fontSize: 15, fontWeight: 700, textAlign: dir === 'rtl' ? 'left' : 'right', whiteSpace: 'nowrap' }}>
                      {it.qty} {it.unit}
                    </Column>
                  </Row>
                ))}
              </>
            )}
          </Section>
          <Section style={{ background: BLUE, padding: '14px 24px' }}>
            <Text style={{ color: '#ffffff', fontSize: 12, margin: 0 }}>{footer}</Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

export function plainText(title: string, rows: EmailRow[], items: EmailItem[], footer: string, intro?: string) {
  return [
    title,
    intro ?? '',
    '',
    ...rows.map((r) => `${r.label}: ${r.value}`),
    ...(items.length ? ['', ...items.map((i) => `• ${i.code ? `${i.code} – ` : ''}${i.name} — ${i.qty} ${i.unit}${i.note ? ` (${i.note})` : ''}`)] : []),
    '',
    footer,
  ]
    .join('\n')
    .replace(/\n{3,}/g, '\n\n');
}
