import { mediaOwner, mediaObject } from "@/lib/media/storage";
export const dynamic = "force-dynamic";
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const { media } = await mediaOwner(id);
    if (!media || media.status !== "ready") throw Error();
    const image = await mediaObject(id, "preview.webp", "GET");
    return new Response(image.body, {
      headers: {
        "Content-Type": "application/octet-stream",
        "Content-Disposition": 'attachment; filename="optimized.webp"',
        "Cache-Control": "private, no-store",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch {
    return new Response(null, {
      status: 404,
      headers: { "Cache-Control": "no-store" },
    });
  }
}
