"use client";
import { useRef, useState } from "react";
export function MediaDownload({
  id,
  filename,
  label,
  failed,
  variant,
}: {
  id: string;
  filename: string;
  label: string;
  failed: string;
  variant: "original" | "optimized";
}) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState(false);
  const busy = useRef(false);
  async function download() {
    if (busy.current) return;
    busy.current = true;
    setPending(true);
    setError(false);
    try {
      const r = await fetch(`/api/creator/media/${id}/${variant}`, {
        signal: AbortSignal.timeout(60000),
      });
      if (!r.ok) throw Error();
      const url = URL.createObjectURL(await r.blob());
      const a = document.createElement("a");
      a.href = url;
      a.download =
        variant === "original"
          ? filename
          : `${filename.replace(/\.[^.]*$/, "")}.webp`;
      document.body.append(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 10000);
    } catch {
      setError(true);
    } finally {
      busy.current = false;
      setPending(false);
    }
  }
  return (
    <div>
      <button
        type="button"
        className="button-secondary"
        disabled={pending}
        onClick={() => void download()}
      >
        {pending ? "…" : label}
      </button>
      {error && (
        <p role="alert" className="mt-2 text-sm text-danger">
          {failed}
        </p>
      )}
    </div>
  );
}
