import type { SocialLink } from '@/lib/creator/social';
import { SOCIAL_NETWORKS } from '@/lib/creator/social';
import { SocialIcon } from './SocialIcon';

export function ProfileCard({ name, username, bio, photo, links }: { name: string; username: string; bio: string; photo: string | null; links: SocialLink[] }) {
  return <section className="rounded-xl border border-line bg-surface p-6 text-center shadow-card sm:p-10">
    {photo ? <img src={photo} alt="" width={112} height={112} className="mx-auto h-28 w-28 rounded-full object-cover" referrerPolicy="no-referrer" /> : <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-full bg-soft font-serif text-4xl" aria-hidden="true">{name.trim().slice(0, 1).toUpperCase() || 'F'}</div>}
    <h1 className="mt-5 break-words font-serif text-4xl text-ink-strong">{name || 'FAVX'}</h1>
    <p className="mt-2 break-all text-sm text-ink-muted">@{username}</p>
    {bio && <p className="mx-auto mt-5 max-w-lg whitespace-pre-wrap break-words text-ink">{bio}</p>}
    <div className="mt-6 flex flex-wrap justify-center gap-3">
      {links.map(link => <a key={link.network} href={link.url} target="_blank" rel="noopener noreferrer nofollow ugc" aria-label={SOCIAL_NETWORKS.find(n => n.id === link.network)?.label} className="flex h-12 w-12 items-center justify-center rounded-full border border-line hover:bg-soft"><SocialIcon network={link.network} /></a>)}
    </div>
  </section>;
}
