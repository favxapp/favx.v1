import sharp from 'sharp';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { MEDIA_ID, MEDIA_MAX_BYTES } from './model';
export function privateMediaConfig(env:Record<string,string|undefined>=process.env) {
 const zone=env.BUNNY_ORIGINALS_STORAGE_ZONE?.trim();const key=env.BUNNY_ORIGINALS_ACCESS_KEY?.trim();const host=env.BUNNY_ORIGINALS_STORAGE_HOST?.trim();
 if(!zone||!key||!host||!/^[a-zA-Z0-9_-]+$/.test(zone)||zone===env.BUNNY_STORAGE_ZONE?.trim())throw Error('media_unavailable');
 const u=new URL(host.includes('://')?host:`https://${host}`);
 if(u.protocol!=='https:'||u.username||u.password||u.port||u.pathname!=='/'||u.search||u.hash||!/^(?:[a-z]{2,3}\.)?storage\.bunnycdn\.com$/.test(u.hostname))throw Error('media_unavailable');
 return {endpoint:`${u.origin}/${zone}/post-media/`,key};
}
export async function mediaObject(id:string,path:string,method:'GET'|'PUT'|'DELETE',bytes?:Uint8Array){
 if(!MEDIA_ID.test(id)||! /^(original|preview\.webp|parts\/[0-6])$/.test(path))throw Error('media_invalid');
 const c=privateMediaConfig();const result=await fetch(`${c.endpoint}${id}/${path}`,{method,headers:{AccessKey:c.key,'Content-Type':'application/octet-stream'},...(bytes?{body:new Uint8Array(bytes)}:{}),signal:AbortSignal.timeout(25000),redirect:'error',cache:'no-store'});
 if(!result.ok)throw Error('media_failed');return result;
}
export async function boundedBytes(body:ReadableStream<Uint8Array>|null,limit:number):Promise<Buffer>{
 const reader=body?.getReader();if(!reader)throw Error('media_invalid');let size=0;const chunks:Uint8Array[]=[];
 try{while(true){const {done,value}=await reader.read();if(done)break;size+=value.length;if(size>limit){await reader.cancel();throw Error('media_invalid');}chunks.push(value);}}finally{reader.releaseLock();}return Buffer.concat(chunks);
}
export async function preparePostImage(bytes:Uint8Array){
 if(!bytes.byteLength||bytes.byteLength>MEDIA_MAX_BYTES)throw Error('media_invalid');const source=sharp(bytes,{limitInputPixels:60_000_000,failOn:'warning'});const meta=await source.metadata();if(!['jpeg','png','webp'].includes(meta.format??'')||(meta.pages??1)>1)throw Error('media_invalid');
 const {data,info}=await source.rotate().resize({width:1600,height:1600,fit:'inside',withoutEnlargement:true}).webp({quality:84}).toBuffer({resolveWithObject:true});if(data.length>4*1024*1024)throw Error('media_invalid');return {bytes:data,width:info.width,height:info.height};
}
export async function mediaOwner(id?:string){
 const db=await createSupabaseServerClient();const {data:{user}}=await db.auth.getUser();if(!user)throw Error('unauthorized');
 const [{data:profile},{data:creator}]=await Promise.all([db.from('profiles').select('account_state').eq('user_id',user.id).single(),db.from('creator_profiles').select('creator_state').eq('user_id',user.id).single()]);if(profile?.account_state!=='active'||creator?.creator_state!=='active')throw Error('unauthorized');
 if(id&&!MEDIA_ID.test(id))throw Error('media_invalid');
 const media=id?await db.from('creator_media').select('id,filename,mime,byte_size,status').eq('id',id).eq('creator_id',user.id).maybeSingle():null;
 if(id&&(media?.error||!media?.data))throw Error('unauthorized');return {db,user,media:media?.data};
}
export const mediaResponse=(data:object,status=200)=>Response.json(data,{status,headers:{'Cache-Control':'no-store'}});
export function mediaFailure(error:unknown){const code=error instanceof Error?error.message:'';return mediaResponse({error:['unauthorized','media_invalid','media_unavailable'].includes(code)?code:'media_failed'},code==='unauthorized'?403:code==='media_invalid'?400:503);}
