import { DEFAULT_LOCALE, normalizeLocale, type Locale } from '../locale.ts';
import { httpsOrigin } from './template.ts';

/** Redirect locale works for returning users; signup metadata alone does not update on every login. */
export function emailLocale(redirectTo: unknown, metadataLocale: unknown, appUrl: string): Locale {
  if (typeof redirectTo === 'string') {
    try {
      const url = new URL(redirectTo);
      if (url.origin === httpsOrigin(appUrl)) {
        const match = /^\/([^/]+)\/login\/?$/.exec(url.pathname);
        const locale = match && normalizeLocale(match[1]);
        if (locale) return locale;
      }
    } catch { /* fallback to a supported stored locale */ }
  }
  return normalizeLocale(typeof metadataLocale === 'string' ? metadataLocale : null) ?? DEFAULT_LOCALE;
}

export function otpRequestOptions(locale: Locale, appUrl?: string) {
  return {
    shouldCreateUser: true,
    data: { preferred_locale: locale },
    ...(appUrl ? { emailRedirectTo: `${httpsOrigin(appUrl)}/${locale}/login` } : {}),
  };
}
