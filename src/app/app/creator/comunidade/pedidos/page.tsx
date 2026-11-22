import Link from "next/link";
import { communityCreator } from "@/lib/community/server";
import { REQUEST_STATES, type CommunityRequest } from "@/lib/community/model";
import { queryPage } from "@/lib/library/model";
import { getMessages } from "@/lib/i18n/messages";
import { getRequestLocale } from "@/lib/i18n/server";
import { utcDate } from "@/lib/posts/management";
import { CommunityNav } from "@/components/community/CommunityNav";
export default async function Requests({
  searchParams,
}: {
  searchParams: Promise<{ state?: string; page?: string }>;
}) {
  const { supabase } = await communityCreator(),
    locale = await getRequestLocale(),
    m = getMessages(locale),
    c = m.community,
    sp = await searchParams,
    page = queryPage(sp.page),
    state = REQUEST_STATES.includes(sp.state as (typeof REQUEST_STATES)[number])
      ? sp.state!
      : "";
  const { data, error } = await supabase.rpc("get_creator_community_requests", {
    p_state: state,
    p_page: page,
  });
  if (error) throw Error("Requests unavailable");
  const result = data as { total: number; items: CommunityRequest[] };
  const href = (n: number, s = state) =>
    `?${new URLSearchParams({ state: s, page: String(n) })}`;
  return (
    <main
      id="main"
      className="mx-auto max-w-content space-y-8 px-4 py-10 sm:px-6"
    >
      <CommunityNav m={c} current="requests" />
      <header className="flex flex-wrap items-start justify-between gap-5">
        <div className="max-w-2xl">
          <p className="eyebrow">{c.title}</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
            {c.requests}
          </h1>
          <p className="mt-4 leading-relaxed text-ink-muted">{c.intro}</p>
        </div>
        <Link
          className="button-primary"
          href="/app/creator/comunidade/pedidos/novo"
        >
          + {c.newRequest}
        </Link>
      </header>
      <nav className="filter-tabs flex-wrap" aria-label={c.status}>
        {["", ...REQUEST_STATES].map((s) => (
          <Link
            key={s}
            href={href(1, s)}
            aria-current={state === s ? "page" : undefined}
          >
            {s ? c[s as (typeof REQUEST_STATES)[number]] : c.all}
          </Link>
        ))}
      </nav>
      {result.items.length ? (
        <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {result.items.map((r) => (
            <li key={r.id} className="discover-card space-y-4">
              <div className="flex flex-wrap justify-between gap-3">
                <span className="rounded-full bg-soft px-3 py-1 text-xs">
                  {r.state === "open" &&
                  r.expires_at &&
                  Date.parse(r.expires_at) <= Date.now()
                    ? c.expired
                    : c[r.state]}
                </span>
                <span className="text-xs text-ink-muted">
                  {c.received}: {r.received ?? 0}
                </span>
              </div>
              <h2 className="break-words text-xl font-semibold">{r.title}</h2>
              <p className="line-clamp-3 whitespace-pre-wrap break-words text-sm text-ink-muted">
                {r.description}
              </p>
              <p className="text-xs text-ink-muted">
                {r.expires_at
                  ? `${utcDate(r.expires_at, locale)} UTC`
                  : c.noExpiry}
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  className="button-secondary"
                  href={`/app/creator/comunidade/pedidos/${r.id}`}
                >
                  {c.edit}
                </Link>
                <Link
                  className="inline-flex min-h-11 items-center text-sm underline"
                  href={`/app/creator/comunidade/recebidas?request=${r.id}`}
                >
                  {c.inbox} ↗
                </Link>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="empty-collection">
          <h2>{c.empty}</h2>
          <p>{c.intro}</p>
        </div>
      )}
      <nav aria-label={m.posts.pages} className="flex gap-4">
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
