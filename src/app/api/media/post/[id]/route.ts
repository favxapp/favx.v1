import { createSupabaseServerClient } from '@/lib/supabase/server';
import { MEDIA_ID } from '@/lib/media/model';
import { mediaObject,boundedBytes } from '@/lib/media/storage';
export const dynamic='force-dynamic';
export async function GET(_request:Request,{params}:{params:Promise<{id:string}>}){
 const {id}=await params;const unavailable=()=>new Response(null,{status:404,headers:{'Cache-Control':'no-store'}});if(!MEDIA_ID.test(id))return unavailable();
 const db=await createSupabaseServerClient();const {data,error}=await db.rpc('can_view_media',{p_id:id});if(error||!data)return unavailable();
 try{const bytes=await boundedBytes((await mediaObject(id,'preview.webp','GET')).body,4*1024*1024);if(bytes.toString('ascii',0,4)!=='RIFF'||bytes.toString('ascii',8,12)!=='WEBP')return unavailable();return new Response(new Uint8Array(bytes),{headers:{'Content-Type':'image/webp','Content-Length':String(bytes.length),'Cache-Control':'private, no-store','X-Content-Type-Options':'nosniff'}});}catch{return unavailable();}
}
