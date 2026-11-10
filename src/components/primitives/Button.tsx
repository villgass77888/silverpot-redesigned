import type { ComponentProps, ReactNode } from 'react';
import { Link } from '@/i18n/navigation';
import { cn } from '@/lib/cn';
import { LogoStar } from '@/components/brand/Logo';
import { IconWhatsApp } from '@/components/icons';

export type ButtonVariant = 'primary' | 'secondary' | 'yellow' | 'blue' | 'ghost' | 'whatsapp';
export type ButtonSize = 'sm' | 'md' | 'lg';

const VARIANTS: Record<ButtonVariant, string> = {
  primary: 'bg-red text-white border-blue press',
  secondary: 'bg-white text-blue border-blue press',
  yellow: 'bg-yellow text-blue border-blue press',
  blue: 'bg-blue text-white border-blue press',
  whatsapp: 'bg-white text-blue border-blue press',
  ghost: 'border-transparent bg-transparent underline decoration-2 underline-offset-4 hover:decoration-[3px]',
};

const SIZES: Record<ButtonSize, string> = {
  sm: 'min-h-11 px-4 text-[0.9375rem] gap-2',
  md: 'min-h-12 px-5 text-base gap-2.5',
  lg: 'min-h-14 px-7 text-lg gap-3',
};

type Common = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: ReactNode;
  iconEnd?: ReactNode;
  loading?: boolean;
  /** shadow-md resting state (hero CTAs, §7.1) */
  raised?: boolean;
  full?: boolean;
  className?: string;
  children?: ReactNode;
};

type AsButton = Common & Omit<ComponentProps<'button'>, keyof Common> & { href?: undefined };
type AsLink = Common &
  Omit<ComponentProps<'a'>, keyof Common | 'href'> & {
    href: string;
    /** analytics: data-track event name, picked up by the global click listener */
    track?: string;
    trackLocation?: string;
    /** false = don't prefetch the route while the link is in view (heavy form pages) */
    prefetch?: boolean;
  };

export type ButtonProps = AsButton | AsLink;

const EXTERNAL = /^(https?:|tel:|mailto:)/;

export function buttonClasses({
  variant = 'primary',
  size = 'md',
  raised,
  full,
  className,
}: Pick<Common, 'variant' | 'size' | 'raised' | 'full' | 'className'>) {
  return cn(
    'relative inline-flex select-none items-center justify-center rounded-btn border-2 font-sans font-bold leading-none tracking-[-0.01em] whitespace-nowrap',
    'disabled:cursor-not-allowed disabled:border-blue/40 disabled:bg-foil disabled:text-blue/60 disabled:shadow-hard-none',
    VARIANTS[variant],
    SIZES[size],
    raised && variant !== 'ghost' && 'press-md',
    full && 'w-full',
    className,
  );
}

function Inner({ icon, iconEnd, loading, children, variant }: Common) {
  const lead = icon ?? (variant === 'whatsapp' ? <IconWhatsApp size={20} /> : null);
  return (
    <>
      <span className={cn('inline-flex items-center gap-[inherit]', loading && 'invisible')}>
        {lead}
        {children}
        {iconEnd}
      </span>
      {loading && (
        <span className="absolute inset-0 grid place-items-center">
          <LogoStar className="size-6" spin />
        </span>
      )}
    </>
  );
}

/**
 * Button (§8). Labels say exactly what happens, sentence case, no trailing arrows.
 * Pass `href` to render a link (internal → locale-aware Link; tel:/mailto:/https → <a>).
 */
export function Button(props: ButtonProps) {
  const {
    variant = 'primary',
    size = 'md',
    icon,
    iconEnd,
    loading,
    raised,
    full,
    className,
    children,
  } = props;
  const cls = buttonClasses({ variant, size, raised, full, className });
  const inner = (
    <Inner icon={icon} iconEnd={iconEnd} loading={loading} variant={variant}>
      {children}
    </Inner>
  );

  if (props.href !== undefined) {
    const {
      href,
      track,
      trackLocation,
      prefetch,
      variant: _v,
      size: _s,
      icon: _i,
      iconEnd: _ie,
      loading: _l,
      raised: _r,
      full: _f,
      className: _c,
      children: _ch,
      ...rest
    } = props as AsLink;
    const data = track ? { 'data-track': track, 'data-track-location': trackLocation ?? '' } : {};
    if (EXTERNAL.test(href)) {
      const newTab = href.startsWith('http');
      return (
        <a
          href={href}
          className={cls}
          {...(newTab ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
          {...data}
          {...rest}
        >
          {inner}
        </a>
      );
    }
    return (
      <Link href={href} className={cls} prefetch={prefetch} {...data} {...(rest as object)}>
        {inner}
      </Link>
    );
  }

  const {
    variant: _v,
    size: _s,
    icon: _i,
    iconEnd: _ie,
    loading: _l,
    raised: _r,
    full: _f,
    className: _c,
    children: _ch,
    type = 'button',
    ...rest
  } = props as AsButton;
  return (
    <button type={type} className={cls} aria-busy={loading || undefined} {...rest}>
      {inner}
    </button>
  );
}
