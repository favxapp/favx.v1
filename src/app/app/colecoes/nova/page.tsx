import { randomUUID } from "node:crypto";
import { userLibrary } from "@/lib/library/server";
import { UUID, pickerItem } from "@/lib/library/model";
import { getMessages } from "@/lib/i18n/messages";
import { getRequestLocale } from "@/lib/i18n/server";
import { CollectionForm } from "@/components/library/CollectionForm";
export default async function NewCollection({
  searchParams,
}: {
  searchParams: Promise<{ add?: string }>;
}) {
  const { add } = await searchParams;
  const [data, selected, locale] = await Promise.all([
    userLibrary(),
    typeof add === "string" && UUID.test(add)
      ? userLibrary({ p_item: add })
      : null,
    getRequestLocale(),
  ]);
  const m = getMessages(locale).library;
  return (
    <main
      id="main"
      className="mx-auto max-w-content space-y-8 px-4 py-10 sm:px-6"
    >
      <div>
        <p className="eyebrow">{m.private}</p>
        <h1>{m.newCollection}</h1>
      </div>
      <CollectionForm
        m={m}
        initial={{
          id: randomUUID(),
          title: "",
          description: "",
          saved_ids: selected?.items.map((x) => x.id) ?? [],
          cover_saved_id: null,
          version: 0,
        }}
        initialItems={data.items.map(pickerItem)}
        selectedItems={selected?.items.map(pickerItem) ?? []}
        total={data.total}
      />
    </main>
  );
}
