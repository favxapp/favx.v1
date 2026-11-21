export type EditorialSuggestion = { title: string; body: string; tags: string[]; categories: string[]; explanation: string };
const shortList = (value: unknown, max: number): value is string[] => Array.isArray(value) && value.length <= max && value.every(v => typeof v === 'string' && v.trim().length > 0 && Array.from(v).length <= 30 && !/[<>]/.test(v));
export function validSuggestion(value: unknown): value is EditorialSuggestion {
  if (!value || typeof value !== 'object') return false;
  const x = value as Record<string, unknown>;
  return typeof x.title === 'string' && Array.from(x.title).length <= 160 && typeof x.body === 'string' && Array.from(x.body).length <= 10000 && shortList(x.tags, 20) && shortList(x.categories, 5) && typeof x.explanation === 'string' && x.explanation.length <= 1200;
}
/** Explicit allowlist: private Context, links, identity and credentials can never enter the prompt. */
export function editorialInput(value: unknown): { title: string; body: string; tags: string[]; categories: string[] } | null {
  if (!value || typeof value !== 'object') return null;
  const x = value as Record<string, unknown>;
  if (typeof x.title !== 'string' || x.title.length > 640 || typeof x.body !== 'string' || Array.from(x.body).length > 10000 || !(x.title.trim() || x.body.trim()) || !shortList(x.tags, 20) || !shortList(x.categories, 5)) return null;
  return { title: x.title, body: x.body, tags: x.tags, categories: x.categories };
}
