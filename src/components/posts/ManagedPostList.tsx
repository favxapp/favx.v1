import Link from "next/link";
import { notFound } from "next/navigation";
import { requireCreator } from "@/lib/posts/server";
import type { PostStatus } from "@/lib/posts/model";
import { getMessages } from "@/lib/i18n/messages";
import { getRequestLocale } from "@/lib/i18n/server";
import { queryPage, queryText } from "@/lib/library/model";
import { utcDate } from "@/lib/posts/management";
import { ManagementNav } from "./ManagementNav";
import { MediaPreview } from "./MediaPreview";
export async function ManagedPostList({
  mode,
  search,
}: {
  mode: "active" | "closed" | "trash";
  search: { page?: string; state?: string; q?: string };
}) {
  const { supabase, user, active } = await requireCreator();
  if (!active) notFound();
  const locale = await getRequestLocale(),
    m = getMessages(locale),
    g = m.management;
  const states: PostStatus[] =
    mode === "closed"
      ? ["hidden", "archived"]
      : mode === "trash"
        ? ["trashed"]
        : ["draft", "published", "hidden"];
  const state = states.includes(search.state as PostStatus)
    ? (search.state as PostStatus)
    : null;
  const page = queryPage(search.page),
    q = queryText(search.q),
    path =
      mode === "closed"
        ? "/app/creator/posts/encerrados"
        : mode === "trash"
          ? "/app/creator/lixeira"
          : "/app/creator/posts";
  let query = supabase
    .from("creator_posts")
    .select("id,title,media_ids,lifecycle_state,updated_at", { count: "exact" })
    .eq("creator_id", user.id)
    .in("lifecycle_state", state ? [state] : states);
  if (q) query = query.ilike("title", `%${q.replace(/[\\%_]/g, "\\$&")}%`);
  const { data, error, count } = await query
    .order("updated_at", { ascending: false })
    .order("id")
    .range((page - 1) * 20, page * 20 - 1);
  if (error) throw Error("Posts unavailable");
  const href = (n: number, s: string = state ?? "") =>
    `${path}?${new URLSearchParams({ page: String(n), state: s, q })}`;
  return (
    <main
      id="main"
      className="mx-auto max-w-content space-y-8 px-4 py-10 sm:px-6"
    >
      <ManagementNav m={m} current={path} />
      <header className="flex flex-wrap items-start justify-between gap-5">
        <div className="max-w-2xl">
          <p className="eyebrow">{m.workspace.studio}</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
            {mode === "closed"
              ? g.closed
              : mode === "trash"
                ? g.trashed
                : m.posts.myPosts}
          </h1>
          <p className="mt-3 leading-relaxed text-ink-muted">
            {mode === "closed"
              ? g.closedIntro
              : mode === "trash"
                ? g.trashIntro
                : m.posts.listIntro}
          </p>
        </div>
        <Link className="button-primary" href="/app/creator/posts/novo">
          + {m.posts.createTitle}
        </Link>
      </header>
      <div className="flex flex-wrap items-end justify-between gap-4">
        {mode !== "trash" && (
          <nav className="filter-tabs flex-wrap" aria-label={g.status}>
            {["", ...states].map((s) => (
              <Link
                key={s}
                href={href(1, s)}
                aria-current={(state ?? "") === s ? "page" : undefined}
              >
                {s ? m.posts.states[s as PostStatus] : g.all}
              </Link>
            ))}
          </nav>
        )}
        <form className="flex w-full max-w-sm gap-2">
          <input type="hidden" name="state" value={state ?? ""} />
          <label className="min-w-0 flex-1">
            <span className="sr-only">{g.search}</span>
            <input
              name="q"
              defaultValue={q}
              maxLength={120}
              placeholder={m.workspace.searchHint}
              className="min-h-11 w-full rounded-full border border-line px-4"
            />
          </label>
          <button className="button-secondary">{g.search}</button>
        </form>
      </div>
      {data?.length ? (
        <ul className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {data.map((p) => (
            <li key={p.id} className="discover-card !p-0">
              <div className="overflow-hidden rounded-t-3xl bg-soft">
                {p.media_ids?.[0] ? (
                  <MediaPreview
                    id={p.media_ids[0]}
                    alt=""
                    failed={g.previewUnavailable}
                    retry={g.retry}
                  />
                ) : (
                  <div className="flex h-32 items-center justify-center text-4xl font-semibold text-ink-muted/30">
                    F
                  </div>
                )}
              </div>
              <div className="space-y-4 p-5">
                <span className="rounded-full bg-soft px-3 py-1 text-xs">
                  {m.posts.states[p.lifecycle_state as PostStatus]}
                </span>
                <h2 className="break-words text-xl font-semibold">
                  {p.title || m.posts.untitled}
                </h2>
                <p className="text-xs text-ink-muted">
                  {utcDate(p.updated_at, locale)} UTC
                </p>
                <Link
                  className="button-secondary"
                  href={`/app/creator/posts/${p.id}`}
                >
                  {g.manage} ↗
                </Link>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="empty-collection">
          <h2>{g.empty}</h2>
          {q && (
            <Link href={path} className="button-secondary mt-4">
              {m.workspace.clear}
            </Link>
          )}
        </div>
      )}
      <nav className="flex gap-5" aria-label={m.posts.pages}>
        {page > 1 && (
          <Link className="button-secondary" href={href(page - 1)}>
            ← {m.posts.previous}
          </Link>
        )}
        {(count ?? 0) > page * 20 && (
          <Link className="button-secondary" href={href(page + 1)}>
            {m.posts.next} →
          </Link>
        )}
      </nav>
    </main>
  );
}
