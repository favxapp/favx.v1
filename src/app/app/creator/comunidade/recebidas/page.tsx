import Link from "next/link";
import { communityCreator } from "@/lib/community/server";
import { REVIEW_STATES, type Suggestion } from "@/lib/community/model";
import { UUID, queryPage } from "@/lib/library/model";
import { getMessages } from "@/lib/i18n/messages";
import { getRequestLocale } from "@/lib/i18n/server";
import { utcDate } from "@/lib/posts/management";
import { CommunityNav } from "@/components/community/CommunityNav";
export default async function Inbox({
  searchParams,
}: {
  searchParams: Promise<{ state?: string; page?: string; request?: string }>;
}) {
  const { supabase } = await communityCreator(),
    locale = await getRequestLocale(),
    m = getMessages(locale),
    c = m.community,
    sp = await searchParams,
    page = queryPage(sp.page),
    state = REVIEW_STATES.includes(sp.state as (typeof REVIEW_STATES)[number])
      ? sp.state!
      : "";
  const request = UUID.test(sp.request ?? "") ? sp.request! : "";
  const { data, error } = await supabase.rpc("get_community_inbox", {
    p_request: request || null,
    p_state: state,
    p_page: page,
  });
  if (error) throw Error("Inbox unavailable");
  const result = data as { total: number; items: Suggestion[] };
  const href = (n: number, s = state) =>
    `?${new URLSearchParams({ request, state: s, page: String(n) })}`;
  return (
    <main
      id="main"
      className="mx-auto max-w-content space-y-8 px-4 py-10 sm:px-6"
    >
      <CommunityNav m={c} current="inbox" />
      <header>
        <p className="eyebrow">{c.title}</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
          {c.inbox}
        </h1>
        <p className="mt-4 max-w-2xl leading-relaxed text-ink-muted">
          {c.inboxIntro}
        </p>
      </header>
      <nav className="filter-tabs flex-wrap" aria-label={c.status}>
        {["", ...REVIEW_STATES].map((s) => (
          <Link
            key={s}
            href={href(1, s)}
            aria-current={state === s ? "page" : undefined}
          >
            {s ? c[s as (typeof REVIEW_STATES)[number]] : c.all}
          </Link>
        ))}
      </nav>
      {request && (
        <Link
          href="/app/creator/comunidade/recebidas"
          className="button-secondary"
        >
          {m.workspace.clear}
        </Link>
      )}
      {result.items.length ? (
        <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {result.items.map((s) => (
            <li key={s.id} className="min-w-0">
              <Link
                className="discover-card space-y-4"
                href={`/app/creator/comunidade/recebidas/${s.id}`}
              >
                <div className="flex flex-wrap justify-between gap-3">
                  <span className="rounded-full bg-soft px-3 py-1 text-xs">
                    {c[s.review_state]}
                  </span>
                  <time
                    dateTime={s.submitted_at}
                    className="text-xs text-ink-muted"
                  >
                    {utcDate(s.submitted_at, locale)} UTC
                  </time>
                </div>
                <h2 className="break-words text-xl font-semibold">{s.title}</h2>
                <p className="line-clamp-3 whitespace-pre-wrap break-words text-sm text-ink-muted">
                  {s.description}
                </p>
                <p className="break-words text-xs text-ink-muted">
                  {c.requestLabel}: {s.request_title}
                </p>
                <span className="inline-flex min-h-11 items-center text-sm underline">
                  {c.review} ↗
                </span>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <div className="empty-collection">
          <h2>{c.empty}</h2>
          <p>{c.privateHint}</p>
        </div>
      )}
      <nav className="flex gap-4" aria-label={m.posts.pages}>
        {page > 1 && (
          <Link className="button-secondary" href={href(page - 1)}>
            ← {m.posts.previous}
          </Link>
        )}
        {result.total > page * 20 && (
          <Link className="button-secondary" href={href(page + 1)}>
            {m.posts.next} →
          </Link>
        )}
      </nav>
    </main>
  );
}
