import Link from 'next/link';
import { requireCreator } from '@/lib/posts/server';
import { getRequestLocale } from '@/lib/i18n/server';
import { getMessages } from '@/lib/i18n/messages';
import type { PostStatus } from '@/lib/posts/model';
export default async function PostsPage({ searchParams }: { searchParams: Promise<{ page?: string; state?: string; q?: string }> }) {
  const { supabase, user } = await requireCreator();
  const m = getMessages(await getRequestLocale());
  const sp = await searchParams; const state = ['draft','published','hidden'].includes(sp.state ?? '') ? sp.state! : ''; const q = (sp.q ?? '').slice(0,120);
  const requested = Number(sp.page ?? 1);
  const page = Number.isSafeInteger(requested) && requested > 0 ? Math.min(requested, 100000) : 1;
  let query = supabase.from('creator_posts').select('id,title,lifecycle_state,updated_at', { count: 'exact' }).eq('creator_id', user.id);
  if (state) query = query.eq('lifecycle_state', state);
  if (q) query = query.ilike('title', `%${q.replace(/[\\%_]/g, '\\$&')}%`);
  const { data, error, count } = await query.order('updated_at', { ascending: false }).order('id').range((page-1)*20, page*20-1);
  const pageLink = (n: number) => `?${new URLSearchParams({state,q,page:String(n)})}`;
  if (error) throw Error('Posts unavailable');
  return <main id="main" className="mx-auto max-w-content space-y-8 px-4 py-10 sm:px-6">
    <div className="flex flex-wrap items-center justify-between gap-4"><div><h1 className="font-sans font-semibold tracking-tight text-4xl">{m.posts.myPosts}</h1><p className="mt-3 text-ink-muted">{m.posts.listIntro}</p></div><Link href="/app/creator/posts/novo" className="inline-flex min-h-12 items-center rounded-md bg-brand px-5 py-2 font-semibold text-brand-text">+ {m.posts.createTitle}</Link></div>
    <div className="flex flex-wrap items-center justify-between gap-4"><nav className="filter-tabs" aria-label={m.posts.myPosts}>{(['','draft','published','hidden'] as const).map(s=><Link key={s} href={`?${new URLSearchParams({state:s,q})}`} aria-current={state===s?'page':undefined}>{s?m.posts.states[s]:m.workspace.all}</Link>)}</nav><form method="get" className="flex w-full min-w-0 gap-2 sm:w-auto"><input type="hidden" name="state" value={state}/><label htmlFor="post-search" className="sr-only">{m.workspace.search}</label><input id="post-search" name="q" defaultValue={q} maxLength={120} placeholder={m.workspace.searchHint} className="min-h-11 w-0 min-w-0 flex-1 rounded-full border border-line px-4 text-sm"/><button className="button-secondary">{m.workspace.search}</button></form></div>
    {data?.length ? <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{data.map(post => <li key={post.id}><Link href={`/app/creator/posts/${post.id}/editar`} className="discover-card space-y-4"><span className="inline-block rounded-full bg-subtle px-3 py-1 text-xs font-semibold">{m.posts.states[post.lifecycle_state as PostStatus]}</span><h2 className="break-words font-sans font-semibold tracking-tight text-2xl">{post.title || m.posts.untitled}</h2><span className="inline-flex min-h-11 items-center text-sm underline">{m.posts.editTitle} →</span></Link></li>)}</ul> : <div className="rounded-xl border border-dashed border-field p-10 text-center"><h2 className="font-sans font-semibold tracking-tight text-3xl">{q || state ? m.workspace.noResults : m.posts.emptyTitle}</h2><p className="mt-3 text-ink-muted">{m.posts.emptyBody}</p>{(q||state)&&<Link href="/app/creator/posts" className="button-secondary mt-5">{m.workspace.clear}</Link>}</div>}
    <nav aria-label={m.posts.pages} className="flex gap-6">{page>1 && <Link className="inline-flex min-h-11 items-center underline" href={pageLink(page-1)}>← {m.posts.previous}</Link>}{(count ?? 0)>page*20 && <Link className="inline-flex min-h-11 items-center underline" href={pageLink(page+1)}>{m.posts.next} →</Link>}</nav>
  </main>;
}
