'use client';

import { Field } from '@/components/form';
import { SOCIAL_NETWORKS, type SocialLink } from '@/lib/creator/social';
import type { Messages } from '@/lib/i18n/messages';
import { SocialIcon } from './SocialIcon';

export function SocialEditor({ links, onChange, labels, error }: { links: SocialLink[]; onChange: (links: SocialLink[]) => void; labels: Messages['creator']; error?: string | null }) {
  return <fieldset className="space-y-4">
    <legend className="mb-2 text-lg font-semibold">{labels.socialTitle}</legend>
    <p className="text-sm text-ink-muted">{labels.socialHint}</p>
    <div className="flex flex-wrap gap-2">
      {SOCIAL_NETWORKS.map(network => {
        const selected = links.some(l => l.network === network.id);
        return <button key={network.id} type="button" aria-pressed={selected} onClick={() => onChange(selected ? links.filter(l => l.network !== network.id) : [...links, { network: network.id, url: '' }])} className={`inline-flex min-h-11 items-center gap-2 rounded-md border px-3 py-2 text-sm ${selected ? 'border-brand bg-brand text-brand-text' : 'border-line bg-surface text-ink-strong'}`}>
          <SocialIcon network={network.id} /><span>{network.label}</span><span aria-hidden="true">{selected ? '✓' : '+'}</span>
        </button>;
      })}
    </div>
    {links.map(link => <div key={link.network} className="flex items-end gap-2">
      <div className="min-w-0 flex-1"><Field id={`social-${link.network}`} label={SOCIAL_NETWORKS.find(n => n.id === link.network)!.label} type="url" inputMode="url" placeholder="https://…" value={link.url} onChange={e => onChange(links.map(l => l.network === link.network ? { ...l, url: e.target.value } : l))} maxLength={2048} required /></div>
      <button type="button" onClick={() => onChange(links.filter(l => l.network !== link.network))} aria-label={`${labels.remove} ${link.network}`} className="min-h-11 px-2 text-sm text-ink-muted underline">{labels.remove}</button>
    </div>)}
    <input type="hidden" name="socialLinks" value={JSON.stringify(links)} />
    {error && <p role="alert" className="text-sm text-danger-text">{error}</p>}
  </fieldset>;
}
