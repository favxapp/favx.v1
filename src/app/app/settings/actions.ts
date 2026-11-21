'use server';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { parseTimeZone } from '@/lib/forms';
import { LOCALE_COOKIE, normalizeLocale } from '@/lib/locale';
export type SettingsState = { error: string | null; saved: boolean };
export async function saveSettings(_prev: SettingsState, form: FormData): Promise<SettingsState> {
  const locale = normalizeLocale(String(form.get('locale') ?? ''));
  const zone = parseTimeZone(form.get('timezone'));
  if (!locale) return { saved: false, error: 'locale_invalid' };
  if (!zone.ok) return { saved: false, error: zone.error };
  const db = await createSupabaseServerClient(); const { data: { user } } = await db.auth.getUser();
  if (!user) return { saved: false, error: 'unauthorized' };
  const { data, error } = await db.from('profiles').update({ preferred_locale: locale, timezone: zone.value }).eq('user_id', user.id).select('user_id').maybeSingle();
  if (error || !data) return { saved: false, error: 'generic' };
  (await cookies()).set(LOCALE_COOKIE, locale, { path: '/', maxAge: 31536000, sameSite: 'lax' });
  revalidatePath('/app', 'layout');
  return { saved: true, error: null };
}
