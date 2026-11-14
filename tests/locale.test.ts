import test from 'node:test';
import assert from 'node:assert/strict';
import { LOCALES, negotiateLocale, normalizeLocale, splitLocalePath } from '../src/lib/locale.ts';

test('seis idiomas oficiais', () => {
  assert.deepEqual([...LOCALES], ['pt-br', 'pt-pt', 'en', 'es', 'it', 'fr']);
});

test('normalizeLocale ignora caixa e rejeita desconhecidos', () => {
  assert.equal(normalizeLocale('pt-BR'), 'pt-br');
  assert.equal(normalizeLocale('EN'), 'en');
  assert.equal(normalizeLocale('de'), null);
  assert.equal(normalizeLocale(''), null);
  assert.equal(normalizeLocale(undefined), null);
});

test('negociação: cookie vence; Accept-Language por q; padrão pt-br', () => {
  assert.equal(negotiateLocale('en-US,en;q=0.9', 'fr'), 'fr');
  assert.equal(negotiateLocale('en-US,en;q=0.9'), 'en');
  assert.equal(negotiateLocale('pt-PT,pt;q=0.9,en;q=0.5'), 'pt-pt');
  assert.equal(negotiateLocale('pt-BR'), 'pt-br');
  assert.equal(negotiateLocale('pt'), 'pt-br');
  assert.equal(negotiateLocale('pt-AO'), 'pt-pt');
  assert.equal(negotiateLocale('de,es;q=0.8,fr;q=0.9'), 'fr');
  assert.equal(negotiateLocale('de,ja'), 'pt-br');
  assert.equal(negotiateLocale(null, null), 'pt-br');
  assert.equal(negotiateLocale('en;q=0,es;q=0.1'), 'es');
  assert.equal(negotiateLocale('xx', 'zz'), 'pt-br');
});

test('splitLocalePath: prefixo, caixa errada e caminhos sem idioma', () => {
  assert.deepEqual(splitLocalePath('/pt-br/login'), { locale: 'pt-br', wrongCase: false, rest: '/login' });
  assert.deepEqual(splitLocalePath('/pt-BR/login'), { locale: 'pt-br', wrongCase: true, rest: '/login' });
  assert.deepEqual(splitLocalePath('/en'), { locale: 'en', wrongCase: false, rest: '' });
  assert.deepEqual(splitLocalePath('/maria'), { locale: null, wrongCase: false, rest: '/maria' });
  assert.deepEqual(splitLocalePath('/app/me'), { locale: null, wrongCase: false, rest: '/app/me' });
});
