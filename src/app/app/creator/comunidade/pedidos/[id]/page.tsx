import Link from "next/link";
import { ownRequest } from "@/lib/community/server";
import { requestPath } from "@/lib/community/model";
import { getMessages } from "@/lib/i18n/messages";
import { getRequestLocale } from "@/lib/i18n/server";
import { publicOrigin } from "@/lib/creator/public";
import { ShareProfile } from "@/components/creator/ShareProfile";
import { RequestForm } from "@/components/community/RequestForm";
import { CommunityNav } from "@/components/community/CommunityNav";
export default async function EditRequest({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params,
    { request, creator } = await ownRequest(id),
    m = getMessages(await getRequestLocale()),
    c = m.community;
  const visible =
    request.state === "open" &&
    (!request.expires_at || Date.parse(request.expires_at) > Date.now()) &&
    creator.is_public;
  return (
    <main id="main" className="mx-auto max-w-3xl space-y-8 px-4 py-10 sm:px-6">
      <CommunityNav m={c} current="requests" />
      <header>
        <p className="eyebrow">
          {c.edit} / {c[request.state]}
        </p>
        <h1 className="mt-3 break-words text-3xl font-semibold tracking-tight">
          {request.title}
        </h1>
      </header>
      <div className="flex flex-wrap gap-3">
        <Link
          className="button-secondary"
          href={`/app/creator/comunidade/recebidas?request=${id}`}
        >
          {c.inbox} ↗
        </Link>
        {visible && (
          <Link
            className="button-secondary"
            href={requestPath(creator.username, id)}
          >
            {c.openPublic} ↗
          </Link>
        )}
      </div>
      {visible && (
        <ShareProfile
          url={`${publicOrigin()}${requestPath(creator.username, id)}`}
          title={request.title}
          labels={m.creator}
        />
      )}
      <RequestForm
        key={request.id}
        id={id}
        version={request.version}
        initial={request}
        m={c}
      />
    </main>
  );
}
