import Link from "next/link";
import type { SavedItem } from "@/lib/library/model";
import type { Messages } from "@/lib/i18n/messages";
import { Icon } from "@/components/ui/Icon";
export function SavedCard({
  item,
  m,
}: {
  item: SavedItem;
  m: Messages["library"];
}) {
  const p = item.post;
  return (
    <Link href={`/app/salvos/${item.id}`} className="saved-card">
      <div className="saved-card-cover">
        {p?.media_ids?.[0] ? (
          <img
            src={`/api/media/post/${p.media_ids[0]}`}
            alt=""
            loading="lazy"
          />
        ) : (
          <Icon name={p ? "bookmark" : "image"} width={32} height={32} />
        )}
      </div>
      <div className="p-5">
        <p className="text-xs text-ink-muted">
          {p ? `@${p.username}` : m.unavailable}
        </p>
        <h2 className="mt-2 text-base font-semibold tracking-tight">
          {p?.title ?? m.unavailable}
        </h2>
        <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-ink-muted">
          {p?.body ?? m.unavailableBody}
        </p>
        {p?.categories?.length ? (
          <p className="mt-4 text-xs text-ink-muted">
            {p.categories.join(" · ")}
          </p>
        ) : null}
      </div>
    </Link>
  );
}
