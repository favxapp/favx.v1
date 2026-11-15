import { createHash } from 'node:crypto';
import { Webhook } from 'standardwebhooks';
import { emailLocale } from './locale.ts';
import { emailAddress, httpsOrigin, renderOtpEmail, type EmailBrand } from './template.ts';

type Config = EmailBrand & { apiKey: string; hookSecret: string; fromEmail: string };
type Fetcher = typeof fetch;
type Reporter = (event: string, status?: number) => void;
const MAX_BYTES = 20 * 1024;
const response = (status: number, message?: string) => Response.json(message ? { error: { http_code: status, message } } : {}, { status, headers: { 'Cache-Control': 'no-store' } });
const object = (value: unknown): Record<string, unknown> => value !== null && typeof value === 'object' && !Array.isArray(value) ? value as Record<string, unknown> : {};

export function readEmailConfig(env: Record<string, string | undefined>): Config {
  const apiKey = env.RESEND_API_KEY;
  const hookSecret = env.SEND_EMAIL_HOOK_SECRET;
  const appUrl = env.APP_URL;
  if (!apiKey || !hookSecret || !appUrl) throw new Error('Missing email configuration');
  const fromEmail = env.RESEND_FROM_EMAIL || 'noreply@mail.favx.app';
  const supportEmail = env.EMAIL_SUPPORT_ADDRESS || 'suporte@favx.app';
  if (!emailAddress(fromEmail) || !emailAddress(supportEmail)) throw new Error('Invalid email configuration');
  httpsOrigin(appUrl);
  return { apiKey, hookSecret, appUrl, fromEmail, supportEmail, logoUrl: env.EMAIL_LOGO_URL || undefined };
}

async function limitedBody(request: Request): Promise<string> {
  if (Number(request.headers.get('content-length')) > MAX_BYTES) throw new Error('Body too large');
  const reader = request.body?.getReader();
  if (!reader) throw new Error('Missing body');
  const chunks: Uint8Array[] = [];
  let length = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      length += value.byteLength;
      if (length > MAX_BYTES) { await reader.cancel(); throw new Error('Body too large'); }
      chunks.push(value);
    }
  } finally { reader.releaseLock(); }
  return Buffer.concat(chunks).toString('utf8');
}

/** Only a signed Supabase event can trigger sending. No user-session or service-role key is used. */
export function createSendEmailHandler(config: Config, transport: Fetcher = fetch, report: Reporter = (event, status) => console.error(event, status ?? '')) {
  const verifier = new Webhook(config.hookSecret.replace(/^v1,/, ''));
  return async (request: Request): Promise<Response> => {
    if (request.method !== 'POST') return response(405, 'Method not allowed');
    let raw: string;
    try { raw = await limitedBody(request); } catch { return response(413, 'Invalid payload size'); }
    let event: Record<string, unknown>;
    try { event = object(verifier.verify(raw, Object.fromEntries(request.headers))); }
    catch { return response(401, 'Invalid webhook signature'); }
    const user = object(event.user);
    const email = object(event.email_data);
    // This app currently supports signup/sign-in OTP only. Never silently acknowledge other Auth events.
    if (!['signup', 'magiclink', 'email'].includes(String(email.email_action_type))) {
      report('auth_email_unsupported_action');
      return response(422, 'Unsupported auth email action');
    }
    if (typeof user.email !== 'string' || !emailAddress(user.email) || typeof email.token !== 'string' || !/^\d{6,10}$/.test(email.token)) return response(400, 'Invalid auth email payload');
    let rendered: ReturnType<typeof renderOtpEmail>;
    try {
      const locale = emailLocale(email.redirect_to, object(user.user_metadata).preferred_locale, config.appUrl);
      rendered = renderOtpEmail(locale, email.token, config);
    } catch {
      report('auth_email_configuration_invalid');
      return response(500, 'Email configuration unavailable');
    }
    // Resend deduplicates repeated delivery of the same signed webhook for 24 hours.
    const id = createHash('sha256').update(request.headers.get('webhook-id')!).digest('hex');
    try {
      const result = await transport('https://api.resend.com/emails', {
        method: 'POST',
        headers: { Authorization: `Bearer ${config.apiKey}`, 'Content-Type': 'application/json', 'Idempotency-Key': `favx-auth/${id}` },
        body: JSON.stringify({ from: `FAVX <${config.fromEmail}>`, to: [user.email], reply_to: config.supportEmail, ...rendered }),
        signal: AbortSignal.timeout(3000),
        redirect: 'error',
      });
      if (!result.ok) {
        report('auth_email_provider_rejected', result.status);
        // Do not log response bodies: they can contain recipient data. Transient errors may be retried by Supabase.
        return response(result.status === 429 || result.status >= 500 ? 503 : 500, 'Email delivery failed');
      }
      const data = object(await result.json());
      if (typeof data.id !== 'string' || !data.id) throw new Error('Invalid provider acknowledgement');
      return response(200);
    } catch {
      report('auth_email_provider_unavailable');
      return response(503, 'Email provider unavailable');
    }
  };
}
