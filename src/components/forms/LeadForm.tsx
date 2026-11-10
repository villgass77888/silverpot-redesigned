'use client';

import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLocale, useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { submitQuote } from '@/app/actions/quote';
import { submitWholesale } from '@/app/actions/wholesale';
import {
  BUSINESS_TYPES,
  EMIRATES,
  INTERESTS,
  VOLUMES,
  quoteSchema,
  todayDubai,
  wholesaleSchema,
} from '@/lib/forms/schemas';
import { useQuote } from '../quote/store';
import { QuoteList, useQuoteWhatsApp } from '../quote/QuoteList';
import { Button } from '../primitives/Button';
import { Chip } from '../primitives/Chip';
import {
  Checkbox,
  ErrorSummary,
  Field,
  Honeypot,
  Input,
  Select,
  Textarea,
  describedBy,
  useErrorText,
} from './Fields';
import { FormSuccess } from './FormSuccess';
import { useTurnstile } from './useTurnstile';
import { waHref } from '@/lib/whatsapp';
import { track } from '@/lib/analytics';

type Mode = 'quote' | 'wholesale';
type Values = {
  company: string;
  name: string;
  email: string;
  phone: string;
  businessType: string;
  emirate: string;
  deliveryEmirate: string;
  neededBy: string;
  volume: string;
  interests: string[];
  message: string;
  consent: boolean;
  website: string;
};

const clientSchemas = {
  quote: quoteSchema.omit({ items: true, token: true, locale: true }),
  wholesale: wholesaleSchema.omit({ items: true, token: true, locale: true }),
};

/**
 * Quote (§7.11) and wholesale/distributor (§7.6) form. Same fields, labels and errors;
 * quote adds delivery emirate + needed-by and requires items; wholesale adds products
 * of interest and shows the quote list inline when it has items.
 */
