"use client";
import { useState } from "react";
export function MediaPreview({
  id,
  alt,
  failed,
  retry,
}: {
  id: string;
  alt: string;
  failed: string;
  retry: string;
}) {
  const [error, setError] = useState(false);
  const [attempt, setAttempt] = useState(0);
  return error ? (
    <div className="flex min-h-40 flex-col items-center justify-center gap-3 rounded-2xl bg-soft p-5 text-center text-sm">
      <p role="status">{failed}</p>
      <button
        type="button"
        className="button-secondary"
        onClick={() => {
          setAttempt(attempt + 1);
          setError(false);
        }}
      >
        {retry}
      </button>
    </div>
  ) : (
    <img
      src={`/api/media/post/${id}?attempt=${attempt}`}
      alt={alt}
      loading="lazy"
      onError={() => setError(true)}
      className="max-h-[560px] w-full rounded-2xl bg-soft object-contain"
    />
  );
}
