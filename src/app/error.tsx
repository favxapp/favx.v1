'use client';

import { useEffect, useState } from 'react';
import { negotiateLocale } from '@/lib/locale';
import { getMessages } from '@/lib/i18n/messages';

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const [locale, setLocale] = useState(negotiateLocale(null));
  useEffect(() => {
    setLocale(negotiateLocale(navigator.language));
    // Sem dados pessoais: apenas o digest para correlação.
    console.error('app_error', error.digest ?? 'sem-digest');
  }, [error]);
  const m = getMessages(locale);
  return (
    <main id="main" className="mx-auto flex min-h-screen max-w-form flex-col justify-center gap-4 px-6 py-16">
      <h1 className="text-2xl font-bold text-ink-strong">{m.error.title}</h1>
      <p className="text-ink-muted">{m.error.body}</p>
      <button type="button" onClick={reset} className="min-h-[44px] w-fit rounded-md bg-brand px-5 py-2 font-semibold text-brand-text hover:bg-brand-hover">
        {m.error.retry}
      </button>
    </main>
  );
}
