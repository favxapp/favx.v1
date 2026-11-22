import { notFound } from "next/navigation";
import { requireCreator } from "./server";
import { MEDIA_ID } from "@/lib/media/model";
import type { PostRecord } from "./model";
export async function managedPost(id: string) {
  if (!MEDIA_ID.test(id)) notFound();
  const session = await requireCreator();
  if (!session.active) notFound();
  const { data, error } = await session.supabase
    .from("creator_posts")
    .select("*")
    .eq("id", id)
    .eq("creator_id", session.user.id)
    .maybeSingle();
  if (error) throw Error("Post unavailable");
  if (!data) notFound();
  return {
    ...session,
    post: data as PostRecord & {
      created_at: string;
      state_changed_at: string | null;
    },
  };
}
export function utcDate(value: string, locale: string) {
  return new Intl.DateTimeFormat(locale, {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "UTC",
  }).format(new Date(value));
}
