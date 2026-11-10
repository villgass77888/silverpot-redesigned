import { LOGO } from './logo-data';
import { LogoShapes } from './Logo';

/**
 * One hidden SVG per page with the shared filter and the symbols that repeat
 * (logo in header + footer, registration marks on every product frame,
 * the conveyor's foil-ball separator). Referencing them with <use> keeps the
 * HTML and RSC payload small (§12.1).
 */
export function SvgSprite() {
  return (
    <svg width="0" height="0" className="absolute" aria-hidden focusable="false">
      <defs>
        <filter id="sp-wobble" x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence type="fractalNoise" baseFrequency="0.022" numOctaves="2" seed="4" result="n" />
          <feDisplacementMap
            in="SourceGraphic"
            in2="n"
            scale="2.6"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </defs>
      <symbol id="sp-logo" viewBox={LOGO.viewBox}>
        <LogoShapes />
      </symbol>
      <symbol id="sp-reg" viewBox="0 0 16 16">
        <circle cx="8" cy="8" r="4.5" fill="none" stroke="currentColor" strokeWidth="1.2" />
        <path d="M8 0V16M0 8H16" stroke="currentColor" strokeWidth="1.2" />
      </symbol>
      <symbol id="sp-foil-ball" viewBox="0 0 20 20">
        <path
          d="M10 1.5L15.5 3.5L18.5 9L16.5 15L10.5 18.5L4.5 16.5L1.5 10.5L3.5 4.5Z"
          fill="var(--color-yellow)"
          stroke="var(--color-blue)"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
        <path
          d="M10 1.5L9 8L3.5 4.5M9 8L16.5 15M9 8L15.5 3.5"
          fill="none"
          stroke="var(--color-blue)"
          strokeWidth="1"
        />
      </symbol>
    </svg>
  );
}
