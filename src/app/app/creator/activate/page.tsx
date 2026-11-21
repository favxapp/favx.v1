import Link from 'next/link';
import { InspirationGallery } from '@/components/ui/InspirationGallery';
import { redirect } from 'next/navigation';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { getRequestLocale } from '@/lib/i18n/server';
import { getMessages } from '@/lib/i18n/messages';
import { Icon } from '@/components/ui/Icon';
export default async function ActivatePage() {
  const db = await createSupabaseServerClient();
  const { data, error } = await db.from('creator_profiles').select('user_id').maybeSingle();
  if (error) throw Error('Creator unavailable'); if (data) redirect('/app/creator');
  const m = getMessages(await getRequestLocale()); const w = m.workspace;
  return <main id="main" className="mx-auto max-w-4xl px-4 py-12 sm:px-8"><div className="onboarding-progress" aria-label={`${w.step} 1/3`}><span data-current="true" /><span /><span /></div><div className="mx-auto max-w-xl text-center"><p className="eyebrow">FAVX Creator</p><h1>{w.activationTitle}</h1><p className="mt-5 text-sm leading-relaxed text-ink-muted">{w.activationBody}</p></div><InspirationGallery compact /><div className="my-10 grid gap-4 sm:grid-cols-3">{([{ icon: 'user', title: w.identity, text: w.identityHint }, { icon: 'grid', title: w.firstPost, text: w.firstPostHint }, { icon: 'link', title: w.share, text: w.shareHint }] as const).map(card => <div className="discover-card" key={card.icon}><span className="icon-tile"><Icon name={card.icon} /></span><h3>{card.title}</h3><p>{card.text}</p></div>)}</div><p className="mx-auto mb-8 max-w-lg text-center text-xs leading-relaxed text-ink-muted">{w.activationPublishBody}</p><div className="flex justify-center gap-3"><Link href="/app/me" className="button-secondary">{w.back}</Link><Link href="/app/creator/activate/identity" className="button-primary">{w.continue}<Icon name="arrow" /></Link></div></main>;
}
