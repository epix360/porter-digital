'use client';

import { useState, useTransition } from 'react';
import { useForm, type Resolver } from 'react-hook-form';
import { contactFormSchema, type ContactFormValues } from './schema';
import { submitContactForm, type ContactFormState } from './actions';
import { Turnstile } from './Turnstile';

type ContactFormProps = {
  turnstileSiteKey: string;
  submitLabel?: string;
  successMessage?: string;
};

const DEFAULT_SUBMIT_LABEL = 'Send message';
const DEFAULT_SUCCESS_MESSAGE =
  "Thanks — your message is on its way. We'll get back to you shortly.";

const zodResolver: Resolver<ContactFormValues> = async (values) => {
  const result = contactFormSchema.safeParse(values);
  if (result.success) {
    return { values: result.data, errors: {} };
  }
  const errors: Record<string, { type: string; message: string }> = {};
  for (const issue of result.error.issues) {
    const path = issue.path.join('.');
    if (!errors[path]) {
      errors[path] = { type: issue.code, message: issue.message };
    }
  }
  return { values: {}, errors };
};

export function ContactForm({
  turnstileSiteKey,
  submitLabel,
  successMessage,
}: ContactFormProps) {
  const [turnstileToken, setTurnstileToken] = useState('');
  const [serverState, setServerState] = useState<ContactFormState>({
    status: 'idle',
  });
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<ContactFormValues>({
    resolver: zodResolver,
    defaultValues: { name: '', email: '', message: '', company: '' },
  });

  const onSubmit = (values: ContactFormValues) => {
    if (!turnstileToken) {
      setServerState({
        status: 'error',
        message: 'Please complete the spam check before submitting.',
      });
      return;
    }
    startTransition(async () => {
      const result = await submitContactForm({ ...values, turnstileToken });
      setServerState(result);
      if (result.status === 'success') {
        reset();
        setTurnstileToken('');
        return;
      }
      if (result.status === 'error' && result.fieldErrors) {
        for (const [key, messages] of Object.entries(result.fieldErrors)) {
          if (messages?.[0]) {
            setError(key as keyof ContactFormValues, {
              type: 'server',
              message: messages[0],
            });
          }
        }
      }
    });
  };

  if (serverState.status === 'success') {
    return (
      <div
        className="rounded-md border border-green-200 bg-green-50 p-4 text-green-900"
        role="status"
      >
        <p className="font-medium whitespace-pre-line">
          {successMessage?.trim() || DEFAULT_SUCCESS_MESSAGE}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
      <div>
        <label htmlFor="contact-name" className="block text-sm font-medium">
          Name
        </label>
        <input
          id="contact-name"
          type="text"
          autoComplete="name"
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? 'contact-name-error' : undefined}
          className="mt-1 w-full rounded-md border border-neutral-300 px-3 py-2"
          {...register('name')}
        />
        {errors.name && (
          <p id="contact-name-error" className="mt-1 text-sm text-red-600">
            {errors.name.message}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="contact-email" className="block text-sm font-medium">
          Email
        </label>
        <input
          id="contact-email"
          type="email"
          autoComplete="email"
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? 'contact-email-error' : undefined}
          className="mt-1 w-full rounded-md border border-neutral-300 px-3 py-2"
          {...register('email')}
        />
        {errors.email && (
          <p id="contact-email-error" className="mt-1 text-sm text-red-600">
            {errors.email.message}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="contact-message" className="block text-sm font-medium">
          Message
        </label>
        <textarea
          id="contact-message"
          rows={6}
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? 'contact-message-error' : undefined}
          className="mt-1 w-full rounded-md border border-neutral-300 px-3 py-2"
          {...register('message')}
        />
        {errors.message && (
          <p id="contact-message-error" className="mt-1 text-sm text-red-600">
            {errors.message.message}
          </p>
        )}
      </div>

      {/* Honeypot — hidden from real users, bots will fill it. */}
      <div aria-hidden="true" className="hidden">
        <label htmlFor="contact-company">Company</label>
        <input
          id="contact-company"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          {...register('company')}
        />
      </div>

      <Turnstile
        siteKey={turnstileSiteKey}
        onToken={setTurnstileToken}
        onExpire={() =>
          setServerState({
            status: 'error',
            message: 'Spam check expired. Please complete it again.',
          })
        }
      />

      {serverState.status === 'error' && (
        <p className="text-sm text-red-600" role="alert">
          {serverState.message}
        </p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="inline-flex items-center rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? 'Sending…' : submitLabel?.trim() || DEFAULT_SUBMIT_LABEL}
      </button>
    </form>
  );
}
