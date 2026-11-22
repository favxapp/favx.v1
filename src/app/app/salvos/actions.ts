"use server";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getRequestLocale } from "@/lib/i18n/server";
import { PUBLIC_ID, UUID } from "@/lib/library/model";
const INTENT = "favx_save_intent";
export async function saveState(publicId: string) {
  if (!PUBLIC_ID.test(publicId)) return null;
  const db = await createSupabaseServerClient();
  const {
    data: { user },
  } = await db.auth.getUser();
  if (!user) return null;
  const { data } = await db
    .from("user_saves")
    .select("id")
    .eq("user_id", user.id)
    .eq("post_public_id", publicId)
    .maybeSingle();
  return data?.id as string | null;
}
export async function saveRecommendation(
  publicId: string,
  consumeIntent = false,
) {
  if (!PUBLIC_ID.test(publicId)) return { error: "unavailable" };
  const db = await createSupabaseServerClient();
  const {
    data: { user },
  } = await db.auth.getUser();
  const jar = await cookies();
  if (!user) {
    if (consumeIntent) return { error: "failed" };
    jar.set(INTENT, publicId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 900,
    });
    return {
      login: `/${await getRequestLocale()}/login?next=${encodeURIComponent(`/app/salvos/adicionar?post=${publicId}`)}`,
    };
  }
  if (consumeIntent && jar.get(INTENT)?.value !== publicId)
    return { error: "missingIntent" };
  const { data, error } = await db.rpc("save_recommendation", {
    p_public_id: publicId,
  });
  if (error || !data)
    return { error: error?.code === "23514" ? "unavailable" : "failed" };
  if (jar.get(INTENT)?.value === publicId) jar.delete(INTENT);
  revalidatePath("/app/me");
  revalidatePath("/app/salvos");
  return { id: data as string };
}
export async function removeSaved(id: string) {
  if (!UUID.test(id)) return { error: "failed" };
  const db = await createSupabaseServerClient();
  const {
    data: { user },
  } = await db.auth.getUser();
  if (!user) return { error: "failed" };
  const { data, error } = await db
    .from("user_saves")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id)
    .select("id");
  if (error || !data?.length) return { error: "failed" };
  revalidatePath("/app/me");
  revalidatePath("/app/salvos", "layout");
  revalidatePath("/app/colecoes", "layout");
  return { ok: true };
}
