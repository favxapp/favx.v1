begin;
-- Public editorial projection only; never reveals Context, owner IDs or audience metrics.
create function favx_private.library_post(p_public_id text) returns jsonb
language sql stable security definer set search_path='' as $$
 select jsonb_build_object('public_id',x.public_id,'slug',x.slug,'title',x.title,'body',x.body,
 'content_kind',x.content_kind,'tags',x.tags,'categories',x.categories,'media_ids',x.media_ids,
 'links',x.links,'rating',x.rating,'is_sponsored',x.is_sponsored,'disclosure',x.disclosure,
 'published_at',x.published_at,'username',c.username,'creator_name',c.display_name)
 from public.creator_posts x join public.creator_profiles c on c.user_id=x.creator_id
 join public.profiles p on p.user_id=c.user_id
 where x.public_id=p_public_id and x.lifecycle_state='published' and c.is_public
 and c.creator_state='active' and p.account_state='active'
$$;
revoke all on function favx_private.library_post(text) from public;
grant execute on function favx_private.library_post(text) to anon,authenticated;

create function favx_private.library_active() returns boolean language sql stable security invoker set search_path='' as $$
 select exists(select 1 from public.profiles where user_id=auth.uid() and account_state='active')
$$;
revoke all on function favx_private.library_active() from public,anon;
grant execute on function favx_private.library_active() to authenticated;

create table public.user_saves (
 id uuid primary key default gen_random_uuid(),
 user_id uuid not null references public.profiles(user_id),
 post_public_id text references public.creator_posts(public_id) on delete set null,
 saved_at timestamptz not null default now(),
 unique(user_id,post_public_id)
);
create index user_saves_recent on public.user_saves(user_id,saved_at desc,id);
create index user_saves_post on public.user_saves(post_public_id);
alter table public.user_saves enable row level security;
revoke all on public.user_saves from public,anon,authenticated;
grant select,delete on public.user_saves to authenticated;
grant insert(user_id,post_public_id) on public.user_saves to authenticated;
create policy saves_own on public.user_saves for all to authenticated
 using(user_id=(select auth.uid()) and (select favx_private.library_active()))
 with check(user_id=(select auth.uid()) and (select favx_private.library_active()));
create function favx_private.validate_save() returns trigger language plpgsql security invoker set search_path='' as $$
begin
 if favx_private.library_post(new.post_public_id) is null then raise exception 'POST_UNAVAILABLE' using errcode='23514'; end if;
 return new;
end $$;
revoke all on function favx_private.validate_save() from public,anon,authenticated;
create trigger user_save_eligible before insert on public.user_saves for each row execute function favx_private.validate_save();
create function public.save_recommendation(p_public_id text) returns uuid language plpgsql security invoker set search_path='' as $$
declare saved uuid;
begin
 if auth.uid() is null or not favx_private.library_active() then raise exception 'UNAUTHORIZED' using errcode='42501'; end if;
 insert into public.user_saves(user_id,post_public_id) values(auth.uid(),p_public_id) on conflict(user_id,post_public_id) do nothing returning id into saved;
 if saved is null then select id into saved from public.user_saves where user_id=auth.uid() and post_public_id=p_public_id; end if;
 return saved;
end $$;
revoke all on function public.save_recommendation(text) from public,anon;
grant execute on function public.save_recommendation(text) to authenticated;

create table public.user_collections (
 id uuid primary key default gen_random_uuid(), user_id uuid not null references public.profiles(user_id),
 title text not null check(char_length(btrim(title)) between 1 and 100),
 description text not null default '' check(char_length(description)<=1000),
 saved_ids uuid[] not null default '{}' check(cardinality(saved_ids)<=200),
 cover_saved_id uuid,
 share_enabled boolean not null default false,
 share_token text unique,
 version integer not null default 1,
 updated_at timestamptz not null default now()
);
create index user_collections_recent on public.user_collections(user_id,updated_at desc,id);
alter table public.user_collections enable row level security;
revoke all on public.user_collections from public,anon,authenticated;
grant select,delete on public.user_collections to authenticated;
grant insert(id,user_id,title,description,saved_ids,cover_saved_id),update(title,description,saved_ids,cover_saved_id,share_enabled) on public.user_collections to authenticated;
create policy user_collections_own on public.user_collections for all to authenticated
 using(user_id=(select auth.uid()) and (select favx_private.library_active()))
 with check(user_id=(select auth.uid()) and (select favx_private.library_active()));
