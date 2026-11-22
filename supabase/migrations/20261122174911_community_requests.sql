begin;
create table public.community_requests (
 id uuid primary key,
 creator_id uuid not null references public.creator_profiles(user_id),
 title text not null check(char_length(btrim(title)) between 1 and 160),
 description text not null default '' check(char_length(description)<=3000),
 category text not null default '' check(char_length(category)<=60),
 instructions text not null default '' check(char_length(instructions)<=1500),
 state text not null default 'draft' check(state in ('draft','open','paused','closed')),
 expires_at timestamptz,
 version integer not null default 1,
 created_at timestamptz not null default now(),updated_at timestamptz not null default now()
);
create index community_requests_owner on public.community_requests(creator_id,updated_at desc,id);
alter table public.community_requests enable row level security;
revoke all on public.community_requests from public,anon,authenticated;
grant select on public.community_requests to authenticated;
grant insert(id,creator_id,title,description,category,instructions,state,expires_at),update(title,description,category,instructions,state,expires_at) on public.community_requests to authenticated;
create policy requests_owner on public.community_requests for all to authenticated using(
 creator_id=(select auth.uid()) and exists(select 1 from public.profiles p join public.creator_profiles c on c.user_id=p.user_id where p.user_id=(select auth.uid()) and p.account_state='active' and c.creator_state='active'))
with check(creator_id=(select auth.uid()) and exists(select 1 from public.profiles p join public.creator_profiles c on c.user_id=p.user_id where p.user_id=(select auth.uid()) and p.account_state='active' and c.creator_state='active'));
create function favx_private.validate_community_request() returns trigger language plpgsql security invoker set search_path='' as $$
begin
 if new.state='open' and (new.expires_at<=now() or not exists(select 1 from public.creator_profiles where user_id=auth.uid() and is_public)) then raise exception 'REQUEST_NOT_READY' using errcode='23514';end if;
 new.version:=case when tg_op='INSERT' then 1 else old.version+1 end;new.updated_at:=now();return new;
end$$;
revoke all on function favx_private.validate_community_request() from public,anon,authenticated;
create trigger community_request_validate before insert or update on public.community_requests for each row execute function favx_private.validate_community_request();
create function public.save_community_request(p_id uuid,p_version integer,p_payload jsonb)
returns table(id uuid,version integer) language plpgsql security invoker set search_path='' as $$
declare saved public.community_requests;
begin
 if p_version=0 then
  insert into public.community_requests(id,creator_id,title,description,category,instructions,state,expires_at) values(p_id,auth.uid(),btrim(p_payload->>'title'),p_payload->>'description',p_payload->>'category',p_payload->>'instructions',p_payload->>'state',(p_payload->>'expires_at')::timestamptz)
  on conflict do nothing returning * into saved;
  if saved.id is null then select * into saved from public.community_requests r where r.id=p_id and r.creator_id=auth.uid() and r.version=1 and r.title=btrim(p_payload->>'title') and r.description=p_payload->>'description' and r.category=p_payload->>'category' and r.instructions=p_payload->>'instructions' and r.state=p_payload->>'state' and r.expires_at is not distinct from (p_payload->>'expires_at')::timestamptz;end if;
 else
  update public.community_requests r set title=btrim(p_payload->>'title'),description=p_payload->>'description',category=p_payload->>'category',instructions=p_payload->>'instructions',state=p_payload->>'state',expires_at=(p_payload->>'expires_at')::timestamptz where r.id=p_id and r.creator_id=auth.uid() and r.version=p_version returning * into saved;
 end if;
 if saved.id is null then raise exception 'REQUEST_CONFLICT' using errcode='40001';end if;
 return query select saved.id,saved.version;
end$$;
revoke all on function public.save_community_request(uuid,integer,jsonb) from public,anon;
grant execute on function public.save_community_request(uuid,integer,jsonb) to authenticated;

