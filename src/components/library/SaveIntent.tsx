"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { saveRecommendation } from "@/app/app/salvos/actions";
import type { Messages } from "@/lib/i18n/messages";
export function SaveIntent({
  publicId,
  resume,
  m,
}: {
  publicId: string;
  resume: boolean;
  m: Messages["library"];
}) {
  const started = useRef(false);
  const busy = useRef(false);
  const [pending, setPending] = useState(resume);
  const [id, setId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  async function save(consume: boolean) {
    if (busy.current) return;
    busy.current = true;
    setPending(true);
    setError(null);
    try {
      const r = await saveRecommendation(publicId, consume);
      if (r.id) setId(r.id);
      else setError(r.error ?? "failed");
    } catch {
      setError("failed");
    } finally {
      setPending(false);
      busy.current = false;
    }
  }
  useEffect(() => {
    if (resume && !started.current) {
      started.current = true;
      void save(true);
    }
  }, [resume]);
  return (
    <section className="discover-card mx-auto max-w-xl space-y-6">
      <h1>{m.intentTitle}</h1>
      <p role="status">
        {id
          ? m.successIntent
          : pending
            ? m.saving
            : resume
              ? m.intentBody
              : m.missingIntent}
      </p>
      {error && (
        <p role="alert" className="text-danger">
          {error === "unavailable"
            ? m.unavailable
            : error === "missingIntent"
              ? m.missingIntent
              : m.failed}
        </p>
      )}
      <div className="flex flex-wrap gap-3">
        {id ? (
          <Link href={`/app/salvos/${id}`} className="button-primary">
            {m.organize}
          </Link>
        ) : (
          <button
            type="button"
            className="button-primary"
            disabled={pending}
            onClick={() => void save(false)}
          >
            {m.save}
          </button>
        )}
        <Link href="/app/salvos" className="button-secondary">
          {m.returnLibrary}
        </Link>
      </div>
    </section>
  );
}
