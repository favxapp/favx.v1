import Link from "next/link";
import { notFound } from "next/navigation";
import { requireCreator } from "@/lib/posts/server";
import { getMessages } from "@/lib/i18n/messages";
import { getRequestLocale } from "@/lib/i18n/server";
import { queryPage, queryText } from "@/lib/library/model";
import type { MediaInventory } from "@/lib/media/library";
import { ManagementNav } from "@/components/posts/ManagementNav";
import { MediaPreview } from "@/components/posts/MediaPreview";
export default async function MediaLibrary({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; q?: string; status?: string }>;
}) {
  const { supabase, active } = await requireCreator();
  if (!active) notFound();
  const m = getMessages(await getRequestLocale()),
    g = m.management;
  const sp = await searchParams,
    page = queryPage(sp.page),
    q = queryText(sp.q),
    status = ["ready", "uploading"].includes(sp.status ?? "") ? sp.status! : "";
  const { data, error } = await supabase.rpc("get_creator_media_library", {
    p_query: q,
    p_status: status,
    p_page: page,
  });
  if (error) throw Error("Media unavailable");
  const result = data as MediaInventory;
  const href = (n: number, s = status) =>
    `?${new URLSearchParams({ q, status: s, page: String(n) })}`;
  return (
    <main
      id="main"
      className="mx-auto max-w-content space-y-8 px-4 py-10 sm:px-6"
    >
      <ManagementNav m={m} current="/app/creator/midias" />
      <header>
        <p className="eyebrow">{m.workspace.studio}</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
          {g.media}
        </h1>
        <p className="mt-3 max-w-2xl leading-relaxed text-ink-muted">
          {g.mediaIntro}
        </p>
      </header>
      <div className="flex flex-wrap justify-between gap-4">
        <nav className="filter-tabs flex-wrap" aria-label={g.status}>
          {(["", "ready", "uploading"] as const).map((s) => (
            <Link
              key={s}
              href={href(1, s)}
              aria-current={s === status ? "page" : undefined}
            >
              {s ? g[s] : g.all}
            </Link>
          ))}
        </nav>
        <form className="flex w-full max-w-sm gap-2">
          <input type="hidden" name="status" value={status} />
          <label className="min-w-0 flex-1">
            <span className="sr-only">{g.mediaSearch}</span>
            <input
              name="q"
              defaultValue={q}
              placeholder={g.mediaSearch}
              maxLength={120}
              className="min-h-11 w-full rounded-full border border-line px-4"
            />
          </label>
          <button className="button-secondary">{g.search}</button>
        </form>
      </div>
      {result.items.length ? (
        <ul className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {result.items.map((item) => (
            <li
              key={item.id}
              className="overflow-hidden rounded-3xl border border-line bg-white"
            >
              {item.status === "ready" ? (
                <MediaPreview
                  id={item.id}
                  alt=""
                  failed={g.previewUnavailable}
                  retry={g.retry}
                />
              ) : (
                <div className="flex h-40 items-center justify-center bg-soft p-5 text-sm text-ink-muted">
                  {g.uploading}
                </div>
              )}
              <div className="space-y-3 p-5">
                <h2 className="break-words font-semibold">{item.filename}</h2>
                <p className="text-xs text-ink-muted">
                  {item.mime} · {(item.byte_size / 1024 / 1024).toFixed(2)} MiB
                </p>
                <p className="text-xs">{g[item.status]}</p>
                <Link
                  className="button-secondary"
                  href={`/app/creator/midias/${item.id}`}
                >
                  {g.details} ↗
                </Link>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="empty-collection">
          <h2>{g.empty}</h2>
          <Link
            className="button-secondary mt-4"
            href="/app/creator/posts/novo"
          >
            {m.posts.createTitle}
          </Link>
        </div>
      )}
      <nav className="flex gap-4" aria-label={m.posts.pages}>
        {page > 1 && (
          <Link className="button-secondary" href={href(page - 1)}>
            ← {m.posts.previous}
          </Link>
        )}
        {result.total > page * 24 && (
          <Link className="button-secondary" href={href(page + 1)}>
            {m.posts.next} →
          </Link>
        )}
      </nav>
    </main>
  );
}
