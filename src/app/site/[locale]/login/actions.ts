'use server';

import { redirect } from 'next/navigation';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { parseEmail, parseOtp } from '@/lib/forms';
import { safeNextPath } from '@/lib/redirect';

export type LoginState = { step: 'email' | 'code'; email: string; error: string | null };

export async function requestOtpAction(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const email = parseEmail(formData.get('email'));
  if (!email.ok) return { step: 'email', email: String(formData.get('email') ?? ''), error: email.error };

  const supabase = await createSupabaseServerClient();
  // shouldCreateUser: cadastro e login são o mesmo fluxo; a resposta não revela se o e-mail já existe.
  const { error } = await supabase.auth.signInWithOtp({ email: email.value, options: { shouldCreateUser: true } });
  if (error) {
    console.error('otp_request_failed', error.status ?? 'sem-status', error.code ?? 'sem-codigo');
    return { step: 'email', email: email.value, error: error.status === 429 ? 'rate_limited' : 'send_failed' };
  }
  return { step: 'code', email: email.value, error: null };
}

export async function verifyOtpAction(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const email = parseEmail(formData.get('email'));
  if (!email.ok) return { step: 'email', email: '', error: email.error };
  const otp = parseOtp(formData.get('token'));
  if (!otp.ok) return { step: 'code', email: email.value, error: otp.error };

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.verifyOtp({ email: email.value, token: otp.value, type: 'email' });
  if (error) {
    console.error('otp_verify_failed', error.status ?? 'sem-status', error.code ?? 'sem-codigo');
    return { step: 'code', email: email.value, error: error.status === 429 ? 'rate_limited' : 'otp_failed' };
  }
  // redirect fora de try/catch
  redirect(safeNextPath(formData.get('next')));
}
