import { randomUUID } from "node:crypto";
import { communityCreator } from "@/lib/community/server";
import { EMPTY_REQUEST } from "@/lib/community/model";
import { getMessages } from "@/lib/i18n/messages";
import { getRequestLocale } from "@/lib/i18n/server";
import { RequestForm } from "@/components/community/RequestForm";
import { CommunityNav } from "@/components/community/CommunityNav";
export default async function NewRequest() {
  await communityCreator();
  const m = getMessages(await getRequestLocale()).community;
  return (
    <main id="main" className="mx-auto max-w-3xl space-y-8 px-4 py-10 sm:px-6">
      <CommunityNav m={m} current="requests" />
      <header>
        <p className="eyebrow">{m.title}</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight">
          {m.newRequest}
        </h1>
        <p className="mt-4 text-ink-muted">{m.intro}</p>
      </header>
      <RequestForm
        id={randomUUID()}
        version={0}
        initial={EMPTY_REQUEST}
        m={m}
      />
    </main>
  );
}
