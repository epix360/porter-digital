# Tally Module

Embed Tally forms with React and handle webhook submissions.

## Install

No npm package required — the included `TallyEmbed` component is a pure
`<iframe>` wrapper with zero dependencies. Tally does not publish an npm
package; if you need their enhanced behavior (auto-resize, popups, etc.),
load their script via `next/script`:

```tsx
import Script from 'next/script';

<Script src="https://tally.so/widgets/embed.js" strategy="lazyOnload" />
```

## Copy in

```
src/components/TallyEmbed.tsx    # React iframe wrapper
src/app/api/tally/route.ts       # Webhook handler (optional)
```

## Usage — embed a form

```tsx
import { TallyEmbed } from '@/components/TallyEmbed';

<TallyEmbed formId="wA7Pkv" height={500} />
```

The form ID is the last segment of your Tally URL: `tally.so/r/wA7Pkv`.

## Usage — webhook

In Tally → Form → Integrations → Webhooks, add:

```
https://yourdomain.com/api/tally
```

Set a signing secret and add it to your env:

```
TALLY_WEBHOOK_SECRET=...
```

The included route handler validates the signature and parses the payload. Customize the
business logic (save to DB, send email, etc.) in `route.ts`.
