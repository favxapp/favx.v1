'use client';
import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Field, FormAlert, TextArea } from '@/components/form';
import { PostCard } from './PostCard';
import { savePost } from '@/app/app/creator/posts/actions';
import { characterCount, parsePost, POST_KINDS, postPath, type PostContent, type PostRecord, type PostStatus } from '@/lib/posts/model';
import type { Messages } from '@/lib/i18n/messages';

const button = 'inline-flex min-h-12 items-center justify-center rounded-md border border-field px-4 py-2 text-sm font-semibold disabled:opacity-50';
const inputClass = 'block min-h-12 w-full rounded-md border border-field bg-surface px-3 py-2 text-base';
export function PostEditor({ id, initial, username, name, isPublic, active, labels: m, errors }: {
  id: string; initial: PostContent & Partial<PostRecord>; username: string; name: string; isPublic: boolean; active: boolean; labels: Messages['posts']; errors: Record<string, string>;
}) {
  const [content, setContent] = useState<PostContent>({ title: initial.title, body: initial.body, content_kind: initial.content_kind, tags: initial.tags, links: initial.links, rating: initial.rating, is_sponsored: initial.is_sponsored, disclosure: initial.disclosure });
  const [tags, setTags] = useState(initial.tags.join(', '));
  const [status, setStatus] = useState<PostStatus>(initial.lifecycle_state ?? 'draft');
  const version = useRef(initial.version ?? 0);
  const [savedSnapshot, setSavedSnapshot] = useState(JSON.stringify(content));
  const [pending, setPending] = useState(false);
  const inFlight = useRef(false);
  const lastAttempt = useRef('');
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState('');
  const [publicPath, setPublicPath] = useState(initial.public_id && initial.slug ? postPath(username, { public_id: initial.public_id, slug: initial.slug }) : '');
  const [previewWidth, setPreviewWidth] = useState<'mobile' | 'desktop'>('mobile');
  const review = useRef<HTMLDialogElement>(null);
  const snapshot = JSON.stringify(content);
  const dirty = snapshot !== savedSnapshot;
  const update = <K extends keyof PostContent>(key: K, value: PostContent[K]) => { setContent(c => ({ ...c, [key]: value })); setError(null); setNotice(''); };

  const persist = useCallback(async (target: PostStatus) => {
    if (inFlight.current || !active) return false;
    lastAttempt.current = snapshot;
    const parsed = parsePost(content, target);
    if (!parsed.ok) { setError(parsed.error); return false; }
    inFlight.current = true; setPending(true); setError(null); setNotice('');
    try {
      const result = await savePost(id, version.current, content, target);
      if (result.error || !result.saved) { setError(result.error ?? 'post_save_failed'); return false; }
      version.current = result.saved.version;
      setStatus(result.saved.lifecycle_state); setSavedSnapshot(snapshot);
      setPublicPath(postPath(username, result.saved));
      setNotice(target === 'published' ? m.publishedSaved : target === 'hidden' ? m.hiddenSaved : m.saved);
      if (window.location.pathname.endsWith('/novo')) window.history.replaceState(null, '', `/app/creator/posts/${id}/editar`);
      return true;
    } catch { setError('post_save_failed'); return false; }
    finally { inFlight.current = false; setPending(false); }
  }, [active, content, id, m.hiddenSaved, m.publishedSaved, m.saved, snapshot, username]);

  useEffect(() => {
    if (!dirty || pending || status === 'published' || !active || snapshot === lastAttempt.current) return;
    const timer = setTimeout(() => { void persist(status); }, 1500);
    return () => clearTimeout(timer);
  }, [dirty, pending, persist, snapshot, status, active]);
  useEffect(() => {
    if (!dirty && !pending) return;
    const unload = (event: BeforeUnloadEvent) => { event.preventDefault(); event.returnValue = ''; };
    const leave = (event: MouseEvent) => {
      const link = (event.target as Element).closest?.('a[href]');
      if (link && link.getAttribute('target') !== '_blank' && !window.confirm(m.unsaved)) { event.preventDefault(); event.stopPropagation(); }
    };
    window.addEventListener('beforeunload', unload); document.addEventListener('click', leave, true);
    return () => { window.removeEventListener('beforeunload', unload); document.removeEventListener('click', leave, true); };
  }, [dirty, pending, m.unsaved]);

  const showReview = () => {
    const parsed = parsePost(content, 'published');
    if (!parsed.ok) { setError(parsed.error); return; }
    if (!isPublic) { setError('post_profile_private'); return; }
    setError(null); review.current?.showModal();
  };
  const previewContent = { ...content, links: content.links.filter(link => parsePost({ ...content, links: [link] }, 'draft').ok) };
  return <>
    <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
      <div><Link href="/app/creator/posts" className="inline-flex min-h-11 items-center text-sm text-ink-muted">← {m.myPosts}</Link><h1 className="font-serif text-4xl sm:text-5xl">{initial.version ? m.editTitle : m.createTitle}</h1><p className="mt-3 max-w-xl text-ink-muted">{m.intro}</p></div>
      <p role="status" aria-live="polite" className="rounded-full border border-line px-4 py-2 text-sm">{pending ? m.saving : error ? m.saveError : dirty ? m.unsavedShort : notice || (initial.version ? m.saved : m.privateDraft)}</p>
    </div>
    {!active && <FormAlert message={errors.unauthorized} />}
    <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
      <form onSubmit={e => { e.preventDefault(); showReview(); }} className="min-w-0 space-y-6">
        <fieldset disabled={!active} className="min-w-0 space-y-6 rounded-xl border border-line bg-surface p-5 sm:p-8">
          <legend className="px-2 text-sm font-semibold">{m.content}</legend>
          <Field id="post-title" label={m.titleLabel} value={content.title} onChange={e => update('title', e.target.value)} hint={`${characterCount(content.title)}/160`} error={characterCount(content.title)>160 ? errors.post_length : null} />
          <TextArea id="post-body" label={m.bodyLabel} value={content.body} onChange={e => update('body', e.target.value)} rows={9} hint={`${characterCount(content.body).toLocaleString()}/10.000 · ${m.requiredPublish}`} error={characterCount(content.body)>10000 ? errors.post_length : null} />
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2"><label htmlFor="post-kind" className="text-sm font-semibold">{m.kind}</label><select id="post-kind" className={inputClass} value={content.content_kind} onChange={e => update('content_kind', e.target.value as PostContent['content_kind'])}>{POST_KINDS.map(kind => <option key={kind} value={kind}>{m.kinds[kind]}</option>)}</select></div>
            <div className="space-y-2"><label htmlFor="post-rating" className="text-sm font-semibold">{m.rating}</label><select id="post-rating" className={inputClass} value={content.rating ?? ''} onChange={e => update('rating', e.target.value === '' ? null : Number(e.target.value))}><option value="">{m.noRating}</option>{Array.from({ length: 21 }, (_, i) => i / 2).map(value => <option key={value} value={value}>{value}/10</option>)}</select></div>
          </div>
          <Field id="post-tags" label={m.tags} value={tags} onChange={e => { setTags(e.target.value); update('tags', e.target.value.split(',').map(t => t.trim()).filter(Boolean)); }} hint={m.tagsHint} />
        </fieldset>
        <fieldset disabled={!active} className="min-w-0 space-y-5 rounded-xl border border-line bg-surface p-5 sm:p-8">
          <legend className="px-2 text-sm font-semibold">{m.linksTitle}</legend>
          <p className="text-sm text-ink-muted">{m.linksHint}</p>
          {content.links.map((link, index) => <div key={index} className="space-y-3 rounded-lg bg-soft p-4">
            <Field id={`link-label-${index}`} label={`${m.linkLabel} ${index + 1}`} value={link.label} maxLength={80} onChange={e => update('links', content.links.map((l, i) => i === index ? { ...l, label: e.target.value } : l))} />
            <Field id={`link-url-${index}`} label={m.linkUrl} value={link.url} type="url" placeholder="https://" maxLength={2048} onChange={e => update('links', content.links.map((l, i) => i === index ? { ...l, url: e.target.value } : l))} />
            <Field id={`link-coupon-${index}`} label={m.couponOptional} value={link.coupon} maxLength={80} onChange={e => update('links', content.links.map((l, i) => i === index ? { ...l, coupon: e.target.value } : l))} />
            <button type="button" className="min-h-11 text-sm underline" onClick={() => update('links', content.links.filter((_, i) => i !== index))}>{m.removeLink} {index + 1}</button>
          </div>)}
          <button type="button" className={button} disabled={content.links.length >= 20} onClick={() => update('links', [...content.links, { label: '', url: '', coupon: '' }])}>+ {m.addLink}</button>
        </fieldset>
        <fieldset disabled={!active} className="min-w-0 space-y-4 rounded-xl border border-line p-5 sm:p-8">
          <legend className="px-2 text-sm font-semibold">{m.transparency}</legend>
          <label className="flex min-h-11 items-center gap-3 font-semibold"><input type="checkbox" className="h-5 w-5" checked={content.is_sponsored} onChange={e => update('is_sponsored', e.target.checked)} />{m.sponsoredToggle}</label>
          {content.is_sponsored && <TextArea id="post-disclosure" label={m.disclosureLabel} value={content.disclosure} maxLength={300} hint={m.disclosureHint} onChange={e => update('disclosure', e.target.value)} />}
        </fieldset>
        <FormAlert message={error ? errors[error] ?? errors.generic : null} />
        {!isPublic && <p className="text-sm text-ink-muted">{m.privateProfileHint} <Link className="inline-flex min-h-11 items-center text-link underline" href="/app/creator/profile">{m.editProfile}</Link></p>}
        <div className="sticky bottom-0 z-10 flex flex-wrap gap-3 border-t border-line bg-surface py-4">
          {status !== 'published' && <button type="button" className={button} disabled={pending || !active} onClick={() => { void persist(status); }}>{m.saveDraft}</button>}
          <button type="submit" className={`${button} border-transparent bg-brand text-brand-text`} disabled={pending || !active}>{m.reviewPublish}</button>
          {status === 'published' && <button type="button" className={button} disabled={pending || !active} onClick={() => { if (window.confirm(m.hideConfirm)) void persist('hidden'); }}>{m.hide}</button>}
        </div>
      </form>
      <aside className="min-w-0 space-y-4 lg:sticky lg:top-6" aria-label={m.preview}>
        <div className="flex flex-wrap items-center justify-between gap-3"><h2 className="text-lg font-semibold">{m.preview}</h2><div className="flex gap-2">{(['mobile', 'desktop'] as const).map(size => <button type="button" key={size} aria-pressed={previewWidth === size} className={`${button} ${previewWidth === size ? 'bg-subtle' : ''}`} onClick={() => setPreviewWidth(size)}>{m[size]}</button>)}</div></div>
        <div className={previewWidth === 'mobile' ? 'mx-auto w-full max-w-sm' : 'w-full'}><PostCard content={previewContent} name={name} labels={m} /></div>
        <p className="text-sm text-ink-muted">{m.previewHint}</p>
        {status === 'published' && publicPath && <Link href={publicPath} target="_blank" className="inline-flex min-h-11 items-center text-link underline">{m.viewPublic} ↗</Link>}
      </aside>
    </div>
    <dialog ref={review} aria-labelledby="post-review-title" className="max-h-[90dvh] w-[calc(100%-2rem)] max-w-2xl overflow-y-auto rounded-xl bg-surface p-5 backdrop:bg-black/40 sm:p-8">
      <h2 id="post-review-title" className="mb-3 font-serif text-3xl">{m.reviewTitle}</h2><p className="mb-5 text-ink-muted">{m.reviewHint}</p>
      <PostCard content={previewContent} name={name} labels={m} />
      <FormAlert message={error ? errors[error] ?? errors.generic : null} />
      <div className="mt-5 flex flex-wrap gap-3"><button type="button" className={button} disabled={pending} onClick={() => review.current?.close()}>{m.backEdit}</button><button type="button" className={`${button} bg-brand text-brand-text`} disabled={pending} onClick={async () => { if (await persist('published')) review.current?.close(); }}>{pending ? m.saving : m.confirmPublish}</button></div>
    </dialog>
  </>;
}
