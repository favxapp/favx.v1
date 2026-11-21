import { randomUUID } from 'node:crypto';
import { requireCreator } from '@/lib/posts/server';
import { getRequestLocale } from '@/lib/i18n/server';
import { getMessages } from '@/lib/i18n/messages';
import { CollectionEditor } from '@/components/collections/CollectionEditor';
export default async function NewCollectionPage(){const {supabase,user}=await requireCreator();const m=getMessages(await getRequestLocale());const {data,error}=await supabase.from('creator_posts').select('id,title,lifecycle_state').eq('creator_id',user.id).order('updated_at',{ascending:false}).limit(1000);if(error)throw Error('Posts unavailable');return <main id="main" className="mx-auto max-w-content space-y-8 px-4 py-10 sm:px-6"><h1>{m.editor.collectionNew}</h1><CollectionEditor initial={{id:randomUUID(),version:0,title:'',description:'',post_ids:[],is_public:false}} posts={data??[]} m={m}/></main>;}
