-- Run against a database with the Creator profile migration applied.
-- Fixture identities exist only inside this transaction; no email is sent and no existing user is changed.
begin;
select set_config('favx.test_a', gen_random_uuid()::text, true);
select set_config('favx.test_b', gen_random_uuid()::text, true);
select set_config('favx.test_username', 'qa_' || substr(replace(current_setting('favx.test_a'), '-', ''),1,27), true);
insert into auth.users(id) values (current_setting('favx.test_a')::uuid), (current_setting('favx.test_b')::uuid);
select set_config('request.jwt.claim.sub', current_setting('favx.test_a'), true);
set local role authenticated;
insert into public.creator_profiles(user_id, username, display_name)
values (auth.uid(), current_setting('favx.test_username'), 'QA fixture');
do $$ begin
  if public.username_problem(current_setting('favx.test_username')) <> 'taken' then raise exception 'Username collision not detected'; end if;
  if public.username_problem('app') <> 'reserved' then raise exception 'Reserved username not rejected'; end if;
end $$;
select public.save_creator_profile('QA Public', 'Temporary fixture', 'pt-br', 'America/Sao_Paulo', '[{"network":"instagram","url":"https://instagram.com/example"}]', true);
do $$ begin
  begin
    perform public.save_creator_profile('Should roll back', null, 'pt-br', 'Not/A_Timezone', '[]', true);
    raise exception 'Invalid timezone was accepted';
  exception when check_violation then null;
  end;
  if (select display_name from public.creator_profiles where user_id=auth.uid()) <> 'QA Public' then raise exception 'Partial write'; end if;
end $$;
select set_config('request.jwt.claim.sub', current_setting('favx.test_b'), true);
do $$ begin
  if exists(select 1 from public.creator_profiles where user_id=current_setting('favx.test_a')::uuid) then raise exception 'Cross-user read'; end if;
  update public.creator_profiles set bio='Attacker' where user_id=current_setting('favx.test_a')::uuid;
  if found then raise exception 'Cross-user update'; end if;
end $$;
set local role anon;
select set_config('request.jwt.claim.sub', '', true);
do $$ begin
  if has_table_privilege('anon','public.creator_profiles','SELECT') then raise exception 'Anonymous base table access'; end if;
  if has_function_privilege('anon','public.username_problem(text)','EXECUTE') then raise exception 'Anonymous availability access'; end if;
  if (select count(*) from public.get_public_creator(current_setting('favx.test_username'))) <> 1 then raise exception 'Public profile not visible'; end if;
end $$;
set local role authenticated;
select set_config('request.jwt.claim.sub', current_setting('favx.test_a'), true);
update public.creator_profiles set is_public=false where user_id=auth.uid();
set local role anon;
select set_config('request.jwt.claim.sub', '', true);
do $$ begin
  if exists(select 1 from public.get_public_creator(current_setting('favx.test_username'))) then raise exception 'Private profile visible'; end if;
end $$;
reset role;
update public.creator_profiles set is_public=true where user_id=current_setting('favx.test_a')::uuid;
update public.profiles set account_state='suspended' where user_id=current_setting('favx.test_a')::uuid;
set local role anon;
do $$ begin
  if exists(select 1 from public.get_public_creator(current_setting('favx.test_username'))) then raise exception 'Suspended account visible'; end if;
end $$;
set local role authenticated;
select set_config('request.jwt.claim.sub', current_setting('favx.test_a'), true);
do $$ begin
  begin
    perform public.save_creator_profile('Suspended write', null, 'pt-br', 'UTC', '[]', true);
    raise exception 'Suspended account wrote';
  exception when insufficient_privilege then null;
  end;
end $$;
reset role;
update public.profiles set account_state='active' where user_id=current_setting('favx.test_a')::uuid;
update public.creator_profiles set creator_state='suspended' where user_id=current_setting('favx.test_a')::uuid;
set local role anon;
select set_config('request.jwt.claim.sub', '', true);
do $$ begin
  if exists(select 1 from public.get_public_creator(current_setting('favx.test_username'))) then raise exception 'Suspended Creator visible'; end if;
end $$;
set local role authenticated;
select set_config('request.jwt.claim.sub', current_setting('favx.test_a'), true);
do $$ begin
  update public.creator_profiles set bio='Suspended write' where user_id=auth.uid();
  if found then raise exception 'Suspended Creator wrote'; end if;
end $$;
rollback;
select 'PASS: A/B/anonymous, public/private, account and Creator suspension, username and atomic save; fixtures rolled back' as result;
