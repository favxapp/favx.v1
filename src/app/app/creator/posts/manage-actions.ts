"use server";
import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import { requireCreator } from "@/lib/posts/server";
import { MEDIA_ID } from "@/lib/media/model";
import { parsePost } from "@/lib/posts/model";
export async function managePost(id: string, version: number, action: string) {
  if (
    !MEDIA_ID.test(id) ||
    !Number.isSafeInteger(version) ||
    version < 1 ||
    !["hide", "archive", "trash", "restore", "duplicate"].includes(action)
  )
    return { error: "failed" };
  const { supabase, user, creator, active } = await requireCreator();
  if (!active) return { error: "failed" };
  let destination = `/app/creator/posts/${id}`;
  if (action === "duplicate") {
    const { data, error } = await supabase
      .from("creator_posts")
      .select("*")
      .eq("id", id)
      .eq("creator_id", user.id)
      .eq("version", version)
      .maybeSingle();
    if (error || !data || data.lifecycle_state === "trashed")
      return { error: "conflict" };
    const parsed = parsePost(data, "draft");
    if (!parsed.ok) return { error: "failed" };
    const newId = randomUUID();
    const saved = await supabase.rpc("save_creator_post", {
      p_id: newId,
      p_expected_version: 0,
      p_payload: parsed.value,
      p_status: "draft",
    });
    if (saved.error) return { error: "failed" };
    destination = `/app/creator/posts/${newId}/editar`;
  } else {
    const { error } = await supabase.rpc("transition_creator_post", {
      p_id: id,
      p_version: version,
      p_action: action,
    });
    if (error) return { error: error.code === "40001" ? "conflict" : "failed" };
  }
  revalidatePath("/app/creator", "layout");
  revalidatePath(`/${creator.username}`, "layout");
  revalidatePath("/app/salvos", "layout");
  return { destination };
}
