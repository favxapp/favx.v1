'use server';
import { revalidatePath } from 'next/cache';
import { parsePost } from '@/lib/posts/model';
import { createSupabaseServerClient } from '@/lib/supabase/server';
export async function savePost(id: string, version: number, content: unknown, status: unknown) {
  if (!/^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/.test(id) || !Number.isSafeInteger(version) || version < 0) return { error: 'post_invalid' as string };
  const parsed = parsePost(content, status);
  if (!parsed.ok) return { error: parsed.error };
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'unauthorized' };
  const [{ data: creator }, { data: profile }] = await Promise.all([
    supabase.from('creator_profiles').select('username, is_public, creator_state').eq('user_id', user.id).single(),
    supabase.from('profiles').select('account_state').eq('user_id', user.id).single(),
  ]);
  if (!creator || creator.creator_state !== 'active' || profile?.account_state !== 'active') return { error: 'unauthorized' };
  if (parsed.status === 'published' && !creator.is_public) return { error: 'post_profile_private' };
  const { data, error } = await supabase.rpc('save_creator_post', { p_id: id, p_expected_version: version, p_payload: parsed.value, p_status: parsed.status });
  if (error || !data?.length) {
    console.error('creator_post_save_failed', { code: error?.code ?? 'empty' });
    return { error: error?.code === '40001' ? 'post_conflict' : 'post_save_failed' };
  }
  revalidatePath('/app/creator/posts'); revalidatePath(`/${creator.username}`); revalidatePath(`/${creator.username}/p`, 'layout');
  return { saved: data[0] as { id: string; version: number; public_id: string; slug: string; lifecycle_state: 'draft' | 'published' | 'hidden' } };
}
