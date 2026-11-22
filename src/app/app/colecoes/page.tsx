import Link from "next/link";
import { libraryClient } from "@/lib/library/server";
import { UUID, queryPage, queryText } from "@/lib/library/model";
import { getMessages } from "@/lib/i18n/messages";
import { getRequestLocale } from "@/lib/i18n/server";
import { Icon } from "@/components/ui/Icon";
export default async function UserCollections({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string;
    page?: string;
    order?: string;
    add?: string;
  }>;
}) {
  const q = await searchParams;
  const page = queryPage(q.page);
  const search = queryText(q.q, 100);
  const add = typeof q.add === "string" && UUID.test(q.add) ? q.add : "";
  const order = q.order === "oldest" ? "oldest" : "newest";
  const { db, user } = await libraryClient();
  let request = db
    .from("user_collections")
    .select("id,title,description,saved_ids,share_enabled", { count: "exact" })
    .eq("user_id", user.id)
    .order("updated_at", { ascending: order === "oldest" })
    .order("id")
    .range((page - 1) * 24, page * 24 - 1);
  if (search)
    request = request.ilike("title", `%${search.replace(/[\\%_]/g, "\\$&")}%`);
  const { data, error, count } = await request;
  if (error) throw Error("Collections unavailable");
  const m = getMessages(await getRequestLocale()).library;
  const href = (n: number) =>
    `/app/colecoes?${new URLSearchParams({ q: search, order, add, page: String(n) })}`;
  return (
    <main
      id="main"
      className="mx-auto max-w-content space-y-8 px-4 py-10 sm:px-6"
    >
      <div className="section-heading">
        <div>
          <p className="eyebrow">{m.title}</p>
          <h1>{m.collections}</h1>
        </div>
        <Link
          href={`/app/colecoes/nova${add ? `?add=${add}` : ""}`}
          className="button-primary"
        >
          <Icon name="plus" />
          {m.newCollection}
        </Link>
      </div>
      {add && <p className="library-filter-note">{m.manageCollections}</p>}
      <form className="library-filters" action="/app/colecoes">
        {add && <input type="hidden" name="add" value={add} />}
        <label>
          {m.collectionTitle}
          <input name="q" type="search" maxLength={100} defaultValue={search} />
        </label>
        <label>
          {m.sort}
          <select name="order" defaultValue={order}>
            <option value="newest">{m.newest}</option>
            <option value="oldest">{m.oldest}</option>
          </select>
        </label>
        <button className="button-secondary" type="submit">
          <Icon name="search" />
          {m.search}
        </button>
      </form>
      {data?.length ? (
        <div className="library-grid">
          {data.map((c) => (
            <Link
              href={`/app/colecoes/${c.id}${add ? `/editar?add=${add}` : ""}`}
              className="discover-card"
              key={c.id}
            >
              <div className="collection-cover">
                <Icon name="layers" width={40} height={40} />
              </div>
              <h2 className="mt-5 font-semibold">{c.title}</h2>
              <p className="mt-2 line-clamp-2">{c.description}</p>
              <div className="mt-5 flex justify-between gap-3 text-xs text-ink-muted">
                <span>{c.share_enabled ? m.shared : m.private}</span>
                <span>
                  {c.saved_ids.length} {m.items.toLocaleLowerCase()}
                </span>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <section className="empty-collection">
          <Icon name="layers" width={32} height={32} />
          <h2>{search ? m.noResults : m.emptyCollection}</h2>
          <p>{m.emptyBody}</p>
        </section>
      )}
      <nav aria-label={m.collections} className="flex justify-between gap-3">
        {page > 1 ? (
          <Link className="button-secondary" href={href(page - 1)}>
            {m.previous}
          </Link>
        ) : (
          <span />
        )}
        {(count ?? 0) > page * 24 && (
          <Link className="button-secondary" href={href(page + 1)}>
            {m.next}
          </Link>
        )}
      </nav>
    </main>
  );
}
