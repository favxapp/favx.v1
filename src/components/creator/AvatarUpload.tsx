'use client';

import { useEffect, useRef, useState } from 'react';
import type { Messages } from '@/lib/i18n/messages';

export function AvatarUpload({ photo, onChange, labels, errors }: { photo: string | null; onChange: (url: string) => void; labels: Messages['creator']; errors: Record<string, string> }) {
  const input = useRef<HTMLInputElement>(null);
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState('');
  const [preview, setPreview] = useState<string | null>(null);
  const [filename, setFilename] = useState('');
  useEffect(() => () => { if (preview) URL.revokeObjectURL(preview); }, [preview]);
  async function upload(file?: File) {
    if (!file || pending) return;
    setFilename(file.name);
    if (input.current) input.current.value = '';
    if ((file.type && !['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) || file.size > 2 * 1024 * 1024) { setMessage(errors.avatar_invalid); return; }
    setPending(true); setMessage(labels.uploading); setPreview(URL.createObjectURL(file));
    try {
      const body = new FormData(); body.set('photo', file);
      const response = await fetch('/api/creator/avatar', { method: 'POST', body, signal: AbortSignal.timeout(30000) });
      const result = await response.json();
      if (!response.ok) { setMessage(errors[result.error] ?? errors.avatar_failed); return; }
      if (typeof result.url !== 'string' || !result.url.startsWith('https://')) throw Error();
      onChange(result.url); setMessage(labels.photoSaved);
    } catch { setMessage(errors.avatar_failed); }
    finally { setPending(false); setPreview(null); }
  }
  return <section aria-busy={pending} className="space-y-3" aria-labelledby="photo-label">
    <h2 id="photo-label" className="text-lg font-semibold">{labels.photo}</h2>
    <div className="flex items-center gap-4">
      {(preview || photo) ? <img key={preview || photo} src={preview || photo!} onError={() => { if (!pending) setMessage(errors.avatar_display_failed); }} alt="" width={80} height={80} className="h-20 w-20 rounded-full object-cover" /> : <div aria-hidden="true" className="flex h-20 w-20 items-center justify-center rounded-full bg-soft font-serif text-3xl">F</div>}
      <button type="button" disabled={pending} onClick={() => input.current?.click()} className="inline-flex min-h-11 items-center rounded-md border border-field px-4 text-sm disabled:opacity-60">
        {pending ? labels.uploading : labels.uploadPhoto}
      </button>
      <input ref={input} type="file" className="sr-only" aria-label={labels.uploadPhoto} accept="image/jpeg,image/png,image/webp" disabled={pending} onChange={e => { void upload(e.target.files?.[0]); }} />
    </div>
    <p className="text-sm text-ink-muted">{labels.photoHint}</p>
    <p className="break-all text-xs text-ink-muted">{filename}</p>
    <p role="status" aria-live="polite" className={message ? "rounded-md bg-soft p-3 text-sm font-semibold text-ink" : "sr-only"}>{message}</p>
  </section>;
}
