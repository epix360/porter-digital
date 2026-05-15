import { type NextRequest, NextResponse } from 'next/server';
import crypto from 'node:crypto';

/**
 * Tally webhook handler.
 *
 * Configure in Tally: Form → Integrations → Webhooks → New Webhook
 * Signing secret goes in env as TALLY_WEBHOOK_SECRET.
 */
export async function POST(req: NextRequest) {
  const secret = process.env.TALLY_WEBHOOK_SECRET;
  if (!secret) {
    return new NextResponse('Webhook secret not configured', { status: 500 });
  }

  const signature = req.headers.get('tally-signature');
  const raw = await req.text();

  // Verify HMAC SHA-256 signature
  const expected = crypto.createHmac('sha256', secret).update(raw).digest('base64');
  if (!signature || signature !== expected) {
    return new NextResponse('Invalid signature', { status: 401 });
  }

  const payload = JSON.parse(raw) as {
    eventId: string;
    eventType: 'FORM_RESPONSE';
    formId: string;
    data: {
      fields: Array<{ key: string; label: string; type: string; value: unknown }>;
    };
  };

  // Flatten fields into a friendlier shape
  const fields = Object.fromEntries(payload.data.fields.map((f) => [f.label, f.value]));

  // TODO: business logic — save to DB, send email, etc.
  console.log('Tally submission:', { formId: payload.formId, fields });

  return NextResponse.json({ ok: true });
}
