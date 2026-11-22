import Link from 'next/link';
import { requireCreator } from '@/lib/posts/server';
import { getRequestLocale } from '@/lib/i18n/server';
import { getMessages } from '@/lib/i18n/messages';
import { Icon } from '@/components/ui/Icon';
import type { PostStatus } from '@/lib/posts/model';

export default async function CreatorDashboard() {
  const { supabase, user, creator } = await requireCreator();
  const m = getMessages(await getRequestLocale()); const w = m.workspace;
  const [recent, ...counts] = await Promise.all([
    supabase.from('creator_posts').select('id,title,lifecycle_state,updated_at').eq('creator_id', user.id).neq('lifecycle_state','trashed').order('updated_at', { ascending: false }).limit(4),
    ...(['draft', 'published', 'hidden'] as const).map(status => supabase.from('creator_posts').select('id', { count: 'exact', head: true }).eq('creator_id', user.id).eq('lifecycle_state', status)),
  ]);
  if (recent.error || counts.some(r => r.error)) throw Error('Dashboard unavailable');
  return <main id="main" className="mx-auto max-w-content space-y-10 px-4 py-10 sm:px-6">
    <section className="studio-hero"><p className="eyebrow">{w.studio} / {creator.display_name}</p><h1>{w.headline}</h1><p>{w.intro}</p><Link href="/app/creator/posts/novo" className="button-primary"><Icon name="plus" />{w.newPost}<Icon name="arrow" /></Link></section>
    <div className="stat-strip">{(['draft', 'published', 'hidden'] as const).map((status, i) => <Link key={status} href={`/app/creator/posts?state=${status}`} className="stat-tile"><span>{m.posts.states[status]}</span><strong>{counts[i].count ?? 0}</strong></Link>)}</div>
    <section><div className="section-heading"><h2>{w.checklist}</h2></div><div className="grid gap-4 sm:grid-cols-3">
      <Link className="discover-card" href="/app/creator/profile"><span className="icon-tile"><Icon name="user" /></span><h3>{w.identity}</h3><p>{w.identityHint}</p></Link>
      <Link className="discover-card" href="/app/creator/posts/novo"><span className="icon-tile"><Icon name="plus" /></span><h3>{w.firstPost}</h3><p>{w.firstPostHint}</p></Link>
      <Link className="discover-card" href={creator.is_public ? `/${creator.username}` : '/app/creator/profile'}><span className="icon-tile"><Icon name="link" /></span><h3>{creator.is_public ? w.share : w.profilePrivate}</h3><p>{creator.is_public ? w.shareHint : w.profileHint}</p></Link>
    </div></section>
    <section><div className="section-heading"><h2>{w.recent}</h2><Link href="/app/creator/posts">{w.allPosts} ↗</Link></div>{recent.data?.length ? <div className="grid gap-4 sm:grid-cols-2">{recent.data.map(post => <Link key={post.id} className="discover-card" href={`/app/creator/posts/${post.id}`}><span className="rounded-full bg-subtle px-3 py-1 text-xs">{m.posts.states[post.lifecycle_state as PostStatus]}</span><h3>{post.title || m.posts.untitled}</h3><span className="text-sm">{m.management.manage} ↗</span></Link>)}</div> : <div className="empty-collection"><Icon name="grid" width={32} height={32} /><h2>{w.emptyTitle}</h2><p>{w.emptyBody}</p><Link href="/app/creator/posts/novo" className="button-secondary mt-6"><Icon name="plus" />{w.newPost}</Link></div>}</section>
  </main>;
}
