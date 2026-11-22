begin;
alter table public.creator_posts drop constraint creator_posts_lifecycle_state_check;
alter table public.creator_posts add constraint creator_posts_lifecycle_state_check check (lifecycle_state in ('draft','published','hidden','archived','trashed'));
alter table public.creator_posts add column state_changed_at timestamptz;
-- No expiry or purge policy is implied by the reversible trash state.
create function favx_private.check_post_transition() returns trigger language plpgsql security invoker set search_path='' as $$
begin
 if tg_op='INSERT' then
  if new.lifecycle_state in ('archived','trashed') then raise exception 'INVALID_TRANSITION' using errcode='23514'; end if;
 elsif old.lifecycle_state in ('archived','trashed') then
  if not (new.lifecycle_state='draft' or (old.lifecycle_state='archived' and new.lifecycle_state='trashed'))
    or (to_jsonb(new)-'lifecycle_state') is distinct from (to_jsonb(old)-'lifecycle_state') then
   raise exception 'RESTORE_AS_DRAFT' using errcode='23514';
  end if;
 end if;
 if tg_op='INSERT' or old.lifecycle_state is distinct from new.lifecycle_state then new.state_changed_at:=now(); end if;
 return new;
end $$;
revoke all on function favx_private.check_post_transition() from public,anon,authenticated;
create trigger posts_00_transition before insert or update on public.creator_posts for each row execute function favx_private.check_post_transition();

create function public.transition_creator_post(p_id uuid,p_version integer,p_action text)
returns table(id uuid,version integer,lifecycle_state text)
language plpgsql security invoker set search_path='' as $$
declare saved public.creator_posts; target text;
begin
 if auth.uid() is null then raise exception 'UNAUTHORIZED' using errcode='42501'; end if;
 target:=case p_action when 'hide' then 'hidden' when 'archive' then 'archived' when 'trash' then 'trashed' when 'restore' then 'draft' end;
 if target is null then raise exception 'INVALID_TRANSITION' using errcode='23514'; end if;
 update public.creator_posts x set lifecycle_state=target where x.id=p_id and x.creator_id=auth.uid() and x.version=p_version
  and case p_action when 'hide' then x.lifecycle_state='published'
   when 'archive' then x.lifecycle_state in ('draft','published','hidden')
   when 'trash' then x.lifecycle_state<>'trashed'
   when 'restore' then x.lifecycle_state in ('hidden','archived','trashed') else false end
 returning * into saved;
 if saved.id is null then raise exception 'POST_CONFLICT' using errcode='40001'; end if;
 return query select saved.id,saved.version,saved.lifecycle_state;
end $$;
revoke all on function public.transition_creator_post(uuid,integer,text) from public,anon;
grant execute on function public.transition_creator_post(uuid,integer,text) to authenticated;

-- History stays append-only. The invoker projection uses RLS even when called directly.
grant select on favx_private.post_revisions to authenticated;
create policy revisions_read_own on favx_private.post_revisions for select to authenticated using (
 exists(select 1 from public.creator_posts x join public.profiles p on p.user_id=x.creator_id join public.creator_profiles c on c.user_id=p.user_id
 where x.id=post_id and x.creator_id=(select auth.uid()) and p.account_state='active' and c.creator_state='active'));
create function public.get_creator_post_history(p_id uuid,p_page integer default 1)
returns table(version integer,changed_at timestamptz,snapshot jsonb)
language sql stable security invoker set search_path='' as $$
 select r.version,r.changed_at,
 (select jsonb_object_agg(k,v) from jsonb_each(r.snapshot) t(k,v) where k=any(array['title','body','lifecycle_state','tags','categories','links','rating','is_sponsored','disclosure','media_ids','private_context']))
 from favx_private.post_revisions r where r.post_id=p_id order by r.version desc
 limit 21 offset ((greatest(1,least(coalesce(p_page,1),100000))-1)*20)
$$;
revoke all on function public.get_creator_post_history(uuid,integer) from public,anon;
grant execute on function public.get_creator_post_history(uuid,integer) to authenticated;

-- Bounded media inventory, including assets referenced by archived/trashed posts.
create function public.get_creator_media_library(p_query text default '',p_status text default '',p_page integer default 1,p_id uuid default null)
returns jsonb language sql stable security invoker set search_path='' as $$
 with eligible as (select m.* from public.creator_media m where m.creator_id=(select auth.uid())
  and exists(select 1 from public.profiles p join public.creator_profiles c on c.user_id=p.user_id where p.user_id=(select auth.uid()) and p.account_state='active' and c.creator_state='active')
  and (p_id is null or m.id=p_id) and (coalesce(p_status,'')='' or m.status=p_status)
  and (coalesce(p_query,'')='' or position(lower(left(p_query,120)) in lower(m.filename))>0)),
 page as (select * from eligible order by created_at desc,id limit 24 offset ((greatest(1,least(coalesce(p_page,1),100000))-1)*24))
 select jsonb_build_object('total',(select count(*) from eligible),'items',coalesce((select jsonb_agg(to_jsonb(m)-'creator_id' order by m.created_at desc,m.id) from page m),'[]'))
$$;
revoke all on function public.get_creator_media_library(text,text,integer,uuid) from public,anon;
grant execute on function public.get_creator_media_library(text,text,integer,uuid) to authenticated;
commit;
