'use server';

import { cookies } from 'next/headers';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { parseBio, parseDisplayName, parseTimeZone } from '@/lib/forms';
import { LOCALE_COOKIE, normalizeLocale } from '@/lib/locale';

export type ProfileState = { error: string | null; saved: boolean };

export async function updateProfileAction(_prev: ProfileState, formData: FormData): Promise<ProfileState> {
  const name = parseDisplayName(formData.get('displayName'));
  if (!name.ok) return { saved: false, error: name.error };
  const bio = parseBio(formData.get('bio'));
  if (!bio.ok) return { saved: false, error: bio.error };
  const tz = parseTimeZone(formData.get('timezone'));
  if (!tz.ok) return { saved: false, error: tz.error };
  const locale = normalizeLocale(String(formData.get('locale') ?? ''));
  if (!locale) return { saved: false, error: 'locale_invalid' };

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { saved: false, error: 'unauthorized' };

  // RLS + privilégios por coluna: só estas colunas são graváveis pelo próprio usuário.
  const creator = await supabase.from('creator_profiles').update({ display_name: name.value, bio: bio.value }).eq('user_id', user.id).select('user_id');
  if (creator.error || !creator.data || creator.data.length !== 1) {
    console.error('creator_update_failed', creator.error?.code ?? 'sem-linha');
    return { saved: false, error: 'generic' };
  }
  const profile = await supabase.from('profiles').update({ preferred_locale: locale, timezone: tz.value, display_name: name.value }).eq('user_id', user.id).select('user_id');
  if (profile.error || !profile.data || profile.data.length !== 1) {
    console.error('profile_update_failed', profile.error?.code ?? 'sem-linha');
    return { saved: false, error: 'generic' };
  }

  const jar = await cookies();
  jar.set(LOCALE_COOKIE, locale, { path: '/', maxAge: 60 * 60 * 24 * 365, sameSite: 'lax' });
  return { saved: true, error: null };
}
