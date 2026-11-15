import { notFound } from 'next/navigation';
import { PostEditor } from '@/components/posts/PostEditor';
import { requireCreator } from '@/lib/posts/server';
import type { PostRecord } from '@/lib/posts/model';
import { getRequestLocale } from '@/lib/i18n/server';
import { getMessages } from '@/lib/i18n/messages';
export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!/^[a-f0-9-]{36}$/.test(id)) notFound();
  const { supabase, creator, user, active } = await requireCreator();
  const { data, error } = await supabase.from('creator_posts').select('id,public_id,slug,title,body,content_kind,tags,links,rating,is_sponsored,disclosure,lifecycle_state,version,updated_at').eq('id', id).eq('creator_id', user.id).maybeSingle();
  if (error) throw Error('Post unavailable');
  if (!data) notFound();
  const m = getMessages(await getRequestLocale());
  return <main id="main" className="mx-auto max-w-content px-4 py-8 sm:px-6"><PostEditor id={id} initial={data as PostRecord} username={creator.username} name={creator.display_name} isPublic={creator.is_public} active={active} labels={m.posts} errors={m.errors} /></main>;
}
