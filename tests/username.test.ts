import test from 'node:test';
import assert from 'node:assert/strict';
import { RESERVED_SLUGS, USERNAME_REGEX, normalizeUsername, usernameProblem } from '../src/lib/username.ts';

test('formato: ASCII minúsculo, 3-30, sem ponto', () => {
  assert.equal(usernameProblem('maria_silva'), null);
  assert.equal(usernameProblem('abc'), null);
  assert.equal(usernameProblem('ab'), 'format');
  assert.equal(usernameProblem('a'.repeat(31)), 'format');
  for (const bad of ['user.name', 'robots.txt', 'sitemap.xml', 'favicon.ico', 'manifest.json', '_next', '-abc', ' ', 'maria silva', 'josé']) {
    assert.equal(usernameProblem(bad), 'format', bad);
  }
});

test('normalização NFKC, trim e caixa (A-03)', () => {
  assert.equal(normalizeUsername('  Maria_Silva '), 'maria_silva');
  assert.equal(usernameProblem('ＡＰＰ'), 'reserved'); // full-width => app
  assert.equal(usernameProblem('  App '), 'reserved');
  assert.equal(usernameProblem('APP'), 'reserved');
});

test('todo slug reservado, em 3 variações de caixa, é recusado (C1)', () => {
  for (const s of RESERVED_SLUGS) {
    for (const v of [s, s.toUpperCase(), s.charAt(0).toUpperCase() + s.slice(1)]) {
      assert.notEqual(usernameProblem(v), null, `${v} deveria ser recusado`);
    }
  }
});

test('lista de reservados: tamanho, unicidade, minúsculas e itens críticos', () => {
  assert.equal(RESERVED_SLUGS.length, 119);
  assert.equal(new Set(RESERVED_SLUGS).size, RESERVED_SLUGS.length);
  for (const s of RESERVED_SLUGS) assert.equal(s, s.toLowerCase());
  for (const s of ['app', 'admin', 'api', 'auth', 'site', 'pt-br', 'pt-pt', 'en', 'es', 'it', 'fr', 'creator', 'partner', 'partners', 'collections', 'ajuda', 'precos', 'entrar', 'error']) {
    assert.ok(RESERVED_SLUGS.includes(s), s);
  }
});

test('códigos HTTP numéricos de erro são reservados; outros numéricos seguem válidos (hipótese a confirmar)', () => {
  for (const c of ['400', '401', '403', '404', '405', '410', '429', '500', '502', '503', '504']) {
    assert.equal(usernameProblem(c), 'reserved', c);
  }
  for (const ok of ['000', '123', '1234', '2026']) assert.equal(usernameProblem(ok), null, ok);
});

test('rotas físicas do app (raízes) estão todas reservadas', () => {
  const physicalRoots = ['app', 'auth', 'api', 'site', 'admin', 'pt-br', 'pt-pt', 'en', 'es', 'it', 'fr', 's', 'c', 'p', 'r', 'error', '403', '404', '500'];
  for (const r of physicalRoots) {
    assert.notEqual(usernameProblem(r), null, `${r} precisa ser recusado como username`);
    assert.ok(RESERVED_SLUGS.includes(r) || !USERNAME_REGEX.test(r), r);
  }
});
