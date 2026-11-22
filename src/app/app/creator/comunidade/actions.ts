"use server";
import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { communityCreator } from "@/lib/community/server";
import {
  parseRequest,
  parseSuggestion,
  REVIEW_STATES,
  requestPath,
} from "@/lib/community/model";
import { UUID } from "@/lib/library/model";
export async function saveRequest(id: string, version: number, input: unknown) {
  const parsed = parseRequest(input);
  if (
    !UUID.test(id) ||
    !Number.isSafeInteger(version) ||
    version < 0 ||
    !parsed
  )
    return { error: "invalid" };
  const { supabase, creator } = await communityCreator();
  const { data, error } = await supabase.rpc("save_community_request", {
    p_id: id,
    p_version: version,
    p_payload: parsed,
  });
  if (error || !data?.length)
    return {
      error:
        error?.code === "40001"
          ? "conflict"
          : error?.code === "23514"
            ? "notReady"
            : "failed",
    };
  revalidatePath("/app/creator/comunidade", "layout");
  revalidatePath(requestPath(creator.username, id), "layout");
  return { saved: data[0] as { id: string; version: number } };
}
export async function sendSuggestion(
  id: string,
  requestId: string,
  input: unknown,
) {
  const parsed = parseSuggestion(input);
  if (!UUID.test(id) || !UUID.test(requestId) || !parsed)
    return { error: "invalid" };
  const db = await createSupabaseServerClient();
  const {
    data: { user },
  } = await db.auth.getUser();
  if (!user) return { error: "loginRequired" };
  const { data, error } = await db.rpc("submit_community_suggestion", {
    p_id: id,
    p_request: requestId,
    p_payload: parsed,
  });
  if (error || !data)
    return {
      error:
        error?.code === "54000"
          ? "rateLimit"
          : error?.code === "23514"
            ? "unavailable"
            : error?.code === "42501"
              ? "loginRequired"
              : "failed",
    };
  return { receipt: data as string };
}
export async function reviewSuggestion(
  id: string,
  version: number,
  state: string,
) {
  if (
    !UUID.test(id) ||
    !Number.isSafeInteger(version) ||
    version < 1 ||
    !REVIEW_STATES.includes(state as (typeof REVIEW_STATES)[number])
  )
    return { error: "invalid" };
  const { supabase } = await communityCreator();
  const { data, error } = await supabase
    .from("community_submissions")
    .update({ review_state: state })
    .eq("id", id)
    .eq("version", version)
    .select("id");
  if (error) return { error: "failed" };
  if (!data?.length) return { error: "conflict" };
  revalidatePath("/app/creator/comunidade", "layout");
  return { saved: true };
}
