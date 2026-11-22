import Link from "next/link";
import type { LibraryPost } from "@/lib/library/model";
import type { Messages } from "@/lib/i18n/messages";
import { PostCard } from "@/components/posts/PostCard";
import { postPath } from "@/lib/posts/model";
import { Icon } from "@/components/ui/Icon";
export function SharedSelection({
  title,
  description,
  cover,
  posts,
  m,
}: {
  title: string;
  description: string;
  cover?: string | null;
  posts: LibraryPost[];
  m: Messages;
}) {
  return (
    <>
      <section className="mb-10 rounded-[30px] bg-soft p-6 sm:p-10">
        {cover && (
          <img
            src={`/api/media/post/${cover}`}
            alt=""
            className="mb-6 max-h-80 w-full rounded-2xl object-cover"
          />
        )}
        <p className="eyebrow">{m.library.sharedTitle}</p>
        <h1 className="break-words text-3xl font-semibold tracking-tight sm:text-4xl">
          {title}
        </h1>
        <p className="mt-4 whitespace-pre-wrap break-words text-sm leading-relaxed text-ink-muted">
          {description}
        </p>
      </section>
      <div className="grid gap-6 md:grid-cols-2">
        {posts.map((p) => (
          <section key={p.public_id} className="min-w-0">
            <PostCard content={p} name={p.creator_name} labels={m.posts} />
            <Link
              className="button-secondary mt-3"
              href={postPath(p.username, p)}
            >
              {m.library.open} <Icon name="arrow" />
            </Link>
          </section>
        ))}
      </div>
      {!posts.length && (
        <section className="empty-collection">
          <Icon name="layers" width={32} height={32} />
          <p>{m.library.emptyShared}</p>
        </section>
      )}
    </>
  );
}
