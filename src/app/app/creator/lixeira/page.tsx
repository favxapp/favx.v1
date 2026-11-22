import { ManagedPostList } from "@/components/posts/ManagedPostList";
export default async function Trash({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; state?: string; q?: string }>;
}) {
  return <ManagedPostList mode="trash" search={await searchParams} />;
}
