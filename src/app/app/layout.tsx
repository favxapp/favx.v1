import { redirect } from 'next/navigation';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { getRequestLocale } from '@/lib/i18n/server';
import { getMessages } from '@/lib/i18n/messages';
import { AppShell } from '@/components/navigation/AppShell';
import { avatarUrl } from '@/lib/creator/avatar';

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const locale = await getRequestLocale();
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect(`/${locale}/login`);
  const { data: creator, error } = await supabase.from('creator_profiles').select('display_name,avatar_path').eq('user_id', user.id).maybeSingle();
  if (error) throw Error('Workspace unavailable');
  const m = getMessages(locale);
  return <AppShell locale={locale} labels={m.workspace} libraryLabels={m.library} managementLabels={m.management} name={creator?.display_name || user.email?.split('@')[0] || 'FAVX'} photo={avatarUrl(creator?.avatar_path ?? null)} creator={!!creator}>{children}</AppShell>;
}
