import test from 'node:test';
import assert from 'node:assert/strict';
import sharp from 'sharp';
import { parseSocialLinks, SOCIAL_NETWORKS } from '../src/lib/creator/social.ts';
import { avatarUrl, bunnyConfig, prepareAvatar, uploadAvatar } from '../src/lib/creator/avatar.ts';

test('social links accept supported networks and reject spoofed, duplicate and executable destinations', () => {
  for (const network of SOCIAL_NETWORKS) assert.equal(parseSocialLinks([{ network: network.id, url: `https://${network.hosts[0]}/creator` }]).ok, true);
  for (const url of ['javascript:alert(1)', 'http://instagram.com/a', 'https://instagram.com.evil.test/a', 'https://instagram.com@evil.test/a', 'https://evil@instagram.com/a', 'https://instagram.com:8443/a', 'https://instagram.com\\@evil.test/a']) {
    assert.equal(parseSocialLinks([{ network: 'instagram', url }]).ok, false, url);
  }
  assert.equal(parseSocialLinks([{ network: 'instagram', url: 'https://instagram.com/a' }, { network: 'instagram', url: 'https://instagram.com/b' }]).ok, false);
  assert.equal(parseSocialLinks('[{"network":"instagram"}]').ok, false);
  assert.equal(parseSocialLinks('invalid').ok, false);
});

test('photo decoder rejects disguised files and strips metadata from a 512px derivative', async () => {
  await assert.rejects(prepareAvatar(Buffer.from('<svg xmlns="http://www.w3.org/2000/svg"></svg>')));
  await assert.rejects(prepareAvatar(new Uint8Array(2 * 1024 * 1024 + 1)));
  const original = await sharp({ create: { width: 1200, height: 600, channels: 3, background: '#c0a080' } }).jpeg().withMetadata().toBuffer();
  const output = await prepareAvatar(original);
  const metadata = await sharp(output).metadata();
  assert.equal(metadata.width, 512); assert.equal(metadata.height, 512); assert.equal(metadata.format, 'webp'); assert.equal(metadata.exif, undefined);
});

test('storage credentials go only to the configured Bunny storage host, never CDN or arbitrary hosts', async () => {
  const config = bunnyConfig({ BUNNY_STORAGE_HOST: 'ny.storage.bunnycdn.com', BUNNY_STORAGE_ZONE: 'test-zone', BUNNY_STORAGE_ACCESS_KEY: 'fake-key', BUNNY_CDN_URL: 'https://test.b-cdn.net/' });
  assert.throws(() => bunnyConfig({ BUNNY_STORAGE_HOST: 'evil.test', BUNNY_STORAGE_ZONE: 'test', BUNNY_STORAGE_ACCESS_KEY: 'fake', BUNNY_CDN_URL: 'https://test.b-cdn.net' }));
  assert.throws(() => bunnyConfig({}));
  const path = '11111111-1111-1111-1111-111111111111/22222222-2222-2222-2222-222222222222.webp';
  assert.equal(avatarUrl(path, config.cdn), `https://test.b-cdn.net/avatars/${path}`);
  assert.equal(avatarUrl('../secret', config.cdn), null);
  await uploadAvatar(path, new Uint8Array([1]), config, async (url, init) => {
    assert.equal(String(url), `${config.endpoint}${path}`);
    assert.equal(new Headers(init?.headers).get('AccessKey'), 'fake-key');
    assert.equal(init?.redirect, 'error');
    return new Response(null, { status: 201 });
  });
  await assert.rejects(uploadAvatar(path, new Uint8Array([1]), config, async () => new Response(null, { status: 403 })));
});
