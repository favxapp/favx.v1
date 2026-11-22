import { cache } from "react";
import { notFound } from "next/navigation";
import { requireCreator } from "@/lib/posts/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { UUID } from "@/lib/library/model";
import type { CommunityRequest, PublicRequest } from "./model";
export const communityCreator = cache(async () => {
  const s = await requireCreator();
  if (!s.active) notFound();
  return s;
});
export const publicRequest = cache(async (id: string) => {
  if (!UUID.test(id)) notFound();
  const db = await createSupabaseServerClient();
  const { data, error } = await db.rpc("get_community_request", { p_id: id });
  if (error) throw Error("Request unavailable");
  if (!data) notFound();
  return data as PublicRequest;
});
export async function ownRequest(id: string) {
  if (!UUID.test(id)) notFound();
  const s = await communityCreator();
  const { data, error } = await s.supabase
    .from("community_requests")
    .select(
      "id,title,description,category,instructions,state,expires_at,version,created_at,updated_at",
    )
    .eq("id", id)
    .eq("creator_id", s.user.id)
    .maybeSingle();
  if (error) throw Error("Request unavailable");
  if (!data) notFound();
  return { ...s, request: data as CommunityRequest };
}
