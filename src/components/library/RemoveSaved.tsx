"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { removeSaved } from "@/app/app/salvos/actions";
import type { Messages } from "@/lib/i18n/messages";
export function RemoveSaved({ id, m }: { id: string; m: Messages["library"] }) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState(false);
  const router = useRouter();
  async function remove() {
    if (pending || !window.confirm(m.removeConfirm)) return;
    setPending(true);
    setError(false);
    try {
      const r = await removeSaved(id);
      if (r.error) setError(true);
      else {
        router.push("/app/salvos");
        router.refresh();
      }
    } catch {
      setError(true);
    } finally {
      setPending(false);
    }
  }
  return (
    <div>
      <button
        className="button-secondary"
        disabled={pending}
        onClick={() => void remove()}
        type="button"
      >
        {m.remove}
      </button>
      {error && (
        <p className="mt-2 text-sm text-danger" role="alert">
          {m.failed}
        </p>
      )}
    </div>
  );
}
