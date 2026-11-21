import { redirect } from 'next/navigation';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { getRequestLocale } from '@/lib/i18n/server';
import { LOCALE_LABELS, getMessages } from '@/lib/i18n/messages';
import { LOCALES } from '@/lib/locale';
import ProfileForm from './ProfileForm';
import { avatarUrl } from '@/lib/creator/avatar';
import { parseSocialLinks } from '@/lib/creator/social';
import { publicOrigin } from '@/lib/creator/public';

export const metadata = { title: 'Editar perfil' };

export default async function ProfilePage() {
  const supabase = await createSupabaseServerClient();
  const { data: creator, error } = await supabase.from('creator_profiles').select('username, display_name, bio, avatar_path, social_links, is_public').maybeSingle();
  if (error) throw new Error('Creator profile unavailable');
  if (!creator) redirect('/app/creator/activate');
  const { data: profile } = await supabase.from('profiles').select('preferred_locale, timezone').maybeSingle();
  const requestLocale = await getRequestLocale();
  const m = getMessages(requestLocale);
  const timezones = Intl.supportedValuesOf('timeZone');
  const current = profile?.timezone ?? 'America/Sao_Paulo';
  if (!timezones.includes(current)) timezones.unshift(current);
  return (
    <main id="main" className="mx-auto max-w-content space-y-6 px-4 py-10 sm:px-6">
      <div><h1 className="font-sans font-semibold tracking-tight text-4xl text-ink-strong">{m.creator.setupTitle}</h1><p className="mt-3 text-ink-muted">{m.creator.setupIntro}</p></div>
      <ProfileForm
        labels={m.profile} creatorLabels={m.creator} errors={m.errors}
        publicUrl={`${publicOrigin()}/${creator.username}`}
        values={{ username: creator.username, displayName: creator.display_name, bio: creator.bio ?? '', locale: profile?.preferred_locale ?? requestLocale, timezone: current, photo: avatarUrl(creator.avatar_path), socialLinks: (() => { const links = parseSocialLinks(creator.social_links); return links.ok ? links.value : []; })(), isPublic: creator.is_public }}
        localeOptions={LOCALES.map((l) => ({ value: l, label: LOCALE_LABELS[l] }))}
        timezones={timezones}
      />
    </main>
  );
}
