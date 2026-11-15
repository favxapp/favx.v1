export const SOCIAL_NETWORKS = [
  { id: 'instagram', label: 'Instagram', hosts: ['instagram.com'] },
  { id: 'tiktok', label: 'TikTok', hosts: ['tiktok.com'] },
  { id: 'youtube', label: 'YouTube', hosts: ['youtube.com', 'youtu.be'] },
  { id: 'facebook', label: 'Facebook', hosts: ['facebook.com', 'fb.com'] },
  { id: 'threads', label: 'Threads', hosts: ['threads.net', 'threads.com'] },
  { id: 'x', label: 'X', hosts: ['x.com', 'twitter.com'] },
  { id: 'bluesky', label: 'Bluesky', hosts: ['bsky.app'] },
  { id: 'linkedin', label: 'LinkedIn', hosts: ['linkedin.com'] },
  { id: 'pinterest', label: 'Pinterest', hosts: ['pinterest.com', 'pinterest.com.br', 'pin.it'] },
  { id: 'twitch', label: 'Twitch', hosts: ['twitch.tv'] },
  { id: 'discord', label: 'Discord', hosts: ['discord.com', 'discord.gg'] },
  { id: 'telegram', label: 'Telegram', hosts: ['t.me', 'telegram.me'] },
  { id: 'whatsapp', label: 'WhatsApp', hosts: ['wa.me', 'whatsapp.com'] },
  { id: 'snapchat', label: 'Snapchat', hosts: ['snapchat.com'] },
  { id: 'spotify', label: 'Spotify', hosts: ['spotify.com'] },
] as const;
export type SocialId = typeof SOCIAL_NETWORKS[number]['id'];
export type SocialLink = { network: SocialId; url: string };

export function parseSocialLinks(raw: unknown): { ok: true; value: SocialLink[] } | { ok: false; error: 'social_invalid' } {
  try {
    const entries: unknown = typeof raw === 'string' ? JSON.parse(raw) : raw;
    if (!Array.isArray(entries) || entries.length > SOCIAL_NETWORKS.length) throw Error();
    const used = new Set<string>();
    const value = entries.map((entry: unknown): SocialLink => {
      if (!entry || typeof entry !== 'object' || !('network' in entry) || !('url' in entry) || typeof entry.url !== 'string') throw Error();
      const network = SOCIAL_NETWORKS.find(n => n.id === entry.network);
      if (!network || used.has(network.id) || entry.url.length > 2048 || /[\s\\]/.test(entry.url)) throw Error();
      const url = new URL(entry.url);
      if (url.protocol !== 'https:' || url.username || url.password || url.port || !network.hosts.some(host => url.hostname === host || url.hostname.endsWith(`.${host}`))) throw Error();
      used.add(network.id);
      return { network: network.id, url: url.href };
    });
    return { ok: true, value };
  } catch { return { ok: false, error: 'social_invalid' }; }
}
