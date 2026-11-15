'use client';

import { useActionState } from 'react';
import { Field, FormAlert, SubmitButton } from '@/components/form';
import { activateCreatorAction, type ActivateState } from './actions';
import { UsernameField } from '@/components/creator/UsernameField';
import type { Messages } from '@/lib/i18n/messages';

type Labels = { usernameLabel: string; usernameHint: string; displayNameLabel: string; submit: string; errors: Record<string, string>; creator: Messages['creator'] };
const initial: ActivateState = { error: null, username: '', displayName: '' };

export default function ActivateForm({ labels }: { labels: Labels }) {
  const [state, action] = useActionState(activateCreatorAction, initial);
  const code = state.error;
  const usernameError = code && code.startsWith('username_') ? (labels.errors[code] ?? labels.errors.generic) : null;
  const otherError = code && !code.startsWith('username_') ? (labels.errors[code] ?? labels.errors.generic) : null;
  return (
    <form action={action} className="space-y-5">
      <p className="text-sm text-ink-muted">{labels.creator.requiredNote}</p>
      <UsernameField label={labels.usernameLabel} hint={labels.usernameHint} labels={labels.creator} errors={labels.errors} serverError={usernameError} />
      <Field id="displayName" name="displayName" label={`${labels.displayNameLabel} *`} defaultValue={state.displayName} maxLength={80} autoComplete="name" error={code?.startsWith('display_name_') ? otherError : null} required />
      <FormAlert message={otherError} />
      <SubmitButton>{labels.creator.nextStep}</SubmitButton>
    </form>
  );
}
