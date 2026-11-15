import test from 'node:test';
import assert from 'node:assert/strict';
import { createHmac } from 'node:crypto';
import { EMAIL_MESSAGES } from '../src/lib/email/messages.ts';
import { LOCALES } from '../src/lib/locale.ts';
import { renderOtpEmail } from '../src/lib/email/template.ts';
import { emailLocale, otpRequestOptions } from '../src/lib/email/locale.ts';
import { createSendEmailHandler, readEmailConfig } from '../src/lib/email/send-hook.ts';

const secret = Buffer.alloc(32, 7).toString('base64');
const config = { apiKey: 'test-key-not-a-credential', hookSecret: `v1,whsec_${secret}`, appUrl: 'https://favx-v1.vercel.app', fromEmail: 'noreply@mail.favx.app', supportEmail: 'suporte@favx.app' };
const event = (locale = 'fr') => ({ user: { email: 'person@example.com', user_metadata: { preferred_locale: 'en' } }, email_data: { token: '123456', email_action_type: 'magiclink', redirect_to: `${config.appUrl}/${locale}/login` } });
function signed(payload: unknown, secondsAgo = 0, id = 'msg_test') {
  const body = JSON.stringify(payload);
  const timestamp = String(Math.floor(Date.now() / 1000) - secondsAgo);
  const sig = createHmac('sha256', Buffer.from(secret, 'base64')).update(`${id}.${timestamp}.${body}`).digest('base64');
  return new Request(`${config.appUrl}/api/auth/send-email`, { method: 'POST', body, headers: { 'webhook-id': id, 'webhook-timestamp': timestamp, 'webhook-signature': `v1,${sig}`, 'Content-Type': 'application/json' } });
}
const silent = () => {};

test('all six emails render translated HTML and plain text with OTP and support', () => {
  assert.deepEqual(Object.keys(EMAIL_MESSAGES).sort(), [...LOCALES].sort());
  for (const locale of LOCALES) {
    const mail = renderOtpEmail(locale, '1234567890', config);
    assert.match(mail.html, new RegExp(`<html lang="${locale}"`));
    assert.ok(mail.html.includes(EMAIL_MESSAGES[locale].support));
    assert.ok(mail.text.includes('1234567890'));
    assert.ok(mail.html.includes('mailto:suporte@favx.app'));
    assert.ok(mail.html.includes('1234567890'));
    assert.ok(!mail.html.includes('token_hash') && !mail.html.includes('auth/v1/verify'));
    assert.ok(!mail.subject.includes('1234567890'));
  }
});

test('unsafe tokens/URLs are rejected and logo attributes are escaped', () => {
  assert.throws(() => renderOtpEmail('en', '<script>', config));
  assert.throws(() => renderOtpEmail('en', '123456', { ...config, logoUrl: 'javascript:alert(1)' }));
  assert.throws(() => renderOtpEmail('en', '123456', { ...config, supportEmail: 'bad\r\nBcc:other@example.com' }));
  const mail = renderOtpEmail('en', '123456', { ...config, logoUrl: 'https://cdn.example.com/logo.png?a=1&b=2' });
  assert.ok(mail.html.includes('a=1&amp;b=2'));
});

test('language follows current allowed login URL even for a returning user', () => {
  for (const locale of LOCALES) {
    const options = otpRequestOptions(locale, config.appUrl);
    assert.equal(emailLocale(options.emailRedirectTo, 'en', config.appUrl), locale);
    assert.equal(options.data.preferred_locale, locale);
  }
  assert.equal(emailLocale('https://evil.example/fr/login', 'it', config.appUrl), 'it');
  assert.equal(emailLocale('https://favx-v1.vercel.app/unknown/login', 'bad', config.appUrl), 'pt-br');
  assert.equal(emailLocale(null, 'pt-PT', config.appUrl), 'pt-pt');
  assert.equal(emailLocale({}, { role: 'admin' }, config.appUrl), 'pt-br');
  assert.throws(() => otpRequestOptions('en', 'http://evil.example'));
});

