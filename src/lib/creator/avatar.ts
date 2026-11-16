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

export function avatarUrl(path: string | null): string | null {
  return path && AVATAR_PATH.test(path) ? `/api/media/avatar/${path}` : null;
}

export function avatarCdnUrl(path: string | null, cdnUrl = process.env.BUNNY_CDN_URL): string | null {
  if (!path || !cdnUrl || !AVATAR_PATH.test(path)) return null;
  const url = new URL(cdnUrl.trim());
  if (url.protocol !== 'https:' || url.username || url.password || url.pathname !== '/' || url.search || url.hash) throw Error('Invalid CDN origin');
  return `${url.origin}/avatars/${path}`;
}

export class AvatarStorageError extends Error {
  readonly stage: 'configuration' | 'upload' | 'cleanup';
  readonly status?: number;
  constructor(stage: 'configuration' | 'upload' | 'cleanup', status?: number) {
    super('avatar_unavailable');
    this.stage = stage; this.status = status;
  }
}

export function bunnyConfig(env: Record<string, string | undefined> = process.env) {
  // Dashboard values are often copied as a URL; accept HTTPS root URLs as well as hostnames.
  const rawHost = env.BUNNY_STORAGE_HOST?.trim().toLowerCase();
  const zone = env.BUNNY_STORAGE_ZONE?.trim();
  const key = env.BUNNY_STORAGE_ACCESS_KEY?.trim();
  const cdn = env.BUNNY_CDN_URL?.trim();
  try {
    if (!rawHost || !zone || !/^[a-zA-Z0-9_-]+$/.test(zone) || !key || !cdn) throw Error();
    const url = new URL(rawHost.includes('://') ? rawHost : `https://${rawHost}`);
    if (url.protocol !== 'https:' || url.username || url.password || url.port || url.pathname !== '/' || url.search || url.hash || !/^(?:[a-z]{2,3}\.)?storage\.bunnycdn\.com$/.test(url.hostname)) throw Error();
    avatarCdnUrl('00000000-0000-0000-0000-000000000000/00000000-0000-0000-0000-000000000000.webp', cdn);
    return { endpoint: `${url.origin}/${zone}/avatars/`, key, cdn };
  } catch { throw new AvatarStorageError('configuration'); }
}

export async function uploadAvatar(path: string, bytes: Uint8Array, config = bunnyConfig(), transport = fetch) {
  if (!AVATAR_PATH.test(path)) throw Error('avatar_invalid');
  const result = await transport(`${config.endpoint}${path}`, { method: 'PUT', headers: { AccessKey: config.key, 'Content-Type': 'image/webp' }, body: new Uint8Array(bytes), signal: AbortSignal.timeout(15000), redirect: 'error' });
  if (!result.ok) throw new AvatarStorageError('upload', result.status);
}

export async function deleteAvatar(path: string, config = bunnyConfig(), transport = fetch) {
  if (!AVATAR_PATH.test(path)) return;
  const result = await transport(`${config.endpoint}${path}`, { method: 'DELETE', headers: { AccessKey: config.key }, signal: AbortSignal.timeout(5000), redirect: 'error' });
  if (!result.ok && result.status !== 404) throw new AvatarStorageError('cleanup', result.status);
}
