import { AVATAR_PATH, avatarCdnUrl, bunnyConfig } from './avatar.ts';

/** Only public, sanitized profile derivatives. Never accepts post paths or arbitrary URLs. */
export async function deliverAvatar(path: string, config = bunnyConfig(), transport = fetch): Promise<Response> {
  const missing = () => new Response(null, { status: 404, headers: { 'Cache-Control': 'no-store' } });
  if (!AVATAR_PATH.test(path)) return missing();
  const destinations: { url: string; headers: Record<string, string> }[] = [
    { url: avatarCdnUrl(path, config.cdn)!, headers: {} },
    { url: `${config.endpoint}${path}`, headers: { AccessKey: config.key } },
  ];
  for (const destination of destinations) {
    try {
      const result = await transport(destination.url, { headers: destination.headers, signal: AbortSignal.timeout(8000), redirect: 'error', cache: 'no-store' });
      if (!result.ok) { await result.body?.cancel(); continue; }
      // Never relay HTML error pages, large objects, arbitrary headers, or upstream credentials.
      const reader = result.body?.getReader(); if (!reader) continue;
      const chunks: Uint8Array[] = []; let length = 0;
      try {
        while (true) {
          const { done, value } = await reader.read(); if (done) break;
          length += value.byteLength;
          if (length > 2 * 1024 * 1024) { await reader.cancel(); throw Error('avatar_too_large'); }
          chunks.push(value);
        }
      } finally { reader.releaseLock(); }
      const bytes = Buffer.concat(chunks);
      if (bytes.length < 12 || bytes.toString('ascii', 0, 4) !== 'RIFF' || bytes.toString('ascii', 8, 12) !== 'WEBP') continue;
      return new Response(bytes, { headers: { 'Content-Type': 'image/webp', 'Content-Length': String(bytes.length), 'X-Content-Type-Options': 'nosniff', 'Cache-Control': 'public, max-age=86400, s-maxage=604800, immutable' } });
    } catch { /* Try the controlled Storage origin if CDN delivery is unavailable. */ }
  }
  return missing();
}
