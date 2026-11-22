import Link from "next/link";
import { userCollection, userLibrary } from "@/lib/library/server";
import { queryPage, type LibraryPost } from "@/lib/library/model";
import { getMessages } from "@/lib/i18n/messages";
import { getRequestLocale } from "@/lib/i18n/server";
import { publicOrigin } from "@/lib/creator/public";
import { CollectionSharing } from "@/components/library/CollectionSharing";
import { SavedCard } from "@/components/library/SavedCard";
import { SharedSelection } from "@/components/library/SharedSelection";
export default async function CollectionDetail({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ page?: string; preview?: string }>;
}) {
  const { id } = await params;
  const query = await searchParams;
  const page = queryPage(query.page);
  const { collection } = await userCollection(id);
  const [data, coverData, locale] = await Promise.all([
    userLibrary({ p_collection: id, p_page: page }),
    collection.cover_saved_id
      ? userLibrary({ p_item: collection.cover_saved_id })
      : null,
    getRequestLocale(),
  ]);
  const messages = getMessages(locale);
  const m = messages.library;
  const cover = coverData?.items[0]?.post?.media_ids?.[0];
  return (
    <main
      id="main"
      className="mx-auto max-w-content space-y-8 px-4 py-10 sm:px-6"
    >
      <Link
        className="button-secondary"
        href={query.preview ? `/app/colecoes/${id}` : "/app/colecoes"}
      >
        ← {m.back}
      </Link>
      {query.preview ? (
        <SharedSelection
          title={collection.title}
          description={collection.description}
          cover={cover}
          posts={data.items
            .map((x) => x.post)
            .filter((p): p is LibraryPost => !!p)}
          m={messages}
        />
      ) : (
        <>
          <div className="section-heading">
            <div>
              <p className="eyebrow">
                {collection.share_enabled ? m.shared : m.private}
              </p>
              <h1 className="break-words">{collection.title}</h1>
            </div>
            <Link
              href={`/app/colecoes/${id}/editar`}
              className="button-secondary"
            >
              {m.editCollection}
            </Link>
          </div>
          {cover && (
            <img
              src={`/api/media/post/${cover}`}
              alt=""
              className="max-h-80 w-full rounded-3xl object-cover"
            />
          )}
          <p className="whitespace-pre-wrap text-sm text-ink-muted">
            {collection.description}
          </p>
          <CollectionSharing
            collection={collection}
            origin={publicOrigin()}
            m={m}
          />
          {data.items.length ? (
            <div className="library-grid">
              {data.items.map((item) => (
                <SavedCard item={item} m={m} key={item.id} />
              ))}
            </div>
          ) : (
            <section className="empty-collection">
              <h2>{m.emptyCollection}</h2>
              <Link
                className="button-primary mt-5"
                href={`/app/colecoes/${id}/editar`}
              >
                {m.editCollection}
              </Link>
            </section>
          )}
        </>
      )}
      <nav className="flex justify-between gap-3" aria-label={m.items}>
        {page > 1 ? (
          <Link
            className="button-secondary"
            href={`/app/colecoes/${id}?page=${page - 1}${query.preview ? "&preview=1" : ""}`}
          >
            {m.previous}
          </Link>
        ) : (
          <span />
        )}
        {data.total > page * 24 && (
          <Link
            className="button-secondary"
            href={`/app/colecoes/${id}?page=${page + 1}${query.preview ? "&preview=1" : ""}`}
          >
            {m.next}
          </Link>
        )}
      </nav>
    </main>
  );
}
