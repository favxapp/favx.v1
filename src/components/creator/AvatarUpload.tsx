'use client';

import { useRef, useState } from 'react';
import type { Messages } from '@/lib/i18n/messages';

export function AvatarUpload({ photo, onChange, labels, errors }: { photo: string | null; onChange: (url: string) => void; labels: Messages['creator']; errors: Record<string, string> }) {
  const input = useRef<HTMLInputElement>(null);
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState('');
  async function upload(file?: File) {
    if (!file) return;
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type) || file.size > 2 * 1024 * 1024) { setMessage(errors.avatar_invalid); return; }
    setPending(true); setMessage('');
    try {
      const body = new FormData(); body.set('photo', file);
      const response = await fetch('/api/creator/avatar', { method: 'POST', body });
      const result = await response.json();
      if (!response.ok) { setMessage(errors[result.error] ?? errors.avatar_failed); return; }
      onChange(result.url); setMessage(labels.photoSaved);
    } catch { setMessage(errors.avatar_failed); }
    finally { setPending(false); if (input.current) input.current.value = ''; }
  }
  return <section className="space-y-3" aria-labelledby="photo-label">
    <h2 id="photo-label" className="text-lg font-semibold">{labels.photo}</h2>
    <div className="flex items-center gap-4">
      {photo ? <img src={photo} alt="" width={80} height={80} className="h-20 w-20 rounded-full object-cover" /> : <div aria-hidden="true" className="flex h-20 w-20 items-center justify-center rounded-full bg-soft font-serif text-3xl">F</div>}
      <label className={`inline-flex min-h-11 cursor-pointer items-center rounded-md border border-line px-4 text-sm focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 ${pending ? 'opacity-60' : ''}`}>
        {pending ? labels.uploading : labels.uploadPhoto}
        <input ref={input} type="file" className="sr-only" accept="image/jpeg,image/png,image/webp" disabled={pending} onChange={e => { void upload(e.target.files?.[0]); }} />
      </label>
    </div>
    <p className="text-sm text-ink-muted">{labels.photoHint}</p>
    <p role="status" className="text-sm text-ink-muted">{message}</p>
  </section>;
}
