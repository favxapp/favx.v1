import test from 'node:test';
import assert from 'node:assert/strict';
import { EMPTY_POST, parsePost, characterCount, postSlug } from '../src/lib/posts/model.ts';
test('editor validates drafts, publishing, Unicode length, ratings and safe destinations', () => {
  assert.equal(parsePost(EMPTY_POST, 'draft').ok, true);
  assert.equal(parsePost(EMPTY_POST, 'published').ok, false);
  const post = { ...EMPTY_POST, title: 'Café & viagens', body: 'Recomendação', rating: 9.5 };
  assert.equal(parsePost(post, 'published').ok, true);
  assert.equal(postSlug(post.title), 'cafe-viagens');
  assert.equal(characterCount('😀'), 1);
  assert.equal(parsePost({ ...post, body: '😀'.repeat(10000) }, 'published').ok, true);
  assert.equal(parsePost({ ...post, body: 'a'.repeat(10001) }, 'published').ok, false);
  assert.equal(parsePost({ ...post, rating: 9.75 }, 'published').ok, false);
  assert.equal(parsePost({ ...post, is_sponsored: true }, 'published').ok, false);
  assert.equal(parsePost({ ...post, is_sponsored: true, disclosure: 'Parceria paga' }, 'published').ok, true);
  for (const url of ['javascript:alert(1)', 'http://example.com', 'https://example.com@evil.test', 'https://example.com:9443', 'https://example.com\\@evil.test']) {
    assert.equal(parsePost({ ...post, links: [{ label: 'Site', url, coupon: '' }] }, 'published').ok, false, url);
  }
  assert.equal(parsePost({ ...post, links: [{ label: 'Site', url: 'https://example.com/path?q=1', coupon: 'FAVX10' }] }, 'published').ok, true);
});
