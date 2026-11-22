import Link from "next/link";
import { notFound } from "next/navigation";
import { normalizeLocale } from "@/lib/locale";
import { getMessages } from "@/lib/i18n/messages";
import { helpArticles } from "@/lib/help/articles";
import { Icon } from "@/components/ui/Icon";
export default async function HelpPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ q?: string }>;
}) {
  const locale = normalizeLocale((await params).locale);
  if (!locale) notFound();
  const m = getMessages(locale);
  const q = ((await searchParams).q ?? "").slice(0, 120);
  const articles = helpArticles(m).filter((a) =>
    `${a.title} ${a.body}`.toLocaleLowerCase().includes(q.toLocaleLowerCase()),
  );
  return (
    <main id="main" className="mx-auto max-w-4xl space-y-8 px-6 py-12">
      <div>
        <p className="eyebrow">FAVX</p>
        <h1 className="text-4xl font-semibold tracking-tight">
          {m.workspace.help}
        </h1>
        <p className="mt-4 text-ink-muted">{m.help.intro}</p>
      </div>
      <form method="get" className="flex gap-3">
        <label className="sr-only" htmlFor="help-search">
          {m.help.search}
        </label>
        <input
          id="help-search"
          name="q"
          defaultValue={q}
          maxLength={120}
          placeholder={m.help.search}
          className="min-h-12 min-w-0 flex-1 rounded-full border border-field px-5"
        />
        <button className="button-primary" aria-label={m.help.search}>
          <Icon name="search" />
        </button>
      </form>
      <div className="grid gap-4 sm:grid-cols-2">
        {articles.map((a) => (
          <Link
            className="discover-card !bg-soft"
            key={a.slug}
            href={`/${locale}/ajuda/${a.slug}`}
          >
            <Icon name="help" />
            <h2 className="my-4 font-semibold">{a.title}</h2>
            <p className="line-clamp-2">{a.body}</p>
            <span className="mt-4 inline-block">↗</span>
          </Link>
        ))}
      </div>
      {!articles.length && <p>{m.help.empty}</p>}
      <Link className="button-secondary" href={`/${locale}/contato`}>
        {m.help.contact} ↗
      </Link>
    </main>
  );
}
