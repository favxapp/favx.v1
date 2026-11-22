import { ManagedPostList } from "@/components/posts/ManagedPostList";
export default async function ClosedPosts({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; state?: string; q?: string }>;
}) {
  return <ManagedPostList mode="closed" search={await searchParams} />;
}
