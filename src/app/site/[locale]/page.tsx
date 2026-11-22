import Link from "next/link";
import { InspirationGallery } from "@/components/ui/InspirationGallery";
import { Icon } from "@/components/ui/Icon";
import { notFound } from "next/navigation";
import { normalizeLocale } from "@/lib/locale";
import { getMessages } from "@/lib/i18n/messages";

export default async function Landing({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  const locale = normalizeLocale(raw);
  if (!locale) notFound();
  const m = getMessages(locale);
  return (
    <main id="main" className="landing-page">
      <div className="landing-copy">
        <p className="eyebrow">FAVX</p>
        <h1>{m.landing.headline}</h1>
        <p className="landing-description">{m.landing.sub}</p>
        <Link href={`/${locale}/login`} className="button-primary mt-8">
          {m.landing.cta}
          <Icon name="arrow" />
        </Link>
        <Link
          href={`/${locale}/como-funciona`}
          className="button-secondary ml-3 mt-4"
        >
          {m.publicGuide.howTitle}
        </Link>
      </div>
      <InspirationGallery />
    </main>
  );
}
