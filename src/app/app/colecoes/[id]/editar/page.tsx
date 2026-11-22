import { userLibrary, userCollection } from "@/lib/library/server";
import { UUID, pickerItem, type LibraryResult } from "@/lib/library/model";
import { getMessages } from "@/lib/i18n/messages";
import { getRequestLocale } from "@/lib/i18n/server";
import { CollectionForm } from "@/components/library/CollectionForm";
export default async function EditCollection({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ add?: string }>;
}) {
  const { id } = await params;
  const { add } = await searchParams;
  const { db, collection } = await userCollection(id);
  const [data, added, locale, ...pages] = await Promise.all([
    userLibrary(),
    typeof add === "string" && UUID.test(add)
      ? userLibrary({ p_item: add })
      : null,
    getRequestLocale(),
    ...Array.from(
      { length: Math.ceil(collection.saved_ids.length / 24) },
      (_, i) => db.rpc("get_user_library", { p_collection: id, p_page: i + 1 }),
    ),
  ]);
  if (pages.some((p) => p.error)) throw Error("Collection unavailable");
  const selected = pages.flatMap((p) => (p.data as LibraryResult).items);
  const ids = [...collection.saved_ids];
  if (added?.items[0] && !ids.includes(added.items[0].id) && ids.length < 200)
    ids.push(added.items[0].id);
  const m = getMessages(locale).library;
  return (
    <main
      id="main"
      className="mx-auto max-w-content space-y-8 px-4 py-10 sm:px-6"
    >
      <div>
        <p className="eyebrow">
          {collection.share_enabled ? m.shared : m.private}
        </p>
        <h1>{m.editCollection}</h1>
      </div>
      <CollectionForm
        key={collection.id}
        m={m}
        initial={{
          id: collection.id,
          title: collection.title,
          description: collection.description,
          saved_ids: ids,
          cover_saved_id: collection.cover_saved_id,
          version: collection.version,
        }}
        initialItems={data.items.map(pickerItem)}
        selectedItems={[...selected, ...(added?.items ?? [])].map(pickerItem)}
        total={data.total}
      />
    </main>
  );
}
