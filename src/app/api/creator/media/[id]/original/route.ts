import { mediaOwner,mediaObject } from '@/lib/media/storage';
export const dynamic='force-dynamic';
export async function GET(_request:Request,{params}:{params:Promise<{id:string}>}){
 try{const {id}=await params;const {media}=await mediaOwner(id);if(!media||media.status!=='ready')throw Error();const original=await mediaObject(id,'original','GET');return new Response(original.body,{headers:{'Content-Type':'application/octet-stream','Content-Disposition':`attachment; filename="original"; filename*=UTF-8''${encodeURIComponent(media.filename).replace(/'/g,'%27')}`,'Cache-Control':'private, no-store','X-Content-Type-Options':'nosniff'}});}catch{return new Response(null,{status:404,headers:{'Cache-Control':'no-store'}});}
}
