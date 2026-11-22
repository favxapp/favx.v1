import Link from "next/link";
import { randomUUID } from "node:crypto";
import { notFound } from "next/navigation";
import { publicRequest } from "@/lib/community/server";
import { requestPath } from "@/lib/community/model";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getMessages } from "@/lib/i18n/messages";
import { getRequestLocale } from "@/lib/i18n/server";
import { SuggestionForm } from "@/components/community/SuggestionForm";
export const dynamic = "force-dynamic";
export const metadata = {
  title: "FAVX · Community",
  robots: { index: false, follow: false },
};
export default async function SendCommunitySuggestion({
  params,
}: {
  params: Promise<{ username: string; request: string }>;
}) {
  const { username, request: id } = await params,
    r = await publicRequest(id);
  if (r.username !== username) notFound();
  const locale = await getRequestLocale(),
    m = getMessages(locale).community,
    db = await createSupabaseServerClient(),
    {
      data: { user },
    } = await db.auth.getUser();
  const next = `/app/comunidade/enviar?request=${id}`;
  return (
    <main id="main" className="mx-auto max-w-3xl space-y-8 px-4 py-10 sm:px-6">
      <Link className="button-secondary" href={requestPath(username, id)}>
        ← {m.back}
      </Link>
      <header>
        <p className="eyebrow">
          {m.send} / {r.display_name}
        </p>
        <h1 className="mt-3 break-words text-3xl font-semibold tracking-tight">
          {r.title}
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-ink-muted">
          {m.privateHint}
        </p>
      </header>
      {user ? (
        <SuggestionForm id={randomUUID()} requestId={id} m={m} />
      ) : (
        <section className="glass-panel space-y-5 rounded-3xl p-7">
          <p>{m.loginRequired}</p>
          <Link
            className="button-primary"
            href={`/${locale}/login?${new URLSearchParams({ next })}`}
          >
            {m.loginCta}
          </Link>
        </section>
      )}
    </main>
  );
}
