import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { getRequestLocale } from '@/lib/i18n/server';
import { getMessages } from '@/lib/i18n/messages';

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const locale = await getRequestLocale();
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect(`/${locale}/login`); // defesa em profundidade; o middleware já protege /app/*
  const m = getMessages(locale);
  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:rounded-md focus:bg-surface focus:px-3 focus:py-2">
        {m.common.skipToContent}
      </a>
      <header className="border-b border-line">
        <div className="mx-auto flex max-w-content flex-wrap items-center justify-between gap-3 px-6 py-4">
          <Link href="/app/me" className="font-serif text-3xl text-ink-strong">
            {m.common.appName}
          </Link>
          <nav className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm font-semibold">
            <Link href="/app/me" className="text-ink hover:text-ink-strong">
              {m.common.menuMe}
            </Link>
            <Link href="/app/creator/profile" className="text-ink hover:text-ink-strong">
              {m.common.menuCreator}
            </Link>
            <Link href="/app/creator/posts" className="text-ink hover:text-ink-strong">{m.posts.myPosts}</Link>
            <form action="/auth/signout" method="post">
              <input type="hidden" name="locale" value={locale} />
              <button type="submit" className="min-h-[44px] text-ink-muted underline underline-offset-4 hover:text-ink-strong">
                {m.common.signOut}
              </button>
            </form>
          </nav>
        </div>
      </header>
      {children}
    </>
  );
}
