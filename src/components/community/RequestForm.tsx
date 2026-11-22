"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Field, TextArea, FormAlert } from "@/components/form";
import { saveRequest } from "@/app/app/creator/comunidade/actions";
import { REQUEST_STATES, type RequestContent } from "@/lib/community/model";
import type { Messages } from "@/lib/i18n/messages";
export function RequestForm({
  id,
  version,
  initial,
  m,
}: {
  id: string;
  version: number;
  initial: RequestContent;
  m: Messages["community"];
}) {
  const [form, setForm] = useState(initial),
    [busy, setBusy] = useState(false),
    [error, setError] = useState<string | null>(null),
    [saved, setSaved] = useState(false);
  const [baseline, setBaseline] = useState(JSON.stringify(initial)),
    [v, setVersion] = useState(version);
  const pending = useRef(false),
    dialog = useRef<HTMLDialogElement>(null),
    router = useRouter();
  const dirty = JSON.stringify(form) !== baseline;
  useEffect(() => {
    if (!dirty) return;
    const leave = (e: BeforeUnloadEvent) => {
      e.preventDefault();
    };
    window.addEventListener("beforeunload", leave);
    return () => window.removeEventListener("beforeunload", leave);
  }, [dirty]);
  function update<K extends keyof RequestContent>(
    key: K,
    value: RequestContent[K],
  ) {
    setForm({ ...form, [key]: value });
    setSaved(false);
  }
  async function save() {
    if (pending.current) return;
    pending.current = true;
    setBusy(true);
    setError(null);
    try {
      const r = await saveRequest(id, v, form);
      if (r.error) setError(m[r.error as keyof typeof m] ?? m.failed);
      else if (r.saved) {
        setVersion(r.saved.version);
        setBaseline(JSON.stringify(form));
        setSaved(true);
        dialog.current?.close();
        if (v === 0) router.replace(`/app/creator/comunidade/pedidos/${id}`);
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
        className="glass-panel space-y-6 rounded-3xl p-5 sm:p-8"
        onSubmit={(e) => {
          e.preventDefault();
          if (form.state === "open") dialog.current?.showModal();
          else void save();
        }}
      >
        <fieldset disabled={busy} className="space-y-5">
          <Field
            id="request-title"
            label={m.question}
            value={form.title}
            required
            maxLength={160}
            onChange={(e) => update("title", e.target.value)}
          />
          <TextArea
            id="request-description"
            label={m.description}
            value={form.description}
            maxLength={3000}
            onChange={(e) => update("description", e.target.value)}
          />
          <Field
            id="request-category"
            label={m.category}
            value={form.category}
            maxLength={60}
            onChange={(e) => update("category", e.target.value)}
          />
          <TextArea
            id="request-instructions"
            label={m.instructions}
            value={form.instructions}
            maxLength={1500}
            onChange={(e) => update("instructions", e.target.value)}
          />
          <div className="grid gap-5 sm:grid-cols-2">
            <Field
              id="request-expires"
              label={m.expires}
              hint={m.expiresHint}
              type="datetime-local"
              value={form.expires_at?.slice(0, 16) ?? ""}
              onChange={(e) =>
                update(
                  "expires_at",
                  e.target.value ? `${e.target.value}:00Z` : null,
                )
              }
            />
            <label className="space-y-2 text-sm font-semibold">
              <span className="block">{m.status}</span>
              <select
                aria-label={m.status}
                className="min-h-11 w-full rounded-xl border border-field bg-white px-3"
                value={form.state}
                onChange={(e) =>
                  update("state", e.target.value as RequestContent["state"])
                }
              >
                {REQUEST_STATES.map((s) => (
                  <option key={s} value={s}>
                    {m[s]}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <p className="rounded-2xl bg-soft p-4 text-sm leading-relaxed text-ink-muted">
            {m.privateHint}
          </p>
          <div className="flex flex-wrap gap-3">
            <button className="button-primary" type="submit">
              {busy ? "…" : m.save}
            </button>
            <button
              type="button"
              className="button-secondary"
              onClick={() => {
                if (!dirty || window.confirm(m.unsaved))
                  router.push("/app/creator/comunidade/pedidos");
              }}
            >
              {m.cancel}
            </button>
          </div>
        </fieldset>
        <FormAlert message={error} />
        {saved && (
          <p role="status" className="text-sm">
            {m.saved}
          </p>
        )}
      </form>
      <dialog
        ref={dialog}
        className="w-[calc(100%-32px)] max-w-lg rounded-3xl p-6 backdrop:bg-black/30"
        aria-labelledby="request-public-title"
        onCancel={(e) => {
          if (busy) e.preventDefault();
        }}
      >
        <h2 id="request-public-title" className="text-xl font-semibold">
          {m.open}
        </h2>
        <p className="my-4 text-sm leading-relaxed">{m.publishHint}</p>
        <h3 className="break-words font-semibold">{form.title}</h3>
        <p className="my-4 whitespace-pre-wrap break-words text-sm">
          {form.description}
        </p>
        <FormAlert message={error} />
        <div className="mt-5 flex gap-3">
          <button
            autoFocus
            type="button"
            disabled={busy}
            className="button-secondary"
            onClick={() => dialog.current?.close()}
          >
            {m.cancel}
          </button>
          <button
            type="button"
            disabled={busy}
            className="button-primary"
            onClick={() => void save()}
          >
            {busy ? "…" : m.confirm}
          </button>
        </div>
      </dialog>
    </>
  );
}
