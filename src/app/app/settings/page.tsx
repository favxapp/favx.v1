import { redirect } from 'next/navigation';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { getRequestLocale } from '@/lib/i18n/server';
import { getMessages, LOCALE_LABELS } from '@/lib/i18n/messages';
import { LOCALES } from '@/lib/locale';
import { SettingsForm } from './SettingsForm';
export default async function SettingsPage() {
  const locale = await getRequestLocale(); const m = getMessages(locale);
  const db = await createSupabaseServerClient(); const { data: { user } } = await db.auth.getUser();
  if (!user) redirect(`/${locale}/login`);
  const { data: profile, error } = await db.from('profiles').select('preferred_locale,timezone').eq('user_id', user.id).single();
  if (error) throw Error('Preferences unavailable');
  const zones = Intl.supportedValuesOf('timeZone'); if (!zones.includes(profile.timezone)) zones.unshift(profile.timezone);
  return <main id="main" className="mx-auto max-w-content space-y-8 px-4 py-10 sm:px-6"><div><p className="eyebrow">{m.workspace.account}</p><h1>{m.workspace.settings}</h1></div><div className="grid gap-6 lg:grid-cols-[1fr_2fr]"><section className="discover-card !h-auto"><h2 className="font-semibold">{m.workspace.account}</h2><p className="mt-4">{m.workspace.email}</p><p className="break-all !text-ink">{user.email}</p></section><section className="discover-card"><h2 className="mb-6 text-lg font-semibold">{m.workspace.preferences}</h2><SettingsForm m={m} locale={profile.preferred_locale} timezone={profile.timezone} locales={LOCALES.map(value => ({ value, label: LOCALE_LABELS[value] }))} zones={zones} /></section></div></main>;
}
