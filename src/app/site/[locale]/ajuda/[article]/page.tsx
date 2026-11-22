import Link from "next/link";
import { notFound } from "next/navigation";
import { normalizeLocale } from "@/lib/locale";
import { getMessages } from "@/lib/i18n/messages";
import { helpArticles } from "@/lib/help/articles";
export default async function HelpArticle({
  params,
}: {
  params: Promise<{ locale: string; article: string }>;
}) {
  const { locale: raw, article } = await params;
  const locale = normalizeLocale(raw);
  if (!locale) notFound();
  const m = getMessages(locale);
  const item = helpArticles(m).find((a) => a.slug === article);
  if (!item) notFound();
  return (
    <main id="main" className="mx-auto max-w-3xl space-y-8 px-6 py-12">
      <Link className="button-secondary" href={`/${locale}/ajuda`}>
        ← {m.workspace.help}
      </Link>
      <article className="rounded-xl bg-soft p-6 sm:p-10">
        <h1 className="text-3xl font-semibold tracking-tight">{item.title}</h1>
        <p className="my-4 text-xs text-ink-muted">
          {m.help.updated} <time dateTime="2026-11-20">20/11/2026</time>
        </p>
        <p className="leading-loose">{item.body}</p>
      </article>
      <Link className="button-primary" href={`/${locale}/contato`}>
        {m.help.contact} ↗
      </Link>
    </main>
  );
}
