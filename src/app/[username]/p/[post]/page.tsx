import Link from 'next/link';
import { cache } from 'react';
import { notFound, permanentRedirect } from 'next/navigation';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { getRequestLocale } from '@/lib/i18n/server';
import { getMessages } from '@/lib/i18n/messages';
import { PostCard } from '@/components/posts/PostCard';
import { postPath, type PublicPost } from '@/lib/posts/model';
import { publicOrigin } from '@/lib/creator/public';
import { ShareProfile } from '@/components/creator/ShareProfile';
export const dynamic = 'force-dynamic';
type Props = { params: Promise<{ username: string; post: string }> };
const getPost = cache(async (username: string, segment: string) => {
  const publicId = segment.match(/-([a-f0-9]{32})$/)?.[1];
  if (!publicId || !/^[a-z0-9][a-z0-9_-]{2,29}$/.test(username)) notFound();
  const supabase = await createSupabaseServerClient();
  const [{ data: posts, error }, { data: profiles, error: profileError }] = await Promise.all([
    supabase.rpc('get_public_posts', { p_username: username, p_public_id: publicId }),
    supabase.rpc('get_public_creator', { p_username: username }),
  ]);
  if (error || profileError) throw Error('Public post unavailable');
  if (!posts?.length || !profiles?.length) notFound();
  return { post: posts[0] as PublicPost, name: profiles[0].display_name as string };
});
export async function generateMetadata({ params }: Props) {
  const { username, post: segment } = await params;
  const { post } = await getPost(username, segment);
  return { title: `${post.title} · FAVX`, description: post.body.slice(0, 160), alternates: { canonical: `${publicOrigin()}${postPath(username, post)}` } };
}
export default async function PublicPostPage({ params }: Props) {
  const { username, post: segment } = await params;
  const { post, name } = await getPost(username, segment);
  if (segment !== `${post.slug}-${post.public_id}`) permanentRedirect(postPath(username, post));
  const m = getMessages(await getRequestLocale());
  return <main id="main" className="mx-auto max-w-3xl space-y-6 px-4 py-10 sm:px-6"><Link href={`/${username}`} className="inline-flex min-h-11 items-center text-sm underline">← {name}</Link><PostCard content={post} name={name} labels={m.posts} /><ShareProfile url={`${publicOrigin()}${postPath(username, post)}`} title={post.title} labels={m.creator} /></main>;
}
