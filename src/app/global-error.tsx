"use client";
import { Recovery } from "@/components/site/Recovery";
import { useRecoveryLocale } from "@/components/site/useRecoveryLocale";

export default function GlobalError({
  error,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const locale = useRecoveryLocale();
  return (
    <html lang={locale}>
      <body
        style={{
          fontFamily: "Manrope, system-ui, sans-serif",
          color: "#191a1a",
          background: "#f0f0ee",
          margin: 0,
        }}
      >
        <Recovery
          locale={locale}
          kind="error"
          reset={() => window.location.reload()}
          digest={error.digest}
        />
      </body>
    </html>
  );
}
