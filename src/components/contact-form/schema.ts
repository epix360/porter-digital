import { z } from 'zod';

export const contactFormSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(100),
  email: z.email('Enter a valid email address').trim().max(200),
  message: z
    .string()
    .trim()
    .min(10, 'Message must be at least 10 characters')
    .max(5000, 'Message must be 5000 characters or fewer'),
  // Honeypot — must be empty.
  company: z.string().max(0).optional(),
});

export type ContactFormValues = z.infer<typeof contactFormSchema>;
