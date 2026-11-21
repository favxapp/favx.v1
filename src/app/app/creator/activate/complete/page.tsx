import Link from 'next/link';
import { requireCreator } from '@/lib/posts/server';
import { getRequestLocale } from '@/lib/i18n/server';
import { getMessages } from '@/lib/i18n/messages';
import { Icon } from '@/components/ui/Icon';
export default async function CompletePage() {
  const { creator } = await requireCreator(); const m = getMessages(await getRequestLocale()); const w = m.workspace;
  return <main id="main" className="mx-auto max-w-2xl space-y-8 px-6 py-12"><div className="onboarding-progress" aria-label={`${w.step} 3/3`}><span /><span /><span data-current="true" /></div><section className="discover-card text-center"><span className="icon-tile mx-auto"><Icon name="check" /></span><h1 className="mt-6">{w.finishTitle}</h1><p className="mx-auto mt-4 max-w-md">{w.finishBody}</p><div className="my-8 rounded-xl bg-soft p-5"><strong>{creator.display_name}</strong><p>@{creator.username}</p><p>{creator.is_public ? w.profileReady : w.profilePrivate}</p></div><div className="flex flex-wrap justify-center gap-3"><Link className="button-primary" href="/app/creator/profile">{w.editProfile}<Icon name="arrow" /></Link><Link className="button-secondary" href="/app/creator">{w.studio}</Link></div></section></main>;
}
