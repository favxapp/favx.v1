import Link from 'next/link';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { getRequestLocale } from '@/lib/i18n/server';
import { getMessages } from '@/lib/i18n/messages';
import { Icon } from '@/components/ui/Icon';

export default async function MePage() {
  const m = getMessages(await getRequestLocale()); const w = m.workspace;
  const supabase = await createSupabaseServerClient();
  const { data: creator, error } = await supabase.from('creator_profiles').select('username,display_name,is_public').maybeSingle();
  if (error) throw Error('Account unavailable');
  return <main id="main" className="mx-auto max-w-content space-y-10 px-4 py-10 sm:px-6">
    <section className="studio-hero"><p className="eyebrow">FAVX / {w.yourSpace}</p><h1>{w.greeting}</h1><p>{creator ? w.intro : w.activationBody}</p><Link className="button-primary" href={creator ? '/app/creator' : '/app/creator/activate'}>{creator ? w.studio : w.becomeCreator}<Icon name="arrow" /></Link></section>
    <section className="grid gap-4 sm:grid-cols-2"><Link href={creator ? '/app/creator/profile' : '/app/creator/activate'} className="discover-card"><span className="icon-tile"><Icon name="user" /></span><h3>{creator ? w.editProfile : w.identity}</h3><p>{w.identityHint}</p></Link><Link href="/app/settings" className="discover-card"><span className="icon-tile"><Icon name="globe" /></span><h3>{w.preferences}</h3><p>{w.language} · {w.timezone} · {w.account}</p></Link></section>
  </main>;
}
