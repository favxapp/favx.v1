import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { PUBLIC_ID } from "@/lib/library/model";
import { libraryClient } from "@/lib/library/server";
import { getRequestLocale } from "@/lib/i18n/server";
import { getMessages } from "@/lib/i18n/messages";
import { SaveIntent } from "@/components/library/SaveIntent";
export default async function AddSaved({
  searchParams,
}: {
  searchParams: Promise<{ post?: string }>;
}) {
  const { post } = await searchParams;
  if (typeof post !== "string" || !PUBLIC_ID.test(post)) notFound();
  await libraryClient();
  const jar = await cookies();
  const m = getMessages(await getRequestLocale());
  return (
    <main id="main" className="px-4 py-12">
      <SaveIntent
        publicId={post}
        resume={jar.get("favx_save_intent")?.value === post}
        m={m.library}
      />
    </main>
  );
}
