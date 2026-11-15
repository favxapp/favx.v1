-- 0005 / camadas contra IDOR de associacoes; rodar em staging antes de ativar escrita.
BEGIN;
CREATE OR REPLACE FUNCTION app.check_post_media_owner() RETURNS trigger
LANGUAGE plpgsql SET search_path = '' AS $$
DECLARE p_owner uuid; m_owner uuid;
BEGIN
 SELECT creator_id INTO p_owner FROM app.posts WHERE id=NEW.post_id;
 SELECT owner_id INTO m_owner FROM app.media_assets WHERE id=NEW.media_id;
 IF p_owner IS NULL OR m_owner IS NULL OR p_owner<>m_owner THEN
  RAISE EXCEPTION 'post_media_owner_mismatch' USING ERRCODE='23514';
 END IF;
 RETURN NEW;
END; $$;
CREATE TRIGGER check_post_media_owner BEFORE INSERT OR UPDATE ON app.post_media
 FOR EACH ROW EXECUTE FUNCTION app.check_post_media_owner();

CREATE OR REPLACE FUNCTION app.check_context_owner() RETURNS trigger
LANGUAGE plpgsql SET search_path = '' AS $$
BEGIN
 IF NOT EXISTS(SELECT 1 FROM app.posts WHERE id=NEW.post_id AND creator_id=NEW.owner_id) THEN
  RAISE EXCEPTION 'context_owner_mismatch' USING ERRCODE='23514';
 END IF;
 RETURN NEW;
END; $$;
CREATE TRIGGER check_post_context_owner BEFORE INSERT OR UPDATE ON app.post_private_contexts
 FOR EACH ROW EXECUTE FUNCTION app.check_context_owner();

CREATE OR REPLACE FUNCTION app.check_pin_owner() RETURNS trigger
LANGUAGE plpgsql SET search_path = '' AS $$
BEGIN
 IF NOT EXISTS(SELECT 1 FROM app.posts WHERE id=NEW.post_id AND creator_id=NEW.creator_id) THEN
  RAISE EXCEPTION 'pin_owner_mismatch' USING ERRCODE='23514';
 END IF;
 RETURN NEW;
END; $$;
CREATE TRIGGER check_post_pin_owner BEFORE INSERT OR UPDATE ON app.pinned_posts
 FOR EACH ROW EXECUTE FUNCTION app.check_pin_owner();

CREATE OR REPLACE FUNCTION app.check_rating_owner() RETURNS trigger
LANGUAGE plpgsql SET search_path = '' AS $$
BEGIN
 IF NOT EXISTS(SELECT 1 FROM app.posts WHERE id=NEW.post_id AND creator_id=NEW.creator_id) THEN
  RAISE EXCEPTION 'rating_owner_mismatch' USING ERRCODE='23514';
 END IF;
 RETURN NEW;
END; $$;
CREATE TRIGGER check_post_rating_owner BEFORE INSERT OR UPDATE ON app.post_ratings
 FOR EACH ROW EXECUTE FUNCTION app.check_rating_owner();

CREATE OR REPLACE FUNCTION app.check_search_document_owner() RETURNS trigger
LANGUAGE plpgsql SET search_path = '' AS $$
BEGIN
 IF NOT EXISTS(SELECT 1 FROM app.posts WHERE id=NEW.post_id AND creator_id=NEW.creator_id) THEN
  RAISE EXCEPTION 'search_document_owner_mismatch' USING ERRCODE='23514';
 END IF;
 RETURN NEW;
END; $$;
CREATE TRIGGER check_search_document_owner BEFORE INSERT OR UPDATE ON app.post_search_documents
 FOR EACH ROW EXECUTE FUNCTION app.check_search_document_owner();

CREATE OR REPLACE FUNCTION app.check_community_request_owner() RETURNS trigger
LANGUAGE plpgsql SET search_path = '' AS $$
BEGIN
 IF NOT EXISTS(SELECT 1 FROM app.recommendation_requests WHERE id=NEW.request_id AND creator_id=NEW.creator_id) THEN
  RAISE EXCEPTION 'submission_request_creator_mismatch' USING ERRCODE='23514';
 END IF;
 RETURN NEW;
END; $$;
CREATE TRIGGER check_community_request_owner BEFORE INSERT OR UPDATE ON app.community_submissions
 FOR EACH ROW EXECUTE FUNCTION app.check_community_request_owner();
CREATE OR REPLACE FUNCTION app.check_banner_media_owner() RETURNS trigger
LANGUAGE plpgsql SET search_path = '' AS $$
BEGIN
 IF NEW.media_id IS NOT NULL AND NOT EXISTS(
  SELECT 1 FROM app.media_assets WHERE id=NEW.media_id AND owner_id=NEW.creator_id
 ) THEN
  RAISE EXCEPTION 'banner_media_owner_mismatch' USING ERRCODE='23514';
 END IF;
 RETURN NEW;
END; $$;
CREATE TRIGGER check_banner_media_owner BEFORE INSERT OR UPDATE ON app.banners
 FOR EACH ROW EXECUTE FUNCTION app.check_banner_media_owner();
COMMIT;
