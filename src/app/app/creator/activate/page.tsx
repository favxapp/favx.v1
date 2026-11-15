import { redirect } from 'next/navigation';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { getRequestLocale } from '@/lib/i18n/server';
import { getMessages } from '@/lib/i18n/messages';
import ActivateForm from './ActivateForm';

export const metadata = { title: 'Ativar perfil Creator' };

export default async function ActivatePage() {
  const supabase = await createSupabaseServerClient();
  const { data: existing } = await supabase.from('creator_profiles').select('user_id').maybeSingle();
  if (existing) redirect('/app/creator/profile');
  const m = getMessages(await getRequestLocale());
  return (
    <main id="main" className="mx-auto max-w-form space-y-6 px-6 py-12">
      <div>
        <h1 className="font-serif text-4xl text-ink-strong">{m.activate.title}</h1>
        <p className="mt-2 text-ink-muted">{m.activate.intro}</p>
      </div>
      <ActivateForm labels={{ ...m.activate, creator: m.creator, errors: m.errors as Record<string, string> }} />
    </main>
  );
}
