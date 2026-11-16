/** Avatar originals are not retained. Post media must use its separate private-original pipeline. */
export const MAX_AVATAR_ORIGINAL_BYTES = 20 * 1024 * 1024;
export async function optimizeAvatar(file: File): Promise<Blob> {
  if (!file.size || file.size > MAX_AVATAR_ORIGINAL_BYTES || (file.type && !['image/jpeg', 'image/png', 'image/webp'].includes(file.type))) throw Error('avatar_invalid');
  let source: ImageBitmap | HTMLImageElement;
  let objectUrl: string | undefined;
  try {
    if (typeof createImageBitmap === 'function') source = await createImageBitmap(file, { imageOrientation: 'from-image' });
    else {
      objectUrl = URL.createObjectURL(file);
      source = await new Promise<HTMLImageElement>((resolve, reject) => {
        const img = new Image(); img.onload = () => resolve(img); img.onerror = () => reject(Error('avatar_invalid')); img.src = objectUrl!;
      });
    }
    try {
      const width = source instanceof HTMLImageElement ? source.naturalWidth : source.width;
      const height = source instanceof HTMLImageElement ? source.naturalHeight : source.height;
      if (!width || !height) throw Error('avatar_invalid');
      const scale = Math.min(1, 1024 / Math.max(width, height));
      const canvas = document.createElement('canvas');
      canvas.width = Math.max(1, Math.round(width * scale)); canvas.height = Math.max(1, Math.round(height * scale));
      const context = canvas.getContext('2d');
      if (!context) throw Error('avatar_invalid');
      context.drawImage(source, 0, 0, canvas.width, canvas.height);
      const result = await new Promise<Blob>((resolve, reject) => canvas.toBlob(blob => blob ? resolve(blob) : reject(Error('avatar_invalid')), 'image/webp', 0.9));
      if (result.size > 2 * 1024 * 1024) throw Error('avatar_invalid');
      return result;
    } finally { if ('close' in source) source.close(); }
  } finally { if (objectUrl) URL.revokeObjectURL(objectUrl); }
}
