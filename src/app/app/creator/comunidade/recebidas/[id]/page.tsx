import Link from "next/link";
import { notFound } from "next/navigation";
import { communityCreator } from "@/lib/community/server";
import type { Suggestion } from "@/lib/community/model";
import { UUID } from "@/lib/library/model";
import { getMessages } from "@/lib/i18n/messages";
import { getRequestLocale } from "@/lib/i18n/server";
import { utcDate } from "@/lib/posts/management";
import { ReviewForm } from "@/components/community/ReviewForm";
export default async function SuggestionDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  if (!UUID.test(id)) notFound();
  const { supabase } = await communityCreator(),
    locale = await getRequestLocale(),
    m = getMessages(locale),
    c = m.community;
  const { data, error } = await supabase.rpc("get_community_inbox", {
    p_id: id,
  });
  if (error) throw Error("Suggestion unavailable");
  const item = (data as { items: Suggestion[] }).items[0];
  if (!item) notFound();
  return (
    <main
      id="main"
      className="mx-auto max-w-content space-y-8 px-4 py-10 sm:px-6"
    >
      <Link
        className="button-secondary"
        href={`/app/creator/comunidade/recebidas?request=${item.request_id}`}
      >
        ← {c.inbox}
      </Link>
      <header>
        <p className="eyebrow">
          {c.origin} / {c[item.review_state]}
        </p>
        <h1 className="mt-3 break-words text-3xl font-semibold tracking-tight sm:text-4xl">
          {item.title}
        </h1>
        <p className="mt-4 text-sm text-ink-muted">
          {utcDate(item.submitted_at, locale)} UTC
        </p>
      </header>
      <div className="management-layout">
        <article className="glass-panel min-w-0 space-y-6 rounded-3xl p-6 sm:p-8">
          <h2 className="text-lg font-semibold">{c.description}</h2>
          <p className="whitespace-pre-wrap break-words leading-relaxed">
            {item.description}
          </p>
          {item.category && (
            <p className="rounded-full bg-soft px-3 py-1 text-sm">
              {item.category}
            </p>
          )}
          {item.url && (
            <a
              className="inline-flex min-h-11 items-center break-all underline"
              href={item.url}
              target="_blank"
              rel="noopener noreferrer nofollow"
            >
              {item.url} ↗
            </a>
          )}
          <div className="rounded-2xl bg-soft p-4 text-sm leading-relaxed">
            {c.consentRecord}
          </div>
          <Link
            className="inline-flex min-h-11 items-center break-words text-sm underline"
            href={`/app/creator/comunidade/pedidos/${item.request_id}`}
          >
            {c.requestLabel}: {item.request_title}
          </Link>
        </article>
        <aside className="glass-panel min-w-0 space-y-5 rounded-3xl p-6">
          <h2 className="text-xl font-semibold">{c.review}</h2>
          <p className="text-sm leading-relaxed text-ink-muted">
            {c.reviewIntro}
          </p>
          <ReviewForm
            key={item.version}
            id={id}
            version={item.version}
            initial={item.review_state}
            m={c}
          />
        </aside>
      </div>
    </main>
  );
}
