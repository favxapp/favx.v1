import Link from "next/link";
import { notFound } from "next/navigation";
import { normalizeLocale } from "@/lib/locale";
import { getMessages } from "@/lib/i18n/messages";
import { SupportForm } from "@/components/site/SupportForm";
import { SUPPORT_EMAIL } from "@/lib/support/message";
import { Icon } from "@/components/ui/Icon";

type Props = { params: Promise<{ locale: string }> };
export async function generateMetadata({ params }: Props) {
  const locale = normalizeLocale((await params).locale);
  return { title: locale ? getMessages(locale).publicGuide.support : "FAVX" };
}
export default async function Contact({ params }: Props) {
  const locale = normalizeLocale((await params).locale);
  if (!locale) notFound();
  const m = getMessages(locale).publicGuide;
  return (
    <main id="main" className="public-page">
      <header className="public-heading">
        <p className="eyebrow">FAVX / {m.support}</p>
        <h1>{m.contactTitle}</h1>
        <p className="mt-5 max-w-xl text-lg text-ink-muted">{m.contactIntro}</p>
      </header>
      <div className="grid items-start gap-8 lg:grid-cols-[.8fr_1.2fr]">
        <aside className="space-y-6">
          <div className="studio-hero">
            <span className="icon-tile !bg-white">
              <Icon name="help" />
            </span>
            <h2 className="mt-6 text-2xl font-semibold">{m.emailChannel}</h2>
            <a
              className="mt-4 inline-block break-all text-lg font-semibold underline underline-offset-4"
              href={`mailto:${SUPPORT_EMAIL}`}
            >
              {SUPPORT_EMAIL}
            </a>
            <p>{m.emailExplain}</p>
          </div>
          <Link className="button-secondary" href={`/${locale}/ajuda`}>
            {m.help}
            <Icon name="arrow" />
          </Link>
        </aside>
        <SupportForm m={m} />
      </div>
    </main>
  );
}
