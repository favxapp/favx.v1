import { cache } from "react";
import { redirect, notFound } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getRequestLocale } from "@/lib/i18n/server";
import { UUID, type LibraryResult, type UserCollection } from "./model";
export const libraryClient = cache(async () => {
  const db = await createSupabaseServerClient();
  const {
    data: { user },
  } = await db.auth.getUser();
  if (!user) redirect(`/${await getRequestLocale()}/login`);
  const { data: profile } = await db
    .from("profiles")
    .select("account_state")
    .eq("user_id", user.id)
    .single();
  if (profile?.account_state !== "active") throw Error("Account unavailable");
  return { db, user };
});
export async function userCollection(id: string) {
  if (!UUID.test(id)) notFound();
  const { db, user } = await libraryClient();
  const { data, error } = await db
    .from("user_collections")
    .select(
      "id,title,description,saved_ids,cover_saved_id,share_enabled,share_token,version,updated_at",
    )
    .eq("id", id)
    .eq("user_id", user.id)
    .maybeSingle();
  if (error) throw Error("Collection unavailable");
  if (!data) notFound();
  return { db, user, collection: data as UserCollection };
}
export async function userLibrary(
  args: Record<string, string | number | null> = {},
) {
  const { db } = await libraryClient();
  const { data, error } = await db.rpc("get_user_library", args);
  if (error) throw Error("Library unavailable");
  return data as LibraryResult;
}
