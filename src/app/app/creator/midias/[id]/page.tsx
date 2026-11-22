import Link from "next/link";
import { notFound } from "next/navigation";
import { requireCreator } from "@/lib/posts/server";
import { getMessages } from "@/lib/i18n/messages";
import { getRequestLocale } from "@/lib/i18n/server";
import { MEDIA_ID } from "@/lib/media/model";
import type { MediaInventory } from "@/lib/media/library";
import type { PostStatus } from "@/lib/posts/model";
import { queryPage } from "@/lib/library/model";
import { utcDate } from "@/lib/posts/management";
import { MediaPreview } from "@/components/posts/MediaPreview";
import { MediaDownload } from "@/components/posts/MediaDownload";
export default async function MediaDetail({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const { id } = await params;
  if (!MEDIA_ID.test(id)) notFound();
  const { supabase, user, active } = await requireCreator();
  if (!active) notFound();
  const locale = await getRequestLocale(),
    m = getMessages(locale),
    g = m.management,
    page = queryPage((await searchParams).page);
  const [media, posts] = await Promise.all([
    supabase.rpc("get_creator_media_library", { p_id: id }),
    supabase
      .from("creator_posts")
      .select("id,title,lifecycle_state", { count: "exact" })
      .eq("creator_id", user.id)
      .contains("media_ids", [id])
      .order("updated_at", { ascending: false })
      .order("id")
      .range((page - 1) * 20, page * 20 - 1),
  ]);
  if (media.error || posts.error) throw Error("Media unavailable");
  const item = (media.data as MediaInventory).items[0];
  if (!item) notFound();
  return (
    <main
      id="main"
      className="mx-auto max-w-content space-y-8 px-4 py-10 sm:px-6"
    >
      <Link className="button-secondary" href="/app/creator/midias">
        ← {g.media}
      </Link>
      <header>
        <p className="eyebrow">{g.details}</p>
        <h1 className="mt-3 break-words text-3xl font-semibold tracking-tight">
          {item.filename}
        </h1>
      </header>
      <div className="management-layout">
        <section className="min-w-0 space-y-5">
          {item.status === "ready" ? (
            <MediaPreview
              id={id}
              alt={item.filename}
              failed={g.previewUnavailable}
              retry={g.retry}
            />
          ) : (
            <p className="empty-collection">{g.uploading}</p>
          )}
          {item.status === "ready" && (
            <div className="flex flex-wrap gap-3">
              <MediaDownload
                id={id}
                filename={item.filename}
                variant="original"
                label={m.media.original}
                failed={g.downloadFailed}
              />
              <MediaDownload
                id={id}
                filename={item.filename}
                variant="optimized"
                label={g.optimized}
                failed={g.downloadFailed}
              />
            </div>
          )}
        </section>
        <aside className="glass-panel min-w-0 space-y-5 rounded-3xl p-6">
          <h2 className="text-xl font-semibold">{g.details}</h2>
          <dl className="space-y-4 text-sm">
            {[
              [g.status, g[item.status]],
              [g.format, item.mime],
              [g.size, `${(item.byte_size / 1024 / 1024).toFixed(2)} MiB`],
              [g.created, `${utcDate(item.created_at, locale)} UTC`],
              ...(item.width && item.height
                ? [[g.dimensions, `${item.width} × ${item.height} px`]]
                : []),
            ].map(([k, v]) => (
              <div key={k}>
                <dt className="text-ink-muted">{k}</dt>
                <dd className="mt-1 break-words">{v}</dd>
              </div>
            ))}
          </dl>
        </aside>
      </div>
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">{g.references}</h2>
        {posts.data?.length ? (
          <ul className="grid gap-4 sm:grid-cols-2">
            {posts.data.map((p) => (
              <li key={p.id}>
                <Link
                  className="discover-card"
                  href={`/app/creator/posts/${p.id}`}
                >
                  <span className="text-xs text-ink-muted">
                    {m.posts.states[p.lifecycle_state as PostStatus]}
                  </span>
                  <h3 className="mt-3 break-words font-semibold">
                    {p.title || m.posts.untitled}
                  </h3>
                  <span className="mt-4 inline-block text-sm underline">
                    {g.manage} ↗
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-ink-muted">{g.noReferences}</p>
        )}
        <nav className="flex gap-4" aria-label={m.posts.pages}>
          {page > 1 && (
            <Link className="button-secondary" href={`?page=${page - 1}`}>
              ← {m.posts.previous}
            </Link>
          )}
          {(posts.count ?? 0) > page * 20 && (
            <Link className="button-secondary" href={`?page=${page + 1}`}>
              {m.posts.next} →
            </Link>
          )}
        </nav>
      </section>
    </main>
  );
}
