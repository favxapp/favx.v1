import Link from "next/link";
import { managedPost, utcDate } from "@/lib/posts/management";
import { getMessages } from "@/lib/i18n/messages";
import { getRequestLocale } from "@/lib/i18n/server";
import { postPath } from "@/lib/posts/model";
import { ManagementActions } from "@/components/posts/ManagementActions";
import { MediaPreview } from "@/components/posts/MediaPreview";
import { ManagementNav } from "@/components/posts/ManagementNav";
export default async function ManagePostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { post, creator, supabase, user } = await managedPost(id);
  const locale = await getRequestLocale();
  const m = getMessages(locale),
    g = m.management;
  const { data: collections, error } = await supabase
    .from("creator_collections")
    .select("id,title")
    .eq("creator_id", user.id)
    .contains("post_ids", [id])
    .order("title")
    .limit(50);
  if (error) throw Error("Collections unavailable");
  return (
    <main
      id="main"
      className="mx-auto max-w-content space-y-8 px-4 py-10 sm:px-6"
    >
      <ManagementNav m={m} current="/app/creator/posts" />
      <header className="space-y-4">
        <p className="eyebrow">
          {g.manage} / {m.posts.states[post.lifecycle_state]}
        </p>
        <h1 className="break-words text-3xl font-semibold tracking-tight sm:text-4xl">
          {post.title || m.posts.untitled}
        </h1>
        <p className="text-ink-muted">{g.intro}</p>
        <div className="flex flex-wrap gap-3">
          {!["archived", "trashed"].includes(post.lifecycle_state) && (
            <Link
              className="button-primary"
              href={`/app/creator/posts/${id}/editar`}
            >
              {m.posts.editTitle}
            </Link>
          )}
          <Link
            className="button-secondary"
            href={`/app/creator/posts/${id}/historico`}
          >
            {g.history}
          </Link>
          {post.lifecycle_state === "published" && creator.is_public && (
            <Link
              className="button-secondary"
              href={postPath(creator.username, post)}
            >
              {m.posts.viewPublic}
            </Link>
          )}
        </div>
      </header>
      <div className="management-layout">
        <section
          className="glass-panel min-w-0 space-y-6 rounded-3xl p-5 sm:p-8"
          aria-label={g.content}
        >
          {(post.media_ids ?? []).length > 0 && (
            <div className="grid gap-4 sm:grid-cols-2">
              {post.media_ids?.map((media) => (
                <div key={media}>
                  <MediaPreview
                    id={media}
                    alt=""
                    failed={g.previewUnavailable}
                    retry={g.retry}
                  />
                  <Link
                    className="inline-flex min-h-11 items-center text-sm underline"
                    href={`/app/creator/midias/${media}`}
                  >
                    {g.details} ↗
                  </Link>
                </div>
              ))}
            </div>
          )}
          <h2 className="text-xl font-semibold">{g.content}</h2>
          <p className="whitespace-pre-wrap break-words leading-relaxed">
            {post.body}
          </p>
          <div className="flex flex-wrap gap-2">
            {[...(post.categories ?? []), ...post.tags].map((t, i) => (
              <span
                key={`${i}-${t}`}
                className="rounded-full bg-soft px-3 py-1 text-xs"
              >
                {t}
              </span>
            ))}
          </div>
          {post.is_sponsored && (
            <p className="rounded-xl bg-soft p-4 text-sm">{post.disclosure}</p>
          )}
          {post.links.length > 0 && (
            <ul className="space-y-3">
              {post.links.map((l, i) => (
                <li key={i} className="break-words">
                  <a
                    className="underline"
                    href={l.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {l.label} ↗
                  </a>
                  {l.coupon && (
                    <span className="ml-3 rounded bg-soft px-2 py-1 text-sm">
                      {l.coupon}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          )}
          {post.private_context && (
            <details className="rounded-2xl border border-line p-4">
              <summary className="cursor-pointer font-semibold">
                {g.privateContext}
              </summary>
              <p className="mt-3 whitespace-pre-wrap break-words text-sm">
                {post.private_context}
              </p>
            </details>
          )}
        </section>
        <aside className="min-w-0 space-y-5">
          <section className="glass-panel space-y-4 rounded-3xl p-6">
            <h2 className="text-lg font-semibold">{g.status}</h2>
            <p>{m.posts.states[post.lifecycle_state]}</p>
            <dl className="space-y-3 text-sm">
              <div>
                <dt className="text-ink-muted">{g.version}</dt>
                <dd>{post.version}</dd>
              </div>
              <div>
                <dt className="text-ink-muted">{g.created}</dt>
                <dd>{utcDate(post.created_at, locale)}</dd>
              </div>
              <div>
                <dt className="text-ink-muted">{g.updated}</dt>
                <dd>{utcDate(post.updated_at, locale)}</dd>
              </div>
            </dl>
            <p className="text-xs text-ink-muted">{g.timezone}</p>
            <ManagementActions
              id={id}
              version={post.version}
              state={post.lifecycle_state}
              m={g}
            />
          </section>
          {!!collections?.length && (
            <section className="glass-panel space-y-3 rounded-3xl p-6">
              <h2 className="font-semibold">{m.workspace.collections}</h2>
              {collections.map((c) => (
                <Link
                  key={c.id}
                  className="block break-words py-2 underline"
                  href={`/app/creator/collections/${c.id}/editar`}
                >
                  {c.title}
                </Link>
              ))}
            </section>
          )}
        </aside>
      </div>
    </main>
  );
}
