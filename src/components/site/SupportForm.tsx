"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import type { Messages } from "@/lib/i18n/messages";
import {
  parseSupportDraft,
  SUPPORT_CATEGORIES,
  supportEmail,
} from "@/lib/support/message";

export function SupportForm({ m }: { m: Messages["publicGuide"] }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const fallback = useRef<HTMLTextAreaElement>(null);
  const [prepared, setPrepared] = useState<{
    href: string;
    text: string;
  } | null>(null);
  const [error, setError] = useState(false);
  const [copied, setCopied] = useState(false);
  const [manual, setManual] = useState(false);
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);
  function prepare(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // No named fields: a native submit before hydration must never put this
    // private draft in a URL or server request. Preparation stays client-side.
    const fields = e.currentTarget.elements;
    const draft = parseSupportDraft({
      subject: (fields.namedItem("support-subject") as HTMLInputElement).value,
      category: (fields.namedItem("support-category") as HTMLSelectElement)
        .value,
      description: (
        fields.namedItem("support-description") as HTMLTextAreaElement
      ).value,
      consent: (fields.namedItem("support-consent") as HTMLInputElement)
        .checked,
    });
    setError(!draft);
    if (!draft) return;
    setPrepared(supportEmail(draft, m[draft.category]));
    setCopied(false);
    setManual(false);
    dialog.current?.showModal();
  }
  async function copy() {
    if (!prepared) return;
    setCopied(false);
    setManual(false);
    try {
      await navigator.clipboard.writeText(prepared.text);
      setCopied(true);
    } catch {
      setManual(true);
      fallback.current?.focus();
      fallback.current?.select();
    }
  }
  const field =
    "mt-2 min-h-12 w-full rounded-2xl border border-field bg-white px-4 py-3";
  return (
    <>
      <form
        onSubmit={prepare}
        className="glass-panel space-y-6 rounded-[32px] p-6 sm:p-8"
      >
        <div>
          <label htmlFor="support-subject" className="text-sm font-semibold">
            {m.subject}
          </label>
          <input
            id="support-subject"
            required
            maxLength={100}
            className={field}
          />
        </div>
        <div>
          <label htmlFor="support-category" className="text-sm font-semibold">
            {m.category}
          </label>
          <select id="support-category" className={field}>
            {SUPPORT_CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {m[category]}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label
            htmlFor="support-description"
            className="text-sm font-semibold"
          >
            {m.description}
          </label>
          <textarea
            id="support-description"
            required
            minLength={20}
            maxLength={3000}
            rows={7}
            className={field}
            aria-describedby="support-hint"
          />
          <p id="support-hint" className="mt-2 text-xs text-ink-muted">
            {m.detailsHint}
          </p>
        </div>
        <p className="rounded-2xl bg-soft p-4 text-sm text-ink-muted">
          {m.privacyHint}
        </p>
        <label className="flex items-start gap-3 text-sm">
          <input
            id="support-consent"
            type="checkbox"
            required
            className="mt-1 size-5 shrink-0 accent-black"
          />
          <span>{m.consent}</span>
        </label>
        {error && (
          <p role="alert" className="text-sm text-danger">
            {m.invalid}
          </p>
        )}
        <button className="button-primary" type="submit" disabled={!ready}>
          {m.prepare}
        </button>
      </form>
      <dialog
        ref={dialog}
        aria-labelledby="support-preview-title"
        aria-describedby="support-preview-hint"
        className="m-auto max-h-[90dvh] w-[calc(100%-2rem)] max-w-xl overflow-y-auto rounded-[28px] bg-surface p-6 text-ink backdrop:bg-black/30 sm:p-8"
      >
        <h2 id="support-preview-title" className="text-2xl font-semibold">
          {m.preview}
        </h2>
        <p id="support-preview-hint" className="my-4 text-sm text-ink-muted">
          {m.previewHint}
        </p>
        <label htmlFor="support-prepared" className="sr-only">
          {m.preview}
        </label>
        <textarea
          id="support-prepared"
          ref={fallback}
          readOnly
          value={prepared?.text ?? ""}
          rows={9}
          className="w-full rounded-xl border border-field bg-soft p-4 text-sm"
        />
        <div className="mt-5 flex flex-wrap gap-3">
          <a href={prepared?.href} className="button-primary">
            {m.openEmail}
          </a>
          <button type="button" onClick={copy} className="button-secondary">
            {m.copyMessage}
          </button>
        </div>
        <p role="status" className="mt-4 text-sm">
          {copied ? m.messageCopied : manual ? m.manualCopy : ""}
        </p>
        <button
          type="button"
          onClick={() => dialog.current?.close()}
          className="button-secondary mt-4"
        >
          {m.edit}
        </button>
      </dialog>
    </>
  );
}