test('signed hook sends through Resend with deterministic idempotency and approved sender', async () => {
  const calls: { input: string; init: RequestInit }[] = [];
  const handler = createSendEmailHandler(config, async (input, init) => {
    calls.push({ input: String(input), init: init! });
    return Response.json({ id: 'message-accepted' });
  }, silent);
  assert.equal((await handler(signed(event()))).status, 200);
  assert.equal((await handler(signed(event()))).status, 200);
  const body = JSON.parse(String(calls[0].init.body));
  assert.equal(calls[0].input, 'https://api.resend.com/emails');
  assert.equal(body.from, 'FAVX <noreply@mail.favx.app>');
  assert.equal(body.reply_to, 'suporte@favx.app');
  assert.deepEqual(body.to, ['person@example.com']);
  assert.equal(body.subject, EMAIL_MESSAGES.fr.subject);
  const first = new Headers(calls[0].init.headers).get('Idempotency-Key');
  assert.equal(first, new Headers(calls[1].init.headers).get('Idempotency-Key'));
  assert.ok(!first?.includes('123456'));
});

test('signup and existing-user magiclink events both send the Supabase OTP', async () => {
  const handler = createSendEmailHandler(config, async () => Response.json({ id: 'ok' }), silent);
  for (const type of ['signup', 'magiclink', 'email']) {
    const payload = event();payload.email_data.email_action_type = type;
    assert.equal((await handler(signed(payload))).status, 200);
  }
});

test('unsigned, tampered, old, future, invalid and unsupported requests never send', async () => {
  let calls = 0;
  const handler = createSendEmailHandler(config, async () => { calls++; return Response.json({ id: 'ok' }); }, silent);
  assert.equal((await handler(new Request(config.appUrl, { method: 'POST', body: JSON.stringify(event()) }))).status, 401);
  const original = signed(event());
  assert.equal((await handler(new Request(config.appUrl, { method: 'POST', headers: original.headers, body: JSON.stringify(event('es')) }))).status, 401);
  assert.equal((await handler(signed(event(), 600))).status, 401);
  assert.equal((await handler(signed(event(), -600))).status, 401);
  const unsupported = event();unsupported.email_data.email_action_type = 'email_change';
  assert.equal((await handler(signed(unsupported))).status, 422);
  assert.equal((await handler(signed({}))).status, 422);
  const invalid = event();invalid.email_data.token = 'not-an-otp';
  assert.equal((await handler(signed(invalid))).status, 400);
  assert.equal((await handler(new Request(config.appUrl))).status, 405);
  assert.equal((await handler(signed({ padding: 'x'.repeat(21000) }))).status, 413);
  assert.equal(calls, 0);
});

test('provider failures are not reported as success and never expose provider body', async () => {
  for (const [providerStatus, expected] of [[403, 500], [429, 503], [500, 503]]) {
    const logs: unknown[] = [];
    const handler = createSendEmailHandler(config, async () => Response.json({ message: 'person@example.com 123456' }, { status: providerStatus }), (...args) => logs.push(args));
    const result = await handler(signed(event()));
    assert.equal(result.status, expected);
    assert.ok(!(await result.text()).includes('123456'));
    assert.ok(!JSON.stringify(logs).includes('person@example.com'));
  }
  const timeout = createSendEmailHandler(config, async () => { throw new Error('timeout with secret'); }, silent);
  assert.equal((await timeout(signed(event()))).status, 503);
  const malformed = createSendEmailHandler(config, async () => Response.json({}), silent);
  assert.equal((await malformed(signed(event()))).status, 503);
});

test('missing configuration fails closed; approved addresses are defaults', () => {
  assert.throws(() => readEmailConfig({}));
  const result = readEmailConfig({ RESEND_API_KEY: 'test', SEND_EMAIL_HOOK_SECRET: secret, APP_URL: config.appUrl });
  assert.equal(result.fromEmail, config.fromEmail);
  assert.equal(result.supportEmail, config.supportEmail);
});
