import Link from 'next/link';
import { notFound } from 'next/navigation';
import { normalizeLocale } from '@/lib/locale';
import { getMessages } from '@/lib/i18n/messages';

export default async function Landing({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  const locale = normalizeLocale(raw);
  if (!locale) notFound();
  const m = getMessages(locale);
  return (
    <main id="main" className="mx-auto max-w-content px-6 py-20 sm:py-28">
      <h1 className="max-w-3xl font-serif text-5xl leading-tight text-ink-strong sm:text-display-lg">{m.landing.headline}</h1>
      <p className="mt-6 max-w-2xl text-lg text-ink-muted">{m.landing.sub}</p>
      <Link href={`/${locale}/login`} className="mt-10 inline-flex min-h-[44px] items-center rounded-md bg-brand px-6 py-3 font-semibold text-brand-text hover:bg-brand-hover">
        {m.landing.cta}
      </Link>
    </main>
  );
}