create function favx_private.validate_user_collection() returns trigger language plpgsql security invoker set search_path='' as $$
begin
 if auth.uid() is null or new.user_id<>auth.uid() then raise exception 'UNAUTHORIZED' using errcode='42501'; end if;
 if cardinality(new.saved_ids)<>(select count(distinct s.id) from public.user_saves s where s.user_id=auth.uid() and s.id=any(new.saved_ids))
 or (new.cover_saved_id is not null and not new.cover_saved_id=any(new.saved_ids)) then raise exception 'INVALID_ITEMS' using errcode='23514'; end if;
 if tg_op='INSERT' then new.share_enabled:=false;new.share_token:=null;new.version:=1;
 else
  new.version:=old.version+1;
  if new.share_enabled and not old.share_enabled then new.share_token:=replace(gen_random_uuid()::text,'-','');
  elsif not new.share_enabled then new.share_token:=null;
  else new.share_token:=old.share_token; end if;
 end if;
 new.updated_at:=now(); return new;
end $$;
revoke all on function favx_private.validate_user_collection() from public,anon,authenticated;
create trigger user_collection_validate before insert or update on public.user_collections for each row execute function favx_private.validate_user_collection();
create function favx_private.remove_saved_membership() returns trigger language plpgsql security invoker set search_path='' as $$
begin
 update public.user_collections set saved_ids=array_remove(saved_ids,old.id),cover_saved_id=case when cover_saved_id=old.id then null else cover_saved_id end where user_id=old.user_id and old.id=any(saved_ids);
 return old;
end $$;
revoke all on function favx_private.remove_saved_membership() from public,anon,authenticated;
create trigger save_remove_membership after delete on public.user_saves for each row execute function favx_private.remove_saved_membership();
create function public.save_user_collection(p_id uuid,p_version integer,p_title text,p_description text,p_saved_ids uuid[],p_cover uuid default null)
returns table(id uuid,version integer) language plpgsql security invoker set search_path='' as $$
declare result public.user_collections;
begin
 if auth.uid() is null or not favx_private.library_active() then raise exception 'UNAUTHORIZED' using errcode='42501'; end if;
 if p_version=0 then
  insert into public.user_collections(id,user_id,title,description,saved_ids,cover_saved_id) values(p_id,auth.uid(),btrim(p_title),p_description,p_saved_ids,p_cover) on conflict do nothing returning * into result;
  if result.id is null then select * into result from public.user_collections c where c.id=p_id and c.user_id=auth.uid() and c.version=1 and c.title=btrim(p_title) and c.description=p_description and c.saved_ids=p_saved_ids and c.cover_saved_id is not distinct from p_cover; end if;
 else
  update public.user_collections c set title=btrim(p_title),description=p_description,saved_ids=p_saved_ids,cover_saved_id=p_cover where c.id=p_id and c.user_id=auth.uid() and c.version=p_version returning * into result;
 end if;
 if result.id is null then raise exception 'COLLECTION_CONFLICT' using errcode='40001'; end if;
 return query select result.id,result.version;
end $$;
revoke all on function public.save_user_collection(uuid,integer,text,text,uuid[],uuid) from public,anon;
grant execute on function public.save_user_collection(uuid,integer,text,text,uuid[],uuid) to authenticated;
create function public.share_user_collection(p_id uuid,p_version integer,p_enabled boolean)
returns table(version integer,share_token text) language plpgsql security invoker set search_path='' as $$
declare result public.user_collections;
begin
 update public.user_collections c set share_enabled=p_enabled where c.id=p_id and c.user_id=auth.uid() and c.version=p_version returning * into result;
 if result.id is null then raise exception 'COLLECTION_CONFLICT' using errcode='40001'; end if;
 return query select result.version,result.share_token;
