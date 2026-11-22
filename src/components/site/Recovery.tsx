import Link from "next/link";
import type { Locale } from "@/lib/locale";
import { getMessages } from "@/lib/i18n/messages";
import { safeErrorReference } from "@/lib/support/recovery";

export function Recovery({
  locale,
  kind,
  reset,
  digest,
}: {
  locale: Locale;
  kind: "not-found" | "error";
  reset?: () => void;
  digest?: string;
}) {
  const m = getMessages(locale);
  const content = kind === "not-found" ? m.notFound : m.error;
  const reference = safeErrorReference(digest);
  return (
    <main
      id="main"
      className="public-page flex min-h-[75dvh] items-center justify-center"
      style={{ padding: "40px 24px", marginInline: "auto", maxWidth: 900 }}
    >
      <section
        className="glass-panel w-full rounded-[32px] p-8 sm:p-12"
        style={{ overflowWrap: "anywhere" }}
      >
        <Link href={`/${locale}`} className="wordmark" aria-label="FAVX">
          FAVX
        </Link>
        <p className="eyebrow mt-10">
          {kind === "not-found" ? "404" : m.publicGuide.recoveryLabel}
        </p>
        <h1 className="max-w-xl text-3xl font-semibold tracking-tight sm:text-5xl">
          {content.title}
        </h1>
        <p className="mb-8 mt-5 max-w-lg text-ink-muted">{content.body}</p>
        <div className="flex flex-wrap gap-3">
          {reset && (
            <button type="button" onClick={reset} className="button-primary">
              {m.error.retry}
            </button>
          )}
          <Link
            className={reset ? "button-secondary" : "button-primary"}
            href={`/${locale}`}
          >
            {m.publicGuide.home}
          </Link>
          <Link className="button-secondary" href={`/${locale}/ajuda`}>
            {m.publicGuide.help}
          </Link>
        </div>
        <div className="mt-8 flex flex-wrap items-center gap-4 border-t border-line pt-6 text-sm">
          <Link
            href={`/${locale}/contato`}
            className="underline underline-offset-4"
          >
            {m.publicGuide.support}
          </Link>
          {reference && (
            <p className="text-xs text-ink-muted">
              {m.publicGuide.reference}: <code>{reference}</code>
            </p>
          )}
        </div>
      </section>
    </main>
  );
}
