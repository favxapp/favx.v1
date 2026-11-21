import Link from 'next/link';
import { notFound } from 'next/navigation';
import { LOCALES, normalizeLocale } from '@/lib/locale';
import { LOCALE_LABELS, getMessages } from '@/lib/i18n/messages';

export default async function SiteLayout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  const locale = normalizeLocale(raw);
  if (!locale) notFound();
  const m = getMessages(locale);
  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:rounded-md focus:bg-surface focus:px-3 focus:py-2">
        {m.common.skipToContent}
      </a>
      <header className="border-b border-line">
        <div className="mx-auto flex max-w-content flex-wrap items-center justify-between gap-3 px-6 py-4">
          <Link href={`/${locale}`} className="font-sans font-semibold tracking-tight text-3xl text-ink-strong">
            {m.common.appName}
          </Link>
          <nav aria-label={m.common.language} className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
            {LOCALES.map((l) => (
              <a key={l} href={`/${l}`} lang={l} hrefLang={l} aria-current={l === locale ? 'true' : undefined} className={l === locale ? 'font-bold text-ink-strong underline underline-offset-4' : 'text-ink-muted hover:text-ink-strong'}>
                {LOCALE_LABELS[l]}
              </a>
            ))}
          </nav>
        </div>
      </header>
      {children}
    </>
  );
}
