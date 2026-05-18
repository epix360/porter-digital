import 'server-only';

const TURNSTILE_VERIFY_URL =
  'https://challenges.cloudflare.com/turnstile/v0/siteverify';

type TurnstileResponse = {
  success: boolean;
  challenge_ts?: string;
  hostname?: string;
  'error-codes'?: string[];
  action?: string;
  cdata?: string;
};

export async function verifyTurnstileToken(
  token: string,
  remoteIp?: string,
): Promise<{ success: boolean; errors?: string[] }> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) {
    throw new Error('TURNSTILE_SECRET_KEY is not set');
  }
  if (!token) {
    return { success: false, errors: ['missing-input-token'] };
  }

  const body = new URLSearchParams();
  body.append('secret', secret);
  body.append('response', token);
  if (remoteIp) body.append('remoteip', remoteIp);

  const res = await fetch(TURNSTILE_VERIFY_URL, {
    method: 'POST',
    body,
    // Don't cache verifications.
    cache: 'no-store',
  });

  const data = (await res.json()) as TurnstileResponse;
  return { success: data.success, errors: data['error-codes'] };
}
