import Link from "next/link";
import { userLibrary } from "@/lib/library/server";
import { queryPage, queryText } from "@/lib/library/model";
import { getRequestLocale } from "@/lib/i18n/server";
import { getMessages } from "@/lib/i18n/messages";
import { SavedCard } from "@/components/library/SavedCard";
import { Icon } from "@/components/ui/Icon";
export default async function SavedPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const q = await searchParams;
  const page = queryPage(q.page);
  const search = queryText(q.q);
  const category = queryText(q.category, 30);
  const creator = queryText(q.creator, 30);
  const since =
    typeof q.since === "string" &&
    /^\d{4}-\d{2}-\d{2}$/.test(q.since) &&
    !Number.isNaN(Date.parse(q.since))
      ? q.since
      : "";
  const order = q.order === "oldest" ? "oldest" : "newest";
  const [data, locale] = await Promise.all([
    userLibrary({
      p_query: search,
      p_category: category,
      p_creator: creator,
      p_since: since ? `${since}T00:00:00Z` : null,
      p_order: order,
      p_page: page,
    }),
    getRequestLocale(),
  ]);
  const m = getMessages(locale).library;
  const href = (n: number) =>
    `/app/salvos?${new URLSearchParams({ q: search, category, creator, since, order, page: String(n) })}`;
  return (
    <main
      id="main"
      className="mx-auto max-w-content space-y-8 px-4 py-10 sm:px-6"
    >
      <div className="section-heading">
        <div>
          <p className="eyebrow">{m.title}</p>
          <h1>{m.saved}</h1>
        </div>
        <Link href="/app/colecoes" className="button-secondary">
          {m.collections}
          <Icon name="arrow" />
        </Link>
      </div>
      <form className="library-filters" action="/app/salvos">
        <label className="library-search">
          {m.search}
          <input name="q" type="search" maxLength={120} defaultValue={search} />
        </label>
        <label>
          {m.allCategories}
          <select name="category" defaultValue={category}>
            <option value="">{m.allCategories}</option>
            {data.categories.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </label>
        <label>
          {m.allCreators}
          <select name="creator" defaultValue={creator}>
            <option value="">{m.allCreators}</option>
            {data.creators.map((c) => (
              <option value={c.username} key={c.username}>
                {c.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          {m.since}
          <input name="since" type="date" defaultValue={since} />
        </label>
        <label>
          {m.sort}
          <select name="order" defaultValue={order}>
            <option value="newest">{m.newest}</option>
            <option value="oldest">{m.oldest}</option>
          </select>
        </label>
        <button className="button-primary" type="submit">
          <Icon name="search" />
          {m.search}
        </button>
        <Link href="/app/salvos" className="button-secondary">
          {m.reset}
        </Link>
      </form>
      {data.items.length ? (
        <div className="library-grid">
          {data.items.map((item) => (
            <SavedCard key={item.id} item={item} m={m} />
          ))}
        </div>
      ) : (
        <section className="empty-collection">
          <Icon name="bookmark" width={32} height={32} />
          <h2>
            {search || category || creator || since
              ? m.noResults
              : m.emptyTitle}
          </h2>
          <p>{m.emptyBody}</p>
        </section>
      )}
      <nav className="flex justify-between gap-3" aria-label={m.saved}>
        {page > 1 ? (
          <Link href={href(page - 1)} className="button-secondary">
            ← {m.previous}
          </Link>
        ) : (
          <span />
        )}
        {data.total > page * 24 && (
          <Link href={href(page + 1)} className="button-secondary">
            {m.next} →
          </Link>
        )}
      </nav>
    </main>
  );
}
