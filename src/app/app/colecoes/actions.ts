"use server";
import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  UUID,
  validCollection,
  type CollectionInput,
} from "@/lib/library/model";
const refresh = () => {
  revalidatePath("/app/me");
  revalidatePath("/app/colecoes", "layout");
  revalidatePath("/app/salvos", "layout");
};
export async function savePersonalCollection(value: CollectionInput) {
  if (!validCollection(value)) return { error: "invalid" };
  const db = await createSupabaseServerClient();
  const {
    data: { user },
  } = await db.auth.getUser();
  if (!user) return { error: "failed" };
  const { data, error } = await db.rpc("save_user_collection", {
    p_id: value.id,
    p_version: value.version,
    p_title: value.title,
    p_description: value.description,
    p_saved_ids: value.saved_ids,
    p_cover: value.cover_saved_id,
  });
  if (error || !data?.length)
    return { error: error?.code === "40001" ? "conflict" : "failed" };
  refresh();
  return { saved: data[0] as { id: string; version: number } };
}
export async function sharePersonalCollection(
  id: string,
  version: number,
  enabled: boolean,
) {
  if (
    !UUID.test(id) ||
    !Number.isSafeInteger(version) ||
    version < 1 ||
    typeof enabled !== "boolean"
  )
    return { error: "failed" };
  const db = await createSupabaseServerClient();
  const {
    data: { user },
  } = await db.auth.getUser();
  if (!user) return { error: "failed" };
  const { data, error } = await db.rpc("share_user_collection", {
    p_id: id,
    p_version: version,
    p_enabled: enabled,
  });
  if (error || !data?.length)
    return { error: error?.code === "40001" ? "conflict" : "failed" };
  refresh();
  return { saved: data[0] as { version: number; share_token: string | null } };
}
export async function deletePersonalCollection(id: string, version: number) {
  if (!UUID.test(id) || !Number.isSafeInteger(version) || version < 1)
    return { error: "failed" };
  const db = await createSupabaseServerClient();
  const {
    data: { user },
  } = await db.auth.getUser();
  if (!user) return { error: "failed" };
  const { data, error } = await db
    .from("user_collections")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id)
    .eq("version", version)
    .select("id");
  if (error || !data?.length) return { error: error ? "failed" : "conflict" };
  refresh();
  return { ok: true };
}
export async function searchSaved(query: string, page: number) {
  if (
    typeof query !== "string" ||
    query.length > 120 ||
    !Number.isSafeInteger(page) ||
    page < 1 ||
    page > 100000
  )
    return { error: "failed" };
  const db = await createSupabaseServerClient();
  const {
    data: { user },
  } = await db.auth.getUser();
  if (!user) return { error: "failed" };
  const { data, error } = await db.rpc("get_user_library", {
    p_query: query,
    p_page: page,
  });
  if (error) return { error: "failed" };
  const { pickerItem } = await import("@/lib/library/model");
  return {
    items: (data.items as import("@/lib/library/model").SavedItem[]).map(
      pickerItem,
    ),
    total: data.total as number,
  };
}
