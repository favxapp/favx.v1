import type { Messages } from '@/lib/i18n/messages';
import type { PostContent } from '@/lib/posts/model';
export function PostCard({ content, name, labels }: { content: PostContent; name: string; labels: Messages['posts'] }) {
  return <article className="min-w-0 space-y-5 rounded-xl border border-line bg-surface p-5 sm:p-8">
    <div className="flex items-center justify-between gap-4 text-sm"><span className="font-semibold">{name}</span><span className="rounded-full bg-soft px-3 py-1">{labels.kinds[content.content_kind]}</span></div>
    {content.is_sponsored && <div className="rounded-md border border-field bg-soft p-3 text-sm"><strong>{labels.sponsored}</strong>{content.disclosure && <p className="mt-1 break-words">{content.disclosure}</p>}</div>}
    <div className="post-gallery">{content.media_ids?.map(id => <img key={id} src={`/api/media/post/${id}`} alt={content.title} loading="lazy" />)}</div>
    <h2 className="break-words font-sans font-semibold tracking-tight text-3xl text-ink-strong">{content.title || labels.untitled}</h2>
    {content.body && <p className="whitespace-pre-wrap break-words leading-relaxed">{content.body}</p>}
    {content.rating !== null && <p className="text-sm"><strong>{content.rating}/10</strong> · {labels.personalRating}</p>}
    {content.tags.length > 0 && <ul className="flex flex-wrap gap-2">{content.tags.map((tag, i) => <li key={`${tag}-${i}`} className="max-w-full break-words rounded-full bg-soft px-3 py-1 text-sm">#{tag}</li>)}</ul>}
    {content.links.length > 0 && <ul className="space-y-3">{content.links.map((link, i) => <li key={i} className="rounded-lg border border-line p-4">
      {/^https:\/\//.test(link.url) ? <a href={link.url} target="_blank" rel={content.is_sponsored ? 'noopener noreferrer sponsored' : 'noopener noreferrer'} className="inline-flex min-h-11 items-center break-all font-semibold text-link underline">{link.label || labels.linkLabel} ↗</a> : <span>{link.label || labels.linkLabel}</span>}
      {link.coupon && <p className="break-all text-sm">{labels.coupon}: <strong>{link.coupon}</strong></p>}
    </li>)}</ul>}
  </article>;
}
