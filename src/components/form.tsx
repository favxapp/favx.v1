'use client';

import { useFormStatus } from 'react-dom';
import type { InputHTMLAttributes, TextareaHTMLAttributes, ReactNode } from 'react';

export function SubmitButton({ children, pendingLabel }: { children: ReactNode; pendingLabel?: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      aria-disabled={pending}
      className="inline-flex min-h-[44px] w-full items-center justify-center rounded-md bg-brand px-5 py-2 text-base font-semibold text-brand-text transition-colors hover:bg-brand-hover disabled:opacity-60 sm:w-auto"
    >
      {pending && pendingLabel ? pendingLabel : children}
    </button>
  );
}

const fieldClass =
  'block w-full min-h-[44px] rounded-md border border-field bg-surface px-3 py-2 text-base text-ink-strong placeholder:text-ink-muted';

export function Field({
  id,
  label,
  hint,
  error,
  ...props
}: { id: string; label: string; hint?: string; error?: string | null } & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-sm font-semibold text-ink-strong">
        {label}
      </label>
      <input id={id} aria-describedby={`${id}-hint${error ? ` ${id}-error` : ''}`} aria-invalid={error ? true : undefined} className={fieldClass} {...props} />
      {hint ? (
        <p id={`${id}-hint`} className="text-sm text-ink-muted">
          {hint}
        </p>
      ) : (
        <span id={`${id}-hint`} />
      )}
      {error ? (
        <p id={`${id}-error`} className="text-sm text-danger-text">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function TextArea({
  id,
  label,
  hint,
  error,
  ...props
}: { id: string; label: string; hint?: string; error?: string | null } & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-sm font-semibold text-ink-strong">
        {label}
      </label>
      <textarea id={id} aria-describedby={`${id}-hint`} aria-invalid={error ? true : undefined} className={`${fieldClass} min-h-[120px]`} {...props} />
      {hint ? (
        <p id={`${id}-hint`} className="text-sm text-ink-muted">
          {hint}
        </p>
      ) : (
        <span id={`${id}-hint`} />
      )}
      {error ? <p className="text-sm text-danger-text">{error}</p> : null}
    </div>
  );
}

export function FormAlert({ message, tone = 'danger' }: { message: string | null; tone?: 'danger' | 'success' }) {
  // região sempre presente para leitores de tela anunciarem mudanças
  const toneClass = tone === 'danger' ? 'border-danger-border bg-danger-bg text-danger-text' : 'border-success-border bg-success-bg text-success-text';
  return (
    <div aria-live="polite" role={message && tone === 'danger' ? 'alert' : undefined}>
      {message ? <p className={`rounded-md border px-3 py-2 text-sm ${toneClass}`}>{message}</p> : null}
    </div>
  );
}
