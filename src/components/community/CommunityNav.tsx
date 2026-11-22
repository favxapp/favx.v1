import Link from "next/link";
import type { Messages } from "@/lib/i18n/messages";
export function CommunityNav({
  m,
  current,
}: {
  m: Messages["community"];
  current: "requests" | "inbox";
}) {
  return (
    <nav className="filter-tabs flex-wrap" aria-label={m.title}>
      <Link
        href="/app/creator/comunidade/pedidos"
        aria-current={current === "requests" ? "page" : undefined}
      >
        {m.requests}
      </Link>
      <Link
        href="/app/creator/comunidade/recebidas"
        aria-current={current === "inbox" ? "page" : undefined}
      >
        {m.inbox}
      </Link>
    </nav>
  );
}
