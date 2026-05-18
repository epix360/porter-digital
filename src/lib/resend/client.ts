import 'server-only';
import { Resend } from 'resend';
import type { ReactElement } from 'react';

const resend = new Resend(process.env.RESEND_API_KEY);

type SendEmailArgs = {
  to: string | string[];
  subject: string;
  react: ReactElement;
  from?: string;
  replyTo?: string;
};

export async function sendEmail({ to, subject, react, from, replyTo }: SendEmailArgs) {
  const fromAddress = from || process.env.RESEND_FROM_EMAIL;
  if (!fromAddress) throw new Error('RESEND_FROM_EMAIL is not set');

  const { data, error } = await resend.emails.send({
    from: fromAddress,
    to,
    subject,
    react,
    replyTo,
  });

  if (error) {
    console.error('Resend error:', error);
    throw new Error(error.message);
  }

  return data;
}
