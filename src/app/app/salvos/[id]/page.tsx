import Link from "next/link";
import { notFound } from "next/navigation";
import { UUID } from "@/lib/library/model";
import { userLibrary, libraryClient } from "@/lib/library/server";
import { getRequestLocale } from "@/lib/i18n/server";
import { getMessages } from "@/lib/i18n/messages";
import { PostCard } from "@/components/posts/PostCard";
import { RemoveSaved } from "@/components/library/RemoveSaved";
import { postPath } from "@/lib/posts/model";
import { ShareProfile } from "@/components/creator/ShareProfile";
import { publicOrigin } from "@/lib/creator/public";
export default async function SavedDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  if (!UUID.test(id)) notFound();
  const { db, user } = await libraryClient();
  const [data, collections, locale] = await Promise.all([
    userLibrary({ p_item: id }),
    db
      .from("user_collections")
      .select("id,title")
      .eq("user_id", user.id)
      .contains("saved_ids", [id])
      .order("title"),
    getRequestLocale(),
  ]);
  if (collections.error) throw Error("Collections unavailable");
  const item = data.items[0];
  if (!item) notFound();
  const messages = getMessages(locale);
  const m = messages.library;
  const p = item.post;
  return (
    <main id="main" className="mx-auto max-w-4xl space-y-6 px-4 py-10 sm:px-6">
      <Link href="/app/salvos" className="button-secondary">
        ← {m.saved}
      </Link>
      <div className="section-heading">
        <h1>{p?.title ?? m.unavailable}</h1>
        <RemoveSaved id={id} m={m} />
      </div>
      <p className="text-xs text-ink-muted">
        {m.savedOn}{" "}
        {new Intl.DateTimeFormat(locale, { dateStyle: "medium" }).format(
          new Date(item.saved_at),
        )}
      </p>
      {p ? (
        <>
          <PostCard content={p} name={p.creator_name} labels={messages.posts} />
          <div className="flex flex-wrap gap-3">
            <Link className="button-primary" href={postPath(p.username, p)}>
              {m.open}
            </Link>
            <ShareProfile
              compact
              url={`${publicOrigin()}${postPath(p.username, p)}`}
              title={p.title}
              labels={messages.creator}
            />
          </div>
        </>
      ) : (
        <div className="empty-collection">
          <p>{m.unavailableBody}</p>
        </div>
      )}
      <section className="discover-card !h-auto">
        <h2 className="mb-4 font-semibold">{m.manageCollections}</h2>
        <div className="flex flex-wrap gap-3">
          {collections.data?.map((c) => (
            <Link
              href={`/app/colecoes/${c.id}/editar`}
              className="button-secondary"
              key={c.id}
            >
              {c.title}
            </Link>
          ))}
        </div>
        {!collections.data?.length && <p>{m.noMembership}</p>}
        <div className="mt-5 flex flex-wrap gap-3">
          <Link href={`/app/colecoes?add=${id}`} className="button-secondary">
            {m.collections}
          </Link>
          <Link
            href={`/app/colecoes/nova?add=${id}`}
            className="button-primary"
          >
            {m.newCollection}
          </Link>
        </div>
      </section>
    </main>
  );
}
