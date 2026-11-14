/** Validação server-side sem dependências. Códigos de erro mapeiam para mensagens i18n (errors.*). */
export type Result<T> = { ok: true; value: T } | { ok: false; error: string };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function str(raw: unknown): string {
  return typeof raw === 'string' ? raw : '';
}

export function parseEmail(raw: unknown): Result<string> {
  const v = str(raw).trim().toLowerCase();
  if (v.length < 6 || v.length > 254 || !EMAIL_RE.test(v)) return { ok: false, error: 'email_invalid' };
  return { ok: true, value: v };
}

export function parseOtp(raw: unknown): Result<string> {
  const v = str(raw).replace(/\s+/g, '');
  if (!/^[0-9]{6,10}$/.test(v)) return { ok: false, error: 'otp_invalid' };
  return { ok: true, value: v };
}

export function isValidTimeZone(tz: string): boolean {
  if (!tz || tz.length > 64) return false;
  try {
    new Intl.DateTimeFormat('en', { timeZone: tz });
    return true;
  } catch {
    return false;
  }
}

export function parseDisplayName(raw: unknown): Result<string> {
  const v = str(raw).normalize('NFKC').trim().replace(/\s+/g, ' ');
  if (v.length < 1) return { ok: false, error: 'display_name_required' };
  if (v.length > 80) return { ok: false, error: 'display_name_too_long' };
  return { ok: true, value: v };
}

export function parseBio(raw: unknown): Result<string | null> {
  const v = str(raw).trim();
  if (v.length === 0) return { ok: true, value: null };
  if (v.length > 500) return { ok: false, error: 'bio_too_long' };
  return { ok: true, value: v };
}

export function parseTimeZone(raw: unknown): Result<string> {
  const v = str(raw).trim();
  return isValidTimeZone(v) ? { ok: true, value: v } : { ok: false, error: 'timezone_invalid' };
}
