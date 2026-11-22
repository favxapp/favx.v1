"use client";

import { useEffect, useId, useRef, useState } from "react";
import type { Messages } from "@/lib/i18n/messages";

type Props = {
  url: string;
  title: string;
  labels: Messages["creator"];
  compact?: boolean;
};
export function ShareProfile(props: Props) {
  return <ShareControls key={props.url} {...props} />;
}

function ShareControls({ url, title, labels, compact = false }: Props) {
  const id = useId();
  const input = useRef<HTMLInputElement>(null);
  const busy = useRef(false);
  const [message, setMessage] = useState("");
  const [pending, setPending] = useState(false);
  const [manual, setManual] = useState(false);
  useEffect(() => {
    if (manual) {
      input.current?.focus();
      input.current?.select();
    }
  }, [manual]);
  function fallback() {
    setManual(true);
    setMessage(labels.copyManually);
  }
  async function run(native: boolean) {
    if (busy.current) return;
    busy.current = true;
    setPending(true);
    setMessage("");
    setManual(false);
    try {
      if (native && navigator.share) {
        await navigator.share({ url, title });
        setMessage(labels.shared);
      } else {
        await navigator.clipboard.writeText(url);
        setMessage(labels.copied);
      }
    } catch (e) {
      if (!(e instanceof Error && e.name === "AbortError")) fallback();
    } finally {
      busy.current = false;
      setPending(false);
    }
  }
  return (
    <div className="min-w-0 space-y-3">
      {(!compact || manual) && (
        <>
          <label htmlFor={id} className="block text-sm font-semibold">
            {labels.profileLink}
          </label>
          <input
            ref={input}
            id={id}
            value={url}
            readOnly
            onFocus={(e) => e.target.select()}
            className="min-h-11 w-full min-w-0 rounded-xl border border-field bg-surface px-3 text-sm"
          />
        </>
      )}
      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          disabled={pending}
          onClick={() => void run(true)}
          className="button-primary"
        >
          {labels.share}
        </button>
        <button
          type="button"
          disabled={pending}
          onClick={() => void run(false)}
          className="button-secondary"
        >
          {labels.copy}
        </button>
      </div>
      <p role="status" aria-live="polite" className="text-sm text-ink-muted">
        {pending ? labels.sharing : message}
      </p>
    </div>
  );
}
