'use client';

import { useActionState } from 'react';
import { Field, FormAlert, SubmitButton } from '@/components/form';
import { activateCreatorAction, type ActivateState } from './actions';

type Labels = { usernameLabel: string; usernameHint: string; displayNameLabel: string; submit: string; errors: Record<string, string> };
const initial: ActivateState = { error: null, username: '', displayName: '' };

export default function ActivateForm({ labels }: { labels: Labels }) {
  const [state, action] = useActionState(activateCreatorAction, initial);
  const code = state.error;
  const usernameError = code && code.startsWith('username_') ? (labels.errors[code] ?? labels.errors.generic) : null;
  const otherError = code && !code.startsWith('username_') ? (labels.errors[code] ?? labels.errors.generic) : null;
  return (
    <form action={action} className="space-y-5" noValidate>
      <Field id="username" name="username" label={labels.usernameLabel} hint={labels.usernameHint} error={usernameError} defaultValue={state.username} autoCapitalize="none" autoCorrect="off" spellCheck={false} autoComplete="username" required />
      <Field id="displayName" name="displayName" label={labels.displayNameLabel} defaultValue={state.displayName} maxLength={80} autoComplete="name" required />
      <FormAlert message={otherError} />
      <SubmitButton>{labels.submit}</SubmitButton>
    </form>
  );
}
