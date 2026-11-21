import { randomUUID } from 'node:crypto';
import { PostEditor } from '@/components/posts/PostEditor';
import { requireCreator } from '@/lib/posts/server';
import { EMPTY_POST } from '@/lib/posts/model';
import { getRequestLocale } from '@/lib/i18n/server';
import { getMessages } from '@/lib/i18n/messages';
export default async function NewPostPage() {
  const { creator, active } = await requireCreator();
  const m = getMessages(await getRequestLocale());
  return <main id="main" className="mx-auto max-w-content px-4 py-8 sm:px-6"><PostEditor id={randomUUID()} initial={EMPTY_POST} username={creator.username} name={creator.display_name} isPublic={creator.is_public} active={active} labels={m.posts} editorLabels={m.editor} mediaLabels={m.media} errors={m.errors} /></main>;
}
