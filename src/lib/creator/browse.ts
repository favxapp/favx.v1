import type { PublicPost } from '@/lib/posts/model';
export type CreatorBrowse = { posts: PublicPost[]; total: number; post_count: number; categories: string[]; collections: { public_id: string; title: string; description: string; count: number }[] };
export function validPage(value?: string) { const n=Number(value??1);return Number.isSafeInteger(n)&&n>0?Math.min(n,100000):1; }
