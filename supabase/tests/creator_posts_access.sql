-- Transactional integration probe; fixture identities and posts are always rolled back.
begin;
select set_config('favx.test_a',gen_random_uuid()::text,true);
select set_config('favx.test_b',gen_random_uuid()::text,true);
select set_config('favx.test_post',gen_random_uuid()::text,true);
select set_config('favx.test_username','qa_'||substr(replace(current_setting('favx.test_a'),'-',''),1,27),true);
select set_config('favx.test_payload','{"title":"QA post","body":"Temporary test","slug":"qa-post","content_kind":"recommendation","tags":[],"links":[],"rating":9.5,"is_sponsored":false,"disclosure":""}',true);
insert into auth.users(id) values(current_setting('favx.test_a')::uuid),(current_setting('favx.test_b')::uuid);
set local role authenticated;
select set_config('request.jwt.claim.sub',current_setting('favx.test_a'),true);
insert into public.creator_profiles(user_id,username,display_name) values(auth.uid(),current_setting('favx.test_username'),'QA Creator');
select * from public.save_creator_post(current_setting('favx.test_post')::uuid,0,current_setting('favx.test_payload')::jsonb,'draft');
select * from public.save_creator_post(current_setting('favx.test_post')::uuid,0,current_setting('favx.test_payload')::jsonb,'draft');
do $$ begin
 if (select version from public.creator_posts where id=current_setting('favx.test_post')::uuid)<>1 then raise exception 'Retry created revision'; end if;
 begin
  perform public.save_creator_post(current_setting('favx.test_post')::uuid,1,current_setting('favx.test_payload')::jsonb,'published');
  raise exception 'Private creator published';
 exception when check_violation then null; end;
end $$;
set local role anon;
select set_config('request.jwt.claim.sub','',true);
do $$ begin
 if exists(select 1 from public.get_public_posts(current_setting('favx.test_username'))) then raise exception 'Draft exposed'; end if;
 if has_table_privilege('anon','public.creator_posts','SELECT') then raise exception 'Anonymous base-table access'; end if;
end $$;
set local role authenticated;
select set_config('request.jwt.claim.sub',current_setting('favx.test_b'),true);
do $$ begin
 if exists(select 1 from public.creator_posts where id=current_setting('favx.test_post')::uuid) then raise exception 'Cross-user read'; end if;
 update public.creator_posts set title='Attacker' where id=current_setting('favx.test_post')::uuid;
 if found then raise exception 'Cross-user update'; end if;
end $$;
select set_config('request.jwt.claim.sub',current_setting('favx.test_a'),true);
update public.creator_profiles set is_public=true where user_id=auth.uid();
select * from public.save_creator_post(current_setting('favx.test_post')::uuid,1,current_setting('favx.test_payload')::jsonb,'published');
do $$ begin
 begin
  perform public.save_creator_post(current_setting('favx.test_post')::uuid,1,current_setting('favx.test_payload')::jsonb,'draft');
  raise exception 'Stale update accepted';
 exception when serialization_failure then null; end;
end $$;
set local role anon;
select set_config('request.jwt.claim.sub','',true);
do $$ declare projection jsonb; begin
 select to_jsonb(x) into projection from public.get_public_posts(current_setting('favx.test_username')) x;
 if projection is null then raise exception 'Published post missing'; end if;
 if projection ? 'id' or projection ? 'creator_id' or projection ? 'version' then raise exception 'Private projection leak'; end if;
end $$;
reset role;
do $$ begin
 if (select count(*) from favx_private.post_revisions where post_id=current_setting('favx.test_post')::uuid)<>2 then raise exception 'Incorrect audit history'; end if;
end $$;
update public.profiles set account_state='suspended' where user_id=current_setting('favx.test_a')::uuid;
set local role anon;
do $$ begin
 if exists(select 1 from public.get_public_posts(current_setting('favx.test_username'))) then raise exception 'Suspended account exposed'; end if;
end $$;
set local role authenticated;
select set_config('request.jwt.claim.sub',current_setting('favx.test_a'),true);
do $$ begin
 update public.creator_posts set body='Blocked' where id=current_setting('favx.test_post')::uuid;
 if found then raise exception 'Suspended account wrote'; end if;
end $$;
reset role;
update public.profiles set account_state='active' where user_id=current_setting('favx.test_a')::uuid;
set local role authenticated;
select set_config('request.jwt.claim.sub',current_setting('favx.test_a'),true);
select * from public.save_creator_post(current_setting('favx.test_post')::uuid,2,current_setting('favx.test_payload')::jsonb,'hidden');
set local role anon;
select set_config('request.jwt.claim.sub','',true);
do $$ begin
 if exists(select 1 from public.get_public_posts(current_setting('favx.test_username'))) then raise exception 'Hidden post exposed'; end if;
end $$;
rollback;
select 'PASS: draft privacy, ownership, publish checks, idempotency, optimistic version, audit, suspension and hide; all fixtures rolled back' as result;
