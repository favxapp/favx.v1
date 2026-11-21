import { randomUUID } from 'node:crypto';
import { isTrustedOrigin } from '@/lib/creator/request-origin';
import { mediaOwner,privateMediaConfig,boundedBytes,mediaResponse,mediaFailure } from '@/lib/media/storage';
import { MEDIA_MAX_BYTES,IMAGE_MIMES } from '@/lib/media/model';
export async function POST(request:Request){
 if(!isTrustedOrigin(request))return mediaResponse({error:'unauthorized'},403);
 try{const {db,user}=await mediaOwner();privateMediaConfig();const input=JSON.parse((await boundedBytes(request.body,4096)).toString());if(typeof input.filename!=='string'||!input.filename.trim()||input.filename.length>180||/[\u0000-\u001f]/.test(input.filename)||!IMAGE_MIMES.includes(input.mime)||!Number.isSafeInteger(input.size)||input.size<1||input.size>MEDIA_MAX_BYTES)throw Error('media_invalid');const id=randomUUID();const {error}=await db.from('creator_media').insert({id,creator_id:user.id,filename:input.filename,mime:input.mime,byte_size:input.size});if(error)throw Error('media_failed');return mediaResponse({id},201);}catch(e){return mediaFailure(e);}
}
