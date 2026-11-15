-- Draft additive change against the live public-schema foundation. Not the DOC05 baseline.
-- Before deployment: inspect live policies; generate a migration with Supabase CLI and copy this reviewed SQL.
-- No existing profile is published automatically.
begin;
create schema if not exists favx_private;
revoke all on schema favx_private from public;
grant usage on schema favx_private to anon, authenticated;

alter table public.creator_profiles
  add column avatar_namespace uuid not null default gen_random_uuid(),
  add column avatar_path text,
  add column social_links jsonb not null default '[]'::jsonb,
  add constraint creator_avatar_owned check (avatar_path is null or avatar_path ~ ('^' || avatar_namespace::text || '/[a-f0-9-]{36}\.webp$'));

create function favx_private.valid_social_links(links jsonb) returns boolean
language plpgsql immutable security invoker set search_path = '' as $$
declare item jsonb; network text; address text; hosts text; seen text[] := '{}';
begin
  if jsonb_typeof(links) <> 'array' or jsonb_array_length(links) > 15 then return false; end if;
  for item in select value from jsonb_array_elements(links) loop
    if jsonb_typeof(item) <> 'object' or jsonb_typeof(item->'url') is distinct from 'string' or jsonb_typeof(item->'network') is distinct from 'string' then return false; end if;
    network := item->>'network'; address := item->>'url';
    if network = any(seen) or length(address) > 2048 or address ~ '[[:space:]\\]' then return false; end if;
    seen := array_append(seen, network);
    hosts := case network
      when 'instagram' then 'instagram\.com' when 'tiktok' then 'tiktok\.com'
      when 'youtube' then '(youtube\.com|youtu\.be)' when 'facebook' then '(facebook\.com|fb\.com)'
      when 'threads' then '(threads\.net|threads\.com)' when 'x' then '(x\.com|twitter\.com)'
      when 'bluesky' then 'bsky\.app' when 'linkedin' then 'linkedin\.com'
      when 'pinterest' then '(pinterest\.com|pinterest\.com\.br|pin\.it)' when 'twitch' then 'twitch\.tv'
      when 'discord' then '(discord\.com|discord\.gg)' when 'telegram' then '(t\.me|telegram\.me)'
      when 'whatsapp' then '(wa\.me|whatsapp\.com)' when 'snapchat' then 'snapchat\.com'
      when 'spotify' then 'spotify\.com' else null end;
    if hosts is null or address !~ ('^https://([a-zA-Z0-9-]+\.)*' || hosts || '(/|\?|#|$)') then return false; end if;
    -- Keep the JSON projection limited to the two documented keys.
    if (select count(*) from jsonb_object_keys(item)) <> 2 then return false; end if;
  end loop;
  return true;
end $$;
revoke all on function favx_private.valid_social_links(jsonb) from public;
grant execute on function favx_private.valid_social_links(jsonb) to authenticated;
alter table public.creator_profiles add constraint creator_social_links_valid check (favx_private.valid_social_links(social_links));
grant update (avatar_path, social_links, is_public) on public.creator_profiles to authenticated;

-- Own profile only, with both account and Creator state enforced.
drop policy creator_update_own on public.creator_profiles;
create policy creator_update_own on public.creator_profiles for update to authenticated
  using (user_id = (select auth.uid()) and creator_state = 'active' and exists (
    select 1 from public.profiles p where p.user_id = (select auth.uid()) and p.account_state = 'active'))
  with check (user_id = (select auth.uid()) and creator_state = 'active' and exists (
    select 1 from public.profiles p where p.user_id = (select auth.uid()) and p.account_state = 'active'));
drop policy profiles_update_own on public.profiles;
create policy profiles_update_own on public.profiles for update to authenticated
  using (user_id = (select auth.uid()) and account_state = 'active')
  with check (user_id = (select auth.uid()) and account_state = 'active');

create function public.save_creator_profile(p_name text, p_bio text, p_locale text, p_timezone text, p_links jsonb, p_public boolean)
returns void language plpgsql security invoker set search_path = '' as $$
begin
  if auth.uid() is null then raise exception 'UNAUTHORIZED' using errcode = '42501'; end if;
  if p_name is null or length(btrim(p_name)) = 0 then raise exception 'NAME_REQUIRED' using errcode = '23514'; end if;
  update public.creator_profiles set display_name = btrim(p_name), bio = p_bio, social_links = p_links, is_public = p_public where user_id = auth.uid();
  if not found then raise exception 'CREATOR_UNAVAILABLE' using errcode = '42501'; end if;
  update public.profiles set display_name = btrim(p_name), preferred_locale = p_locale, timezone = p_timezone where user_id = auth.uid();
  if not found then raise exception 'ACCOUNT_UNAVAILABLE' using errcode = '42501'; end if;
end $$;
revoke all on function public.save_creator_profile(text,text,text,text,jsonb,boolean) from public, anon;
grant execute on function public.save_creator_profile(text,text,text,text,jsonb,boolean) to authenticated;

-- Intentional public projection: no user_id, account preferences, internal state or analytics.
-- The definer is private; the exposed API function is an invoker wrapper with a narrow signature.
create function favx_private.public_creator(p_username text)
returns table(username text, display_name text, bio text, avatar_path text, social_links jsonb)
language sql stable security definer set search_path = '' as $$
  select c.username, c.display_name, c.bio, c.avatar_path, c.social_links
  from public.creator_profiles c join public.profiles p on p.user_id = c.user_id
  where c.username = p_username and c.is_public and c.creator_state = 'active' and p.account_state = 'active'
    and p_username ~ '^[a-z0-9][a-z0-9_-]{2,29}$'
$$;
revoke all on function favx_private.public_creator(text) from public;
grant execute on function favx_private.public_creator(text) to anon, authenticated;
create function public.get_public_creator(p_username text)
returns table(username text, display_name text, bio text, avatar_path text, social_links jsonb)
language sql stable security invoker set search_path = '' as $$ select * from favx_private.public_creator(p_username) $$;
revoke all on function public.get_public_creator(text) from public;
grant execute on function public.get_public_creator(text) to anon, authenticated;

create function favx_private.username_problem(p_username text) returns text
language plpgsql stable security definer set search_path = '' as $$
declare n text := lower(btrim(normalize(p_username, NFKC)));
begin
  if auth.uid() is null or not exists(select 1 from public.profiles p where p.user_id = auth.uid() and p.account_state = 'active') then
    raise exception 'UNAUTHORIZED' using errcode = '42501';
  end if;
  if n is null or n !~ '^[a-z0-9][a-z0-9_-]{2,29}$' then return 'format'; end if;
  if exists(select 1 from public.reserved_slugs r where r.slug = n) then return 'reserved'; end if;
  if exists(select 1 from public.creator_profiles c where c.username = n) then return 'taken'; end if;
  return null;
end $$;
revoke all on function favx_private.username_problem(text) from public, anon;
grant execute on function favx_private.username_problem(text) to authenticated;
create or replace function public.username_problem(p_username text) returns text
language sql stable security invoker set search_path = '' as $$ select favx_private.username_problem(p_username) $$;
revoke all on function public.username_problem(text) from public, anon;
grant execute on function public.username_problem(text) to authenticated;
commit;
