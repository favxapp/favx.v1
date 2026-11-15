'use server';

import { cookies } from 'next/headers';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { parseBio, parseDisplayName, parseTimeZone } from '@/lib/forms';
import { LOCALE_COOKIE, normalizeLocale } from '@/lib/locale';
import { parseSocialLinks } from '@/lib/creator/social';
import { revalidatePath } from 'next/cache';

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
  const social = parseSocialLinks(formData.get('socialLinks'));
  if (!social.ok) return { saved: false, error: social.error };

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { saved: false, error: 'unauthorized' };

  // Invoker RPC: both updates commit together under the caller's RLS policies.
  const { error } = await supabase.rpc('save_creator_profile', {
    p_name: name.value, p_bio: bio.value, p_locale: locale, p_timezone: tz.value,
    p_links: social.value, p_public: formData.get('isPublic') === 'on',
  });
  if (error) {
    console.error('profile_update_failed', error.code ?? 'unknown');
    return { saved: false, error: 'generic' };
  }

  const jar = await cookies();
  jar.set(LOCALE_COOKIE, locale, { path: '/', maxAge: 60 * 60 * 24 * 365, sameSite: 'lax' });
  revalidatePath('/app/creator/profile');
  return { saved: true, error: null };
}
