begin;
-- Additive editorial metadata. Context is deliberately excluded from every public projection.
alter table public.creator_posts add column categories text[] not null default '{}' check (cardinality(categories)<=5 and favx_private.valid_post_tags(categories)), add column private_context text not null default '' check (char_length(private_context)<=5000);
grant insert(categories,private_context), update(categories,private_context) on public.creator_posts to authenticated;

create table public.creator_collections (
 id uuid primary key default gen_random_uuid(),
 creator_id uuid not null references public.creator_profiles(user_id),
 public_id uuid not null unique default gen_random_uuid(),
 title text not null check (char_length(btrim(title)) between 1 and 100),
 description text not null default '' check (char_length(description)<=1000),
 post_ids uuid[] not null default '{}' check (cardinality(post_ids)<=100),
 is_public boolean not null default false,
 version integer not null default 1,
 updated_at timestamptz not null default now()
);
create index creator_collections_owner on public.creator_collections(creator_id,updated_at desc,id);
alter table public.creator_collections enable row level security;
revoke all on public.creator_collections from public,anon,authenticated;
grant select on public.creator_collections to authenticated;
grant insert(id,creator_id,title,description,post_ids,is_public), update(title,description,post_ids,is_public) on public.creator_collections to authenticated;
create policy collections_read_own on public.creator_collections for select to authenticated using (creator_id=(select auth.uid()));
create policy collections_insert_own on public.creator_collections for insert to authenticated with check (creator_id=(select auth.uid()) and exists(select 1 from public.profiles p join public.creator_profiles c on c.user_id=p.user_id where p.user_id=(select auth.uid()) and p.account_state='active' and c.creator_state='active'));
create policy collections_update_own on public.creator_collections for update to authenticated using (creator_id=(select auth.uid()) and exists(select 1 from public.profiles p join public.creator_profiles c on c.user_id=p.user_id where p.user_id=(select auth.uid()) and p.account_state='active' and c.creator_state='active')) with check (creator_id=(select auth.uid()) and exists(select 1 from public.profiles p join public.creator_profiles c on c.user_id=p.user_id where p.user_id=(select auth.uid()) and p.account_state='active' and c.creator_state='active'));
create function favx_private.validate_collection() returns trigger language plpgsql security invoker set search_path='' as $$
begin
 if auth.uid() is null or new.creator_id<>auth.uid() then raise exception 'UNAUTHORIZED' using errcode='42501'; end if;
 if cardinality(new.post_ids) <> (select count(distinct x.id) from public.creator_posts x where x.creator_id=auth.uid() and x.id=any(new.post_ids)) then raise exception 'INVALID_POSTS' using errcode='23514'; end if;
 new.version:=case when tg_op='INSERT' then 1 else old.version+1 end; new.updated_at:=now(); return new;
end $$;
revoke all on function favx_private.validate_collection() from public,anon,authenticated;
create trigger validate_collection before insert or update on public.creator_collections for each row execute function favx_private.validate_collection();
create function public.save_creator_collection(p_id uuid,p_version integer,p_title text,p_description text,p_posts uuid[],p_public boolean)
returns table(id uuid,version integer) language plpgsql security invoker set search_path='' as $$
declare saved public.creator_collections;
begin
 if auth.uid() is null then raise exception 'UNAUTHORIZED' using errcode='42501'; end if;
 if p_version=0 then
  insert into public.creator_collections(id,creator_id,title,description,post_ids,is_public) values(p_id,auth.uid(),btrim(p_title),p_description,p_posts,p_public) on conflict do nothing returning * into saved;
  if saved.id is null then select * into saved from public.creator_collections c where c.id=p_id and c.creator_id=auth.uid() and c.version=1 and c.title=btrim(p_title) and c.description=p_description and c.post_ids=p_posts and c.is_public=p_public; end if;
 else
  update public.creator_collections c set title=btrim(p_title),description=p_description,post_ids=p_posts,is_public=p_public where c.id=p_id and c.creator_id=auth.uid() and c.version=p_version returning * into saved;
 end if;
 if saved.id is null then raise exception 'COLLECTION_CONFLICT' using errcode='40001'; end if;
 return query select saved.id,saved.version;
end $$;
revoke all on function public.save_creator_collection(uuid,integer,text,text,uuid[],boolean) from public,anon;
grant execute on function public.save_creator_collection(uuid,integer,text,text,uuid[],boolean) to authenticated;

