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
import { ShareProfile } from '@/components/creator/ShareProfile';

export const dynamic = 'force-dynamic';
type Props = { params: Promise<{ username: string }> };
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
  return { title: `${profile.display_name} · FAVX`, description: profile.bio || 'FAVX', alternates: { canonical: url }, openGraph: { title: `${profile.display_name} · FAVX`, description: profile.bio || 'FAVX', url, ...(avatarUrl(profile.avatar_path) ? { images: [avatarUrl(profile.avatar_path)!] } : {}) } };
}
export default async function PublicCreatorPage({ params }: Props) {
  const profile = await getProfile((await params).username);
  const locale = await getRequestLocale(); const m = getMessages(locale);
  const links = parseSocialLinks(profile.social_links);
  return <main id="main" className="mx-auto max-w-3xl space-y-8 px-4 py-10 sm:px-6">
    <ProfileCard name={profile.display_name} username={profile.username} bio={profile.bio ?? ''} photo={avatarUrl(profile.avatar_path)} links={links.ok ? links.value : []} />
    <section className="rounded-xl border border-dashed border-line px-6 py-12 text-center"><h2 className="font-serif text-2xl">{m.creator.emptyTitle}</h2><p className="mt-3 text-ink-muted">{m.creator.emptyBody}</p></section>
    <ShareProfile url={`${publicOrigin()}/${profile.username}`} title={profile.display_name} labels={m.creator} />
    <footer className="text-center text-sm"><Link href={`/${locale}`} className="inline-flex min-h-11 items-center text-ink-muted">by FAVX</Link></footer>
  </main>;
}
