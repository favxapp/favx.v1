"use client";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { managePost } from "@/app/app/creator/posts/manage-actions";
import type { Messages } from "@/lib/i18n/messages";
import type { PostStatus } from "@/lib/posts/model";
export function ManagementActions({
  id,
  version,
  state,
  m,
}: {
  id: string;
  version: number;
  state: PostStatus;
  m: Messages["management"];
}) {
  const [action, setAction] = useState<
    "hide" | "archive" | "trash" | "restore" | "duplicate" | null
  >(null);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const dialog = useRef<HTMLDialogElement>(null);
  const busy = useRef(false);
  const router = useRouter();
  const actions: NonNullable<typeof action>[] =
    state === "trashed"
      ? ["restore"]
      : state === "archived"
        ? ["restore", "duplicate", "trash"]
        : state === "hidden"
          ? ["restore", "archive", "duplicate", "trash"]
          : state === "published"
            ? ["hide", "archive", "duplicate", "trash"]
            : ["archive", "duplicate", "trash"];
  async function confirm() {
    if (!action || busy.current) return;
    busy.current = true;
    setPending(true);
    setError("");
    try {
      const result = await managePost(id, version, action);
      if (result.error)
        setError(result.error === "conflict" ? m.conflict : m.failed);
      else if (result.destination) {
        dialog.current?.close();
        router.push(result.destination);
        router.refresh();
      }
    } catch {
      setError(m.failed);
    } finally {
      busy.current = false;
      setPending(false);
    }
  }
  return (
    <>
      <div className="flex flex-wrap gap-2">
        {actions.map((a) => (
          <button
            key={a}
            type="button"
            className="button-secondary"
            onClick={() => {
              setAction(a);
              setError("");
              dialog.current?.showModal();
            }}
          >
            {m[a]}
          </button>
        ))}
      </div>
      <dialog
        ref={dialog}
        aria-labelledby="manage-confirm-title"
        onCancel={(e) => {
          if (pending) e.preventDefault();
        }}
        className="w-[calc(100%-32px)] max-w-lg rounded-3xl p-6 backdrop:bg-black/30"
      >
        <h2 id="manage-confirm-title" className="text-xl font-semibold">
          {action ? m[action] : m.confirm}
        </h2>
        {action !== "duplicate" && (
          <p className="my-4 leading-relaxed text-ink-muted">
            {action === "restore" ? m.restoreHint : m.confirmHint}
          </p>
        )}
        {error && (
          <p role="alert" className="my-4 text-danger">
            {error}
          </p>
        )}
        <div className="mt-6 flex flex-wrap gap-3">
          <button
            autoFocus
            type="button"
            className="button-secondary"
            disabled={pending}
            onClick={() => dialog.current?.close()}
          >
            {m.cancel}
          </button>
          <button
            type="button"
            className="button-primary"
            disabled={pending}
            onClick={() => void confirm()}
          >
            {pending ? "…" : m.confirm}
          </button>
        </div>
      </dialog>
    </>
  );
}
