import Link from 'next/link';
import { getRequestLocale } from '@/lib/i18n/server';
import { getMessages } from '@/lib/i18n/messages';

export default async function NotFound() {
  const locale = await getRequestLocale();
  const m = getMessages(locale);
  return (
    <main id="main" className="mx-auto flex min-h-screen max-w-form flex-col justify-center gap-4 px-6 py-16">
      <p className="font-sans font-semibold tracking-tight text-5xl text-ink-strong">404</p>
      <h1 className="text-2xl font-bold text-ink-strong">{m.notFound.title}</h1>
      <p className="text-ink-muted">{m.notFound.body}</p>
      <Link href={`/${locale}`} className="font-semibold text-link underline underline-offset-4">
        {m.notFound.back}
      </Link>
    </main>
  );
}
