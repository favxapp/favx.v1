import { isTrustedOrigin } from '@/lib/creator/request-origin';
import { mediaOwner,mediaObject,boundedBytes,mediaResponse,mediaFailure } from '@/lib/media/storage';
import { partSize } from '@/lib/media/model';
export const maxDuration=60;
export async function PUT(request:Request,{params}:{params:Promise<{id:string;part:string}>}){
 if(!isTrustedOrigin(request))return mediaResponse({error:'unauthorized'},403);
 try{const {id,part}=await params;if(!/^[0-6]$/.test(part))throw Error('media_invalid');const {media}=await mediaOwner(id);if(!media||media.status!=='uploading')throw Error('media_invalid');const expected=partSize(media.byte_size,Number(part));if(!expected)throw Error('media_invalid');const bytes=await boundedBytes(request.body,expected);if(bytes.length!==expected)throw Error('media_invalid');await mediaObject(id,`parts/${part}`,'PUT',bytes);return mediaResponse({received:bytes.length});}catch(e){return mediaFailure(e);}
}
