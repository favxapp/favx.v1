"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { saveRecommendation, saveState } from "@/app/app/salvos/actions";
import type { Messages } from "@/lib/i18n/messages";
import { Icon } from "@/components/ui/Icon";
export function SaveButton({
  publicId,
  m,
}: {
  publicId: string;
  m: Messages["library"];
}) {
  const [id, setId] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState(false);
  const busy = useRef(false);
  const touched = useRef(false);
  const router = useRouter();
  useEffect(() => {
    let active = true;
    void saveState(publicId)
      .then((value) => {
        if (active && !touched.current) setId(value ?? null);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, [publicId]);
  async function save() {
    if (busy.current) return;
    busy.current = true;
    touched.current = true;
    setPending(true);
    setError(false);
    try {
      const result = await saveRecommendation(publicId);
      if (result.login) router.push(result.login);
      else if (result.id) setId(result.id);
      else setError(true);
    } catch {
      setError(true);
    } finally {
      busy.current = false;
      setPending(false);
    }
  }
  return (
    <div>
      {id ? (
        <Link className="button-secondary" href={`/app/salvos/${id}`}>
          <Icon name="check" />
          {m.savedState}
        </Link>
      ) : (
        <button
          className="button-primary"
          type="button"
          disabled={pending}
          onClick={() => void save()}
        >
          <Icon name="bookmark" />
          {pending ? m.saving : m.save}
        </button>
      )}
      {error && (
        <p role="alert" className="mt-2 text-sm text-danger">
          {m.failed}
        </p>
      )}
    </div>
  );
}
