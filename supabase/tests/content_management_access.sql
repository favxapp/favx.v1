-- Synthetic identities only; every write rolls back, no email is sent.
begin;
select set_config('favx.qa_a',gen_random_uuid()::text,true),set_config('favx.qa_b',gen_random_uuid()::text,true),set_config('favx.qa_post',gen_random_uuid()::text,true),set_config('favx.qa_media',gen_random_uuid()::text,true);
select set_config('favx.qa_name','qa_'||substr(replace(current_setting('favx.qa_a'),'-',''),1,27),true);
insert into auth.users(id) values(current_setting('favx.qa_a')::uuid),(current_setting('favx.qa_b')::uuid);
set local role authenticated;
select set_config('request.jwt.claim.sub',current_setting('favx.qa_a'),true);
insert into public.creator_profiles(user_id,username,display_name) values(auth.uid(),current_setting('favx.qa_name'),'Content QA');
update public.creator_profiles set is_public=true where user_id=auth.uid();
insert into public.creator_media(id,creator_id,filename,mime,byte_size) values(current_setting('favx.qa_media')::uuid,auth.uid(),'qa.png','image/png',1024);
update public.creator_media set status='ready' where id=current_setting('favx.qa_media')::uuid;
select set_config('favx.qa_payload',jsonb_build_object('title','Content QA','body','Synthetic content','slug','content-qa','content_kind','recommendation','tags','[]'::jsonb,'links','[]'::jsonb,'rating',null,'is_sponsored',false,'disclosure','','media_ids',jsonb_build_array(current_setting('favx.qa_media')),'private_context','QA_PRIVATE_CONTEXT')::text,true);
select set_config('favx.qa_public',public_id,true) from public.save_creator_post(current_setting('favx.qa_post')::uuid,0,current_setting('favx.qa_payload')::jsonb,'published');
select * from public.transition_creator_post(current_setting('favx.qa_post')::uuid,1,'archive');
do $$begin
 if (select count(*) from public.get_creator_post_history(current_setting('favx.qa_post')::uuid))<>2 then raise exception 'HISTORY_MISSING';end if;
 if (public.get_creator_media_library(p_id:=current_setting('favx.qa_media')::uuid)->>'total')::integer<>1 then raise exception 'ARCHIVED_MEDIA_MISSING';end if;
 begin perform public.transition_creator_post(current_setting('favx.qa_post')::uuid,1,'trash');raise exception 'STALE_WRITE';exception when serialization_failure then null;end;
 begin update public.creator_posts set lifecycle_state='published' where id=current_setting('favx.qa_post')::uuid;raise exception 'PUBLIC_RESTORE';exception when check_violation then null;end;
 begin delete from favx_private.post_revisions where post_id=current_setting('favx.qa_post')::uuid;raise exception 'HISTORY_MUTABLE';exception when insufficient_privilege then null;end;
end$$;
select set_config('request.jwt.claim.sub',current_setting('favx.qa_b'),true);
do $$begin
 if exists(select 1 from public.get_creator_post_history(current_setting('favx.qa_post')::uuid)) then raise exception 'HISTORY_LEAK';end if;
 if (public.get_creator_media_library(p_id:=current_setting('favx.qa_media')::uuid)->>'total')::integer<>0 then raise exception 'MEDIA_LEAK';end if;
 begin perform public.transition_creator_post(current_setting('favx.qa_post')::uuid,2,'restore');raise exception 'CROSS_USER_WRITE';exception when serialization_failure then null;end;
end$$;
set local role anon;select set_config('request.jwt.claim.sub','',true);
do $$begin
 if exists(select 1 from public.get_public_posts(current_setting('favx.qa_name'),current_setting('favx.qa_public'))) or public.can_view_media(current_setting('favx.qa_media')::uuid) then raise exception 'ARCHIVED_PUBLIC';end if;
 if has_function_privilege('anon','public.get_creator_post_history(uuid,integer)','EXECUTE') or has_function_privilege('anon','public.get_creator_media_library(text,text,integer,uuid)','EXECUTE') then raise exception 'PRIVATE_RPC_PUBLIC';end if;
end$$;
set local role authenticated;select set_config('request.jwt.claim.sub',current_setting('favx.qa_a'),true);
select * from public.transition_creator_post(current_setting('favx.qa_post')::uuid,2,'trash');
select * from public.transition_creator_post(current_setting('favx.qa_post')::uuid,3,'restore');
do $$begin
 if not exists(select 1 from public.creator_posts where id=current_setting('favx.qa_post')::uuid and lifecycle_state='draft' and public_id=current_setting('favx.qa_public')) then raise exception 'RESTORE_FAILED';end if;
end$$;
reset role;
update public.profiles set account_state='suspended' where user_id=current_setting('favx.qa_a')::uuid;
set local role authenticated;select set_config('request.jwt.claim.sub',current_setting('favx.qa_a'),true);
do $$begin
 if exists(select 1 from public.get_creator_post_history(current_setting('favx.qa_post')::uuid)) or (public.get_creator_media_library()->>'total')::integer<>0 then raise exception 'SUSPENDED_READ';end if;
 begin perform public.transition_creator_post(current_setting('favx.qa_post')::uuid,4,'trash');raise exception 'SUSPENDED_WRITE';exception when serialization_failure then null;end;
end$$;
reset role;
rollback;
select 'content management ownership, archive revocation, conflicts, history, media and draft restore passed; all fixtures rolled back' as result;
