import { randomUUID } from 'node:crypto';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { AvatarStorageError, avatarUrl, bunnyConfig, deleteAvatar, MAX_AVATAR_BYTES, prepareAvatar, uploadAvatar } from '@/lib/creator/avatar';

import { isTrustedOrigin } from '@/lib/creator/request-origin';

export const maxDuration = 30;
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export async function POST(request: Request) {
  const respond = (body: object, status = 200) => Response.json(body, { status, headers: { 'Cache-Control': 'no-store' } });
  const fail = (stage: string, error: string, status: number, detail?: string | number) => {
    console.error('creator_avatar_failed', { stage, status, ...(detail ? { detail } : {}) });
    return respond({ error }, status);
  };
  if (!isTrustedOrigin(request)) return fail('origin', 'unauthorized', 403);
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return fail('session', 'unauthorized', 401);
  const { data: creator } = await supabase.from('creator_profiles').select('avatar_namespace, creator_state').eq('user_id', user.id).single();
  const { data: profile } = await supabase.from('profiles').select('account_state').eq('user_id', user.id).single();
  if (!creator || creator.creator_state !== 'active' || profile?.account_state !== 'active') return fail('account', 'unauthorized', 403);
  let config: ReturnType<typeof bunnyConfig>;
  try { config = bunnyConfig(); } catch { return fail('configuration', 'avatar_unavailable', 503); }
  let bytes: Buffer;
  try {
    // Bound the streamed body before parsing multipart; Content-Length alone is not trusted.
    const reader = request.body?.getReader();
    if (!reader) throw Error();
    const chunks: Uint8Array[] = []; let length = 0;
    try {
      while (true) {
        const { value, done } = await reader.read(); if (done) break;
        length += value.byteLength;
        if (length > MAX_AVATAR_BYTES + 65536) { await reader.cancel(); throw Error(); }
        chunks.push(value);
      }
    } finally { reader.releaseLock(); }
    const form = await new Response(Buffer.concat(chunks), { headers: { 'Content-Type': request.headers.get('content-type') ?? '' } }).formData();
    const file = form.get('photo');
    if (!(file instanceof File) || file.size > MAX_AVATAR_BYTES) throw Error();
    bytes = await prepareAvatar(new Uint8Array(await file.arrayBuffer()));
  } catch { return fail('decode', 'avatar_invalid', 400); }
  const path = `${creator.avatar_namespace}/${randomUUID()}.webp`;
  try { await uploadAvatar(path, bytes, config); }
  catch (error) { return fail('storage', 'avatar_failed', 502, error instanceof AvatarStorageError ? error.status : 'network'); }
  const { data, error } = await supabase.from('creator_profiles').update({ avatar_path: path }).eq('user_id', user.id).select('user_id');
  if (error || data?.length !== 1) {
    try { await deleteAvatar(path, config); } catch { console.error('creator_avatar_cleanup_failed'); }
    return fail('database', 'avatar_failed', 500, error?.code);
  }
  return respond({ url: avatarUrl(path) });
}
