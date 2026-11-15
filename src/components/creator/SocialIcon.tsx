import paths from '@/lib/creator/social-icons.json';
import type { SocialId } from '@/lib/creator/social';

export function SocialIcon({ network }: { network: SocialId }) {
  return <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden="true" focusable="false"><path d={paths[network]} /></svg>;
}
