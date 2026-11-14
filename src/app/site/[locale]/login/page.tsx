import { notFound } from 'next/navigation';
import { normalizeLocale } from '@/lib/locale';
import { getMessages } from '@/lib/i18n/messages';
import { safeNextPath } from '@/lib/redirect';
import LoginForm from './LoginForm';

export const metadata = { title: 'Login' };

export default async function LoginPage({ params, searchParams }: { params: Promise<{ locale: string }>; searchParams: Promise<{ next?: string | string[] }> }) {
  const { locale: raw } = await params;
  const locale = normalizeLocale(raw);
  if (!locale) notFound();
  const sp = await searchParams;
  const next = safeNextPath(Array.isArray(sp.next) ? sp.next[0] : sp.next);
  const m = getMessages(locale);
  return (
    <main id="main" className="mx-auto max-w-form px-6 py-16">
      <LoginForm
        locale={locale}
        next={next}
        labels={{ ...m.login, errors: m.errors as Record<string, string> }}
      />
    </main>
  );
}
