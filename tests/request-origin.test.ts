import test from 'node:test';
import assert from 'node:assert/strict';
import { isTrustedOrigin } from '../src/lib/creator/request-origin.ts';
test('aliased deployment accepts configured app origin but rejects forged forwarded host and null', () => {
  const request = (origin: string) => new Request('https://deploy.vercel.app/api/creator/avatar', { headers: { origin, 'x-forwarded-host': 'evil.test' } });
  assert.equal(isTrustedOrigin(request('https://favx.app'), { APP_URL: 'https://favx.app' }), true);
  assert.equal(isTrustedOrigin(request('https://deploy.vercel.app'), {}), true);
  for (const origin of ['https://evil.test', 'null', 'https://favx.app.evil.test']) assert.equal(isTrustedOrigin(request(origin), { APP_URL: 'https://favx.app' }), false);
});
