'use client';

import { useActionState } from 'react';
import { Field, FormAlert, SubmitButton, TextArea } from '@/components/form';
import { updateProfileAction, type ProfileState } from './actions';

type Props = {
  labels: {
    usernameLabel: string;
    usernameLocked: string;
    displayNameLabel: string;
    bioLabel: string;
    bioHint: string;
    localeLabel: string;
    timezoneLabel: string;
    submit: string;
    saved: string;
    publicPageSoon: string;
    errors: Record<string, string>;
  };
  values: { username: string; displayName: string; bio: string; locale: string; timezone: string };
  localeOptions: { value: string; label: string }[];
  timezones: string[];
};

const initial: ProfileState = { error: null, saved: false };
const selectClass = 'block w-full min-h-[44px] rounded-md border border-field bg-surface px-3 py-2 text-base text-ink-strong';

export default function ProfileForm({ labels, values, localeOptions, timezones }: Props) {
  const [state, action] = useActionState(updateProfileAction, initial);
  const err = state.error ? (labels.errors[state.error] ?? labels.errors.generic) : null;
  return (
    <form action={action} className="space-y-5" noValidate>
      <Field id="username" label={labels.usernameLabel} hint={labels.usernameLocked} value={`@${values.username}`} readOnly />
      <Field id="displayName" name="displayName" label={labels.displayNameLabel} defaultValue={values.displayName} maxLength={80} required />
      <TextArea id="bio" name="bio" label={labels.bioLabel} hint={labels.bioHint} defaultValue={values.bio} maxLength={500} />
      <div className="space-y-1.5">
        <label htmlFor="locale" className="block text-sm font-semibold text-ink-strong">
          {labels.localeLabel}
        </label>
        <select id="locale" name="locale" defaultValue={values.locale} className={selectClass}>
          {localeOptions.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>
      <div className="space-y-1.5">
        <label htmlFor="timezone" className="block text-sm font-semibold text-ink-strong">
          {labels.timezoneLabel}
        </label>
        <select id="timezone" name="timezone" defaultValue={values.timezone} className={selectClass}>
          {timezones.map((tz) => (
            <option key={tz} value={tz}>
              {tz}
            </option>
          ))}
        </select>
      </div>
      <FormAlert message={err} />
      <FormAlert message={state.saved ? labels.saved : null} tone="success" />
      <SubmitButton>{labels.submit}</SubmitButton>
      <p className="text-sm text-ink-muted">{labels.publicPageSoon}</p>
    </form>
  );
}
