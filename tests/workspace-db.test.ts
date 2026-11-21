import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { PGlite } from '@electric-sql/pglite';

test('workspace: collection ownership, public search privacy, counts and atomic AI ceiling', async () => {
  const db = new PGlite();
  const a='11111111-1111-4111-8111-111111111111', b='22222222-2222-4222-8222-222222222222', post='33333333-3333-4333-8333-333333333333', draft='44444444-4444-4444-8444-444444444444', collection='55555555-5555-4555-8555-555555555555', media='66666666-6666-4666-8666-666666666666';
  const role = async (name: string, user='') => { await db.exec('reset role'); await db.query("select set_config('request.jwt.claim.sub',$1,false)",[user]); await db.exec(`set role ${name}`); };
  const payload={title:'Café favorito',body:'Perto do parque',slug:'cafe',content_kind:'place',tags:['cafe'],links:[],rating:null,is_sponsored:false,disclosure:'',categories:['Cafés'],private_context:'PRIVATE_DO_NOT_EXPOSE'};
  const browse = async (query='') => (await db.query<{ result: { posts: Record<string,unknown>[]; categories: string[]; post_count: number; collections: {public_id:string;count:number}[];total:number } }>("select public.browse_creator('alice',$1) result",[query])).rows[0].result;
  try {
    await db.exec(`create role anon;create role authenticated;create schema auth;create table auth.users(id uuid primary key);create function auth.uid() returns uuid language sql stable as $$select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid$$;grant usage on schema auth to anon,authenticated;grant execute on function auth.uid() to anon,authenticated;`);
    for(const path of ['migrations/20261109000100_foundation_auth_creator.sql','migrations/20261115155702_creator_public_profile.sql','migrations/20261115221433_creator_posts.sql','migrations/20261120220440_workspace_collections_search_ai_media.sql']) await db.exec(await readFile(new URL(`../supabase/${path}`,import.meta.url),'utf8'));
    await db.query('insert into auth.users(id) values($1),($2)',[a,b]);
    await role('authenticated',a); await db.query("insert into public.creator_profiles(user_id,username,display_name) values($1,'alice','Alice')",[a]); await db.exec('update public.creator_profiles set is_public=true');
    await db.query("select * from public.save_creator_post($1,0,$2,'published')",[post,JSON.stringify(payload)]);
    await db.query("select * from public.save_creator_post($1,0,$2,'draft')",[draft,JSON.stringify({...payload,title:'SECRET_DRAFT',categories:['PRIVATE_CATEGORY']})]);
    await db.query("insert into public.creator_media(id,creator_id,filename,mime,byte_size) values($1,$2,'private-name.png','image/png',5000)",[media,a]);
    await assert.rejects(db.query("select * from public.save_creator_post($1,1,$2,'published')",[post,JSON.stringify({...payload,media_ids:[media]})]),/MEDIA_NOT_READY/);
    await db.query("update public.creator_media set status='ready' where id=$1",[media]);
    await role('anon'); assert.equal((await db.query<{allowed:boolean}>('select public.can_view_media($1) allowed',[media])).rows[0].allowed,false);
    await role('authenticated',a); await db.query("select * from public.save_creator_post($1,1,$2,'published')",[post,JSON.stringify({...payload,media_ids:[media]})]);
    await role('anon'); assert.equal((await db.query<{allowed:boolean}>('select public.can_view_media($1) allowed',[media])).rows[0].allowed,true);
    await role('authenticated',a);
    await db.query('select * from public.save_creator_collection($1,0,$2,$3,$4,true)',[collection,'Coffee','My selection',[post,draft]]);
    await assert.rejects(db.query('select * from public.save_creator_collection($1,1,$2,$3,$4,true)',[collection,'Bad','',[b]]), /INVALID_POSTS/);
    await assert.rejects(db.query('select * from public.save_creator_collection($1,99,$2,$3,$4,true)',[collection,'Bad','',[]]), /COLLECTION_CONFLICT/);
    await role('authenticated',b);
    assert.equal((await db.query('select * from public.creator_collections')).rows.length,0);
    await assert.rejects(db.query('select * from public.save_creator_collection($1,1,$2,$3,$4,true)',[collection,'Attack','',[]]));
    await assert.rejects(db.query('select public.claim_editor_ai()'), /UNAUTHORIZED/);
    await role('anon'); await assert.rejects(db.query('select * from public.creator_collections')); await assert.rejects(db.query('select public.claim_editor_ai()'));
    const visible=await browse(); assert.equal(visible.post_count,1); assert.equal(visible.collections[0].count,1); assert.deepEqual(visible.categories,['Cafés']);
    assert.equal((await browse('parque')).total,1); assert.equal((await browse('PRIVATE_DO_NOT_EXPOSE')).total,0); assert.equal((await browse('SECRET_DRAFT')).total,0);
    assert.ok(!JSON.stringify(visible).includes('private_context')); assert.ok(!JSON.stringify(visible).includes(a)); assert.ok(!JSON.stringify(visible).includes('PRIVATE_CATEGORY'));
    await role('authenticated',a);
    for(let n=0;n<30;n++) assert.equal((await db.query<{allowed:boolean}>('select public.claim_editor_ai() allowed')).rows[0].allowed,true);
    assert.equal((await db.query<{allowed:boolean}>('select public.claim_editor_ai() allowed')).rows[0].allowed,false);
    await assert.rejects(db.query('delete from favx_private.ai_usage'));
    await db.query('select * from public.save_creator_collection($1,1,$2,$3,$4,false)',[collection,'Coffee','My selection',[post,draft]]);
    await role('anon'); assert.equal((await browse()).collections.length,0);
    await role('authenticated',a); await db.exec('update public.creator_profiles set is_public=false');
    await role('anon'); assert.equal((await browse()).posts.length,0); assert.equal((await browse()).categories.length,0);assert.equal((await db.query<{allowed:boolean}>('select public.can_view_media($1) allowed',[media])).rows[0].allowed,false);
    await role('postgres'); await db.query("update public.profiles set account_state='suspended' where user_id=$1",[a]);
    await role('authenticated',a); await assert.rejects(db.query('select public.claim_editor_ai()'), /UNAUTHORIZED/); await assert.rejects(db.query('select * from public.save_creator_collection($1,2,$2,$3,$4,true)',[collection,'Coffee','',[]]));
  } finally { await db.close(); }
});
