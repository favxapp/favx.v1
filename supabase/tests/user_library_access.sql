-- Synthetic identities and records; all changes roll back. Never sends email.
begin;
select set_config('favx.lib_a',gen_random_uuid()::text,true),set_config('favx.lib_b',gen_random_uuid()::text,true),set_config('favx.lib_c',gen_random_uuid()::text,true),set_config('favx.lib_post',gen_random_uuid()::text,true),set_config('favx.lib_collection',gen_random_uuid()::text,true);
select set_config('favx.lib_name','qa_'||substr(replace(current_setting('favx.lib_a'),'-',''),1,27),true);
insert into auth.users(id) values(current_setting('favx.lib_a')::uuid),(current_setting('favx.lib_b')::uuid),(current_setting('favx.lib_c')::uuid);
set local role authenticated;
select set_config('request.jwt.claim.sub',current_setting('favx.lib_a'),true);
insert into public.creator_profiles(user_id,username,display_name) values(auth.uid(),current_setting('favx.lib_name'),'Library QA Creator');
update public.creator_profiles set is_public=true where user_id=auth.uid();
select set_config('favx.lib_payload',jsonb_build_object('title','QA library public title','body','Temporary public recommendation','slug','library-qa','content_kind','recommendation','tags',jsonb_build_array('test'),'links','[]'::jsonb,'rating',null,'is_sponsored',false,'disclosure','','private_context','QA_LIBRARY_CONTEXT_SECRET')::text,true);
select set_config('favx.lib_public_id',public_id,true) from public.save_creator_post(current_setting('favx.lib_post')::uuid,0,current_setting('favx.lib_payload')::jsonb,'published');
select set_config('request.jwt.claim.sub',current_setting('favx.lib_b'),true);
select set_config('favx.lib_saved',public.save_recommendation(current_setting('favx.lib_public_id'))::text,true);
do $$begin
 if public.save_recommendation(current_setting('favx.lib_public_id'))::text<>current_setting('favx.lib_saved') then raise exception 'NOT_IDEMPOTENT';end if;
 if (public.get_user_library('QA_LIBRARY_CONTEXT_SECRET')->>'total')::integer<>0 then raise exception 'CONTEXT_SEARCH_LEAK';end if;
end$$;
select * from public.save_user_collection(current_setting('favx.lib_collection')::uuid,0,'QA shared selection','Only this selection',array[current_setting('favx.lib_saved')::uuid]);
do $$begin
 if exists(select 1 from public.user_collections where share_enabled or share_token is not null) then raise exception 'UNEXPECTED_PUBLICATION';end if;
end$$;
select set_config('favx.lib_token',share_token,true) from public.share_user_collection(current_setting('favx.lib_collection')::uuid,1,true);
select set_config('request.jwt.claim.sub',current_setting('favx.lib_c'),true);
do $$begin
 if exists(select 1 from public.user_saves) or exists(select 1 from public.user_collections) or (public.get_user_library()->>'total')::integer<>0 then raise exception 'CROSS_USER_READ';end if;
 update public.user_collections set title='Attack' where id=current_setting('favx.lib_collection')::uuid;if found then raise exception 'CROSS_USER_WRITE';end if;
end$$;
set local role anon;
select set_config('request.jwt.claim.sub','',true);
do $$declare projection jsonb;begin
 if has_table_privilege('anon','public.user_saves','SELECT') or has_table_privilege('anon','public.user_collections','SELECT') then raise exception 'TABLE_EXPOSED';end if;
 projection:=public.get_shared_user_collection(current_setting('favx.lib_token'));
 if jsonb_array_length(projection->'posts')<>1 then raise exception 'SHARED_POST_MISSING';end if;
 if projection::text like '%QA_LIBRARY_CONTEXT_SECRET%' or projection::text like '%'||current_setting('favx.lib_b')||'%' or projection::text like '%'||current_setting('favx.lib_saved')||'%' then raise exception 'PRIVATE_DATA_LEAK';end if;
end$$;
set local role authenticated;
select set_config('request.jwt.claim.sub',current_setting('favx.lib_b'),true);
select * from public.share_user_collection(current_setting('favx.lib_collection')::uuid,2,false);
set local role anon;
select set_config('request.jwt.claim.sub','',true);
do $$begin if public.get_shared_user_collection(current_setting('favx.lib_token')) is not null then raise exception 'REVOCATION_FAILED';end if;end$$;
set local role authenticated;
select set_config('request.jwt.claim.sub',current_setting('favx.lib_a'),true);
select * from public.save_creator_post(current_setting('favx.lib_post')::uuid,1,current_setting('favx.lib_payload')::jsonb,'hidden');
select set_config('request.jwt.claim.sub',current_setting('favx.lib_b'),true);
do $$declare projection jsonb;begin
 projection:=public.get_user_library();
 if (projection->>'total')::integer<>1 or projection#>'{items,0,post}'<>'null'::jsonb then raise exception 'UNAVAILABLE_REFERENCE_LEAK';end if;
end$$;
delete from public.user_saves where id=current_setting('favx.lib_saved')::uuid;
do $$begin if exists(select 1 from public.user_collections where cardinality(saved_ids)<>0) then raise exception 'MEMBERSHIP_CLEANUP_FAILED';end if;end$$;
reset role;
rollback;
select 'library idempotency, ownership, explicit sharing, revocation, unavailable placeholder and cleanup passed; fixtures rolled back' as result;
