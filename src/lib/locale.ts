/** Idiomas oficiais (A-02) e negociação. Autocontido para teste em Node. */
export const LOCALES = ['pt-br', 'pt-pt', 'en', 'es', 'it', 'fr'] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = 'pt-br';
export const LOCALE_COOKIE = 'favx_locale';

export function normalizeLocale(value: string | null | undefined): Locale | null {
  if (!value) return null;
  const v = value.trim().toLowerCase();
  return (LOCALES as readonly string[]).includes(v) ? (v as Locale) : null;
}

function tagToLocale(tag: string): Locale | null {
  const t = tag.trim().toLowerCase();
  if (!t || t === '*') return null;
  const exact = normalizeLocale(t);
  if (exact) return exact;
  const base = t.split('-')[0];
  if (base === 'pt') return t === 'pt' || t === 'pt-br' ? 'pt-br' : 'pt-pt';
  if (base === 'en' || base === 'es' || base === 'it' || base === 'fr') return base;
  return null;
}

/** Cookie válido vence; senão Accept-Language por q; senão padrão. */
export function negotiateLocale(acceptLanguage: string | null | undefined, cookieValue?: string | null): Locale {
  const fromCookie = normalizeLocale(cookieValue);
  if (fromCookie) return fromCookie;
  if (acceptLanguage) {
    const ranked = acceptLanguage
      .split(',')
      .map((part, index) => {
        const [tag, ...params] = part.trim().split(';');
        const q = params.map((p) => p.trim()).find((p) => p.startsWith('q='));
        const weight = q ? Number.parseFloat(q.slice(2)) : 1;
        return { tag, weight: Number.isFinite(weight) ? weight : 0, index };
      })
      .filter((x) => x.weight > 0)
      .sort((a, b) => b.weight - a.weight || a.index - b.index);
    for (const { tag } of ranked) {
      const l = tagToLocale(tag);
      if (l) return l;
    }
  }
  return DEFAULT_LOCALE;
}

/** Separa o prefixo de idioma do caminho. `pt-BR` com caixa diferente é detectado para 301 em minúsculas. */
export function splitLocalePath(pathname: string): { locale: Locale | null; wrongCase: boolean; rest: string } {
  const m = /^\/([^/]+)(\/.*)?$/.exec(pathname);
  if (!m) return { locale: null, wrongCase: false, rest: pathname };
  const locale = normalizeLocale(m[1]);
  if (!locale) return { locale: null, wrongCase: false, rest: pathname };
  return { locale, wrongCase: m[1] !== locale, rest: m[2] ?? '' };
}
