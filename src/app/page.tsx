import { redirect } from 'next/navigation';
import { DEFAULT_LOCALE } from '@/lib/locale';

// O middleware negocia o idioma; este redirecionamento é só um reforço.
export default function Home() {
  redirect(`/${DEFAULT_LOCALE}`);
}
