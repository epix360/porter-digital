# Resend Module

Transactional email with React Email templates.

## Install

```bash
pnpm add resend @react-email/components
pnpm add -D react-email
```

Add to `.env.local`:

```
RESEND_API_KEY=
RESEND_FROM_EMAIL="Hello <hello@yourdomain.com>"
```

## Copy in

```
src/lib/resend/
├── client.ts         # Resend client + send helper
emails/
└── welcome.tsx       # Example template
src/app/api/send/
└── route.ts          # Example API route
```

## DNS setup

1. Add your sending domain at resend.com/domains
2. Add the DNS records they provide (SPF, DKIM, DMARC)
3. Wait for verification before sending

## Usage

```ts
import { sendEmail } from '@/lib/resend/client';
import WelcomeEmail from '@/../emails/welcome';

await sendEmail({
  to: 'user@example.com',
  subject: 'Welcome',
  react: <WelcomeEmail name="Sam" />,
});
```

## Preview emails locally

```bash
npx react-email dev
```

Opens at http://localhost:3000 (use a different port from your app).
