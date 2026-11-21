import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { getRequestLocale } from '@/lib/i18n/server';
import { getMessages } from '@/lib/i18n/messages';
import { validPage, type CreatorBrowse } from '@/lib/creator/browse';
import { usernameProblem } from '@/lib/username';
import { PostCard } from '@/components/posts/PostCard';
import { ShareProfile } from '@/components/creator/ShareProfile';
import { publicOrigin } from '@/lib/creator/public';
import { postPath } from '@/lib/posts/model';
export const dynamic='force-dynamic';
export default async function PublicCollection({params,searchParams}:{params:Promise<{username:string;id:string}>;searchParams:Promise<{page?:string}>}) {
 const {username,id}=await params;if(usernameProblem(username)||!/^[a-f0-9-]{36}$/.test(id))notFound();const page=validPage((await searchParams).page);const db=await createSupabaseServerClient();const {data,error}=await db.rpc('browse_creator',{p_username:username,p_collection:id,p_page:page});if(error)throw Error('Collection unavailable');const result=data as CreatorBrowse;const collection=result?.collections.find(c=>c.public_id===id);if(!collection)notFound();const m=getMessages(await getRequestLocale());
 return <main id="main" className="public-profile"><div className="public-profile-inner"><header className="space-y-5 px-6 py-10 sm:px-12"><Link href={`/${username}`} className="button-secondary">← @{username}</Link><p className="eyebrow">{m.workspace.collections}</p><h1 className="text-4xl font-semibold tracking-tight">{collection.title}</h1><p className="max-w-xl text-sm leading-relaxed text-ink-muted">{collection.description}</p><ShareProfile url={`${publicOrigin()}/${username}/collections/${id}`} title={collection.title} labels={m.creator}/></header><section className="profile-content"><div className="grid items-start gap-5 md:grid-cols-2">{result.posts.map(post=><div key={post.public_id}><PostCard content={post} name={`@${username}`} labels={m.posts}/><Link href={postPath(username,post)} className="inline-flex min-h-11 items-center text-sm underline">{m.posts.openPost} ↗</Link></div>)}</div>{!result.posts.length&&<p className="py-12 text-center text-sm text-ink-muted">{m.creator.emptyBody}</p>}<nav className="mt-8 flex gap-6" aria-label={m.posts.pages}>{page>1&&<Link href={`?page=${page-1}`} className="button-secondary">{m.posts.previous}</Link>}{result.total>page*20&&<Link href={`?page=${page+1}`} className="button-secondary">{m.posts.next}</Link>}</nav></section></div></main>;
}
