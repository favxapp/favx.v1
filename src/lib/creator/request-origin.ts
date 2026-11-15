/** Compare against explicit deployment origins, never an untrusted forwarded host. */
export function isTrustedOrigin(request: Request, env: Record<string, string | undefined> = process.env): boolean {
  const origin = request.headers.get('origin');
  if (!origin || origin === 'null') return false;
  const allowed = [new URL(request.url).origin];
  for (const candidate of [env.APP_URL, env.VERCEL_URL ? `https://${env.VERCEL_URL}` : undefined]) {
    if (!candidate) continue;
    try { const url = new URL(candidate); if ((url.protocol === 'https:' || (env.NODE_ENV === 'development' && url.protocol === 'http:' && ['localhost', '127.0.0.1'].includes(url.hostname))) && !url.username && !url.password) allowed.push(url.origin); } catch { /* Invalid configuration is not an allowed origin. */ }
  }
  return allowed.includes(origin);
}
