import { isTrustedOrigin } from '@/lib/creator/request-origin';
import { mediaOwner,mediaObject,boundedBytes,preparePostImage,mediaResponse,mediaFailure } from '@/lib/media/storage';
import { MEDIA_PART_BYTES,partSize } from '@/lib/media/model';
export const maxDuration=120;
export async function POST(request:Request,{params}:{params:Promise<{id:string}>}){
 if(!isTrustedOrigin(request))return mediaResponse({error:'unauthorized'},403);
 try{const {id}=await params;const {db,user,media}=await mediaOwner(id);if(!media)throw Error('unauthorized');if(media.status==='ready')return mediaResponse({id,url:`/api/media/post/${id}`});
 const chunks:Buffer[]=[];for(let index=0;index<Math.ceil(media.byte_size/MEDIA_PART_BYTES);index++){const bytes=await boundedBytes((await mediaObject(id,`parts/${index}`,'GET')).body,partSize(media.byte_size,index));if(bytes.length!==partSize(media.byte_size,index))throw Error('media_invalid');chunks.push(bytes);}
 const original=Buffer.concat(chunks);const preview=await preparePostImage(original);await mediaObject(id,'original','PUT',original);await mediaObject(id,'preview.webp','PUT',preview.bytes);
 const {data,error}=await db.from('creator_media').update({status:'ready',width:preview.width,height:preview.height}).eq('id',id).eq('creator_id',user.id).select('id').maybeSingle();if(error||!data)throw Error('media_failed');
 // Parts stay private for safe retries; lifecycle cleanup is tracked in the operational backlog.
 return mediaResponse({id,url:`/api/media/post/${id}`});}catch(e){return mediaFailure(e);}
}
