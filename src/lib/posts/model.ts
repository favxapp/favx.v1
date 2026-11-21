export const POST_KINDS = ['recommendation', 'product', 'service', 'place', 'experience', 'culture', 'event'] as const;
export type PostKind = typeof POST_KINDS[number];
export type PostLink = { label: string; url: string; coupon: string };
export type PostContent = { media_ids?: string[]; categories?: string[]; private_context?: string; title: string; body: string; content_kind: PostKind; tags: string[]; links: PostLink[]; rating: number | null; is_sponsored: boolean; disclosure: string };
export type PostStatus = 'draft' | 'published' | 'hidden';
export type PostRecord = PostContent & { id: string; public_id: string; slug: string; version: number; lifecycle_state: PostStatus; updated_at: string };
export type PublicPost = PostContent & { public_id: string; slug: string; published_at: string };
export const EMPTY_POST: PostContent = { title: '', body: '', content_kind: 'recommendation', tags: [], links: [], rating: null, is_sponsored: false, disclosure: '' };
export const characterCount = (text: string) => Array.from(text).length;
export function postSlug(title: string) {
  return title.normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 100).replace(/-$/g, '') || 'post';
}
export function postPath(username: string, post: { slug: string; public_id: string }) { return `/${username}/p/${post.slug}-${post.public_id}`; }
export function parsePost(input: unknown, status: unknown): { ok: true; value: PostContent & { slug: string }; status: PostStatus } | { ok: false; error: string } {
  if (!input || typeof input !== 'object' || !['draft', 'published', 'hidden'].includes(String(status))) return { ok: false, error: 'post_invalid' };
  const d = input as Record<string, unknown>;
  if (typeof d.title !== 'string' || characterCount(d.title) > 160 || typeof d.body !== 'string' || characterCount(d.body) > 10000) return { ok: false, error: 'post_length' };
  if (!POST_KINDS.includes(d.content_kind as PostKind) || typeof d.is_sponsored !== 'boolean' || typeof d.disclosure !== 'string' || characterCount(d.disclosure) > 300) return { ok: false, error: 'post_invalid' };
  if (d.rating !== null && (typeof d.rating !== 'number' || !Number.isFinite(d.rating) || d.rating < 0 || d.rating > 10 || d.rating * 2 % 1 !== 0)) return { ok: false, error: 'post_rating' };
  if (!Array.isArray(d.tags) || d.tags.length > 20 || d.tags.some(t => typeof t !== 'string' || !t.trim() || characterCount(t) > 30 || /[<>]/.test(t))) return { ok: false, error: 'post_tags' };
  if (d.media_ids !== undefined && (!Array.isArray(d.media_ids) || d.media_ids.length > 10 || new Set(d.media_ids).size !== d.media_ids.length || d.media_ids.some(id => typeof id !== 'string' || !/^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/.test(id)))) return { ok: false, error: 'post_invalid' };
  if (d.categories !== undefined && (!Array.isArray(d.categories) || d.categories.length > 5 || d.categories.some(t => typeof t !== 'string' || !t.trim() || characterCount(t) > 30 || /[<>]/.test(t)))) return { ok: false, error: 'post_tags' };
  if (d.private_context !== undefined && (typeof d.private_context !== 'string' || characterCount(d.private_context) > 5000)) return { ok: false, error: 'post_length' };
  if (!Array.isArray(d.links) || d.links.length > 20) return { ok: false, error: 'post_links' };
  const links: PostLink[] = [];
  for (const link of d.links) {
    if (!link || typeof link.label !== 'string' || !link.label.trim() || characterCount(link.label) > 80 || typeof link.coupon !== 'string' || characterCount(link.coupon) > 80 || typeof link.url !== 'string' || link.url.length > 2048 || /[\s\\@]/.test(link.url)) return { ok: false, error: 'post_links' };
    try {
      const url = new URL(link.url);
      if (url.protocol !== 'https:' || url.username || url.password || url.port || !/^[a-z0-9]([a-z0-9.-]*[a-z0-9])?$/i.test(url.hostname)) throw Error();
      links.push({ label: link.label.trim(), url: url.href, coupon: link.coupon.trim() });
    } catch { return { ok: false, error: 'post_links' }; }
  }
  if (status === 'published' && (!d.title.trim() || !d.body.trim())) return { ok: false, error: 'post_required' };
  if (status === 'published' && d.is_sponsored && !d.disclosure.trim()) return { ok: false, error: 'post_disclosure' };
  return { ok: true, status: status as PostStatus, value: { ...(d.media_ids !== undefined ? { media_ids: d.media_ids as string[] } : {}), ...(d.categories !== undefined ? { categories: [...new Set((d.categories as string[]).map(t => t.trim()))] } : {}), ...(d.private_context !== undefined ? { private_context: d.private_context as string } : {}), title: d.title.trim(), body: d.body, content_kind: d.content_kind as PostKind, tags: [...new Set(d.tags.map(t => t.trim()))], links, rating: d.rating as number | null, is_sponsored: d.is_sponsored, disclosure: d.disclosure.trim(), slug: postSlug(d.title) } };
}