create table public.creator_media (
 id uuid primary key,
 creator_id uuid not null references public.creator_profiles(user_id),
 filename text not null check (char_length(filename) between 1 and 180),
 mime text not null check (mime in ('image/jpeg','image/png','image/webp')),
 byte_size integer not null check (byte_size between 1 and 20971520),
 status text not null default 'uploading' check (status in ('uploading','ready')),
 width integer, height integer,
 created_at timestamptz not null default now()
);
create index creator_media_owner on public.creator_media(creator_id,created_at desc);
alter table public.creator_media enable row level security;
revoke all on public.creator_media from public,anon,authenticated;
grant select on public.creator_media to authenticated;
grant insert(id,creator_id,filename,mime,byte_size), update(status,width,height) on public.creator_media to authenticated;
create policy media_read_own on public.creator_media for select to authenticated using (creator_id=(select auth.uid()));
create policy media_insert_own on public.creator_media for insert to authenticated with check (creator_id=(select auth.uid()) and exists(select 1 from public.profiles p join public.creator_profiles c on c.user_id=p.user_id where p.user_id=(select auth.uid()) and p.account_state='active' and c.creator_state='active'));
create policy media_update_own on public.creator_media for update to authenticated using (creator_id=(select auth.uid()) and exists(select 1 from public.profiles p join public.creator_profiles c on c.user_id=p.user_id where p.user_id=(select auth.uid()) and p.account_state='active' and c.creator_state='active')) with check (creator_id=(select auth.uid()) and exists(select 1 from public.profiles p join public.creator_profiles c on c.user_id=p.user_id where p.user_id=(select auth.uid()) and p.account_state='active' and c.creator_state='active'));
alter table public.creator_posts add column media_ids uuid[] not null default '{}' check (cardinality(media_ids)<=10);
grant insert(media_ids), update(media_ids) on public.creator_posts to authenticated;
create function favx_private.validate_post_media() returns trigger language plpgsql security invoker set search_path='' as $$
begin
 if cardinality(new.media_ids)<>(select count(distinct m.id) from public.creator_media m where m.id=any(new.media_ids) and m.creator_id=new.creator_id and m.status='ready') then raise exception 'MEDIA_NOT_READY' using errcode='23514'; end if;
 return new;
end $$;
revoke all on function favx_private.validate_post_media() from public,anon,authenticated;
create trigger posts_media_check before insert or update of media_ids,lifecycle_state on public.creator_posts for each row execute function favx_private.validate_post_media();
-- Narrow public eligibility only. No filenames, originals, owner identity or private Context.
create function favx_private.media_access(p_id uuid) returns boolean language sql stable security definer set search_path='' as $$
 select exists(select 1 from public.creator_media m join public.creator_profiles c on c.user_id=m.creator_id join public.profiles p on p.user_id=c.user_id where m.id=p_id and m.status='ready' and c.creator_state='active' and p.account_state='active' and (m.creator_id=auth.uid() or (c.is_public and exists(select 1 from public.creator_posts x where x.creator_id=c.user_id and x.lifecycle_state='published' and m.id=any(x.media_ids)))))
$$;
revoke all on function favx_private.media_access(uuid) from public;
grant execute on function favx_private.media_access(uuid) to anon,authenticated;
create function public.can_view_media(p_id uuid) returns boolean language sql stable security invoker set search_path='' as $$select favx_private.media_access(p_id)$$;
revoke all on function public.can_view_media(uuid) from public;
grant execute on function public.can_view_media(uuid) to anon,authenticated;

