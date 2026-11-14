-- FAVX incremento 1: identidade e perfil Creator.
-- Desvio registrado: schema public + RLS (o DOC05 prevê schema privado `app` acessado só pelo servidor com service_role,
-- que o conector não fornece). Troca de username NÃO implementada (aguarda homologação de A-04/A-12/D08).

create table public.reserved_slugs (
  slug text primary key check (slug = lower(slug)),
  reason text not null,
  created_at timestamptz not null default now()
);
alter table public.reserved_slugs enable row level security;
revoke all on table public.reserved_slugs from anon, authenticated;

-- Lista PROPOSTA e EM VALIDAÇÃO (A-03): idêntica a src/lib/username.ts
insert into public.reserved_slugs (slug, reason)
select slug, 'lista proposta A-03 (em validação)' from unnest(string_to_array('400,401,403,404,405,410,429,500,502,503,504,about,account,admin,ajuda,api,app,assets,auth,billing,brand,brands,c,cdn,checkout,collections,como-funciona,connections,conta-restrita,contact,contato,cookies,creator,creators,criar-conta,delete-account,discover,edit,email,en,entrar,erro,error,errors,es,events,explore,favicon,favx,fr,global,health,help,humans,internal,invitations,invite,it,legal,library,login,logout,mail,manifest,marketplace,me,media,moderator,new,notifications,official,p,parceiros,partner,partners,plans,precos,pricing,privacy,profile,proof,pt,pt-br,pt-pt,public,r,recover-access,recuperar-acesso,redefinir-senha,register,requests,reset-password,restricted-account,robots,s,saved,search,security,serviceworker,settings,signin,signup,site,sitemap,staff,static,status,support,sw,team,terms,user,users,verificar-email,verify,verify-email,webhooks,well-known,www', ',')) as slug;

create or replace function public.set_updated_at() returns trigger language plpgsql set search_path = '' as $$
begin new.updated_at = now(); return new; end $$;

create table public.profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  account_state text not null default 'active' check (account_state in ('active','suspended','deletion_requested')),
  display_name text check (display_name is null or char_length(display_name) between 1 and 80),
  preferred_locale text not null default 'pt-br' check (preferred_locale in ('pt-br','pt-pt','en','es','it','fr')),
  timezone text not null default 'America/Sao_Paulo' check (char_length(timezone) between 1 and 64),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.validate_profile() returns trigger language plpgsql set search_path = '' as $$
begin
  if not exists (select 1 from pg_catalog.pg_timezone_names n where n.name = new.timezone) then
    raise exception 'TIMEZONE_INVALID' using errcode = '23514';
  end if;
  return new;
end $$;
create trigger profiles_validate before insert or update of timezone on public.profiles for each row execute function public.validate_profile();
create trigger profiles_updated_at before update on public.profiles for each row execute function public.set_updated_at();

create table public.creator_profiles (
  user_id uuid primary key references public.profiles(user_id) on delete cascade,
  username text not null,
  display_name text not null check (char_length(display_name) between 1 and 80),
  bio text check (bio is null or char_length(bio) <= 500),
  is_public boolean not null default false,
  creator_state text not null default 'active' check (creator_state in ('active','suspended')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint creator_profiles_username_format check (username ~ '^[a-z0-9][a-z0-9_-]{2,29}$')
);
create unique index creator_profiles_username_ci_key on public.creator_profiles (lower(username));

create or replace function public.enforce_username_policy() returns trigger language plpgsql security definer set search_path = '' as $$
begin
  if tg_op = 'UPDATE' and new.username is distinct from old.username then
    raise exception 'USERNAME_IMMUTABLE' using errcode = '23514', hint = 'Troca de username aguarda homologação (A-04/A-12).';
  end if;
  if tg_op = 'INSERT' then
    new.username := lower(new.username);
    if new.username !~ '^[a-z0-9][a-z0-9_-]{2,29}$' then
      raise exception 'USERNAME_FORMAT' using errcode = '23514';
    end if;
    if exists (select 1 from public.reserved_slugs r where r.slug = new.username) then
      raise exception 'USERNAME_RESERVED' using errcode = '23514';
    end if;
  end if;
  return new;
end $$;
create trigger creator_profiles_username_policy before insert or update of username on public.creator_profiles for each row execute function public.enforce_username_policy();
create trigger creator_profiles_updated_at before update on public.creator_profiles for each row execute function public.set_updated_at();

create or replace function public.handle_new_user() returns trigger language plpgsql security definer set search_path = '' as $$
begin
  insert into public.profiles (user_id) values (new.id) on conflict do nothing;
  return new;
end $$;
create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_user();

revoke execute on function public.set_updated_at() from public, anon, authenticated;
revoke execute on function public.validate_profile() from public, anon, authenticated;
revoke execute on function public.enforce_username_policy() from public, anon, authenticated;
revoke execute on function public.handle_new_user() from public, anon, authenticated;

-- Privilégios por coluna: o próprio usuário NUNCA altera account_state, creator_state ou is_public.
alter table public.profiles enable row level security;
alter table public.creator_profiles enable row level security;
revoke all on table public.profiles from anon, authenticated;
revoke all on table public.creator_profiles from anon, authenticated;
grant select on public.profiles to authenticated;
grant update (display_name, preferred_locale, timezone) on public.profiles to authenticated;
grant select on public.creator_profiles to authenticated;
grant insert (user_id, username, display_name, bio) on public.creator_profiles to authenticated;
grant update (display_name, bio) on public.creator_profiles to authenticated;

create policy profiles_select_own on public.profiles for select to authenticated using (user_id = (select auth.uid()));
create policy profiles_update_own on public.profiles for update to authenticated
  using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
create policy creator_select_own on public.creator_profiles for select to authenticated using (user_id = (select auth.uid()));
create policy creator_insert_own on public.creator_profiles for insert to authenticated
  with check (user_id = (select auth.uid()) and exists (select 1 from public.profiles p where p.user_id = (select auth.uid()) and p.account_state = 'active'));
create policy creator_update_own on public.creator_profiles for update to authenticated
  using (user_id = (select auth.uid()) and creator_state = 'active') with check (user_id = (select auth.uid()));

create or replace function public.username_problem(p_username text) returns text language plpgsql stable security definer set search_path = '' as $$
declare n text := lower(btrim(normalize(p_username, NFKC)));
begin
  if n !~ '^[a-z0-9][a-z0-9_-]{2,29}$' then return 'format'; end if;
  if exists (select 1 from public.reserved_slugs r where r.slug = n) then return 'reserved'; end if;
  if exists (select 1 from public.creator_profiles c where lower(c.username) = n) then return 'taken'; end if;
  return null;
end $$;
revoke execute on function public.username_problem(text) from public, anon;
grant execute on function public.username_problem(text) to authenticated;
