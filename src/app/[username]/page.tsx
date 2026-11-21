import Link from 'next/link';
import { cache } from 'react';
import { notFound } from 'next/navigation';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { getRequestLocale } from '@/lib/i18n/server';
import { getMessages } from '@/lib/i18n/messages';
import { usernameProblem } from '@/lib/username';
import { avatarUrl } from '@/lib/creator/avatar';
import { parseSocialLinks } from '@/lib/creator/social';
import { publicOrigin } from '@/lib/creator/public';
import { ProfileCard } from '@/components/creator/ProfileCard';
import { PostCard } from '@/components/posts/PostCard';
import { postPath, type PublicPost } from '@/lib/posts/model';
import { Icon } from '@/components/ui/Icon';
import { validPage, type CreatorBrowse } from '@/lib/creator/browse';
import { ShareProfile } from '@/components/creator/ShareProfile';

export const dynamic = 'force-dynamic';
type Props = { params: Promise<{ username: string }>; searchParams: Promise<{ page?: string; q?: string; category?: string; tab?: string }> };
const getProfile = cache(async (username: string) => {
  if (usernameProblem(username)) notFound();
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.rpc('get_public_creator', { p_username: username });
  if (error) throw Error('Public profile unavailable');
  if (!data?.length) notFound();
  return data[0] as { username: string; display_name: string; bio: string | null; avatar_path: string | null; social_links: unknown };
});
export async function generateMetadata({ params }: Props) {
  const profile = await getProfile((await params).username);
  const url = `${publicOrigin()}/${profile.username}`;
  return { title: `${profile.display_name} · FAVX`, description: profile.bio || 'FAVX', alternates: { canonical: url }, openGraph: { title: `${profile.display_name} · FAVX`, description: profile.bio || 'FAVX', url, ...(avatarUrl(profile.avatar_path) ? { images: [`${publicOrigin()}${avatarUrl(profile.avatar_path)!}`] } : {}) } };
}
export default async function PublicCreatorPage({ params, searchParams }: Props) {
  const profile = await getProfile((await params).username);
  const locale = await getRequestLocale(); const m = getMessages(locale); const sp = await searchParams;
  const links = parseSocialLinks(profile.social_links); const page = validPage(sp.page);
  const q = (sp.q ?? '').slice(0,120); const category = (sp.category ?? '').slice(0,30); const tab = sp.tab === 'collections' ? 'collections' : 'posts';
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.rpc('browse_creator', { p_username: profile.username, p_query: q, p_category: category, p_page: page });
  if (error || !data) throw Error('Public posts unavailable'); const result = data as CreatorBrowse;
  const linkToPage = (number: number) => `?${new URLSearchParams({q,category,page:String(number)})}`;
  return <main id="main" className="public-profile"><div className="public-profile-inner">
    <div className="flex flex-wrap items-center justify-between gap-4 px-6 sm:px-12"><Link href={`/${locale}`} className="wordmark">FAVX</Link><ShareProfile compact url={`${publicOrigin()}/${profile.username}`} title={profile.display_name} labels={m.creator} /></div>
    <ProfileCard name={profile.display_name} username={profile.username} bio={profile.bio ?? ''} photo={avatarUrl(profile.avatar_path)} links={links.ok ? links.value : []} counts={[{ label: m.workspace.posts, value: result.post_count }, { label: m.workspace.collections, value: result.collections.length }, { label: m.workspace.categories, value: result.categories.length }]} />
    <section className="profile-content"><div className="section-heading"><nav className="filter-tabs" aria-label={m.posts.recommendations}><Link href={`/${profile.username}`} aria-current={tab === 'posts' ? 'page' : undefined}>{m.workspace.posts}</Link><Link href="?tab=collections" aria-current={tab === 'collections' ? 'page' : undefined}>{m.workspace.collections}</Link></nav></div>
    {tab === 'collections' ? <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{result.collections.map(c => <Link className="discover-card" key={c.public_id} href={`/${profile.username}/collections/${c.public_id}`}><div className="collection-cover"><Icon name="layers" width={40} height={40} /></div><h2 className="mt-5 text-lg font-semibold">{c.title}</h2><p>{c.description}</p><p>{c.count} {m.workspace.posts.toLocaleLowerCase()}</p></Link>)}{!result.collections.length && <p className="py-12 text-sm text-ink-muted">{m.creator.emptyBody}</p>}</div> : <>
      <form className="profile-search mb-6 flex flex-wrap gap-3" method="get"><label className="sr-only" htmlFor="profile-search">{m.workspace.search}</label><input id="profile-search" name="q" defaultValue={q} maxLength={120} placeholder={m.workspace.search} className="min-h-12 min-w-0 flex-1 rounded-full border border-line bg-white px-5 text-sm" />{result.categories.length>0 && <><label htmlFor="category" className="sr-only">{m.workspace.categories}</label><select id="category" name="category" defaultValue={category} className="min-h-12 max-w-full rounded-full border border-line bg-white px-4 text-sm"><option value="">{m.workspace.all}</option>{result.categories.map(c=><option key={c}>{c}</option>)}</select></>}<button className="button-primary" type="submit"><Icon name="search" />{m.workspace.search}</button></form>
      {result.posts.length ? <div className="grid items-start gap-5 md:grid-cols-2">{result.posts.map(post=><div key={post.public_id}><PostCard content={post} name={profile.display_name} labels={m.posts} /><Link href={postPath(profile.username,post)} className="inline-flex min-h-11 items-center text-sm underline underline-offset-4">{m.posts.openPost} ↗</Link></div>)}</div> : <div className="empty-collection"><Icon name="grid" width={32} height={32} /><h2>{q || category ? m.workspace.noResults : m.creator.emptyTitle}</h2><p>{m.creator.emptyBody}</p>{(q || category) && <Link href={`/${profile.username}`} className="button-secondary mt-5">{m.workspace.clear}</Link>}</div>}
      <nav aria-label={m.posts.pages} className="mt-8 flex gap-6">{page>1 && <Link className="button-secondary" href={linkToPage(page-1)}>← {m.posts.previous}</Link>}{result.total>page*20 && <Link className="button-secondary" href={linkToPage(page+1)}>{m.posts.next} →</Link>}</nav>
    </>}
    <footer className="mt-10 text-center text-xs text-ink-muted"><Link href={`/${locale}`} className="inline-flex min-h-11 items-center">by FAVX</Link></footer></section>
  </div></main>;
}
