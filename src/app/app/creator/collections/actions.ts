'use server';
import { revalidatePath } from 'next/cache';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import type { CollectionValues } from '@/components/collections/CollectionEditor';
export async function saveCollection(input: CollectionValues) {
  const uuid=/^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/;
  if(!input || !uuid.test(input.id) || !Number.isSafeInteger(input.version) || input.version<0 || typeof input.title!=='string' || !input.title.trim() || input.title.length>100 || typeof input.description!=='string' || input.description.length>1000 || typeof input.is_public!=='boolean' || !Array.isArray(input.post_ids) || input.post_ids.length>100 || new Set(input.post_ids).size!==input.post_ids.length || input.post_ids.some(id=>typeof id!=='string'||!uuid.test(id))) return {error:'post_invalid'};
  const db=await createSupabaseServerClient();const {data:{user}}=await db.auth.getUser();if(!user)return {error:'unauthorized'};
  const {data,error}=await db.rpc('save_creator_collection',{p_id:input.id,p_version:input.version,p_title:input.title,p_description:input.description,p_posts:input.post_ids,p_public:input.is_public});
  if(error || !data?.length)return {error:error?.code==='40001'?'post_conflict':'generic'};
  revalidatePath('/app/creator/collections');
  return {saved:data[0] as {id:string;version:number}};
}
