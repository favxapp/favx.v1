import { redirect, notFound } from "next/navigation";
import { publicRequest } from "@/lib/community/server";
import { requestPath } from "@/lib/community/model";
export default async function ReturnToSuggestion({
  searchParams,
}: {
  searchParams: Promise<{ request?: string }>;
}) {
  const { request } = await searchParams;
  if (!request) notFound();
  const r = await publicRequest(request);
  redirect(`${requestPath(r.username, r.id)}/enviar`);
}
