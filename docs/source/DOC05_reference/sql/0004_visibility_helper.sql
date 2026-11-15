-- 0004_read_visibility.sql — função segura somente server-side (NÃO expor app schema)
BEGIN;
CREATE OR REPLACE FUNCTION app.post_is_public(p app.posts, at_time timestamptz DEFAULT now())
RETURNS boolean LANGUAGE sql STABLE SET search_path='' AS $$
 SELECT p.lifecycle_state IN ('published','scheduled')
   AND p.moderation_state='approved' AND p.deleted_at IS NULL
   AND (p.visible_from IS NULL OR p.visible_from <= at_time)
   AND (p.visible_until IS NULL OR at_time < p.visible_until)
   AND EXISTS (SELECT 1 FROM app.creator_profiles c
    JOIN app.profiles u ON u.user_id=c.user_id
    WHERE c.user_id=p.creator_id AND c.is_public AND c.creator_state='active' AND u.account_state='active');
$$;
REVOKE ALL ON FUNCTION app.post_is_public(app.posts,timestamptz) FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION app.post_is_public(app.posts,timestamptz) TO service_role;
-- NAO criar VIEW com security definer em schema exposto.
COMMIT;
