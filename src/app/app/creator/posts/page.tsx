import Link from 'next/link';
import { requireCreator } from '@/lib/posts/server';
import { getRequestLocale } from '@/lib/i18n/server';
import { getMessages } from '@/lib/i18n/messages';
import type { PostStatus } from '@/lib/posts/model';
export default async function PostsPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const { supabase, user } = await requireCreator();
  const m = getMessages(await getRequestLocale());
  const requested = Number((await searchParams).page ?? 1);
  const page = Number.isSafeInteger(requested) && requested > 0 ? Math.min(requested, 100000) : 1;
  const { data, error, count } = await supabase.from('creator_posts').select('id,title,lifecycle_state,updated_at', { count: 'exact' }).eq('creator_id', user.id).order('updated_at', { ascending: false }).order('id').range((page-1)*20, page*20-1);
  if (error) throw Error('Posts unavailable');
  return <main id="main" className="mx-auto max-w-content space-y-8 px-4 py-10 sm:px-6">
    <div className="flex flex-wrap items-center justify-between gap-4"><div><h1 className="font-serif text-4xl">{m.posts.myPosts}</h1><p className="mt-3 text-ink-muted">{m.posts.listIntro}</p></div><Link href="/app/creator/posts/novo" className="inline-flex min-h-12 items-center rounded-md bg-brand px-5 py-2 font-semibold text-brand-text">+ {m.posts.createTitle}</Link></div>
    {data?.length ? <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{data.map(post => <li key={post.id}><Link href={`/app/creator/posts/${post.id}/editar`} className="block h-full space-y-4 rounded-xl border border-line p-6 hover:bg-soft"><span className="inline-block rounded-full bg-subtle px-3 py-1 text-xs font-semibold">{m.posts.states[post.lifecycle_state as PostStatus]}</span><h2 className="break-words font-serif text-2xl">{post.title || m.posts.untitled}</h2><span className="inline-flex min-h-11 items-center text-sm underline">{m.posts.editTitle} →</span></Link></li>)}</ul> : <div className="rounded-xl border border-dashed border-field p-10 text-center"><h2 className="font-serif text-3xl">{m.posts.emptyTitle}</h2><p className="mt-3 text-ink-muted">{m.posts.emptyBody}</p></div>}
    <nav aria-label={m.posts.pages} className="flex gap-6">{page>1 && <Link className="inline-flex min-h-11 items-center underline" href={`?page=${page-1}`}>← {m.posts.previous}</Link>}{(count ?? 0)>page*20 && <Link className="inline-flex min-h-11 items-center underline" href={`?page=${page+1}`}>{m.posts.next} →</Link>}</nav>
  </main>;
}
