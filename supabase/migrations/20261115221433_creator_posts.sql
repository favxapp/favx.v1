-- Additive editorial increment on the existing public schema; no media originals in this table.
begin;
create function favx_private.valid_post_links(items jsonb) returns boolean
language plpgsql immutable security invoker set search_path='' as $$
declare item jsonb;
begin
  if jsonb_typeof(items) is distinct from 'array' or jsonb_array_length(items)>20 then return false; end if;
  for item in select value from jsonb_array_elements(items) loop
    if jsonb_typeof(item) is distinct from 'object' or (select count(*) from jsonb_object_keys(item))<>3
      or jsonb_typeof(item->'label') is distinct from 'string' or length(item->>'label') not between 1 and 80
      or jsonb_typeof(item->'url') is distinct from 'string' or length(item->>'url')>2048
      or item->>'url' !~ '^https://[a-zA-Z0-9]([a-zA-Z0-9.-]*[a-zA-Z0-9])?(/|\?|#|$)'
      or item->>'url' ~ '[[:space:]\\@]'
      or jsonb_typeof(item->'coupon') is distinct from 'string' or length(item->>'coupon')>80
    then return false; end if;
  end loop;
  return true;
end $$;
revoke all on function favx_private.valid_post_links(jsonb) from public;
grant execute on function favx_private.valid_post_links(jsonb) to authenticated;

create function favx_private.valid_post_tags(items text[]) returns boolean
language sql immutable security invoker set search_path='' as $$
 select items is not null and cardinality(items)<=20 and not exists(
   select 1 from unnest(items) item where item is null or length(btrim(item)) not between 1 and 30 or item ~ '[<>]')
$$;
revoke all on function favx_private.valid_post_tags(text[]) from public;
grant execute on function favx_private.valid_post_tags(text[]) to authenticated;

create table public.creator_posts (
  id uuid primary key,
  creator_id uuid not null references public.creator_profiles(user_id),
  public_id text not null unique default replace(gen_random_uuid()::text,'-',''),
  slug text not null default 'post' check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$' and length(slug)<=120),
  title text not null default '' check (char_length(title)<=160),
  body text not null default '' check (char_length(body)<=10000),
  content_kind text not null default 'recommendation' check (content_kind in ('recommendation','product','service','place','experience','culture','event')),
  tags text[] not null default '{}' check (favx_private.valid_post_tags(tags)),
  links jsonb not null default '[]' check (favx_private.valid_post_links(links)),
  rating numeric check (rating between 0 and 10 and mod(rating*2,1)=0),
  is_sponsored boolean not null default false,
  disclosure text not null default '' check (char_length(disclosure)<=300),
  lifecycle_state text not null default 'draft' check (lifecycle_state in ('draft','published','hidden')),
  version integer not null default 1,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint published_post_complete check (lifecycle_state <> 'published' or
    (length(btrim(title))>0 and length(btrim(body))>0 and (not is_sponsored or length(btrim(disclosure))>0)))
);
create index creator_posts_owner_updated on public.creator_posts(creator_id,updated_at desc,id);
alter table public.creator_posts enable row level security;
revoke all on public.creator_posts from public,anon,authenticated;
grant select on public.creator_posts to authenticated;
grant insert (id,creator_id,slug,title,body,content_kind,tags,links,rating,is_sponsored,disclosure,lifecycle_state) on public.creator_posts to authenticated;
grant update (slug,title,body,content_kind,tags,links,rating,is_sponsored,disclosure,lifecycle_state) on public.creator_posts to authenticated;
create policy posts_select_own on public.creator_posts for select to authenticated using (creator_id=(select auth.uid()));
create policy posts_insert_own on public.creator_posts for insert to authenticated with check (
  creator_id=(select auth.uid()) and exists(select 1 from public.creator_profiles c join public.profiles p on p.user_id=c.user_id
    where c.user_id=(select auth.uid()) and c.creator_state='active' and p.account_state='active'));
create policy posts_update_own on public.creator_posts for update to authenticated using (
  creator_id=(select auth.uid()) and exists(select 1 from public.creator_profiles c join public.profiles p on p.user_id=c.user_id
    where c.user_id=(select auth.uid()) and c.creator_state='active' and p.account_state='active'))
with check (creator_id=(select auth.uid()) and exists(select 1 from public.creator_profiles c join public.profiles p on p.user_id=c.user_id
    where c.user_id=(select auth.uid()) and c.creator_state='active' and p.account_state='active'));

create table favx_private.post_revisions (
 post_id uuid not null references public.creator_posts(id), version integer not null,
 snapshot jsonb not null, changed_at timestamptz not null default now(), primary key(post_id,version)
);
alter table favx_private.post_revisions enable row level security;
revoke all on favx_private.post_revisions from public,anon,authenticated;
-- A narrowly scoped trigger writes audit snapshots. It cannot be invoked as a normal RPC.
create function favx_private.record_post_revision() returns trigger
language plpgsql security definer set search_path='' as $$
begin
 if auth.uid() is null or new.creator_id<>auth.uid() then raise exception 'UNAUTHORIZED' using errcode='42501'; end if;
 if new.lifecycle_state='published' and not exists(select 1 from public.creator_profiles c join public.profiles p on p.user_id=c.user_id
   where c.user_id=auth.uid() and c.is_public and c.creator_state='active' and p.account_state='active') then
   raise exception 'PUBLIC_PROFILE_REQUIRED' using errcode='23514';
 end if;
 new.version:=case when tg_op='INSERT' then 1 else old.version+1 end;
 new.updated_at:=now();
 if new.lifecycle_state='published' and new.published_at is null then new.published_at:=now(); end if;
 return new;
