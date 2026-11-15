import { createSupabaseServerClient } from '@/lib/supabase/server';
import { normalizeUsername, usernameProblem } from '@/lib/username';

export const dynamic = 'force-dynamic';
export async function GET(request: Request) {
  const respond = (body: object, status = 200) => Response.json(body, { status, headers: { 'Cache-Control': 'no-store' } });
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return respond({ error: 'unauthorized' }, 401);
  const username = normalizeUsername(new URL(request.url).searchParams.get('username') ?? '');
  const local = usernameProblem(username);
  if (local) return respond({ available: false, problem: local });
  const { data, error } = await supabase.rpc('username_problem', { p_username: username });
  if (error) return respond({ error: 'unavailable' }, 503);
  return respond({ available: data === null, problem: data });
}