export function LeadForm({
  mode,
  turnstileSiteKey,
  responseTimeHours,
}: {
  mode: Mode;
  turnstileSiteKey?: string;
  responseTimeHours: number | null;
}) {
  const t = useTranslations('forms');
  const tq = useTranslations('quote');
  const tc = useTranslations('common');
  const errText = useErrorText();
  const locale = useLocale();
  const items = useQuote((s) => s.items);
  const clear = useQuote((s) => s.clear);
  const buildWa = useQuoteWhatsApp();
  const {
    container: turnstileSlot,
    activate: activateTurnstile,
    getToken,
    reset: resetTurnstile,
  } = useTurnstile(turnstileSiteKey);
  const [done, setDone] = useState(false);
  const [formError, setFormError] = useState<string>();
  const [focusKey, setFocusKey] = useState(0);

  const {
    register,
    handleSubmit,
    control,
    setError,
    getValues,
    formState: { errors, isSubmitting, submitCount },
  } = useForm<Values>({
    resolver: zodResolver(clientSchemas[mode] as never),
    defaultValues: {
      company: '',
      name: '',
      email: '',
      phone: '',
      businessType: '',
      emirate: '',
      deliveryEmirate: '',
      neededBy: '',
      volume: '',
      interests: [],
      message: '',
      consent: false,
      website: '',
    },
    shouldFocusError: false,
  });

  const err = (k: keyof Values) =>
    errText(errors[k]?.message as string | undefined, k === 'message' ? 2000 : 120);
  const id = (k: string) => `f-${k}`;

  const onSubmit = handleSubmit(
    async (values) => {
      setFormError(undefined);
      if (mode === 'quote' && items.length === 0) {
        setFormError(t('errors.items'));
        setFocusKey((k) => k + 1);
        return;
      }
      const token = await getToken();
      const payload = { ...values, items: items.length ? items : undefined, token, locale };
      const res = mode === 'quote' ? await submitQuote(payload) : await submitWholesale(payload);
      if (res.ok) {
        if (mode === 'quote') {
          track('quote_submit', {
            itemCount: items.length,
            totalQty: items.reduce((s, i) => s + i.qty, 0),
            emirate: values.deliveryEmirate,
          });
          clear();
        } else {
          track('wholesale_submit', { type: values.businessType });
        }
        setDone(true);
        return;
      }
      resetTurnstile();
      if (res.fieldErrors)
        for (const [k, v] of Object.entries(res.fieldErrors)) setError(k as keyof Values, { message: v });
      if (res.formError) setFormError(t(`errors.${res.formError}`));
      setFocusKey((k) => k + 1);
    },
    () => setFocusKey((k) => k + 1),
  );

  if (done)
    return (
      <FormSuccess title={tq('success')} sub={tq('successSub')} responseTimeHours={responseTimeHours}>
        {mode === 'quote' ? (
          <Button href="/products" variant="secondary">
            {tq('startNew')}
          </Button>
        ) : (
          <Button href="/products" variant="secondary">
            {tc('browseProducts')}
          </Button>
        )}
      </FormSuccess>
    );

  const labels: Record<string, string> = {
    company: t('company'),
    name: t('contactName'),
    email: t('email'),
    phone: t('phone'),
    businessType: t('businessType'),
    emirate: t('emirate'),
    deliveryEmirate: t('deliveryEmirate'),
    neededBy: t('neededBy'),
    message: t('message'),
    consent: t('consent'),
  };
  const errorMap = Object.fromEntries(Object.keys(labels).map((k) => [k, err(k as keyof Values)]));

  const sendWhatsApp = () => {
    const v = getValues();
    const emirate = v.deliveryEmirate
      ? t(`options.emirate.${v.deliveryEmirate}` as 'options.emirate.dubai')
      : undefined;
    track('quote_whatsapp', { itemCount: items.length });
    window.open(
      waHref(
        buildWa({
          delivery: emirate,
          name: v.name || undefined,
          company: v.company || undefined,
          neededBy: v.neededBy || undefined,
        }),
      ),
      '_blank',
      'noopener',
    );
  };

  return (
    <form noValidate onSubmit={onSubmit} onFocusCapture={activateTurnstile} className="relative">
      <ErrorSummary
        errors={submitCount ? errorMap : {}}
        labels={labels}
        formError={formError}
        focusKey={focusKey}
      />

      {mode === 'wholesale' && items.length > 0 && (
        <div className="mb-8 rounded-[14px] border-2 border-blue/15 bg-foil px-4">
          <h3 className="pt-4 type-h4">{tq('inlineHeading')}</h3>
          <QuoteList variant="full" />
        </div>
      )}

      <div className="grid gap-5 md:grid-cols-2">
        <Field id={id('company')} label={labels.company} required error={err('company')} shakeKey={focusKey}>
          <Input
            id={id('company')}
            autoComplete="organization"
            invalid={!!errors.company}
            aria-describedby={describedBy(id('company'), err('company'))}
            {...register('company')}
          />
        </Field>
        <Field id={id('name')} label={labels.name} required error={err('name')} shakeKey={focusKey}>
          <Input
            id={id('name')}
            autoComplete="name"
            invalid={!!errors.name}
            aria-describedby={describedBy(id('name'), err('name'))}
            {...register('name')}
          />
        </Field>
        <Field id={id('email')} label={labels.email} required error={err('email')} shakeKey={focusKey}>
          <Input
            id={id('email')}
            type="email"
            autoComplete="email"
            inputMode="email"
            invalid={!!errors.email}
            aria-describedby={describedBy(id('email'), err('email'))}
            {...register('email')}
          />
        </Field>
        <Field
          id={id('phone')}
          label={labels.phone}
          required
          help={t('phoneHelp')}
          error={err('phone')}
          shakeKey={focusKey}
        >
          <Input
            id={id('phone')}
            type="tel"
            autoComplete="tel"
            inputMode="tel"
            dir="ltr"
            placeholder="+971"
            invalid={!!errors.phone}
            aria-describedby={describedBy(id('phone'), err('phone'), true)}
            {...register('phone')}
          />
        </Field>
        <Field
          id={id('businessType')}
          label={labels.businessType}
          required
          error={err('businessType')}
          shakeKey={focusKey}
        >
          <Select
            id={id('businessType')}
            invalid={!!errors.businessType}
            aria-describedby={describedBy(id('businessType'), err('businessType'))}
            {...register('businessType')}
          >
            <option value="">{t('choose')}</option>
            {BUSINESS_TYPES.map((b) => (
              <option key={b} value={b}>
                {t(`options.business.${b}`)}
              </option>
            ))}
          </Select>
        </Field>
        {mode === 'quote' ? (
          <Field
            id={id('deliveryEmirate')}
            label={labels.deliveryEmirate}
            required
            error={err('deliveryEmirate')}
            shakeKey={focusKey}
          >
            <Select
              id={id('deliveryEmirate')}
              invalid={!!errors.deliveryEmirate}
              aria-describedby={describedBy(id('deliveryEmirate'), err('deliveryEmirate'))}
              {...register('deliveryEmirate')}
            >
              <option value="">{t('choose')}</option>
              {EMIRATES.map((e) => (
                <option key={e} value={e}>
                  {t(`options.emirate.${e}`)}
                </option>
              ))}
            </Select>
          </Field>
        ) : (
          <Field
            id={id('emirate')}
            label={labels.emirate}
            required
            error={err('emirate')}
            shakeKey={focusKey}
          >
            <Select
              id={id('emirate')}
              invalid={!!errors.emirate}
              aria-describedby={describedBy(id('emirate'), err('emirate'))}
              {...register('emirate')}
            >
              <option value="">{t('choose')}</option>
              {EMIRATES.map((e) => (
                <option key={e} value={e}>
                  {t(`options.emirate.${e}`)}
                </option>
              ))}
            </Select>
          </Field>
        )}
        {mode === 'quote' && (
          <Field
            id={id('neededBy')}
            label={labels.neededBy}
            optionalLabel={t('optional')}
            error={err('neededBy')}
            shakeKey={focusKey}
          >
            <Input
              id={id('neededBy')}
              type="date"
              min={todayDubai()}
              invalid={!!errors.neededBy}
              aria-describedby={describedBy(id('neededBy'), err('neededBy'))}
              {...register('neededBy')}
            />
          </Field>
        )}
        <Field id={id('volume')} label={t('volume')} optionalLabel={t('optional')}>
          <Select id={id('volume')} {...register('volume')}>
            <option value="">{t('choose')}</option>
            {VOLUMES.map((v) => (
              <option key={v} value={v}>
                {t(`options.volume.${v}`)}
              </option>
            ))}
          </Select>
        </Field>
        {mode === 'wholesale' && (
          <fieldset className="md:col-span-2">
            <legend className="mb-2 font-semibold">
              {t('interests')} <span className="type-small font-normal text-blue/80">({t('optional')})</span>
            </legend>
            <Controller
              control={control}
              name="interests"
              render={({ field }) => (
                <div className="flex flex-wrap gap-2.5">
                  {INTERESTS.map((i) => {
                    const on = field.value.includes(i);
                    return (
                      <Chip
                        key={i}
                        selected={on}
                        onClick={() =>
                          field.onChange(on ? field.value.filter((x) => x !== i) : [...field.value, i])
                        }
                      >
                        {t(`options.interests.${i}`)}
                      </Chip>
                    );
                  })}
                </div>
              )}
            />
          </fieldset>
        )}
        <Field
          id={id('message')}
          label={labels.message}
          optionalLabel={t('optional')}
          error={err('message')}
          className="md:col-span-2"
          shakeKey={focusKey}
        >
          <Textarea
            id={id('message')}
            rows={5}
            invalid={!!errors.message}
            aria-describedby={describedBy(id('message'), err('message'))}
            placeholder={mode === 'quote' ? tq('notePlaceholder') : undefined}
            {...register('message')}
          />
        </Field>
      </div>

      <div className="mt-6" id={id('consent')}>
        <Checkbox
          id={`${id('consent')}-box`}
          label={
            <>
              {t('consent')}{' '}
              <Link href="/privacy" className="font-semibold underline underline-offset-2">
                {t('privacyLink')}
              </Link>
            </>
          }
          invalid={!!errors.consent}
          errorId={`${id('consent')}-error`}
          {...register('consent')}
        />
        {errors.consent && (
          <p id={`${id('consent')}-error`} className="ms-9 mt-1.5 type-small font-semibold text-red">
            {err('consent')}
          </p>
        )}
      </div>

      <Honeypot label={t('honeypot')} register={register('website')} />
      <div ref={turnstileSlot} className="mt-4" />

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        <Button type="submit" size="lg" raised loading={isSubmitting} disabled={isSubmitting}>
          {isSubmitting ? t('sending') : tq('send')}
        </Button>
        {mode === 'quote' && items.length > 0 && (
          <Button type="button" variant="whatsapp" size="lg" onClick={sendWhatsApp}>
            {tq('sendWhatsApp')}
          </Button>
        )}
      </div>
    </form>
  );
}