end $$;
revoke all on function favx_private.record_post_revision() from public,anon,authenticated;
create trigger posts_before_write before insert or update on public.creator_posts for each row execute function favx_private.record_post_revision();
create function favx_private.audit_post_revision() returns trigger
language plpgsql security definer set search_path='' as $$
begin
 if auth.uid() is null or new.creator_id<>auth.uid() then raise exception 'UNAUTHORIZED' using errcode='42501'; end if;
 insert into favx_private.post_revisions(post_id,version,snapshot) values(new.id,new.version,to_jsonb(new));
 return new;
end $$;
revoke all on function favx_private.audit_post_revision() from public,anon,authenticated;
create trigger posts_after_write after insert or update on public.creator_posts for each row execute function favx_private.audit_post_revision();

create function public.save_creator_post(p_id uuid,p_expected_version integer,p_payload jsonb,p_status text)
returns table(id uuid,version integer,public_id text,slug text,lifecycle_state text)
language plpgsql security invoker set search_path='' as $$
declare result public.creator_posts; current_post public.creator_posts; tags_value text[];
begin
 if auth.uid() is null then raise exception 'UNAUTHORIZED' using errcode='42501'; end if;
 if p_expected_version is null or p_expected_version<0 or p_status is null or p_status not in ('draft','published','hidden') then raise exception 'INVALID_POST' using errcode='23514'; end if;
 if jsonb_typeof(p_payload->'tags') is distinct from 'array' then raise exception 'INVALID_POST' using errcode='23514'; end if;
 select coalesce(array_agg(value),'{}') into tags_value from jsonb_array_elements_text(p_payload->'tags');
 if p_expected_version=0 then
   insert into public.creator_posts(id,creator_id,title,body,slug,content_kind,tags,links,rating,is_sponsored,disclosure,lifecycle_state)
     values(p_id,auth.uid(),p_payload->>'title',p_payload->>'body',p_payload->>'slug',p_payload->>'content_kind',tags_value,p_payload->'links',
       (p_payload->>'rating')::numeric,(p_payload->>'is_sponsored')::boolean,p_payload->>'disclosure',p_status)
     on conflict do nothing returning * into result;
   if result.id is null then
     select * into current_post from public.creator_posts x where x.id=p_id and x.creator_id=auth.uid();
     if current_post.id is not null and current_post.version=1 and current_post.lifecycle_state=p_status
       and current_post.title=p_payload->>'title' and current_post.body=p_payload->>'body'
       and current_post.slug=p_payload->>'slug' and current_post.content_kind=p_payload->>'content_kind'
       and current_post.tags=tags_value and current_post.links=p_payload->'links'
       and current_post.rating is not distinct from (p_payload->>'rating')::numeric
       and current_post.is_sponsored=(p_payload->>'is_sponsored')::boolean and current_post.disclosure=p_payload->>'disclosure' then
       result:=current_post;
     else raise exception 'POST_CONFLICT' using errcode='40001'; end if;
   end if;
 else
   update public.creator_posts x set title=p_payload->>'title',body=p_payload->>'body',slug=p_payload->>'slug',content_kind=p_payload->>'content_kind',
     tags=tags_value,links=p_payload->'links',rating=(p_payload->>'rating')::numeric,is_sponsored=(p_payload->>'is_sponsored')::boolean,
     disclosure=p_payload->>'disclosure',lifecycle_state=p_status
     where x.id=p_id and x.creator_id=auth.uid() and x.version=p_expected_version returning * into result;
   if result.id is null then raise exception 'POST_CONFLICT' using errcode='40001'; end if;
 end if;
 return query select result.id,result.version,result.public_id,result.slug,result.lifecycle_state;
end $$;
revoke all on function public.save_creator_post(uuid,integer,jsonb,text) from public,anon;
grant execute on function public.save_creator_post(uuid,integer,jsonb,text) to authenticated;

-- Deliberate public projection. Private drafts and owner IDs never enter this result.
create function favx_private.public_posts(p_username text,p_public_id text default null,p_page integer default 1)
returns table(public_id text,slug text,title text,body text,content_kind text,tags text[],links jsonb,rating numeric,is_sponsored boolean,disclosure text,published_at timestamptz)
language sql stable security definer set search_path='' as $$
 select x.public_id,x.slug,x.title,x.body,x.content_kind,x.tags,x.links,x.rating,x.is_sponsored,x.disclosure,x.published_at
 from public.creator_posts x join public.creator_profiles c on c.user_id=x.creator_id join public.profiles p on p.user_id=c.user_id
 where c.username=p_username and c.is_public and c.creator_state='active' and p.account_state='active'
 and x.lifecycle_state='published' and (p_public_id is null or x.public_id=p_public_id)
 
 order by x.published_at desc,x.id desc limit 21 offset ((greatest(1,least(coalesce(p_page,1),100000))-1)*20)
$$;
revoke all on function favx_private.public_posts(text,text,integer) from public;
grant execute on function favx_private.public_posts(text,text,integer) to anon,authenticated;
create function public.get_public_posts(p_username text,p_public_id text default null,p_page integer default 1)
returns table(public_id text,slug text,title text,body text,content_kind text,tags text[],links jsonb,rating numeric,is_sponsored boolean,disclosure text,published_at timestamptz)
language sql stable security invoker set search_path='' as $$ select * from favx_private.public_posts(p_username,p_public_id,p_page) $$;
revoke all on function public.get_public_posts(text,text,integer) from public;
grant execute on function public.get_public_posts(text,text,integer) to anon,authenticated;
commit;
