import sharp from 'sharp';

export const MAX_AVATAR_BYTES = 2 * 1024 * 1024;
export const AVATAR_PATH = /^[a-f0-9-]{36}\/[a-f0-9-]{36}\.webp$/;

/** Public profile photo derivative only. Original post media belongs to a separate, private pipeline. */
export async function prepareAvatar(bytes: Uint8Array): Promise<Buffer> {
  if (!bytes.byteLength || bytes.byteLength > MAX_AVATAR_BYTES) throw Error('avatar_invalid');
  const image = sharp(bytes, { limitInputPixels: 16_000_000, failOn: 'warning' });
  const metadata = await image.metadata();
  if (!['jpeg', 'png', 'webp'].includes(metadata.format ?? '') || (metadata.pages ?? 1) > 1) throw Error('avatar_invalid');
  return image.rotate().resize(512, 512, { fit: 'cover' }).webp({ quality: 85 }).toBuffer();
}

export function avatarUrl(path: string | null, cdnUrl = process.env.BUNNY_CDN_URL): string | null {
  if (!path || !cdnUrl || !AVATAR_PATH.test(path)) return null;
  const url = new URL(cdnUrl);
  if (url.protocol !== 'https:' || url.username || url.password || url.pathname !== '/' || url.search || url.hash) throw Error('Invalid CDN origin');
  return `${url.origin}/avatars/${path}`;
}

export function bunnyConfig(env: Record<string, string | undefined> = process.env) {
  const host = env.BUNNY_STORAGE_HOST;
  const zone = env.BUNNY_STORAGE_ZONE;
  const key = env.BUNNY_STORAGE_ACCESS_KEY;
  const cdn = env.BUNNY_CDN_URL;
  if (!host || !/^(?:[a-z]{2}\.)?storage\.bunnycdn\.com$/.test(host) || !zone || !/^[a-zA-Z0-9_-]+$/.test(zone) || !key || !cdn) throw Error('avatar_unavailable');
  avatarUrl('00000000-0000-0000-0000-000000000000/00000000-0000-0000-0000-000000000000.webp', cdn);
  return { endpoint: `https://${host}/${zone}/avatars/`, key, cdn };
}

export async function uploadAvatar(path: string, bytes: Uint8Array, config = bunnyConfig(), transport = fetch) {
  if (!AVATAR_PATH.test(path)) throw Error('avatar_invalid');
  const result = await transport(`${config.endpoint}${path}`, { method: 'PUT', headers: { AccessKey: config.key, 'Content-Type': 'image/webp' }, body: new Uint8Array(bytes), signal: AbortSignal.timeout(15000), redirect: 'error' });
  if (!result.ok) throw Error('avatar_failed');
}

export async function deleteAvatar(path: string, config = bunnyConfig(), transport = fetch) {
  if (!AVATAR_PATH.test(path)) return;
  await transport(`${config.endpoint}${path}`, { method: 'DELETE', headers: { AccessKey: config.key }, signal: AbortSignal.timeout(5000), redirect: 'error' });
}
