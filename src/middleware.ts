import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { LOCALE_COOKIE, negotiateLocale, splitLocalePath, type Locale } from './lib/locale';
import { safeNextPath } from './lib/redirect';
import { getSupabaseEnv } from './lib/supabase/env';

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|txt|xml|json|woff2?)$).*)'],
};

function copyCookies(from: NextResponse, to: NextResponse): NextResponse {
  from.cookies.getAll().forEach((c) => to.cookies.set(c));
  return to;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  // The pre-session Auth hook authenticates its raw payload using Standard Webhooks.
  if (pathname === '/api/auth/send-email') return NextResponse.next();
  const negotiated = negotiateLocale(request.headers.get('accept-language'), request.cookies.get(LOCALE_COOKIE)?.value);
  const { locale: pathLocale, wrongCase, rest } = splitLocalePath(pathname);
  const locale: Locale = pathLocale ?? negotiated;

  // Segmento físico interno: não é acessível diretamente.
  if (pathname === '/site' || pathname.startsWith('/site/')) {
    return new NextResponse(null, { status: 404 });
  }
  // Idioma com caixa diferente (pt-BR) → 301 para minúsculas.
  if (pathLocale && wrongCase) {
    const url = request.nextUrl.clone();
    url.pathname = `/${pathLocale}${rest}`;
    return NextResponse.redirect(url, 301);
  }
  // Raiz → idioma negociado (cookie, Accept-Language, padrão).
  if (pathname === '/') {
    const url = request.nextUrl.clone();
    url.pathname = `/${negotiated}`;
    return NextResponse.redirect(url, 307);
  }

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-favx-locale', locale);
  let response = NextResponse.next({ request: { headers: requestHeaders } });

  // Renova a sessão do Supabase e mantém os cookies sincronizados entre requisição e resposta.
  const { url: supabaseUrl, key } = getSupabaseEnv();
  const supabase = createServerClient(supabaseUrl, key, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        requestHeaders.set('cookie', request.cookies.toString());
        response = NextResponse.next({ request: { headers: requestHeaders } });
        cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      },
    },
  });
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isApp = pathname === '/app' || pathname.startsWith('/app/');

  if (isApp && !user) {
    const url = request.nextUrl.clone();
    url.pathname = `/${locale}/login`;
    url.search = `?next=${encodeURIComponent(pathname)}`;
    return copyCookies(response, NextResponse.redirect(url, 307));
  }
  if (pathname === '/app') {
    const url = request.nextUrl.clone();
    url.pathname = '/app/me';
    return copyCookies(response, NextResponse.redirect(url, 307));
  }
  if (pathLocale && rest === '/login' && user) {
    const url = request.nextUrl.clone();
    const target = safeNextPath(request.nextUrl.searchParams.get('next'));
    url.pathname = target;
    url.search = '';
    return copyCookies(response, NextResponse.redirect(url, 307));
  }

  if (pathLocale) {
    const url = request.nextUrl.clone();
    url.pathname = `/site/${pathLocale}${rest}`;
    const rewritten = NextResponse.rewrite(url, { request: { headers: requestHeaders } });
    copyCookies(response, rewritten);
    // Persist only document navigation. Next strips RSC prefetch headers before
    // middleware, so background fetches must not select a language. The language
    // switcher uses native links; account settings persist their cookie directly.
    const documentNavigation = request.headers.get('sec-fetch-mode') === 'navigate'
      || request.headers.get('sec-fetch-dest') === 'document';
    if (documentNavigation) rewritten.cookies.set(LOCALE_COOKIE, pathLocale, { path: '/', maxAge: 60 * 60 * 24 * 365, sameSite: 'lax' });
    return rewritten;
  }
  return response;
}
