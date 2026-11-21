'use client';

import Link from 'next/link';
import { useActionState, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Field, FormAlert, SubmitButton, TextArea } from '@/components/form';
import { AvatarUpload } from '@/components/creator/AvatarUpload';
import { SocialEditor } from '@/components/creator/SocialEditor';
import { ProfileCard } from '@/components/creator/ProfileCard';
import { ShareProfile } from '@/components/creator/ShareProfile';
import { parseSocialLinks, type SocialLink } from '@/lib/creator/social';
import type { Messages } from '@/lib/i18n/messages';
import { updateProfileAction, type ProfileState } from './actions';

type Props = {
  labels: Messages['profile']; creatorLabels: Messages['creator']; errors: Record<string, string>;
  values: { username: string; displayName: string; bio: string; locale: string; timezone: string; photo: string | null; socialLinks: SocialLink[]; isPublic: boolean };
  publicUrl: string; localeOptions: { value: string; label: string }[]; timezones: string[];
};
const initial: ProfileState = { error: null, saved: false };
const selectClass = 'block w-full min-h-[44px] rounded-md border border-field bg-surface px-3 py-2 text-base text-ink-strong';

export default function ProfileForm({ labels, creatorLabels: c, errors, values, publicUrl, localeOptions, timezones }: Props) {
  const [state, action] = useActionState(updateProfileAction, initial);
  const [name, setName] = useState(values.displayName);
  const [bio, setBio] = useState(values.bio);
  const [photo, setPhoto] = useState(values.photo);
  const [links, setLinks] = useState(values.socialLinks);
  const router = useRouter();
  useEffect(() => { if (state.saved) router.refresh(); }, [state, router]);
  const err = state.error ? errors[state.error] ?? errors.generic : null;
  const validLinks = parseSocialLinks(links.filter(link => link.url));
  return <div className="grid items-start gap-8 lg:grid-cols-2">
    <div className="space-y-8 rounded-xl border border-line bg-surface p-5 sm:p-8">
      <AvatarUpload photo={photo} onChange={setPhoto} labels={c} errors={errors} />
      <form action={action} className="space-y-5">
        <p className="text-sm text-ink-muted">{c.requiredNote}</p>
        <Field id="username" label={labels.usernameLabel} hint={labels.usernameLocked} value={`@${values.username}`} readOnly />
        <Field id="displayName" name="displayName" label={`${labels.displayNameLabel} *`} value={name} onChange={e => setName(e.target.value)} maxLength={80} error={state.error?.startsWith('display_name_') ? err : null} required />
        <TextArea id="bio" name="bio" label={labels.bioLabel} hint={labels.bioHint} value={bio} onChange={e => setBio(e.target.value)} maxLength={500} error={state.error === 'bio_too_long' ? err : null} />
        <SocialEditor links={links} onChange={setLinks} labels={c} error={state.error === 'social_invalid' ? err : null} />
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5"><label htmlFor="locale" className="block text-sm font-semibold">{labels.localeLabel} *</label><select id="locale" name="locale" defaultValue={values.locale} className={selectClass} required>{localeOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}</select></div>
          <div className="min-w-0 space-y-1.5"><label htmlFor="timezone" className="block text-sm font-semibold">{labels.timezoneLabel} *</label><select id="timezone" name="timezone" defaultValue={values.timezone} className={selectClass} required>{timezones.map(tz => <option key={tz} value={tz}>{tz}</option>)}</select></div>
        </div>
        <div className="rounded-lg border border-line bg-soft p-4">
          <label className="flex min-h-11 items-center gap-3 font-semibold"><input type="checkbox" name="isPublic" defaultChecked={values.isPublic} className="h-5 w-5" />{c.publish}</label>
          <p className="text-sm text-ink-muted">{c.publicHint}</p>
        </div>
        <FormAlert message={err} /><FormAlert message={state.saved ? labels.saved : null} tone="success" />
        <SubmitButton>{labels.submit}</SubmitButton>
      </form>
    </div>
    <aside className="space-y-5 lg:sticky lg:top-6">
      <h2 className="text-lg font-semibold">{c.preview}</h2>
      <div className="profile-preview"><ProfileCard name={name} username={values.username} bio={bio} photo={photo} links={validLinks.ok ? validLinks.value : []} /></div>
      {values.isPublic ? <>
        <Link href={`/${values.username}`} target="_blank" rel="noopener" className="inline-flex min-h-11 items-center font-semibold text-link underline">{c.viewPublic} ↗</Link>
        <ShareProfile url={publicUrl} title={values.displayName} labels={c} />
      </> : <p className="rounded-md bg-soft p-4 text-sm text-ink-muted">{c.privateHint}</p>}
    </aside>
  </div>;
}
