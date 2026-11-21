export const MEDIA_MAX_BYTES=20*1024*1024;
export const MEDIA_PART_BYTES=3*1024*1024;
export const MEDIA_ID=/^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/;
export const IMAGE_MIMES=['image/jpeg','image/png','image/webp'];
export function partSize(total:number,index:number){return Math.max(0,Math.min(MEDIA_PART_BYTES,total-index*MEDIA_PART_BYTES));}
