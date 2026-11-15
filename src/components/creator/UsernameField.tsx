'use client';

import { useEffect, useState } from 'react';
import { Field } from '@/components/form';
import { normalizeUsername, usernameProblem } from '@/lib/username';
import type { Messages } from '@/lib/i18n/messages';

export function UsernameField({ label, hint, labels, errors, serverError }: { label: string; hint: string; labels: Messages['creator']; errors: Record<string, string>; serverError?: string | null }) {
  const [value, setValue] = useState('');
  const [status, setStatus] = useState('idle');
  const [problem, setProblem] = useState<string | null>(null);
  useEffect(() => {
    const username = normalizeUsername(value);
    if (!username) { setStatus('idle'); setProblem(null); return; }
    const local = usernameProblem(username);
    if (local) { setStatus('invalid'); setProblem(errors[`username_${local}`]); return; }
    let active = true;
    const controller = new AbortController();
    setStatus('checking'); setProblem(null);
    const timer = setTimeout(async () => {
      try {
        const response = await fetch(`/api/creator/username?username=${encodeURIComponent(username)}`, { signal: controller.signal, cache: 'no-store' });
        if (!response.ok) throw Error();
        const data = await response.json();
        if (active) { setStatus(data.available === true ? 'available' : 'invalid'); setProblem(data.available === true ? null : errors[`username_${data.problem}`] ?? labels.unavailable); }
      } catch { if (active) { setStatus('error'); setProblem(labels.checkFailed); } }
    }, 350);
    return () => { active = false; controller.abort(); clearTimeout(timer); };
  }, [value, errors, labels]);
  const invalid = status === 'invalid';
  return <div className="space-y-2">
    <Field id="username" name="username" label={`${label} *`} hint={hint} error={problem ?? serverError} value={value} onChange={e => { setValue(e.target.value); setStatus('checking'); }} autoCapitalize="none" autoCorrect="off" spellCheck={false} autoComplete="username" maxLength={30} required />
    <div role="status" aria-live="polite" className={`flex min-h-6 items-center gap-2 text-sm ${status === 'available' ? 'text-success-text' : 'text-ink-muted'}`}>
      {(status === 'available' || invalid) && <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d={invalid ? 'm6 6 12 12M18 6 6 18' : 'm5 12 4 4L19 6'} /></svg>}
      {status === 'available' ? labels.available : status === 'checking' && value ? labels.checking : invalid ? labels.unavailable : ''}
    </div>
  </div>;
}
