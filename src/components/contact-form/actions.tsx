'use server';

import { headers } from 'next/headers';
import { sendEmail } from '@/lib/resend/client';
import ContactEmail from '@/../emails/contact';
import { contactFormSchema, type ContactFormValues } from './schema';
import { verifyTurnstileToken } from './verify-turnstile';

export type ContactFormState =
  | { status: 'idle' }
  | { status: 'success' }
  | {
      status: 'error';
      message: string;
      fieldErrors?: Partial<Record<keyof ContactFormValues, string[]>>;
    };

type SubmitArgs = ContactFormValues & { turnstileToken: string };

export async function submitContactForm(
  input: SubmitArgs,
): Promise<ContactFormState> {
  const parsed = contactFormSchema.safeParse(input);
  if (!parsed.success) {
    const fieldErrors = parsed.error.flatten().fieldErrors as Partial<
      Record<keyof ContactFormValues, string[]>
    >;
    return {
      status: 'error',
      message: 'Please fix the errors and try again.',
      fieldErrors,
    };
  }

  if (parsed.data.company && parsed.data.company.length > 0) {
    return { status: 'success' };
  }

  const headerList = await headers();
  const forwardedFor = headerList.get('x-forwarded-for') ?? '';
  const remoteIp = forwardedFor.split(',')[0]?.trim() || undefined;

  const verification = await verifyTurnstileToken(input.turnstileToken, remoteIp);
  if (!verification.success) {
    return {
      status: 'error',
      message: 'Spam check failed. Refresh the page and try again.',
    };
  }

  const to = process.env.CONTACT_FORM_TO_EMAIL;
  if (!to) {
    console.error('CONTACT_FORM_TO_EMAIL is not set');
    return {
      status: 'error',
      message: 'Server is not configured to receive messages.',
    };
  }

  try {
    await sendEmail({
      to,
      subject: `New contact form submission from ${parsed.data.name}`,
      replyTo: parsed.data.email,
      react: (
        <ContactEmail
          name={parsed.data.name}
          email={parsed.data.email}
          message={parsed.data.message}
        />
      ),
    });
  } catch (err) {
    console.error('Contact form send failed', err);
    return {
      status: 'error',
      message: 'We could not send your message. Please try again later.',
    };
  }

  return { status: 'success' };
}
