'use client';
import { useRef, useState } from 'react';
import type { PostContent } from '@/lib/posts/model';
import { validSuggestion, type EditorialSuggestion } from '@/lib/ai/editor';
import type { Messages } from '@/lib/i18n/messages';
import { Icon } from '@/components/ui/Icon';
import { FormAlert } from '@/components/form';
export function EditorialAssistant({ content, onApply, labels: m, errors, disabled }: { content: PostContent; onApply: (key: 'title' | 'body' | 'tags' | 'categories', value: string | string[]) => void; labels: Messages['editor']; errors: Record<string,string>; disabled: boolean }) {
  const [suggestion, setSuggestion] = useState<EditorialSuggestion | null>(null);
  const [pending, setPending] = useState(false); const busy = useRef(false);
  const [error, setError] = useState<string | null>(null);
  async function generate() {
    if (busy.current || disabled) return; busy.current = true; setPending(true); setError(null); setSuggestion(null);
    try {
      const response = await fetch('/api/creator/assistant', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ title: content.title, body: content.body, tags: content.tags, categories: content.categories ?? [] }), signal: AbortSignal.timeout(55000) });
      const result = await response.json();
      if (!response.ok) { setError(errors[result.error] || m.aiFailed); return; }
      if (!validSuggestion(result.suggestion)) throw Error();
      setSuggestion(result.suggestion);
    } catch { setError(m.aiFailed); } finally { busy.current = false; setPending(false); }
  }
  return <section className="rounded-xl border border-white bg-white/80 p-5" aria-busy={pending}>
    <h2 className="flex items-center gap-2 text-sm font-bold"><Icon name="sparkles" />{m.assistant}</h2><p className="my-3 text-xs leading-relaxed text-ink-muted">{m.assistantIntro}</p>
    <button type="button" disabled={disabled || pending || !(content.title.trim() || content.body.trim())} className="button-secondary w-full disabled:opacity-50" onClick={() => { void generate(); }}>{pending ? m.generating : m.generate}</button>
    <div className="mt-3" role="status" aria-live="polite">{pending && <p className="text-sm">{m.generating}</p>}</div><FormAlert message={error} />
    {suggestion && <div className="mt-5 space-y-4"><p className="text-xs leading-relaxed text-ink-muted">{suggestion.explanation}</p>{([{ key: 'title', label: m.applyTitle }, { key: 'body', label: m.applyBody }, { key: 'tags', label: m.applyTags }, { key: 'categories', label: m.applyCategories }] as const).map(({ key, label }) => <div key={key} className="rounded-lg bg-soft p-4"><p className="max-h-56 overflow-y-auto whitespace-pre-wrap break-words text-sm">{Array.isArray(suggestion[key]) ? (suggestion[key] as string[]).join(', ') : suggestion[key]}</p><button type="button" disabled={disabled} className="mt-2 min-h-11 text-xs font-semibold underline underline-offset-4" onClick={() => onApply(key, suggestion[key])}>{label}</button></div>)}<button type="button" className="min-h-11 text-sm underline" onClick={() => setSuggestion(null)}>{m.dismiss}</button></div>}
  </section>;
}
