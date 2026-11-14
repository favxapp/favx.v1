import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { LOCALES } from '../src/lib/locale.ts';

function flatten(obj: Record<string, unknown>, prefix = ''): string[] {
  return Object.entries(obj).flatMap(([k, v]) =>
    v && typeof v === 'object' ? flatten(v as Record<string, unknown>, `${prefix}${k}.`) : [`${prefix}${k}`],
  );
}
function load(l: string): Record<string, unknown> {
  return JSON.parse(readFileSync(new URL(`../src/lib/i18n/messages/${l}.json`, import.meta.url), 'utf-8'));
}

test('os seis idiomas têm exatamente as mesmas chaves e nenhum valor vazio', () => {
  const base = flatten(load('pt-br')).sort();
  for (const l of LOCALES) {
    const keys = flatten(load(l)).sort();
    assert.deepEqual(keys, base, l);
    const raw = JSON.stringify(load(l));
    assert.ok(!raw.includes('""'), `${l} tem string vazia`);
  }
});

test('placeholders {email} e {username} presentes em todos os idiomas', () => {
  for (const l of LOCALES) {
    const m = load(l) as { login: { sentTo: string }; me: { creatorActive: string } };
    assert.ok(m.login.sentTo.includes('{email}'), l);
    assert.ok(m.me.creatorActive.includes('{username}'), l);
  }
});

test('todo código de erro de formulário tem mensagem em todos os idiomas', () => {
  const codes = ['email_invalid', 'otp_invalid', 'otp_failed', 'send_failed', 'rate_limited', 'username_format', 'username_reserved', 'username_taken', 'display_name_required', 'display_name_too_long', 'bio_too_long', 'timezone_invalid', 'locale_invalid', 'unauthorized', 'generic'];
  for (const l of LOCALES) {
    const errors = (load(l) as { errors: Record<string, string> }).errors;
    for (const c of codes) assert.ok(errors[c] && errors[c].length > 3, `${l}.${c}`);
  }
});
