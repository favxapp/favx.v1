import { AVATAR_PATH } from '@/lib/creator/avatar';
import { deliverAvatar } from '@/lib/creator/avatar-delivery';
export const runtime = 'nodejs';
export const maxDuration = 25;
export async function GET(_request: Request, { params }: { params: Promise<{ namespace: string; file: string }> }) {
  const { namespace, file } = await params;
  const path = `${namespace}/${file}`;
  if (!AVATAR_PATH.test(path)) return new Response(null, { status: 404 });
  try { return await deliverAvatar(path); }
  catch { console.error('avatar_delivery_unavailable'); return new Response(null, { status: 503, headers: { 'Cache-Control': 'no-store' } }); }
}
