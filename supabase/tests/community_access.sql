-- Synthetic identities only. No email; all fixture writes are rolled back.
begin;
select set_config('favx.com_a',gen_random_uuid()::text,true),set_config('favx.com_b',gen_random_uuid()::text,true),set_config('favx.com_c',gen_random_uuid()::text,true),set_config('favx.com_request',gen_random_uuid()::text,true),set_config('favx.com_submission',gen_random_uuid()::text,true);
select set_config('favx.com_name','qa_'||substr(replace(current_setting('favx.com_a'),'-',''),1,27),true);
insert into auth.users(id) values(current_setting('favx.com_a')::uuid),(current_setting('favx.com_b')::uuid),(current_setting('favx.com_c')::uuid);
set local role authenticated;select set_config('request.jwt.claim.sub',current_setting('favx.com_a'),true);
insert into public.creator_profiles(user_id,username,display_name) values(auth.uid(),current_setting('favx.com_name'),'Community QA');
update public.creator_profiles set is_public=true where user_id=auth.uid();
select set_config('favx.com_payload','{"title":"Community QA request","description":"Public question","category":"Books","instructions":"Text only","state":"draft","expires_at":null}',true);
select * from public.save_community_request(current_setting('favx.com_request')::uuid,0,current_setting('favx.com_payload')::jsonb);
set local role anon;select set_config('request.jwt.claim.sub','',true);
do $$begin if public.get_community_request(current_setting('favx.com_request')::uuid) is not null then raise exception 'DRAFT_LEAK';end if;end$$;
set local role authenticated;select set_config('request.jwt.claim.sub',current_setting('favx.com_a'),true);
select * from public.save_community_request(current_setting('favx.com_request')::uuid,1,current_setting('favx.com_payload')::jsonb||'{"state":"open"}'::jsonb);
select set_config('request.jwt.claim.sub',current_setting('favx.com_b'),true);
select set_config('favx.com_reply','{"title":"QA_PRIVATE_REPLY","description":"QA_PRIVATE_BODY","category":"Books","url":"https://example.com","consent":true}',true);
select public.submit_community_suggestion(current_setting('favx.com_submission')::uuid,current_setting('favx.com_request')::uuid,current_setting('favx.com_reply')::jsonb);
do $$begin
 if public.submit_community_suggestion(current_setting('favx.com_submission')::uuid,current_setting('favx.com_request')::uuid,current_setting('favx.com_reply')::jsonb)<>current_setting('favx.com_submission')::uuid then raise exception 'DUPLICATE';end if;
 if exists(select id from public.community_submissions) then raise exception 'SENDER_READ';end if;
 for i in 1..4 loop perform public.submit_community_suggestion(gen_random_uuid(),current_setting('favx.com_request')::uuid,current_setting('favx.com_reply')::jsonb);end loop;
 begin perform public.submit_community_suggestion(gen_random_uuid(),current_setting('favx.com_request')::uuid,current_setting('favx.com_reply')::jsonb);raise exception 'NO_LIMIT';exception when program_limit_exceeded then null;end;
end$$;
select set_config('request.jwt.claim.sub',current_setting('favx.com_c'),true);
do $$begin
 if (public.get_community_inbox()->>'total')::integer<>0 then raise exception 'CROSS_ACCOUNT_READ';end if;
 update public.community_submissions set review_state='selected' where id=current_setting('favx.com_submission')::uuid;if found then raise exception 'CROSS_ACCOUNT_WRITE';end if;
end$$;
set local role anon;select set_config('request.jwt.claim.sub','',true);
do $$declare projection text;begin
 projection:=public.get_community_request(current_setting('favx.com_request')::uuid)::text;
 if projection is null or projection like '%QA_PRIVATE_REPLY%' or projection like '%QA_PRIVATE_BODY%' or projection like '%received%' or projection like '%'||current_setting('favx.com_b')||'%' then raise exception 'PUBLIC_PROJECTION_FAILED';end if;
 if has_function_privilege('anon','public.submit_community_suggestion(uuid,uuid,jsonb)','EXECUTE') then raise exception 'ANON_INTAKE';end if;
end$$;
set local role authenticated;select set_config('request.jwt.claim.sub',current_setting('favx.com_a'),true);
do $$begin
 if (public.get_community_inbox()->>'total')::integer<>5 then raise exception 'INBOX_MISSING';end if;
 if public.get_community_inbox()::text like '%'||current_setting('favx.com_b')||'%' then raise exception 'SENDER_ID_LEAK';end if;
 update public.community_submissions set review_state='selected' where id=current_setting('favx.com_submission')::uuid and version=1;if not found then raise exception 'REVIEW_FAILED';end if;
 update public.community_submissions set review_state='rejected' where id=current_setting('favx.com_submission')::uuid and version=1;if found then raise exception 'STALE_REVIEW';end if;
end$$;
select * from public.save_community_request(current_setting('favx.com_request')::uuid,2,current_setting('favx.com_payload')::jsonb||'{"state":"closed"}'::jsonb);
select set_config('request.jwt.claim.sub',current_setting('favx.com_c'),true);
do $$begin
 begin perform public.submit_community_suggestion(gen_random_uuid(),current_setting('favx.com_request')::uuid,current_setting('favx.com_reply')::jsonb);raise exception 'CLOSED_INTAKE';exception when check_violation then null;end;
end$$;
reset role;
update public.profiles set account_state='suspended' where user_id=current_setting('favx.com_a')::uuid;
set local role authenticated;select set_config('request.jwt.claim.sub',current_setting('favx.com_a'),true);
do $$begin if (public.get_community_inbox()->>'total')::integer<>0 then raise exception 'SUSPENDED_INBOX';end if;end$$;
reset role;
rollback;
select 'community privacy, idempotency, rate limit, ownership, review conflict and closure passed; fixtures rolled back' as result;
