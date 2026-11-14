import { headers } from 'next/headers';
import { DEFAULT_LOCALE, normalizeLocale, type Locale } from '../locale';

/** Idioma da requisição, definido pelo middleware (cookie → Accept-Language → padrão). */
export async function getRequestLocale(): Promise<Locale> {
  const h = await headers();
  return normalizeLocale(h.get('x-favx-locale')) ?? DEFAULT_LOCALE;
}