end $$;
revoke all on function public.share_user_collection(uuid,integer,boolean) from public,anon;
grant execute on function public.share_user_collection(uuid,integer,boolean) to authenticated;

create function public.get_user_library(p_query text default '',p_category text default '',p_creator text default '',p_since timestamptz default null,p_order text default 'newest',p_page integer default 1,p_collection uuid default null,p_item uuid default null)
returns jsonb language sql stable security invoker set search_path='' as $$
 with collection as (select saved_ids from public.user_collections where id=p_collection and user_id=auth.uid()),
 own as materialized (select s.id,s.saved_at,favx_private.library_post(s.post_public_id) post from public.user_saves s where s.user_id=auth.uid()),
 matched as (select * from own o where (p_item is null or o.id=p_item)
 and (p_collection is null or o.id=any((select saved_ids from collection)::uuid[]))
 and (coalesce(p_query,'')='' or position(lower(left(p_query,120)) in lower(o.post->>'title'||' '||(o.post->>'body')||' '||(o.post->>'tags')))>0)
 and (coalesce(p_category,'')='' or (o.post->'categories') ? p_category)
 and (coalesce(p_creator,'')='' or o.post->>'username'=p_creator)
 and (p_since is null or o.saved_at>=p_since)),
 ordered as (select * from matched order by case when p_collection is not null then array_position((select saved_ids from collection),id) end,
 case when p_order='oldest' then saved_at end asc,case when p_order<>'oldest' then saved_at end desc,id limit 24 offset ((greatest(1,least(coalesce(p_page,1),100000))-1)*24))
 select jsonb_build_object('items',(select coalesce(jsonb_agg(jsonb_build_object('id',id,'saved_at',saved_at,'post',post)),'[]') from ordered),'total',(select count(*) from matched),
 'categories',(select coalesce(jsonb_agg(category order by category),'[]') from (select distinct jsonb_array_elements_text(post->'categories') category from own) cats),
 'creators',(select coalesce(jsonb_agg(jsonb_build_object('username',username,'name',name) order by name),'[]') from (select distinct post->>'username' username,post->>'creator_name' name from own where post is not null) creators))
$$;
revoke all on function public.get_user_library(text,text,text,timestamptz,text,integer,uuid,uuid) from public,anon;
grant execute on function public.get_user_library(text,text,text,timestamptz,text,integer,uuid,uuid) to authenticated;

-- The only shared projection: authorized collection, current eligible posts, no owner identity or internal counts.
create function favx_private.shared_user_collection(p_token text,p_page integer) returns jsonb language sql stable security definer set search_path='' as $$
 with collection as (select c.* from public.user_collections c join public.profiles p on p.user_id=c.user_id where c.share_enabled and c.share_token=p_token and p.account_state='active' and p_token ~ '^[a-f0-9]{32}$'),
 items as materialized (select x.ordinality position,favx_private.library_post(s.post_public_id) post from collection c cross join lateral unnest(c.saved_ids) with ordinality x(id,ordinality) join public.user_saves s on s.id=x.id and s.user_id=c.user_id),
 eligible as (select * from items where post is not null),
 page as (select * from eligible order by position limit 24 offset ((greatest(1,least(coalesce(p_page,1),100000))-1)*24))
 select jsonb_build_object('title',c.title,'description',c.description,
 'cover',(select (favx_private.library_post(s.post_public_id)->'media_ids')->>0 from public.user_saves s where s.id=c.cover_saved_id and s.user_id=c.user_id),
 'posts',(select coalesce(jsonb_agg(post order by position),'[]') from page),
 'has_more',(select count(*) from eligible)>greatest(1,least(coalesce(p_page,1),100000))*24) from collection c
$$;
revoke all on function favx_private.shared_user_collection(text,integer) from public;
grant execute on function favx_private.shared_user_collection(text,integer) to anon,authenticated;
create function public.get_shared_user_collection(p_token text,p_page integer default 1) returns jsonb language sql stable security invoker set search_path='' as $$select favx_private.shared_user_collection(p_token,p_page)$$;
revoke all on function public.get_shared_user_collection(text,integer) from public;
grant execute on function public.get_shared_user_collection(text,integer) to anon,authenticated;
commit;
