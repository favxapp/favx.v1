'use client';

import { useActionState } from 'react';
import { Field, FormAlert, SubmitButton } from '@/components/form';
import { requestOtpAction, verifyOtpAction, type LoginState } from './actions';

type Labels = {
  title: string;
  intro: string;
  emailLabel: string;
  sendCode: string;
  codeTitle: string;
  sentTo: string;
  codeLabel: string;
  verify: string;
  changeEmail: string;
  errors: Record<string, string>;
};

const initial: LoginState = { step: 'email', email: '', error: null };

export default function LoginForm({ labels, next, locale }: { labels: Labels; next: string; locale: string }) {
  const [reqState, reqAction] = useActionState(requestOtpAction, initial);
  const [verState, verAction] = useActionState(verifyOtpAction, initial);

  const message = (code: string | null) => (code ? (labels.errors[code] ?? labels.errors.generic) : null);

  // Etapa do código: aberta quando o pedido de código teve sucesso; erros de verificação aparecem aqui.
  if (reqState.step === 'code') {
    return (
      <form action={verAction} className="space-y-5" noValidate>
        <h1 className="text-2xl font-bold text-ink-strong">{labels.codeTitle}</h1>
        <p className="text-ink-muted">{labels.sentTo.replace('{email}', reqState.email)}</p>
        <input type="hidden" name="email" value={reqState.email} />
        <input type="hidden" name="next" value={next} />
        <input type="hidden" name="locale" value={locale} />
        <Field id="token" name="token" label={labels.codeLabel} inputMode="numeric" autoComplete="one-time-code" maxLength={10} required autoFocus />
        <FormAlert message={message(verState.error)} />
        <div className="flex flex-wrap items-center gap-4">
          <SubmitButton>{labels.verify}</SubmitButton>
          <a href="" className="text-sm font-semibold text-link underline underline-offset-4">
            {labels.changeEmail}
          </a>
        </div>
      </form>
    );
  }

  return (
    <form action={reqAction} className="space-y-5" noValidate>
      <h1 className="text-2xl font-bold text-ink-strong">{labels.title}</h1>
      <p className="text-ink-muted">{labels.intro}</p>
      <Field id="email" name="email" type="email" label={labels.emailLabel} autoComplete="email" inputMode="email" defaultValue={reqState.email} required />
      <FormAlert message={message(reqState.error)} />
      <SubmitButton>{labels.sendCode}</SubmitButton>
    </form>
  );
}
