import { redirect } from 'next/navigation';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { getRequestLocale } from '@/lib/i18n/server';
export async function requireCreator() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect(`/${await getRequestLocale()}/login`);
  const [{ data: creator }, { data: profile }] = await Promise.all([
    supabase.from('creator_profiles').select('username, display_name, is_public, creator_state').eq('user_id', user.id).maybeSingle(),
    supabase.from('profiles').select('account_state').eq('user_id', user.id).single(),
  ]);
  if (!creator) redirect('/app/creator/activate');
  return { supabase, user, creator, active: creator.creator_state === 'active' && profile?.account_state === 'active' };
}
