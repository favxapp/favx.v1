import ptBr from './messages/pt-br.json';
import ptPt from './messages/pt-pt.json';
import en from './messages/en.json';
import es from './messages/es.json';
import it from './messages/it.json';
import fr from './messages/fr.json';
import type { Locale } from '../locale';

export type Messages = typeof ptBr;

const ALL: Record<Locale, Messages> = { 'pt-br': ptBr, 'pt-pt': ptPt, en, es, it, fr };

export function getMessages(locale: Locale): Messages {
  return ALL[locale];
}

export function format(template: string, vars: Record<string, string>): string {
  return template.replace(/\{(\w+)\}/g, (_m, key: string) => vars[key] ?? '');
}

export function errorMessage(messages: Messages, code: string | null): string | null {
  if (!code) return null;
  const errors = messages.errors as Record<string, string>;
  return errors[code] ?? messages.errors.generic;
}

export const LOCALE_LABELS: Record<Locale, string> = {
  'pt-br': 'Português (Brasil)',
  'pt-pt': 'Português (Portugal)',
  en: 'English',
  es: 'Español',
  it: 'Italiano',
  fr: 'Français',
};
