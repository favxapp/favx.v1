'use server';

import { redirect } from 'next/navigation';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { parseDisplayName } from '@/lib/forms';
import { normalizeUsername, usernameProblem } from '@/lib/username';

export type ActivateState = { error: string | null; username: string; displayName: string };

export async function activateCreatorAction(_prev: ActivateState, formData: FormData): Promise<ActivateState> {
  const rawUsername = String(formData.get('username') ?? '');
  const rawName = String(formData.get('displayName') ?? '');
  const base = { username: rawUsername, displayName: rawName };

  const username = normalizeUsername(rawUsername);
  const problem = usernameProblem(username);
  if (problem) return { ...base, error: problem === 'format' ? 'username_format' : 'username_reserved' };
  const name = parseDisplayName(rawName);
  if (!name.ok) return { ...base, error: name.error };

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ...base, error: 'unauthorized' };

  const { error } = await supabase.from('creator_profiles').insert({ user_id: user.id, username, display_name: name.value });
  if (error) {
    const msg = `${error.message ?? ''} ${error.details ?? ''}`;
    if (msg.includes('USERNAME_RESERVED')) return { ...base, error: 'username_reserved' };
    if (msg.includes('USERNAME_FORMAT')) return { ...base, error: 'username_format' };
    if (error.code === '23505' && msg.includes('pkey')) redirect('/app/creator/profile'); // já é Creator
    if (error.code === '23505') return { ...base, error: 'username_taken' };
    console.error('creator_activate_failed', error.code ?? 'sem-codigo');
    return { ...base, error: 'generic' };
  }
  redirect('/app/creator/profile');
}