-- Public projection: active request only; no responses, owner ID or counts.
create function favx_private.community_request(p_id uuid) returns jsonb language sql stable security definer set search_path='' as $$
 select jsonb_build_object('id',r.id,'title',r.title,'description',r.description,'category',r.category,'instructions',r.instructions,'expires_at',r.expires_at,'username',c.username,'display_name',c.display_name)
 from public.community_requests r join public.creator_profiles c on c.user_id=r.creator_id join public.profiles p on p.user_id=c.user_id
 where r.id=p_id and r.state='open' and (r.expires_at is null or r.expires_at>now()) and c.is_public and c.creator_state='active' and p.account_state='active'
$$;
revoke all on function favx_private.community_request(uuid) from public;
grant execute on function favx_private.community_request(uuid) to anon,authenticated;
create function public.get_community_request(p_id uuid) returns jsonb language sql stable security invoker set search_path='' as $$select favx_private.community_request(p_id)$$;
revoke all on function public.get_community_request(uuid) from public;
grant execute on function public.get_community_request(uuid) to anon,authenticated;

create table public.community_submissions (
 id uuid primary key,request_id uuid not null references public.community_requests(id),sender_id uuid not null references public.profiles(user_id),
 title text not null check(char_length(btrim(title)) between 1 and 160),
 description text not null check(char_length(btrim(description)) between 1 and 4000),
 category text not null default '' check(char_length(category)<=60),
 url text not null default '' check(url='' or (length(url)<=2048 and url ~ '^https://[a-zA-Z0-9]([a-zA-Z0-9.-]*[a-zA-Z0-9])?(/|\?|#|$)' and url !~ '[[:space:]\\@]')),
 review_state text not null default 'new' check(review_state in ('new','reviewing','selected','rejected','archived')),
 consent_version text not null default 'private-review-v1',
 submitted_at timestamptz not null default now(),reviewed_at timestamptz,version integer not null default 1
);
create index community_submissions_request on public.community_submissions(request_id,submitted_at desc,id);
create index community_submissions_sender on public.community_submissions(sender_id,submitted_at desc);
alter table public.community_submissions enable row level security;
revoke all on public.community_submissions from public,anon,authenticated;
-- Sender identity is not exposed to the Creator or available through SELECT *.
grant select(id,request_id,title,description,category,url,review_state,consent_version,submitted_at,reviewed_at,version),update(review_state) on public.community_submissions to authenticated;
create policy submissions_read_recipient on public.community_submissions for select to authenticated using(exists(select 1 from public.community_requests r where r.id=request_id and r.creator_id=(select auth.uid())));
create policy submissions_review_recipient on public.community_submissions for update to authenticated using(exists(select 1 from public.community_requests r where r.id=request_id and r.creator_id=(select auth.uid()))) with check(exists(select 1 from public.community_requests r where r.id=request_id and r.creator_id=(select auth.uid())));
create function favx_private.review_community_submission() returns trigger language plpgsql security invoker set search_path='' as $$
begin new.version:=old.version+1;new.reviewed_at:=now();return new;end$$;
revoke all on function favx_private.review_community_submission() from public,anon,authenticated;
create trigger community_submission_review before update on public.community_submissions for each row execute function favx_private.review_community_submission();

