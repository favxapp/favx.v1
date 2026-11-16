'use client';

import { useEffect, useRef, useState } from 'react';
import { MAX_AVATAR_ORIGINAL_BYTES, optimizeAvatar } from '@/lib/creator/avatar-client';
import type { Messages } from '@/lib/i18n/messages';

type UploadState = { phase: 'idle' | 'sending' | 'saved' | 'error'; error?: string };
export function AvatarUpload({ photo, onChange, labels, errors }: { photo: string | null; onChange: (url: string) => void; labels: Messages['creator']; errors: Record<string, string> }) {
  const input = useRef<HTMLInputElement>(null);
  const inFlight = useRef(false);
  const [state, setState] = useState<UploadState>({ phase: 'idle' });
  const [preview, setPreview] = useState<string | null>(null);
  const [filename, setFilename] = useState('');
  const pending = state.phase === 'sending';
  useEffect(() => () => { if (preview) URL.revokeObjectURL(preview); }, [preview]);
  async function upload(file?: File) {
    if (!file || inFlight.current) return;
    inFlight.current = true;
    setState({ phase: 'sending' });
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30000);
    try {
      setFilename(`${file.name} · ${(file.size / 1024 / 1024).toFixed(2)} MB`);
      if ((file.type && !['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) || !file.size || file.size > MAX_AVATAR_ORIGINAL_BYTES) {
        setState({ phase: 'error', error: 'avatar_invalid' }); return;
      }
      // A preview is optional; failure to create it must not prevent the actual upload.
      try { setPreview(URL.createObjectURL(file)); } catch { setPreview(null); }
      let optimized: Blob;
      try { optimized = await optimizeAvatar(file); } catch { setState({ phase: 'error', error: 'avatar_invalid' }); return; }
      const body = new FormData(); body.set('photo', optimized, 'avatar.webp');
      const response = await fetch('/api/creator/avatar', { method: 'POST', body, signal: controller.signal });
      const result = await response.json();
      if (!response.ok) { setState({ phase: 'error', error: typeof result.error === 'string' ? result.error : 'avatar_failed' }); return; }
      if (typeof result.url !== 'string' || !(result.url.startsWith('/api/media/avatar/') || result.url.startsWith('https://'))) throw Error();
      onChange(result.url); setState({ phase: 'saved' });
    } catch { setState({ phase: 'error', error: 'avatar_failed' }); }
    finally {
      clearTimeout(timeout); inFlight.current = false; setPreview(null);
      if (input.current) input.current.value = '';
    }
  }
  const message = state.phase === 'sending' ? labels.uploading : state.phase === 'saved' ? labels.photoSaved : state.phase === 'error' ? errors[state.error ?? 'avatar_failed'] || errors.generic : labels.photoHint;
  return <section aria-busy={pending} className="space-y-3" aria-labelledby="photo-label">
    <h2 id="photo-label" className="text-lg font-semibold">{labels.photo}</h2>
    <div className="flex items-center gap-4">
      {(preview || photo) ? <img key={preview || photo} src={preview || photo!} onError={() => { if (!inFlight.current) setState({ phase: 'error', error: 'avatar_display_failed' }); }} alt="" width={80} height={80} className="h-20 w-20 shrink-0 rounded-full object-cover" /> : <div aria-hidden="true" className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-soft font-serif text-3xl">F</div>}
      <button type="button" disabled={pending} onClick={() => input.current?.click()} className="inline-flex min-h-11 items-center rounded-md border border-field px-4 text-sm disabled:opacity-60">
        {pending ? labels.uploading : labels.uploadPhoto}
      </button>
      <input ref={input} type="file" className="sr-only" aria-label={labels.uploadPhoto} accept="image/jpeg,image/png,image/webp" disabled={pending} onChange={e => { void upload(e.target.files?.[0]); }} />
    </div>
    <p className="break-all text-xs text-ink-muted">{filename}</p>
    <div role="status" aria-live="polite" aria-atomic="true" className={`rounded-md border p-3 text-sm ${state.phase === 'error' ? 'border-danger-border bg-danger-bg text-danger-text' : state.phase === 'saved' ? 'border-success-border bg-success-bg text-success-text' : 'border-line bg-soft text-ink'}`}>{message}</div>
  </section>;
}
