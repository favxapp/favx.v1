export type OwnedMedia = {
  id: string;
  filename: string;
  mime: string;
  byte_size: number;
  status: "ready" | "uploading";
  width: number | null;
  height: number | null;
  created_at: string;
};
export type MediaInventory = { total: number; items: OwnedMedia[] };