-- One bounded projection for profile counts, scoped search and collection browsing.
-- Definer exists only in a non-exposed schema. Never return owner IDs or private context.
create function favx_private.browse_creator(p_username text,p_query text,p_category text,p_collection uuid,p_page integer)
returns jsonb language sql stable security definer set search_path='' as $$
 with owner as (select c.user_id from public.creator_profiles c join public.profiles p on p.user_id=c.user_id where c.username=p_username and c.is_public and c.creator_state='active' and p.account_state='active'),
 visible as (select x.* from public.creator_posts x join owner o on x.creator_id=o.user_id where x.lifecycle_state='published'),
 collections as (select c.public_id,c.title,c.description,c.post_ids from public.creator_collections c join owner o on c.creator_id=o.user_id where c.is_public),
 matched as (select v.* from visible v where (coalesce(p_query,'')='' or position(lower(left(p_query,120)) in lower(v.title||' '||v.body||' '||array_to_string(v.tags,' ')))>0) and (coalesce(p_category,'')='' or p_category=any(v.categories)) and (p_collection is null or exists(select 1 from collections c where c.public_id=p_collection and v.id=any(c.post_ids)))),
 page as (select * from matched order by published_at desc,id desc limit 20 offset ((greatest(1,least(coalesce(p_page,1),100000))-1)*20))
 select jsonb_build_object(
  'posts',(select coalesce(jsonb_agg(jsonb_build_object('public_id',x.public_id,'slug',x.slug,'title',x.title,'body',x.body,'content_kind',x.content_kind,'tags',x.tags,'categories',x.categories,'media_ids',x.media_ids,'links',x.links,'rating',x.rating,'is_sponsored',x.is_sponsored,'disclosure',x.disclosure,'published_at',x.published_at) order by x.published_at desc,x.id desc),'[]') from page x),
  'total',(select count(*) from matched),
  'post_count',(select count(*) from visible),
  'categories',(select coalesce(jsonb_agg(t.category order by t.category),'[]') from (select distinct unnest(categories) category from visible) t),
  'collections',(select coalesce(jsonb_agg(jsonb_build_object('public_id',c.public_id,'title',c.title,'description',c.description,'count',(select count(*) from visible v where v.id=any(c.post_ids))) order by c.title,c.public_id),'[]') from collections c)
 )
$$;
revoke all on function favx_private.browse_creator(text,text,text,uuid,integer) from public;
grant execute on function favx_private.browse_creator(text,text,text,uuid,integer) to anon,authenticated;
create function public.browse_creator(p_username text,p_query text default '',p_category text default '',p_collection uuid default null,p_page integer default 1)
returns jsonb language sql stable security invoker set search_path='' as $$ select favx_private.browse_creator(p_username,p_query,p_category,p_collection,p_page) $$;
revoke all on function public.browse_creator(text,text,text,uuid,integer) from public;
grant execute on function public.browse_creator(text,text,text,uuid,integer) to anon,authenticated;

-- Technical abuse ceiling, not a commercial plan entitlement. Atomic across server instances.
create table favx_private.ai_usage (owner_id uuid not null,day date not null,requests integer not null,primary key(owner_id,day));
alter table favx_private.ai_usage enable row level security;
revoke all on favx_private.ai_usage from public,anon,authenticated;
create function favx_private.claim_editor_ai() returns boolean language plpgsql security definer set search_path='' as $$
declare amount integer;
begin
 if auth.uid() is null or not exists(select 1 from public.profiles p join public.creator_profiles c on c.user_id=p.user_id where p.user_id=auth.uid() and p.account_state='active' and c.creator_state='active') then raise exception 'UNAUTHORIZED' using errcode='42501'; end if;
 perform pg_advisory_xact_lock(731946120);
 if (select coalesce(sum(requests),0) from favx_private.ai_usage where day=(now() at time zone 'UTC')::date)>=600 then return false; end if;
 insert into favx_private.ai_usage(owner_id,day,requests) values(auth.uid(),(now() at time zone 'UTC')::date,1)
 on conflict(owner_id,day) do update set requests=favx_private.ai_usage.requests+1 where favx_private.ai_usage.requests<30 returning requests into amount;
 return amount is not null;
end $$;
revoke all on function favx_private.claim_editor_ai() from public,anon;
grant execute on function favx_private.claim_editor_ai() to authenticated;
create function public.claim_editor_ai() returns boolean language sql security invoker set search_path='' as $$ select favx_private.claim_editor_ai() $$;
revoke all on function public.claim_editor_ai() from public,anon;
grant execute on function public.claim_editor_ai() to authenticated;

