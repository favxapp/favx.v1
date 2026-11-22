"use client";
import { useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  sharePersonalCollection,
  deletePersonalCollection,
} from "@/app/app/colecoes/actions";
import type { UserCollection } from "@/lib/library/model";
import type { Messages } from "@/lib/i18n/messages";
export function CollectionSharing({
  collection,
  origin,
  m,
}: {
  collection: UserCollection;
  origin: string;
  m: Messages["library"];
}) {
  const [version, setVersion] = useState(collection.version);
  const [token, setToken] = useState(collection.share_token);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const busy = useRef(false);
  const router = useRouter();
  const url = token ? `${origin}/collections/shared/${token}` : "";
  async function share(enabled: boolean) {
    if (busy.current) return;
    if (!enabled && !window.confirm(m.revokeConfirm)) return;
    busy.current = true;
    setPending(true);
    setError(null);
    setCopied(false);
    try {
      const r = await sharePersonalCollection(collection.id, version, enabled);
      if (r.error || !r.saved) setError(r.error ?? "failed");
      else {
        setVersion(r.saved.version);
        setToken(r.saved.share_token);
        router.refresh();
      }
    } catch {
      setError("failed");
    } finally {
      busy.current = false;
      setPending(false);
    }
  }
  async function remove() {
    if (busy.current || !window.confirm(m.deleteConfirm)) return;
    busy.current = true;
    setPending(true);
    setError(null);
    try {
      const r = await deletePersonalCollection(collection.id, version);
      if (r.error) setError(r.error);
      else {
        router.push("/app/colecoes");
        router.refresh();
      }
    } catch {
      setError("failed");
    } finally {
      busy.current = false;
      setPending(false);
    }
  }
  return (
    <>
      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          className="button-primary"
          onClick={() => dialog.current?.showModal()}
        >
          {m.share}
        </button>
        <button
          type="button"
          className="button-secondary"
          disabled={pending}
          onClick={() => void remove()}
        >
          {m.deleteCollection}
        </button>
      </div>
      {error && (
        <p role="alert" className="text-sm text-danger">
          {error === "conflict" ? m.conflict : m.failed}
        </p>
      )}
      <dialog
        ref={dialog}
        className="w-[calc(100%-32px)] max-w-lg rounded-3xl bg-white p-6 backdrop:bg-black/30"
        aria-labelledby="collection-share-title"
      >
        <h2 id="collection-share-title" className="text-xl font-semibold">
          {m.share}
        </h2>
        <p className="mt-4 text-sm leading-relaxed text-ink-muted">
          {m.shareIntro}
        </p>
        <div className="my-5 rounded-2xl bg-soft p-4">
          <h3 className="font-semibold">{collection.title}</h3>
          <p className="mt-2 whitespace-pre-wrap text-sm">
            {collection.description}
          </p>
          <Link
            href={`/app/colecoes/${collection.id}?preview=1`}
            className="mt-3 inline-flex min-h-11 items-center text-sm underline"
            onClick={() => dialog.current?.close()}
          >
            {m.previewShared}
          </Link>
        </div>
        <p className="text-xs leading-relaxed text-ink-muted">
          {m.shareWarning}
        </p>
        {token ? (
          <div className="mt-5 space-y-3">
            <label className="block text-xs">
              {m.copyLink}
              <input
                className="mt-2 min-h-11 w-full rounded-xl border border-field p-3 text-xs"
                readOnly
                value={url}
                onFocus={(e) => e.target.select()}
              />
            </label>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                className="button-primary"
                onClick={() => {
                  void navigator.clipboard
                    ?.writeText(url)
                    .then(() => setCopied(true))
                    .catch(() => setCopied(false));
                }}
              >
                {copied ? m.linkCopied : m.copyLink}
              </button>
              <Link
                href={`/collections/shared/${token}`}
                target="_blank"
                className="button-secondary"
              >
                {m.previewShared}
              </Link>
              <button
                type="button"
                className="button-secondary"
                disabled={pending}
                onClick={() => void share(false)}
              >
                {m.revokeShare}
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            className="button-primary mt-5"
            disabled={pending}
            onClick={() => void share(true)}
          >
            {m.enableShare}
          </button>
        )}
        <p role="status" className="mt-3 text-xs">
          {pending ? m.saving : copied ? m.linkCopied : ""}
        </p>
        {error && (
          <p role="alert" className="mt-3 text-sm text-danger">
            {error === "conflict" ? m.conflict : m.failed}
          </p>
        )}
        <button
          type="button"
          className="button-secondary mt-5"
          onClick={() => dialog.current?.close()}
        >
          {m.back}
        </button>
      </dialog>
    </>
  );
}
