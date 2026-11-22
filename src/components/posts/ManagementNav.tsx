import Link from "next/link";
import type { Messages } from "@/lib/i18n/messages";
export function ManagementNav({
  m,
  current,
}: {
  m: Messages;
  current: string;
}) {
  const links = [
    ["/app/creator/posts", m.posts.myPosts],
    ["/app/creator/posts/encerrados", m.management.closed],
    ["/app/creator/lixeira", m.management.trashed],
    ["/app/creator/midias", m.management.media],
  ];
  return (
    <nav className="filter-tabs flex-wrap" aria-label={m.management.manage}>
      {links.map(([href, label]) => (
        <Link
          key={href}
          href={href}
          aria-current={current === href ? "page" : undefined}
        >
          {label}
        </Link>
      ))}
    </nav>
  );
}
