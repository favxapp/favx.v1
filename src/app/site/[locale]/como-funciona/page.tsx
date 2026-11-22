import Link from "next/link";
import { notFound } from "next/navigation";
import { normalizeLocale } from "@/lib/locale";
import { getMessages } from "@/lib/i18n/messages";
import { Icon } from "@/components/ui/Icon";
import { GuideDemo } from "@/components/site/GuideDemo";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ trilha?: string }>;
};
export async function generateMetadata({ params }: Pick<Props, "params">) {
  const locale = normalizeLocale((await params).locale);
  return { title: locale ? getMessages(locale).publicGuide.howTitle : "FAVX" };
}
export default async function HowItWorks({ params, searchParams }: Props) {
  const locale = normalizeLocale((await params).locale);
  if (!locale) notFound();
  const m = getMessages(locale).publicGuide;
  const tracks = [
    {
      id: "publicar",
      label: m.publish,
      title: m.publishTitle,
      body: m.publishBody,
      article: "publicacoes",
      destination: "/app/creator/activate",
      icon: "image" as const,
    },
    {
      id: "encontrar",
      label: m.find,
      title: m.findTitle,
      body: m.findBody,
      article: "perfil",
      destination: null,
      icon: "search" as const,
    },
    {
      id: "salvar",
      label: m.save,
      title: m.saveTitle,
      body: m.saveBody,
      article: "perfil",
      destination: "/app/me",
      icon: "bookmark" as const,
    },
  ];
  const selected = (await searchParams).trilha;
  const active = tracks.find((t) => t.id === selected) ?? tracks[0];
  const faqs = [
    [m.faqVisit, m.faqVisitAnswer],
    [m.faqAccount, m.faqAccountAnswer],
    [m.faqSearch, m.faqSearchAnswer],
  ];
  return (
    <main id="main" className="public-page">
      <header className="public-heading">
        <p className="eyebrow">FAVX / {m.howTitle}</p>
        <h1>{m.howIntro}</h1>
      </header>
      <section
        aria-label={m.guideLabel}
        className="grid gap-6 lg:grid-cols-[.75fr_1.25fr]"
      >
        <nav aria-label={m.guideLabel} className="flex flex-col gap-3">
          {tracks.map((track, index) => (
            <Link
              key={track.id}
              scroll={false}
              href={`/${locale}/como-funciona?trilha=${track.id}`}
              aria-current={active.id === track.id ? "page" : undefined}
              className="guide-track"
            >
              <span className="text-xs opacity-70">0{index + 1}</span>
              <Icon name={track.icon} />
              <span>{track.label}</span>
              <Icon name="arrow" className="ml-auto shrink-0" />
            </Link>
          ))}
        </nav>
        <div className="studio-hero !min-h-72" id="guide-content">
          <span className="icon-tile !bg-white">
            <Icon name={active.icon} />
          </span>
          <h2 className="mt-6 text-3xl font-semibold tracking-tight">
            {active.title}
          </h2>
          <p>{active.body}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            {active.destination && (
              <Link
                className="button-primary !mt-0"
                href={`/${locale}/login?next=${encodeURIComponent(active.destination)}`}
              >
                {m.start}
                <Icon name="arrow" />
              </Link>
            )}
            <Link
              className="button-secondary"
              href={`/${locale}/ajuda/${active.article}`}
            >
              {m.readGuide}
            </Link>
          </div>
        </div>
      </section>
      <GuideDemo m={m} />
      <section className="mx-auto w-full max-w-3xl">
        <h2 className="mb-6 text-2xl font-semibold tracking-tight">
          {m.faqTitle}
        </h2>
        <div className="space-y-3">
          {faqs.map(([q, a]) => (
            <details
              key={q}
              className="rounded-2xl border border-line bg-surface px-6 py-2"
            >
              <summary className="min-h-12 cursor-pointer py-3 font-semibold">
                {q}
              </summary>
              <p className="pb-5 pt-2 text-sm leading-relaxed text-ink-muted">
                {a}
              </p>
            </details>
          ))}
        </div>
      </section>
      <section className="flex flex-wrap items-center justify-between gap-6 rounded-[28px] bg-soft p-8">
        <h2 className="text-xl font-semibold">{m.contactCta}</h2>
        <Link className="button-primary" href={`/${locale}/contato`}>
          {m.support}
          <Icon name="arrow" />
        </Link>
      </section>
    </main>
  );
}
