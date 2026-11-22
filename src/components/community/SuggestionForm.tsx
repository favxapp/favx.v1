"use client";
import { useEffect, useRef, useState } from "react";
import { Field, TextArea, FormAlert } from "@/components/form";
import { sendSuggestion } from "@/app/app/creator/comunidade/actions";
import type { SubmissionContent } from "@/lib/community/model";
import type { Messages } from "@/lib/i18n/messages";
export function SuggestionForm({
  id,
  requestId,
  m,
}: {
  id: string;
  requestId: string;
  m: Messages["community"];
}) {
  const [form, setForm] = useState<SubmissionContent>({
      title: "",
      description: "",
      category: "",
      url: "",
      consent: false,
    }),
    [busy, setBusy] = useState(false),
    [error, setError] = useState<string | null>(null),
    [receipt, setReceipt] = useState("");
  const pending = useRef(false),
    dialog = useRef<HTMLDialogElement>(null);
  const dirty = !!(form.title || form.description || form.url);
  useEffect(() => {
    if (!dirty || receipt) return;
    const leave = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", leave);
    return () => window.removeEventListener("beforeunload", leave);
  }, [dirty, receipt]);
  function update<K extends keyof SubmissionContent>(
    key: K,
    value: SubmissionContent[K],
  ) {
    setForm({ ...form, [key]: value });
  }
  async function send() {
    if (pending.current) return;
    pending.current = true;
    setBusy(true);
    setError(null);
    try {
      const r = await sendSuggestion(id, requestId, form);
      if (r.error) setError(m[r.error as keyof typeof m] ?? m.failed);
      else if (r.receipt) {
        setReceipt(r.receipt);
        dialog.current?.close();
      }
    } catch {
      setError(m.failed);
    } finally {
      pending.current = false;
      setBusy(false);
    }
  }
  if (receipt)
    return (
      <section className="glass-panel space-y-5 rounded-3xl p-7" role="status">
        <h2 className="text-2xl font-semibold">{m.receipt}</h2>
        <p>{m.receiptHint}</p>
        <code className="block break-all rounded-xl bg-soft p-4 text-sm">
          {receipt}
        </code>
      </section>
    );
  return (
    <>
      <form
        className="glass-panel space-y-5 rounded-3xl p-5 sm:p-8"
        onSubmit={(e) => {
          e.preventDefault();
          setError(null);
          dialog.current?.showModal();
        }}
      >
        <fieldset disabled={busy} className="space-y-5">
          <Field
            id="suggestion-title"
            label={m.itemTitle}
            required
            maxLength={160}
            value={form.title}
            onChange={(e) => update("title", e.target.value)}
          />
          <TextArea
            id="suggestion-description"
            label={m.itemDescription}
            required
            maxLength={4000}
            value={form.description}
            onChange={(e) => update("description", e.target.value)}
          />
          <Field
            id="suggestion-category"
            label={m.category}
            maxLength={60}
            value={form.category}
            onChange={(e) => update("category", e.target.value)}
          />
          <Field
            id="suggestion-url"
            label={m.url}
            type="url"
            pattern="https://.*"
            maxLength={2048}
            value={form.url}
            onChange={(e) => update("url", e.target.value)}
          />
          <label className="flex items-start gap-3 rounded-2xl bg-soft p-4 text-sm leading-relaxed">
            <input
              type="checkbox"
              required
              checked={form.consent}
              onChange={(e) => update("consent", e.target.checked)}
              className="mt-1 h-5 w-5 shrink-0 accent-black"
            />
            {m.consent}
          </label>
          <button className="button-primary" type="submit">
            {m.preview}
          </button>
        </fieldset>
        <FormAlert message={error} />
      </form>
      <dialog
        ref={dialog}
        aria-labelledby="suggestion-review-title"
        onCancel={(e) => {
          if (busy) e.preventDefault();
        }}
        className="w-[calc(100%-32px)] max-w-xl rounded-3xl p-6 backdrop:bg-black/30"
      >
        <h2 id="suggestion-review-title" className="text-xl font-semibold">
          {m.preview}
        </h2>
        <h3 className="mt-5 break-words font-semibold">{form.title}</h3>
        <p className="my-4 max-h-64 overflow-auto whitespace-pre-wrap break-words text-sm">
          {form.description}
        </p>
        {form.url && <p className="break-all text-sm">{form.url}</p>}
        <p className="my-5 rounded-xl bg-soft p-4 text-sm">{m.privateHint}</p>
        <FormAlert message={error} />
        <div className="flex flex-wrap gap-3">
          <button
            autoFocus
            disabled={busy}
            className="button-secondary"
            type="button"
            onClick={() => dialog.current?.close()}
          >
            {m.cancel}
          </button>
          <button
            disabled={busy}
            className="button-primary"
            type="button"
            onClick={() => void send()}
          >
            {busy ? "…" : m.send}
          </button>
        </div>
      </dialog>
    </>
  );
}