create or replace function public.save_creator_post(p_id uuid,p_expected_version integer,p_payload jsonb,p_status text)
returns table(id uuid,version integer,public_id text,slug text,lifecycle_state text)
language plpgsql security invoker set search_path='' as $$
declare result public.creator_posts; current_post public.creator_posts; tags_value text[]; categories_value text[]; media_value uuid[];
begin
 if auth.uid() is null then raise exception 'UNAUTHORIZED' using errcode='42501'; end if;
 if p_expected_version is null or p_expected_version<0 or p_status is null or p_status not in ('draft','published','hidden') then raise exception 'INVALID_POST' using errcode='23514'; end if;
 if jsonb_typeof(p_payload->'tags') is distinct from 'array' then raise exception 'INVALID_POST' using errcode='23514'; end if;
 select coalesce(array_agg(value),'{}') into tags_value from jsonb_array_elements_text(p_payload->'tags');
 select coalesce(array_agg(value),'{}') into categories_value from jsonb_array_elements_text(coalesce(p_payload->'categories','[]'));
 select coalesce(array_agg(value::uuid),'{}') into media_value from jsonb_array_elements_text(coalesce(p_payload->'media_ids','[]'));
 if p_expected_version=0 then
   insert into public.creator_posts(id,creator_id,title,body,slug,content_kind,tags,links,rating,is_sponsored,disclosure,lifecycle_state,categories,private_context,media_ids)
     values(p_id,auth.uid(),p_payload->>'title',p_payload->>'body',p_payload->>'slug',p_payload->>'content_kind',tags_value,p_payload->'links',
       (p_payload->>'rating')::numeric,(p_payload->>'is_sponsored')::boolean,p_payload->>'disclosure',p_status,categories_value,coalesce(p_payload->>'private_context',''),media_value)
     on conflict do nothing returning * into result;
   if result.id is null then
     select * into current_post from public.creator_posts x where x.id=p_id and x.creator_id=auth.uid();
     if current_post.id is not null and current_post.version=1 and current_post.lifecycle_state=p_status
       and current_post.title=p_payload->>'title' and current_post.body=p_payload->>'body'
       and current_post.slug=p_payload->>'slug' and current_post.content_kind=p_payload->>'content_kind'
       and current_post.media_ids=media_value and current_post.categories=categories_value and current_post.private_context=coalesce(p_payload->>'private_context','')
       and current_post.tags=tags_value and current_post.links=p_payload->'links'
       and current_post.rating is not distinct from (p_payload->>'rating')::numeric
       and current_post.is_sponsored=(p_payload->>'is_sponsored')::boolean and current_post.disclosure=p_payload->>'disclosure' then
       result:=current_post;
     else raise exception 'POST_CONFLICT' using errcode='40001'; end if;
   end if;
 else
   update public.creator_posts x set title=p_payload->>'title',body=p_payload->>'body',slug=p_payload->>'slug',content_kind=p_payload->>'content_kind',
     tags=tags_value,links=p_payload->'links',rating=(p_payload->>'rating')::numeric,is_sponsored=(p_payload->>'is_sponsored')::boolean,
     disclosure=p_payload->>'disclosure',lifecycle_state=p_status,
     media_ids=case when p_payload ? 'media_ids' then media_value else x.media_ids end,
     categories=case when p_payload ? 'categories' then categories_value else x.categories end, private_context=coalesce(p_payload->>'private_context',x.private_context)
     where x.id=p_id and x.creator_id=auth.uid() and x.version=p_expected_version returning * into result;
   if result.id is null then raise exception 'POST_CONFLICT' using errcode='40001'; end if;
 end if;
 return query select result.id,result.version,result.public_id,result.slug,result.lifecycle_state;
end $$;
revoke all on function public.save_creator_post(uuid,integer,jsonb,text) from public,anon;
grant execute on function public.save_creator_post(uuid,integer,jsonb,text) to authenticated;


create function favx_private.public_post_media(p_username text,p_public_id text) returns uuid[] language sql stable security definer set search_path='' as $$
 select x.media_ids from public.creator_posts x join public.creator_profiles c on c.user_id=x.creator_id join public.profiles p on p.user_id=c.user_id where c.username=p_username and c.is_public and c.creator_state='active' and p.account_state='active' and x.public_id=p_public_id and x.lifecycle_state='published'
$$;
revoke all on function favx_private.public_post_media(text,text) from public;
grant execute on function favx_private.public_post_media(text,text) to anon,authenticated;
create function public.get_post_media(p_username text,p_public_id text) returns uuid[] language sql stable security invoker set search_path='' as $$select favx_private.public_post_media(p_username,p_public_id)$$;
revoke all on function public.get_post_media(text,text) from public;
grant execute on function public.get_post_media(text,text) to anon,authenticated;
commit;
