import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { DEFAULT_LOCALE, normalizeLocale } from '@/lib/locale';

export async function POST(request: Request) {
  // Proteção simples contra CSRF: se houver Origin, deve ser o mesmo host.
  const origin = request.headers.get('origin');
  const host = request.headers.get('host');
  if (origin && host) {
    try {
      if (new URL(origin).host !== host) return new NextResponse('Forbidden', { status: 403 });
    } catch {
      return new NextResponse('Forbidden', { status: 403 });
    }
  }
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  const form = await request.formData();
  const locale = normalizeLocale(String(form.get('locale') ?? '')) ?? DEFAULT_LOCALE;
  return NextResponse.redirect(new URL(`/${locale}`, request.url), 303);
}
