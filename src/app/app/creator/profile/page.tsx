import { redirect } from 'next/navigation';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { getRequestLocale } from '@/lib/i18n/server';
import { LOCALE_LABELS, getMessages } from '@/lib/i18n/messages';
import { LOCALES } from '@/lib/locale';
import ProfileForm from './ProfileForm';

export const metadata = { title: 'Editar perfil' };

export default async function ProfilePage() {
  const supabase = await createSupabaseServerClient();
  const { data: creator } = await supabase.from('creator_profiles').select('username, display_name, bio').maybeSingle();
  if (!creator) redirect('/app/creator/activate');
  const { data: profile } = await supabase.from('profiles').select('preferred_locale, timezone').maybeSingle();
  const requestLocale = await getRequestLocale();
  const m = getMessages(requestLocale);
  const timezones = Intl.supportedValuesOf('timeZone');
  const current = profile?.timezone ?? 'America/Sao_Paulo';
  if (!timezones.includes(current)) timezones.unshift(current);
  return (
    <main id="main" className="mx-auto max-w-form space-y-6 px-6 py-12">
      <h1 className="font-serif text-4xl text-ink-strong">{m.profile.title}</h1>
      <ProfileForm
        labels={{ ...m.profile, errors: m.errors as Record<string, string> }}
        values={{ username: creator.username, displayName: creator.display_name, bio: creator.bio ?? '', locale: profile?.preferred_locale ?? requestLocale, timezone: current }}
        localeOptions={LOCALES.map((l) => ({ value: l, label: LOCALE_LABELS[l] }))}
        timezones={timezones}
      />
    </main>
  );
}
