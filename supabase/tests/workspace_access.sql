-- Isolated fixture identities; always rolled back. No emails or external calls.
begin;
select set_config('favx.qa_a',gen_random_uuid()::text,true),set_config('favx.qa_b',gen_random_uuid()::text,true),set_config('favx.qa_post',gen_random_uuid()::text,true),set_config('favx.qa_media',gen_random_uuid()::text,true),set_config('favx.qa_collection',gen_random_uuid()::text,true);
select set_config('favx.qa_name','qa_'||substr(replace(current_setting('favx.qa_a'),'-',''),1,27),true);
insert into auth.users(id) values(current_setting('favx.qa_a')::uuid),(current_setting('favx.qa_b')::uuid);
set local role authenticated;
select set_config('request.jwt.claim.sub',current_setting('favx.qa_a'),true);
insert into public.creator_profiles(user_id,username,display_name) values(auth.uid(),current_setting('favx.qa_name'),'QA Creator');
update public.creator_profiles set is_public=true where user_id=auth.uid();
insert into public.creator_media(id,creator_id,filename,mime,byte_size) values(current_setting('favx.qa_media')::uuid,auth.uid(),'qa.png','image/png',500);
update public.creator_media set status='ready',width=10,height=10 where id=current_setting('favx.qa_media')::uuid;
select set_config('favx.qa_payload',jsonb_build_object('title','QA public title','body','A temporary recommendation','slug','qa-post','content_kind','recommendation','tags',jsonb_build_array('test'),'links','[]'::jsonb,'rating',null,'is_sponsored',false,'disclosure','','categories',jsonb_build_array('QA category'),'private_context','QA_CONTEXT_SECRET','media_ids',jsonb_build_array(current_setting('favx.qa_media')))::text,true);
select * from public.save_creator_post(current_setting('favx.qa_post')::uuid,0,current_setting('favx.qa_payload')::jsonb,'draft');
select * from public.save_creator_collection(current_setting('favx.qa_collection')::uuid,0,'QA collection','',array[current_setting('favx.qa_post')::uuid],true);
set local role anon;
select set_config('request.jwt.claim.sub','',true);
do $$declare projection jsonb;begin
 projection:=public.browse_creator(current_setting('favx.qa_name'));
 if (projection->>'post_count')::integer<>0 or public.can_view_media(current_setting('favx.qa_media')::uuid) then raise exception 'DRAFT_OR_MEDIA_LEAK';end if;
 if has_table_privilege('anon','public.creator_media','SELECT') or has_table_privilege('anon','public.creator_collections','SELECT') then raise exception 'BASE_TABLE_EXPOSED';end if;
end$$;
set local role authenticated;
select set_config('request.jwt.claim.sub',current_setting('favx.qa_b'),true);
do $$begin
 if exists(select 1 from public.creator_media where id=current_setting('favx.qa_media')::uuid) or exists(select 1 from public.creator_collections where id=current_setting('favx.qa_collection')::uuid) then raise exception 'CROSS_OWNER_READ';end if;
 update public.creator_collections set title='Attack' where id=current_setting('favx.qa_collection')::uuid;if found then raise exception 'CROSS_OWNER_WRITE';end if;
end$$;
select set_config('request.jwt.claim.sub',current_setting('favx.qa_a'),true);
select * from public.save_creator_post(current_setting('favx.qa_post')::uuid,1,current_setting('favx.qa_payload')::jsonb,'published');
set local role anon;
select set_config('request.jwt.claim.sub','',true);
do $$declare projection jsonb;begin
 projection:=public.browse_creator(current_setting('favx.qa_name'));
 if (projection->>'post_count')::integer<>1 or not public.can_view_media(current_setting('favx.qa_media')::uuid) then raise exception 'PUBLIC_CONTENT_MISSING';end if;
 if projection::text like '%QA_CONTEXT_SECRET%' or projection::text like '%'||current_setting('favx.qa_a')||'%' then raise exception 'PRIVATE_DATA_EXPOSED';end if;
 if (public.browse_creator(current_setting('favx.qa_name'),'QA_CONTEXT_SECRET')->>'total')::integer<>0 then raise exception 'CONTEXT_SEARCH_LEAK';end if;
end$$;
set local role authenticated;
select set_config('request.jwt.claim.sub',current_setting('favx.qa_a'),true);
update public.creator_profiles set is_public=false where user_id=auth.uid();
set local role anon;
select set_config('request.jwt.claim.sub','',true);
do $$begin
 if (public.browse_creator(current_setting('favx.qa_name'))->>'post_count')::integer<>0 or public.can_view_media(current_setting('favx.qa_media')::uuid) then raise exception 'REVOCATION_FAILED';end if;
end$$;
reset role;
rollback;
select 'workspace ownership, public projection, search, media eligibility and revocation passed; fixtures rolled back' as result;
