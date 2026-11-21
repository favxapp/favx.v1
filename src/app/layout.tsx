import type { Metadata } from 'next';
import { Manrope } from 'next/font/google';
import { getRequestLocale } from '@/lib/i18n/server';
import './globals.css';

const manrope = Manrope({ subsets: ['latin'], variable: '--font-manrope', display: 'swap' });

export const metadata: Metadata = {
  title: { default: 'FAVX', template: '%s · FAVX' },
  description: 'Plataforma para compartilhar recomendações, experiências e momentos.',
  // pré-lançamento: não indexar
  robots: { index: false, follow: false },
};

const HTML_LANG: Record<string, string> = { 'pt-br': 'pt-BR', 'pt-pt': 'pt-PT', en: 'en', es: 'es', it: 'it', fr: 'fr' };

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = await getRequestLocale();
  return (
    <html lang={HTML_LANG[locale]} className={manrope.variable}>
      <body className="min-h-screen bg-canvas font-sans text-ink antialiased">{children}</body>
    </html>
  );
}
