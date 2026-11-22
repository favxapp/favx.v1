"use client";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { reviewSuggestion } from "@/app/app/creator/comunidade/actions";
import { REVIEW_STATES, type ReviewState } from "@/lib/community/model";
import type { Messages } from "@/lib/i18n/messages";
import { FormAlert } from "@/components/form";
export function ReviewForm({
  id,
  version,
  initial,
  m,
}: {
  id: string;
  version: number;
  initial: ReviewState;
  m: Messages["community"];
}) {
  const [state, setState] = useState(initial),
    [busy, setBusy] = useState(false),
    [error, setError] = useState<string | null>(null);
  const pending = useRef(false),
    dialog = useRef<HTMLDialogElement>(null),
    router = useRouter();
  async function save() {
    if (pending.current) return;
    pending.current = true;
    setBusy(true);
    setError(null);
    try {
      const r = await reviewSuggestion(id, version, state);
      if (r.error) setError(m[r.error as keyof typeof m] ?? m.failed);
      else {
        dialog.current?.close();
        router.refresh();
      }
    } catch {
      setError(m.failed);
    } finally {
      pending.current = false;
      setBusy(false);
    }
  }
  return (
    <>
      <form
        className="space-y-5"
        onSubmit={(e) => {
          e.preventDefault();
          dialog.current?.showModal();
        }}
      >
        <label className="block space-y-2 text-sm font-semibold">
          <span>{m.chooseState}</span>
          <select
            aria-label={m.chooseState}
            value={state}
            onChange={(e) => setState(e.target.value as ReviewState)}
            className="min-h-11 w-full rounded-xl border border-field bg-white p-3"
          >
            {REVIEW_STATES.map((s) => (
              <option key={s} value={s}>
                {m[s]}
              </option>
            ))}
          </select>
        </label>
        <button
          className="button-primary"
          type="submit"
          disabled={busy || state === initial}
        >
          {m.confirm}
        </button>
      </form>
      <dialog
        ref={dialog}
        onCancel={(e) => {
          if (busy) e.preventDefault();
        }}
        aria-labelledby="review-confirm-title"
        className="w-[calc(100%-32px)] max-w-lg rounded-3xl p-6 backdrop:bg-black/30"
      >
        <h2 id="review-confirm-title" className="text-xl font-semibold">
          {m[state]}
        </h2>
        <p className="my-5 text-sm">
          {state === "selected" ? m.selectedHint : m.reviewIntro}
        </p>
        <FormAlert message={error} />
        <div className="flex gap-3">
          <button
            autoFocus
            type="button"
            className="button-secondary"
            disabled={busy}
            onClick={() => dialog.current?.close()}
          >
            {m.cancel}
          </button>
          <button
            type="button"
            className="button-primary"
            disabled={busy}
            onClick={() => void save()}
          >
            {busy ? "…" : m.confirm}
          </button>
        </div>
      </dialog>
    </>
  );
}
