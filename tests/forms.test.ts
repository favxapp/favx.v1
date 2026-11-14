import test from 'node:test';
import assert from 'node:assert/strict';
import { isValidTimeZone, parseBio, parseDisplayName, parseEmail, parseOtp, parseTimeZone } from '../src/lib/forms.ts';
import { safeNextPath } from '../src/lib/redirect.ts';

test('e-mail', () => {
  assert.deepEqual(parseEmail('  Maria@Exemplo.com '), { ok: true, value: 'maria@exemplo.com' });
  for (const bad of ['', 'a@b', 'sem-arroba', 'a b@c.com', 'a@b.c', 'x'.repeat(250) + '@a.com', 42, null]) {
    assert.deepEqual(parseEmail(bad), { ok: false, error: 'email_invalid' }, String(bad));
  }
});

test('OTP: 6 a 10 dígitos, espaços ignorados', () => {
  assert.deepEqual(parseOtp('123 456'), { ok: true, value: '123456' });
  assert.deepEqual(parseOtp('12345678'), { ok: true, value: '12345678' });
  for (const bad of ['12345', '12345678901', 'abc123', '', '12-3456']) assert.deepEqual(parseOtp(bad), { ok: false, error: 'otp_invalid' }, bad);
});

test('nome, bio e fuso IANA', () => {
  assert.deepEqual(parseDisplayName('  Maria   Silva '), { ok: true, value: 'Maria Silva' });
  assert.deepEqual(parseDisplayName('   '), { ok: false, error: 'display_name_required' });
  assert.deepEqual(parseDisplayName('x'.repeat(81)), { ok: false, error: 'display_name_too_long' });
  assert.deepEqual(parseBio(''), { ok: true, value: null });
  assert.deepEqual(parseBio('olá'), { ok: true, value: 'olá' });
  assert.deepEqual(parseBio('x'.repeat(501)), { ok: false, error: 'bio_too_long' });
  assert.equal(isValidTimeZone('America/Sao_Paulo'), true);
  assert.equal(isValidTimeZone('Europe/Lisbon'), true);
  assert.equal(isValidTimeZone('Mars/Olympus'), false);
  assert.deepEqual(parseTimeZone('Mars/Olympus'), { ok: false, error: 'timezone_invalid' });
});

test('safeNextPath impede open redirect', () => {
  assert.equal(safeNextPath('/app/creator/profile'), '/app/creator/profile');
  assert.equal(safeNextPath('/app'), '/app');
  for (const bad of ['https://evil.com', '//evil.com', '/\\evil.com', '/app//x', '/outro', 'javascript:alert(1)', '/app/x://y', undefined, 5, '/app/\u0000x']) {
    assert.equal(safeNextPath(bad), '/app/me', String(bad));
  }
});
