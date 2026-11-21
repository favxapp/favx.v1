import type { SocialLink } from '@/lib/creator/social';
import { SOCIAL_NETWORKS } from '@/lib/creator/social';
import { SocialIcon } from './SocialIcon';

type Count = { label: string; value: number };
export function ProfileCard({ name, username, bio, photo, links, counts }: { name: string; username: string; bio: string; photo: string | null; links: SocialLink[]; counts?: Count[] }) {
  return <section className="profile-header">
    <div className="profile-identity-row">
      {photo ? <img src={photo} alt="" width={120} height={120} className="profile-avatar" referrerPolicy="no-referrer" /> : <div className="profile-avatar" aria-hidden="true">{name.trim().slice(0, 1).toUpperCase() || 'F'}</div>}
      {counts && <dl className="profile-counts">{counts.map(count => <div key={count.label}><dt>{count.label}</dt><dd>{count.value.toLocaleString()}</dd></div>)}</dl>}
    </div>
    <h1 className="break-words">{name || 'FAVX'}</h1>
    <p className="mt-1 break-all text-sm text-ink-muted">@{username}</p>
    {bio && <p className="mt-5 max-w-xl whitespace-pre-wrap break-words text-sm leading-relaxed">{bio}</p>}
    {links.length > 0 && <div className="profile-social">{links.map(link => <a key={link.network} href={link.url} target="_blank" rel="noopener noreferrer nofollow ugc" aria-label={SOCIAL_NETWORKS.find(n => n.id === link.network)?.label} title={SOCIAL_NETWORKS.find(n => n.id === link.network)?.label}><SocialIcon network={link.network} /></a>)}</div>}
  </section>;
}
