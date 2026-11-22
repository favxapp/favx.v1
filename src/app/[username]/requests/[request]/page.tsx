import Link from "next/link";
import { notFound } from "next/navigation";
import { publicRequest } from "@/lib/community/server";
import { requestPath } from "@/lib/community/model";
import { getMessages } from "@/lib/i18n/messages";
import { getRequestLocale } from "@/lib/i18n/server";
import { utcDate } from "@/lib/posts/management";
import { publicOrigin } from "@/lib/creator/public";
import { ShareProfile } from "@/components/creator/ShareProfile";
export const dynamic = "force-dynamic";
export const metadata = {
  title: "FAVX · Community",
  robots: { index: false, follow: false },
};
export default async function PublicCommunityRequest({
  params,
}: {
  params: Promise<{ username: string; request: string }>;
}) {
  const { username, request: id } = await params,
    r = await publicRequest(id);
  if (r.username !== username) notFound();
  const locale = await getRequestLocale(),
    m = getMessages(locale),
    c = m.community;
  return (
    <main id="main" className="mx-auto max-w-3xl space-y-8 px-4 py-10 sm:px-6">
      <Link
        className="inline-flex min-h-11 items-center text-sm underline"
        href={`/${username}`}
      >
        ← {r.display_name}
      </Link>
      <article className="glass-panel space-y-6 rounded-[32px] p-6 sm:p-10">
        <p className="eyebrow">
          {c.title} / {r.display_name}
        </p>
        <h1 className="break-words text-3xl font-semibold leading-tight tracking-tight sm:text-5xl">
          {r.title}
        </h1>
        {r.category && (
          <p className="inline-block rounded-full bg-soft px-4 py-2 text-sm">
            {r.category}
          </p>
        )}
        <p className="whitespace-pre-wrap break-words leading-relaxed text-ink-muted">
          {r.description}
        </p>
        {r.instructions && (
          <section className="rounded-2xl bg-soft p-5">
            <h2 className="font-semibold">{c.instructions}</h2>
            <p className="mt-3 whitespace-pre-wrap break-words text-sm leading-relaxed">
              {r.instructions}
            </p>
          </section>
        )}
        <p className="text-xs text-ink-muted">
          {r.expires_at ? `${utcDate(r.expires_at, locale)} UTC` : c.noExpiry}
        </p>
        <Link
          className="button-primary"
          href={`${requestPath(username, id)}/enviar`}
        >
          {c.send} →
        </Link>
        <p className="text-sm leading-relaxed text-ink-muted">
          {c.privateHint}
        </p>
      </article>
      <ShareProfile
        url={`${publicOrigin()}${requestPath(username, id)}`}
        title={r.title}
        labels={m.creator}
      />
    </main>
  );
}
