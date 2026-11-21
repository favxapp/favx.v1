'use client';

import { useId, useState } from 'react';
import type { Messages } from '@/lib/i18n/messages';

export function ShareProfile({ url, title, labels, compact = false }: { url: string; title: string; labels: Messages['creator']; compact?: boolean }) {
  const id = useId();
  const [message, setMessage] = useState('');
  async function copy() {
    try { await navigator.clipboard.writeText(url); setMessage(labels.copied); }
    catch { setMessage(labels.copyManually); }
  }
  async function share() {
    if (!navigator.share) { await copy(); return; }
    try { await navigator.share({ url, title }); }
    catch (e) { if (!(e instanceof Error && e.name === 'AbortError')) setMessage(labels.copyManually); }
  }
  return <div className="space-y-3">
    {(!compact || message === labels.copyManually) && <><label htmlFor={id} className="block text-sm font-semibold">{labels.profileLink}</label>
    <input id={id} value={url} readOnly onFocus={e => e.target.select()} className="min-h-11 w-full rounded-md border border-line bg-surface px-3 text-sm" /></>}
    <div className="flex flex-wrap gap-3">
      <button type="button" onClick={share} className="button-primary">{labels.share}</button>
      <button type="button" onClick={copy} className="button-secondary">{labels.copy}</button>
    </div>
    <p role="status" className="text-sm text-ink-muted">{message}</p>
  </div>;
}
