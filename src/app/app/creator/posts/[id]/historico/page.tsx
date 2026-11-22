import Link from "next/link";
import { managedPost, utcDate } from "@/lib/posts/management";
import { getRequestLocale } from "@/lib/i18n/server";
import { getMessages } from "@/lib/i18n/messages";
import { queryPage } from "@/lib/library/model";
import type { PostStatus } from "@/lib/posts/model";
type Revision = {
  version: number;
  changed_at: string;
  snapshot: Record<string, unknown>;
};
export default async function PostHistory({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const { id } = await params;
  const { post, supabase } = await managedPost(id);
  const locale = await getRequestLocale(),
    m = getMessages(locale),
    g = m.management;
  const page = queryPage((await searchParams).page);
  const { data, error } = await supabase.rpc("get_creator_post_history", {
    p_id: id,
    p_page: page,
  });
  if (error) throw Error("History unavailable");
  const rows = (data ?? []) as Revision[];
  const labels: Record<string, string> = {
    title: m.posts.titleLabel,
    body: g.content,
    lifecycle_state: g.status,
    tags: m.posts.tags,
    categories: m.editor.categories,
    links: m.posts.linksTitle,
    rating: m.posts.rating,
    is_sponsored: m.posts.sponsored,
    disclosure: m.posts.disclosureLabel,
    media_ids: g.media,
    private_context: g.privateContext,
  };
  const show = (key: string, value: unknown): string =>
    key === "lifecycle_state"
      ? (m.posts.states[value as PostStatus] ?? String(value))
      : typeof value === "string"
        ? value
        : JSON.stringify(value ?? null);
  return (
    <main
      id="main"
      className="mx-auto max-w-content space-y-8 px-4 py-10 sm:px-6"
    >
      <Link className="button-secondary" href={`/app/creator/posts/${id}`}>
        ← {g.manage}
      </Link>
      <header>
        <p className="eyebrow">{post.title || m.posts.untitled}</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight">
          {g.history}
        </h1>
        <p className="mt-3 text-ink-muted">{g.historyIntro}</p>
        <p className="mt-2 text-xs text-ink-muted">{g.timezone}</p>
      </header>
      {rows.length ? (
        <ol className="history-timeline">
          {rows.slice(0, 20).map((r, i) => {
            const older = rows[i + 1];
            const changed = older
              ? Object.keys(labels).filter(
                  (k) =>
                    JSON.stringify(r.snapshot[k] ?? null) !==
                    JSON.stringify(older.snapshot[k] ?? null),
                )
              : [];
            return (
              <li
                key={r.version}
                className="glass-panel space-y-4 rounded-3xl p-5 sm:p-7"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h2 className="text-lg font-semibold">
                    {g.version} {r.version}
                  </h2>
                  <time
                    className="text-xs text-ink-muted"
                    dateTime={r.changed_at}
                  >
                    {utcDate(r.changed_at, locale)} UTC
                  </time>
                </div>
                <p className="text-sm">
                  {show("lifecycle_state", r.snapshot.lifecycle_state)}
                </p>
                <details>
                  <summary className="cursor-pointer py-2 font-semibold">
                    {g.selectVersion}
                  </summary>
                  <dl className="mt-3 space-y-4">
                    {Object.keys(labels).map((k) => (
                      <div key={k}>
                        <dt className="text-xs font-semibold text-ink-muted">
                          {labels[k]}
                        </dt>
                        <dd className="mt-1 whitespace-pre-wrap break-words text-sm">
                          {show(k, r.snapshot[k])}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </details>
                {older && (
                  <details>
                    <summary className="cursor-pointer py-2 font-semibold">
                      {g.compare}
                    </summary>
                    {changed.length ? (
                      <dl className="mt-4 space-y-4">
                        {changed.map((k) => (
                          <div key={k}>
                            <dt className="mb-2 text-sm font-semibold">
                              {labels[k]}
                            </dt>
                            <dd className="grid min-w-0 gap-3 sm:grid-cols-2">
                              <div className="min-w-0 rounded-xl bg-soft p-3">
                                <p className="mb-2 text-xs text-ink-muted">
                                  {g.version} {older.version}
                                </p>
                                <p className="whitespace-pre-wrap break-words text-sm">
                                  {show(k, older.snapshot[k])}
                                </p>
                              </div>
                              <div className="min-w-0 rounded-xl border border-line p-3">
                                <p className="mb-2 text-xs text-ink-muted">
                                  {g.version} {r.version}
                                </p>
                                <p className="whitespace-pre-wrap break-words text-sm">
                                  {show(k, r.snapshot[k])}
                                </p>
                              </div>
                            </dd>
                          </div>
                        ))}
                      </dl>
                    ) : (
                      <p className="mt-3 text-sm text-ink-muted">
                        {g.noChanges}
                      </p>
                    )}
                  </details>
                )}
              </li>
            );
          })}
        </ol>
      ) : (
        <p className="empty-collection">{g.noHistory}</p>
      )}
      <nav className="flex gap-4" aria-label={m.posts.pages}>
        {page > 1 && (
          <Link className="button-secondary" href={`?page=${page - 1}`}>
            ← {m.posts.previous}
          </Link>
        )}
        {rows.length > 20 && (
          <Link className="button-secondary" href={`?page=${page + 1}`}>
            {m.posts.next} →
          </Link>
        )}
      </nav>
    </main>
  );
}
