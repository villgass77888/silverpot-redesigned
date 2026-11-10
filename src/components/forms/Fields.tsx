'use client';

import { forwardRef, useEffect, useState, type ComponentProps, type ReactNode } from 'react';
import { useTranslations } from 'next-intl';
import { IconCheck, IconWarning } from '../icons';
import { cn } from '@/lib/cn';

/** Translate a schema error key ("phone", "tooLong") to a specific message. */
export function useErrorText() {
  const t = useTranslations('forms.errors');
  return (key?: string, max?: number) => (key ? t(key as 'phone', { max: max ?? 120 }) : undefined);
}

const control =
  'w-full rounded-btn border-2 border-blue/50 bg-white px-3.5 text-base text-blue outline-none transition-[border-color,box-shadow] placeholder:text-blue/40 focus:border-[3px] focus:border-blue focus:shadow-hard-sm aria-[invalid=true]:border-red';

type FieldShell = {
  id: string;
  label: ReactNode;
  required?: boolean;
  optionalLabel?: string;
  help?: ReactNode;
  error?: string;
  className?: string;
  children: ReactNode;
  /** bump to replay the shake on each failed submit */
  shakeKey?: number;
};

/** Visible label, helper, Red error with icon; shakes once (6px × 2, 240ms) when an error appears (§4.4). */
export function Field({
  id,
  label,
  required,
  optionalLabel,
  help,
  error,
  className,
  children,
  shakeKey,
}: FieldShell) {
  const [shake, setShake] = useState(false);
  useEffect(() => {
    if (!error) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- replay the one-off shake
    setShake(true);
    const t = setTimeout(() => setShake(false), 260);
    return () => clearTimeout(t);
  }, [error, shakeKey]);
  return (
    <div className={cn(shake && 'shake', className)}>
      <label htmlFor={id} className="mb-1.5 flex items-baseline gap-1.5 font-semibold">
        {label}
        {required ? (
          <span aria-hidden className="text-red">
            *
          </span>
        ) : (
          optionalLabel && <span className="type-small font-normal text-blue/80">({optionalLabel})</span>
        )}
      </label>
      {children}
      {help && !error && (
        <p id={`${id}-help`} className="mt-1.5 type-small text-blue/80">
          {help}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className="mt-1.5 flex items-start gap-1.5 type-small font-semibold text-red">
          <IconWarning size={18} className="mt-px shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
}

export function describedBy(id: string, error?: string, help?: boolean) {
  return (
    [error ? `${id}-error` : null, !error && help ? `${id}-help` : null].filter(Boolean).join(' ') ||
    undefined
  );
}

export const Input = forwardRef<HTMLInputElement, ComponentProps<'input'> & { invalid?: boolean }>(
  function Input({ className, invalid, ...rest }, ref) {
    return (
      <input
        ref={ref}
        aria-invalid={invalid || undefined}
        className={cn(control, 'h-12', className)}
        {...rest}
      />
    );
  },
);

export const Textarea = forwardRef<HTMLTextAreaElement, ComponentProps<'textarea'> & { invalid?: boolean }>(
  function Textarea({ className, invalid, ...rest }, ref) {
    return (
      <textarea
        ref={ref}
        aria-invalid={invalid || undefined}
        className={cn(control, 'min-h-32 py-3 leading-relaxed', className)}
        {...rest}
      />
    );
  },
);

export const Select = forwardRef<HTMLSelectElement, ComponentProps<'select'> & { invalid?: boolean }>(
  function Select({ className, invalid, children, ...rest }, ref) {
    return (
      <select
        ref={ref}
        aria-invalid={invalid || undefined}
        className={cn(
          control,
          'h-12 appearance-none [background-image:var(--caret)] bg-[length:16px] [background-position:right_14px_center] bg-no-repeat pe-10 rtl:[background-position:left_14px_center]',
          className,
        )}
        style={{
          ['--caret' as string]: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath d='M3 6l5 5 5-5' fill='none' stroke='%230E2A8C' stroke-width='2.4' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
        }}
        {...rest}
      >
        {children}
      </select>
    );
  },
);

/** Consent / single checkbox with a big hit area. */
export const Checkbox = forwardRef<
  HTMLInputElement,
  ComponentProps<'input'> & { label: ReactNode; invalid?: boolean; errorId?: string }
>(function Checkbox({ label, invalid, errorId, className, id, ...rest }, ref) {
  return (
    <label htmlFor={id} className={cn('flex cursor-pointer items-start gap-3', className)}>
      <span className="relative mt-0.5 grid size-6 shrink-0 place-items-center">
        <input
          ref={ref}
          id={id}
          type="checkbox"
          aria-invalid={invalid || undefined}
          aria-describedby={invalid ? errorId : undefined}
          className="peer size-6 cursor-pointer appearance-none rounded-[6px] border-2 border-blue bg-white checked:bg-yellow aria-[invalid=true]:border-red"
          {...rest}
        />
        <IconCheck size={16} className="pointer-events-none absolute opacity-0 peer-checked:opacity-100" />
      </span>
      <span className="leading-snug">{label}</span>
    </label>
  );
});

/**
 * Honeypot: hidden from people and assistive tech, tempting to bots. Clipped in place
 * rather than pushed off-screen: a far-left offset becomes scrollable overflow in RTL.
 */
export function Honeypot({ register, label }: { register: object; label: string }) {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute start-0 top-0 h-px w-px overflow-hidden opacity-0 [clip-path:inset(50%)]"
    >
      <label>
        {label}
        <input type="text" tabIndex={-1} autoComplete="off" {...register} />
      </label>
    </div>
  );
}

/** Error summary at the top on submit (§12.2). Focused when shown. */
export function ErrorSummary({
  errors,
  labels,
  formError,
  focusKey,
}: {
  errors: Record<string, string | undefined>;
  labels: Record<string, string>;
  formError?: string;
  focusKey: number;
}) {
  const t = useTranslations('forms');
  const keys = Object.keys(errors).filter((k) => errors[k] && labels[k]);
  const ref = (el: HTMLDivElement | null) => {
    if (el && focusKey > 0) el.focus();
  };
  if (!keys.length && !formError) return null;
  return (
    <div
      key={focusKey}
      ref={ref}
      tabIndex={-1}
      role="alert"
      className="mb-6 rounded-[12px] border-2 border-red bg-white p-4 text-blue outline-none focus-visible:outline-3 focus-visible:outline-red"
    >
      {formError && <p className="font-semibold text-red">{formError}</p>}
      {keys.length > 0 && (
        <>
          <p className="font-bold">{t('summary', { count: keys.length })}</p>
          <ul className="mt-2 list-disc ps-5">
            {keys.map((k) => (
              <li key={k}>
                <a href={`#f-${k}`} className="underline underline-offset-2">
                  {labels[k]}
                </a>
                : {errors[k]}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
