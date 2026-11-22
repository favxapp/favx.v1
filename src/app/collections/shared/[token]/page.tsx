import Link from "next/link";
import { notFound } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getRequestLocale } from "@/lib/i18n/server";
import { getMessages } from "@/lib/i18n/messages";
import { PUBLIC_ID, queryPage, type LibraryPost } from "@/lib/library/model";
import { SharedSelection } from "@/components/library/SharedSelection";
import { ShareProfile } from "@/components/creator/ShareProfile";
import { publicOrigin } from "@/lib/creator/public";
export const dynamic = "force-dynamic";
export const metadata = {
  title: "FAVX",
  robots: { index: false, follow: false },
};
export default async function SharedCollection({
  params,
  searchParams,
}: {
  params: Promise<{ token: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const { token } = await params;
  if (!PUBLIC_ID.test(token)) notFound();
  const page = queryPage((await searchParams).page);
  const db = await createSupabaseServerClient();
  const { data, error } = await db.rpc("get_shared_user_collection", {
    p_token: token,
    p_page: page,
  });
  if (error) throw Error("Collection unavailable");
  if (!data) notFound();
  const result = data as {
    title: string;
    description: string;
    cover: string | null;
    posts: LibraryPost[];
    has_more: boolean;
  };
  const locale = await getRequestLocale();
  const m = getMessages(locale);
  return (
    <main id="main" className="mx-auto max-w-5xl px-4 py-8 sm:px-8">
      <header className="mb-10 flex flex-wrap items-center justify-between gap-4">
        <Link href={`/${locale}`} className="wordmark">
          FAVX
        </Link>
        <ShareProfile
          compact
          url={`${publicOrigin()}/collections/shared/${token}`}
          title={result.title}
          labels={m.creator}
        />
      </header>
      <SharedSelection {...result} m={m} />
      <nav
        aria-label={m.library.items}
        className="mt-8 flex justify-between gap-3"
      >
        {page > 1 ? (
          <a
            className="button-secondary"
            href={`/collections/shared/${token}?page=${page - 1}`}
          >
            {m.library.previous}
          </a>
        ) : (
          <span />
        )}
        {result.has_more && (
          <a
            className="button-secondary"
            href={`/collections/shared/${token}?page=${page + 1}`}
          >
            {m.library.next}
          </a>
        )}
      </nav>
    </main>
  );
}
