import test from 'node:test';
import assert from 'node:assert/strict';
import sharp from 'sharp';
import { deliverAvatar } from '../src/lib/creator/avatar-delivery.ts';
import { bunnyConfig } from '../src/lib/creator/avatar.ts';
const path = '11111111-1111-4111-8111-111111111111/22222222-2222-4222-8222-222222222222.webp';
const config = bunnyConfig({BUNNY_STORAGE_HOST:'br.storage.bunnycdn.com',BUNNY_STORAGE_ZONE:'test',BUNNY_STORAGE_ACCESS_KEY:'fixture-secret',BUNNY_CDN_URL:'https://fixture.b-cdn.net'});
test('CDN 404 falls back to Storage with credentials confined to Storage and a bounded WebP response', async () => {
  const webp=await sharp({create:{width:512,height:512,channels:3,background:'#aaa'}}).webp().toBuffer();
  let count=0;
  const response=await deliverAvatar(path,config,async(url,init)=>{
    count++;
    assert.equal(init?.redirect,'error');
    if(String(url).startsWith('https://fixture.b-cdn.net')){
      assert.equal(new Headers(init?.headers).has('AccessKey'),false);
      return new Response('<h1>404</h1>',{status:404});
    }
    assert.equal(String(url),`${config.endpoint}${path}`);
    assert.equal(new Headers(init?.headers).get('AccessKey'),'fixture-secret');
    return new Response(webp,{headers:{AccessKey:'must-not-relay','Set-Cookie':'must-not-relay'}});
  });
  assert.equal(count,2);assert.equal(response.status,200);assert.equal(response.headers.get('Content-Type'),'image/webp');
  assert.equal(response.headers.has('AccessKey'),false);assert.equal(response.headers.has('Set-Cookie'),false);
  assert.deepEqual(Buffer.from(await response.arrayBuffer()),webp);
});
test('avatar delivery rejects invalid paths, HTML responses and oversized objects', async () => {
  let calls=0;
  const transport: typeof fetch=async()=>{calls++;return new Response('<html>error</html>');};
  assert.equal((await deliverAvatar('../private/original',config,transport)).status,404);assert.equal(calls,0);
  assert.equal((await deliverAvatar(path,config,transport)).status,404);
  const oversized=await deliverAvatar(path,config,async()=>new Response(new Uint8Array(2*1024*1024+1)));
  assert.equal(oversized.status,404);assert.equal(oversized.headers.get('Cache-Control'),'no-store');
});
