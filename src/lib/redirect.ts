/** Evita open redirect: só caminhos internos da área autenticada. */
export function safeNextPath(raw: unknown, fallback = '/app/me'): string {
  if (typeof raw !== 'string') return fallback;
  const v = raw.trim();
  if (!v.startsWith('/app/') && v !== '/app') return fallback;
  if (v.includes('//') || v.includes('\\') || v.includes('://') || /[\u0000-\u001f]/.test(v)) return fallback;
  return v;
}
