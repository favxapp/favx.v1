import Link from 'next/link';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { getRequestLocale } from '@/lib/i18n/server';
import { format, getMessages } from '@/lib/i18n/messages';

export const metadata = { title: 'Minha conta' };

export default async function MePage() {
  const locale = await getRequestLocale();
  const m = getMessages(locale);
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data: creator } = await supabase.from('creator_profiles').select('username, display_name').maybeSingle();
  return (
    <main id="main" className="mx-auto max-w-content space-y-8 px-6 py-12">
      <div>
        <h1 className="font-serif text-4xl text-ink-strong">{m.me.title}</h1>
        <p className="mt-2 text-ink-muted">
          {m.me.welcome} <strong className="text-ink-strong">{user?.email}</strong>
        </p>
      </div>
      <section aria-labelledby="creator-title" className="max-w-form space-y-3 rounded-lg border border-line bg-surface p-6 shadow-card">
        <h2 id="creator-title" className="text-xl font-bold text-ink-strong">
          {m.me.creatorTitle}
        </h2>
        {creator ? (
          <>
            <p className="text-ink">{format(m.me.creatorActive, { username: creator.username })}</p>
            <Link href="/app/creator/profile" className="inline-flex min-h-[44px] items-center font-semibold text-link underline underline-offset-4">
              {m.me.editCta}
            </Link>
          </>
        ) : (
          <>
            <p className="text-ink-muted">{m.me.creatorInactive}</p>
            <Link href="/app/creator/activate" className="inline-flex min-h-[44px] items-center rounded-md bg-brand px-5 py-2 font-semibold text-brand-text hover:bg-brand-hover">
              {m.me.activateCta}
            </Link>
          </>
        )}
      </section>
    </main>
  );
}
