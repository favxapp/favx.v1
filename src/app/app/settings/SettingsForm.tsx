'use client';
import { useActionState } from 'react';
import { saveSettings } from './actions';
import { FormAlert, SubmitButton } from '@/components/form';
import type { Messages } from '@/lib/i18n/messages';
export function SettingsForm({ locale, timezone, locales, zones, m }: { locale: string; timezone: string; locales: { value: string; label: string }[]; zones: string[]; m: Messages }) {
  const [state, action] = useActionState(saveSettings, { error: null, saved: false });
  const control = 'mt-2 min-h-12 w-full rounded-xl border border-field px-4 text-sm';
  return <form action={action} className="space-y-6"><div><label htmlFor="locale" className="text-sm font-semibold">{m.workspace.language}</label><select id="locale" name="locale" defaultValue={locale} className={control}>{locales.map(l => <option key={l.value} value={l.value}>{l.label}</option>)}</select></div><div><label htmlFor="timezone" className="text-sm font-semibold">{m.workspace.timezone}</label><select id="timezone" name="timezone" defaultValue={timezone} className={control}>{zones.map(z => <option key={z}>{z}</option>)}</select></div><FormAlert message={state.error ? (m.errors as Record<string,string>)[state.error] || m.errors.generic : null} /><FormAlert message={state.saved ? m.workspace.saved : null} tone="success" /><SubmitButton>{m.workspace.save}</SubmitButton></form>;
}
