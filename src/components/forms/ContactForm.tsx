'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLocale, useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { submitContact } from '@/app/actions/contact';
import { TOPICS, contactSchema } from '@/lib/forms/schemas';
import { Button } from '../primitives/Button';
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
import { track } from '@/lib/analytics';

type Values = {
  name: string;
  company: string;
  email: string;
  phone: string;
  topic: string;
  message: string;
  consent: boolean;
  website: string;
};
const schema = contactSchema.omit({ token: true, locale: true });

/** Contact form (§7.10). */
export function ContactForm({
  turnstileSiteKey,
  responseTimeHours,
}: {
  turnstileSiteKey?: string;
  responseTimeHours: number | null;
}) {
  const t = useTranslations('forms');
  const errText = useErrorText();
  const locale = useLocale();
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
    setError,
    formState: { errors, isSubmitting, submitCount },
  } = useForm<Values>({
    resolver: zodResolver(schema as never),
    defaultValues: {
      name: '',
      company: '',
      email: '',
      phone: '',
      topic: '',
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
      const res = await submitContact({ ...values, token: await getToken(), locale });
      if (res.ok) {
        track('contact_submit', { type: values.topic });
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

  if (done) return <FormSuccess title={t('messageSent')} sub=" " responseTimeHours={responseTimeHours} />;

  const labels: Record<string, string> = {
    name: t('name'),
    email: t('email'),
    phone: t('phoneOptional'),
    topic: t('topic'),
    message: t('message'),
    consent: t('consent'),
  };
  const errorMap = Object.fromEntries(Object.keys(labels).map((k) => [k, err(k as keyof Values)]));

  return (
    <form noValidate onSubmit={onSubmit} onFocusCapture={activateTurnstile} className="relative">
      <ErrorSummary
        errors={submitCount ? errorMap : {}}
        labels={labels}
        formError={formError}
        focusKey={focusKey}
      />
      <div className="grid gap-5 md:grid-cols-2">
        <Field id={id('name')} label={labels.name} required error={err('name')} shakeKey={focusKey}>
          <Input
            id={id('name')}
            autoComplete="name"
            invalid={!!errors.name}
            aria-describedby={describedBy(id('name'), err('name'))}
            {...register('name')}
          />
        </Field>
        <Field
          id={id('company')}
          label={t('companyOptional')}
          optionalLabel={t('optional')}
          error={err('company')}
        >
          <Input id={id('company')} autoComplete="organization" {...register('company')} />
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
          optionalLabel={t('optional')}
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
            invalid={!!errors.phone}
            aria-describedby={describedBy(id('phone'), err('phone'), true)}
            {...register('phone')}
          />
        </Field>
        <Field
          id={id('topic')}
          label={labels.topic}
          required
          error={err('topic')}
          className="md:col-span-2"
          shakeKey={focusKey}
        >
          <Select
            id={id('topic')}
            invalid={!!errors.topic}
            aria-describedby={describedBy(id('topic'), err('topic'))}
            {...register('topic')}
          >
            <option value="">{t('choose')}</option>
            {TOPICS.map((tp) => (
              <option key={tp} value={tp}>
                {t(`options.topic.${tp}`)}
              </option>
            ))}
          </Select>
        </Field>
        <Field
          id={id('message')}
          label={labels.message}
          required
          error={err('message')}
          className="md:col-span-2"
          shakeKey={focusKey}
        >
          <Textarea
            id={id('message')}
            rows={6}
            invalid={!!errors.message}
            aria-describedby={describedBy(id('message'), err('message'))}
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
      <Button type="submit" size="lg" raised loading={isSubmitting} disabled={isSubmitting} className="mt-8">
        {isSubmitting ? t('sending') : t('sendMessage')}
      </Button>
    </form>
  );
}
