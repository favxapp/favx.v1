import type { PublicPost } from "@/lib/posts/model";
export const UUID =
  /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/;
export const PUBLIC_ID = /^[a-f0-9]{32}$/;
export type LibraryPost = PublicPost & {
  username: string;
  creator_name: string;
};
export type SavedItem = {
  id: string;
  saved_at: string;
  post: LibraryPost | null;
};
export type LibraryResult = {
  items: SavedItem[];
  total: number;
  categories: string[];
  creators: { username: string; name: string }[];
};
export type UserCollection = {
  id: string;
  title: string;
  description: string;
  saved_ids: string[];
  cover_saved_id: string | null;
  share_enabled: boolean;
  share_token: string | null;
  version: number;
  updated_at?: string;
};
export type CollectionInput = Pick<
  UserCollection,
  "id" | "title" | "description" | "saved_ids" | "cover_saved_id" | "version"
>;
export function validCollection(value: CollectionInput) {
  return (
    value &&
    UUID.test(value.id) &&
    Number.isSafeInteger(value.version) &&
    value.version >= 0 &&
    typeof value.title === "string" &&
    !!value.title.trim() &&
    value.title.length <= 100 &&
    typeof value.description === "string" &&
    value.description.length <= 1000 &&
    Array.isArray(value.saved_ids) &&
    value.saved_ids.length <= 200 &&
    new Set(value.saved_ids).size === value.saved_ids.length &&
    value.saved_ids.every((id) => typeof id === "string" && UUID.test(id)) &&
    (value.cover_saved_id === null ||
      (UUID.test(value.cover_saved_id) &&
        value.saved_ids.includes(value.cover_saved_id)))
  );
}
export function queryPage(value?: unknown) {
  const n = Number(value);
  return Number.isSafeInteger(n) && n > 0 ? Math.min(n, 100000) : 1;
}
export type PickerItem = {
  id: string;
  title: string | null;
  username: string | null;
  image: string | null;
};
export function pickerItem(item: SavedItem): PickerItem {
  return {
    id: item.id,
    title: item.post?.title ?? null,
    username: item.post?.username ?? null,
    image: item.post?.media_ids?.[0] ?? null,
  };
}

export function queryText(value: unknown, max = 120) {
  return typeof value === "string" ? value.slice(0, max) : "";
}
