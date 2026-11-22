"use client";
import { startTransition, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Recovery } from "@/components/site/Recovery";
import { useRecoveryLocale } from "@/components/site/useRecoveryLocale";
import { safeErrorReference } from "@/lib/support/recovery";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const locale = useRecoveryLocale();
  const router = useRouter();
  useEffect(() => {
    console.error(
      "app_error",
      safeErrorReference(error.digest) ?? "no-reference",
    );
  }, [error]);
  const retry = () =>
    startTransition(() => {
      router.refresh();
      reset();
    });
  return (
    <Recovery
      locale={locale}
      kind="error"
      reset={retry}
      digest={error.digest}
    />
  );
}