-- Atomic intake: callers cannot insert directly, enumerate replies or read rate-limit data.
-- Identity is derived from Auth; this narrowly scoped writer validates all eligibility and consent.
create function favx_private.submit_community_suggestion(p_id uuid,p_request uuid,p_payload jsonb) returns uuid language plpgsql security definer set search_path='' as $$
declare existing public.community_submissions; request public.community_requests; uid uuid:=auth.uid();
begin
 if uid is null or not exists(select 1 from public.profiles where user_id=uid and account_state='active') then raise exception 'UNAUTHORIZED' using errcode='42501';end if;
 if p_payload->'consent' is distinct from 'true'::jsonb then raise exception 'CONSENT_REQUIRED' using errcode='23514';end if;
 perform pg_advisory_xact_lock(hashtextextended(uid::text,752));
 select * into existing from public.community_submissions where id=p_id;
 if existing.id is not null then
  if existing.sender_id=uid and existing.request_id=p_request and existing.title=btrim(p_payload->>'title') and existing.description=p_payload->>'description' and existing.category=p_payload->>'category' and existing.url=p_payload->>'url' then return existing.id;end if;
  raise exception 'SUBMISSION_CONFLICT' using errcode='40001';
 end if;
 select * into request from public.community_requests where id=p_request for share;
 if request.id is null or favx_private.community_request(p_request) is null then raise exception 'REQUEST_CLOSED' using errcode='23514';end if;
 if (select count(*) from public.community_submissions where sender_id=uid and submitted_at>now()-interval '1 hour')>=5 then raise exception 'RATE_LIMIT' using errcode='54000';end if;
 insert into public.community_submissions(id,request_id,sender_id,title,description,category,url) values(p_id,p_request,uid,btrim(p_payload->>'title'),p_payload->>'description',p_payload->>'category',p_payload->>'url');
 return p_id;
end$$;
revoke all on function favx_private.submit_community_suggestion(uuid,uuid,jsonb) from public,anon;
grant execute on function favx_private.submit_community_suggestion(uuid,uuid,jsonb) to authenticated;
create function public.submit_community_suggestion(p_id uuid,p_request uuid,p_payload jsonb) returns uuid language sql security invoker set search_path='' as $$select favx_private.submit_community_suggestion(p_id,p_request,p_payload)$$;
revoke all on function public.submit_community_suggestion(uuid,uuid,jsonb) from public,anon;
grant execute on function public.submit_community_suggestion(uuid,uuid,jsonb) to authenticated;

create function public.get_creator_community_requests(p_state text default '',p_page integer default 1) returns jsonb language sql stable security invoker set search_path='' as $$
 with matched as (select * from public.community_requests where creator_id=(select auth.uid()) and (coalesce(p_state,'')='' or state=p_state)),
 page as (select * from matched order by updated_at desc,id limit 20 offset ((greatest(1,least(coalesce(p_page,1),100000))-1)*20))
 select jsonb_build_object('total',(select count(*) from matched),'items',coalesce((select jsonb_agg((to_jsonb(r)-'creator_id')||jsonb_build_object('received',(select count(s.id) from public.community_submissions s where s.request_id=r.id)) order by r.updated_at desc,r.id) from page r),'[]'))
$$;
revoke all on function public.get_creator_community_requests(text,integer) from public,anon;
grant execute on function public.get_creator_community_requests(text,integer) to authenticated;
create function public.get_community_inbox(p_request uuid default null,p_state text default '',p_page integer default 1,p_id uuid default null) returns jsonb language sql stable security invoker set search_path='' as $$
 with matched as (select s.id,s.request_id,s.title,s.description,s.category,s.url,s.review_state,s.consent_version,s.submitted_at,s.reviewed_at,s.version,r.title request_title from public.community_submissions s join public.community_requests r on r.id=s.request_id where r.creator_id=(select auth.uid()) and (p_request is null or s.request_id=p_request) and (coalesce(p_state,'')='' or s.review_state=p_state) and (p_id is null or s.id=p_id)),
 page as (select * from matched order by submitted_at desc,id limit 20 offset ((greatest(1,least(coalesce(p_page,1),100000))-1)*20))
 select jsonb_build_object('total',(select count(*) from matched),'items',coalesce((select jsonb_agg(to_jsonb(s) order by s.submitted_at desc,s.id) from page s),'[]'))
$$;
revoke all on function public.get_community_inbox(uuid,text,integer,uuid) from public,anon;
grant execute on function public.get_community_inbox(uuid,text,integer,uuid) to authenticated;
commit;
