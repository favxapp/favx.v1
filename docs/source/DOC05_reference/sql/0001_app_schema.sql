-- FAVX / DOC05 / MIGRATION 0001 / BASELINE SQL
-- ESTADO: REFERENCIA IMPLEMENTAVEL PARA REVISAR E TESTAR EM SUPABASE LOCAL.
-- NAO EXECUTADO NESTA ENTREGA; NAO APLICAR EM PRODUCAO SEM VALIDACAO.
-- Todos objetos no schema app, que DEVE permanecer FORA de 'Exposed schemas' no Supabase.
-- Regras comerciais PENDENTES nao devem ser codificadas sem aprovacao.
BEGIN;
CREATE SCHEMA IF NOT EXISTS app;
REVOKE ALL ON SCHEMA app FROM PUBLIC;
GRANT USAGE ON SCHEMA app TO authenticated, service_role;

CREATE OR REPLACE FUNCTION app.touch_updated_at() RETURNS trigger LANGUAGE plpgsql
SET search_path = '' AS $$ BEGIN NEW.updated_at := now(); RETURN NEW; END $$;

-- 01 IDENTIDADE E PERFIS
CREATE TABLE app.profiles (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name text NOT NULL DEFAULT '', avatar_asset_id uuid,
  locale text NOT NULL DEFAULT 'pt-BR' CHECK (locale IN ('pt-BR','pt-PT','en','es','it','fr')),
  timezone text NOT NULL DEFAULT 'America/Sao_Paulo', region_code text,
  currency text NOT NULL DEFAULT 'BRL' CHECK (currency IN ('BRL','USD','EUR')),
  account_state text NOT NULL DEFAULT 'active' CHECK (account_state IN ('active','suspended','pending_deletion','deleted')),
  created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now(), deleted_at timestamptz
);
CREATE TABLE app.creator_profiles (
  user_id uuid PRIMARY KEY REFERENCES app.profiles(user_id) ON DELETE CASCADE,
  username text NOT NULL UNIQUE CHECK (username ~ '^[a-z0-9][a-z0-9._-]{2,29}$'),
  bio text NOT NULL DEFAULT '', is_public boolean NOT NULL DEFAULT true,
  creator_state text NOT NULL DEFAULT 'active' CHECK (creator_state IN ('active','suspended','hidden')),
  created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE app.reserved_slugs (slug text PRIMARY KEY, reason text NOT NULL);
CREATE TABLE app.slug_redirects (
  old_slug text PRIMARY KEY, creator_id uuid NOT NULL REFERENCES app.creator_profiles(user_id) ON DELETE CASCADE,
  new_slug text NOT NULL, created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE app.profile_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), creator_id uuid NOT NULL REFERENCES app.creator_profiles(user_id) ON DELETE CASCADE,
  title text NOT NULL, url text NOT NULL, sort_order integer NOT NULL DEFAULT 0,
  is_public boolean NOT NULL DEFAULT true, created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE app.follows (
  follower_id uuid NOT NULL REFERENCES app.profiles(user_id) ON DELETE CASCADE,
  creator_id uuid NOT NULL REFERENCES app.creator_profiles(user_id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(), PRIMARY KEY (follower_id,creator_id),
  CHECK (follower_id <> creator_id)
);
CREATE TABLE app.blocked_users (
  owner_id uuid NOT NULL REFERENCES app.profiles(user_id) ON DELETE CASCADE,
  blocked_id uuid NOT NULL REFERENCES app.profiles(user_id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(), PRIMARY KEY (owner_id,blocked_id),
  CHECK (owner_id <> blocked_id)
);

-- 02 STORAGE E PROCESSAMENTO (original privado, derivados controlados)
CREATE TABLE app.media_assets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), owner_id uuid NOT NULL REFERENCES app.profiles(user_id) ON DELETE CASCADE,
  origin_kind text NOT NULL CHECK (origin_kind IN ('native_capture','user_upload','external_reference','community_submission')),
  media_kind text NOT NULL CHECK (media_kind IN ('image','video','audio')),
  original_key text UNIQUE, original_filename text, original_mime text,
  original_bytes bigint CHECK (original_bytes >= 0), duration_ms bigint CHECK (duration_ms >= 0),
  sha256 text, original_state text NOT NULL DEFAULT 'pending' CHECK (original_state IN ('pending','uploading','verifying','verified','failed','purged')),
  rights_confirmed boolean NOT NULL DEFAULT false, can_download_original boolean NOT NULL DEFAULT false,
  moderation_state text NOT NULL DEFAULT 'pending' CHECK (moderation_state IN ('pending','approved','restricted','rejected')),
  created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now(), deleted_at timestamptz,
  CHECK (original_state <> 'verified' OR original_key IS NOT NULL),
  CHECK (NOT can_download_original OR (rights_confirmed AND origin_kind IN ('native_capture','user_upload')))
);
CREATE TABLE app.media_upload_intents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), asset_id uuid NOT NULL REFERENCES app.media_assets(id) ON DELETE CASCADE,
  owner_id uuid NOT NULL REFERENCES app.profiles(user_id) ON DELETE CASCADE,
  provider text NOT NULL DEFAULT 'bunny', upload_token_hash text NOT NULL,
  expires_at timestamptz NOT NULL, state text NOT NULL DEFAULT 'issued'
    CHECK (state IN ('issued','completed','expired','revoked','failed')),
  created_at timestamptz NOT NULL DEFAULT now(), completed_at timestamptz,
  UNIQUE (asset_id, upload_token_hash)
);
CREATE TABLE app.media_variants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), asset_id uuid NOT NULL REFERENCES app.media_assets(id) ON DELETE CASCADE,
  variant_name text NOT NULL, storage_key text NOT NULL UNIQUE,
  mime text NOT NULL, bytes bigint CHECK (bytes >= 0), width integer, height integer,
  processing_state text NOT NULL DEFAULT 'pending' CHECK (processing_state IN ('pending','ready','failed','purged')),
  created_at timestamptz NOT NULL DEFAULT now(), UNIQUE(asset_id,variant_name)
);
CREATE TABLE app.media_processing_jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), asset_id uuid NOT NULL REFERENCES app.media_assets(id) ON DELETE CASCADE,
  kind text NOT NULL, state text NOT NULL DEFAULT 'queued' CHECK (state IN ('queued','running','done','failed','dead')),
  attempts integer NOT NULL DEFAULT 0 CHECK (attempts>=0), next_run_at timestamptz NOT NULL DEFAULT now(),
  last_error_code text, created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now()
);

-- 03 POSTS / CAMPANHAS
CREATE TABLE app.posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), creator_id uuid NOT NULL REFERENCES app.creator_profiles(user_id) ON DELETE CASCADE,
  title text NOT NULL DEFAULT '', body text NOT NULL DEFAULT '' CHECK (char_length(body) <= 10000),
  lifecycle_state text NOT NULL DEFAULT 'draft' CHECK (lifecycle_state IN ('draft','scheduled','published','hidden','expired','archived','pending_deletion','deleted')),
  moderation_state text NOT NULL DEFAULT 'approved' CHECK (moderation_state IN ('pending','approved','restricted','rejected')),
  visible_from timestamptz, visible_until timestamptz,
  original_timezone text NOT NULL DEFAULT 'UTC', published_at timestamptz,
  is_sponsored boolean NOT NULL DEFAULT false,
  version integer NOT NULL DEFAULT 1 CHECK (version>0),
  created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now(), deleted_at timestamptz,
  CHECK (visible_until IS NULL OR visible_from IS NULL OR visible_until > visible_from)
);
CREATE TABLE app.post_revisions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), post_id uuid NOT NULL REFERENCES app.posts(id) ON DELETE CASCADE,
  version integer NOT NULL, editor_id uuid REFERENCES app.profiles(user_id) ON DELETE SET NULL,
  snapshot jsonb NOT NULL, changed_at timestamptz NOT NULL DEFAULT now(), UNIQUE(post_id,version)
);
CREATE TABLE app.post_media (
  post_id uuid NOT NULL REFERENCES app.posts(id) ON DELETE CASCADE,
  media_id uuid NOT NULL REFERENCES app.media_assets(id) ON DELETE RESTRICT,
  sort_order integer NOT NULL CHECK (sort_order>=0), caption text,
  PRIMARY KEY(post_id,media_id), UNIQUE(post_id,sort_order)
);
CREATE TABLE app.post_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), post_id uuid NOT NULL REFERENCES app.posts(id) ON DELETE CASCADE,
  label text, url text NOT NULL, normalized_url text, link_kind text NOT NULL DEFAULT 'external',
  sort_order integer NOT NULL DEFAULT 0, created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE app.categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), parent_id uuid REFERENCES app.categories(id) ON DELETE RESTRICT,
  slug text NOT NULL UNIQUE, label_default text NOT NULL, is_active boolean NOT NULL DEFAULT true
);
CREATE TABLE app.tags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), canonical_key text NOT NULL UNIQUE, label text NOT NULL
);
CREATE TABLE app.tag_aliases (
  alias_key text PRIMARY KEY, tag_id uuid NOT NULL REFERENCES app.tags(id) ON DELETE CASCADE
);
CREATE TABLE app.post_categories (
  post_id uuid NOT NULL REFERENCES app.posts(id) ON DELETE CASCADE,
  category_id uuid NOT NULL REFERENCES app.categories(id),
  provenance text NOT NULL CHECK (provenance IN ('creator','ai_suggested','admin')),
  PRIMARY KEY(post_id,category_id)
);
CREATE TABLE app.post_tags (
  post_id uuid NOT NULL REFERENCES app.posts(id) ON DELETE CASCADE,
  tag_id uuid NOT NULL REFERENCES app.tags(id),
  provenance text NOT NULL CHECK (provenance IN ('creator','ai_suggested','admin')),
  PRIMARY KEY(post_id,tag_id)
);
CREATE TABLE app.post_coupons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), post_id uuid NOT NULL REFERENCES app.posts(id) ON DELETE CASCADE,
  code text NOT NULL, label text, discount_type text, discount_value numeric(12,2), currency text,
  starts_at timestamptz, expires_at timestamptz, terms text,
  CHECK (expires_at IS NULL OR starts_at IS NULL OR expires_at > starts_at)
);
CREATE TABLE app.post_sponsorships (
  post_id uuid PRIMARY KEY REFERENCES app.posts(id) ON DELETE CASCADE,
  sponsor_name text NOT NULL, disclosure text NOT NULL, sponsorship_type text,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE app.post_ratings (
  post_id uuid PRIMARY KEY REFERENCES app.posts(id) ON DELETE CASCADE,
  creator_id uuid NOT NULL REFERENCES app.creator_profiles(user_id),
  score numeric(3,1) NOT NULL CHECK (score>=0 AND score<=10 AND score*2=trunc(score*2)),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE app.post_private_contexts (
  post_id uuid PRIMARY KEY REFERENCES app.posts(id) ON DELETE CASCADE,
  owner_id uuid NOT NULL REFERENCES app.profiles(user_id),
  context_text text NOT NULL DEFAULT '', source_media_id uuid REFERENCES app.media_assets(id),
  transcription_status text NOT NULL DEFAULT 'not_needed' CHECK (transcription_status IN ('not_needed','pending','done','failed')),
  generation integer NOT NULL DEFAULT 1, updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE app.banners (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), creator_id uuid NOT NULL REFERENCES app.creator_profiles(user_id),
  media_id uuid REFERENCES app.media_assets(id), title text, destination_url text,
  lifecycle_state text NOT NULL DEFAULT 'draft' CHECK (lifecycle_state IN ('draft','scheduled','published','hidden','expired','archived','pending_deletion','deleted')),
  moderation_state text NOT NULL DEFAULT 'approved' CHECK (moderation_state IN ('pending','approved','restricted','rejected')),
  visible_from timestamptz, visible_until timestamptz, original_timezone text NOT NULL DEFAULT 'UTC',
  version integer NOT NULL DEFAULT 1, created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(), deleted_at timestamptz,
  CHECK (visible_until IS NULL OR visible_from IS NULL OR visible_until > visible_from)
);
CREATE TABLE app.pinned_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), post_id uuid NOT NULL REFERENCES app.posts(id) ON DELETE CASCADE,
  creator_id uuid NOT NULL REFERENCES app.creator_profiles(user_id), slot integer NOT NULL CHECK (slot BETWEEN 1 AND 6),
  visible_from timestamptz, visible_until timestamptz, lifecycle_state text NOT NULL DEFAULT 'scheduled'
  CHECK (lifecycle_state IN ('scheduled','active','expired','hidden','cancelled')),
  created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now(),
  CHECK (visible_until IS NULL OR visible_from IS NULL OR visible_until>visible_from)
);

-- 04 COLECOES E USUARIOS
CREATE TABLE app.collections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), owner_id uuid NOT NULL REFERENCES app.profiles(user_id) ON DELETE CASCADE,
  title text NOT NULL, description text NOT NULL DEFAULT '', cover_media_id uuid REFERENCES app.media_assets(id),
  visibility text NOT NULL DEFAULT 'private' CHECK (visibility IN ('private','public','unlisted')),
  is_creator_collection boolean NOT NULL DEFAULT false, sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now(), deleted_at timestamptz
);
CREATE TABLE app.collection_items (
  collection_id uuid NOT NULL REFERENCES app.collections(id) ON DELETE CASCADE,
  post_id uuid NOT NULL REFERENCES app.posts(id) ON DELETE CASCADE,
  sort_order integer NOT NULL DEFAULT 0, added_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY(collection_id,post_id)
);
CREATE TABLE app.saved_posts (
  user_id uuid NOT NULL REFERENCES app.profiles(user_id) ON DELETE CASCADE,
  post_id uuid NOT NULL REFERENCES app.posts(id) ON DELETE CASCADE,
  saved_at timestamptz NOT NULL DEFAULT now(), PRIMARY KEY(user_id,post_id)
);
CREATE TABLE app.collection_share_tokens (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), collection_id uuid NOT NULL REFERENCES app.collections(id) ON DELETE CASCADE,
  token_hash text NOT NULL UNIQUE, revoked_at timestamptz, expires_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 05 COMUNIDADE
CREATE TABLE app.recommendation_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), creator_id uuid NOT NULL REFERENCES app.creator_profiles(user_id),
  title text NOT NULL, instructions text, state text NOT NULL DEFAULT 'open' CHECK (state IN ('open','closed','archived')),
  allow_anonymous boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(), expires_at timestamptz
);
CREATE TABLE app.community_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), request_id uuid NOT NULL REFERENCES app.recommendation_requests(id),
  creator_id uuid NOT NULL REFERENCES app.creator_profiles(user_id),
  submitter_id uuid REFERENCES app.profiles(user_id) ON DELETE SET NULL,
  submitter_display_name text, body text NOT NULL, reference_url text,
  state text NOT NULL DEFAULT 'pending' CHECK (state IN ('pending','approved','rejected','withdrawn','hidden')),
  published_post_id uuid REFERENCES app.posts(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(), reviewed_at timestamptz
);

-- 06 DISCOVERY/IA, NENHUM DADO PRIVADO EM OBJETOS PUBLICOS
CREATE TABLE app.discovery_entities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), entity_kind text NOT NULL CHECK (entity_kind IN ('product','place','service','other')),
  canonical_name text NOT NULL, canonical_url text, normalized_url text,
  created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE app.entity_aliases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), entity_id uuid NOT NULL REFERENCES app.discovery_entities(id) ON DELETE CASCADE,
  alias text NOT NULL, locale text, source text, UNIQUE(entity_id,alias)
);
CREATE TABLE app.post_entity_links (
  post_id uuid NOT NULL REFERENCES app.posts(id) ON DELETE CASCADE,
  entity_id uuid NOT NULL REFERENCES app.discovery_entities(id) ON DELETE CASCADE,
  confidence numeric(4,3) CHECK (confidence BETWEEN 0 AND 1),
  review_state text NOT NULL DEFAULT 'proposed' CHECK (review_state IN ('proposed','verified','rejected')),
  provenance text, PRIMARY KEY(post_id,entity_id)
);
CREATE TABLE app.entity_evidence (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), entity_id uuid NOT NULL REFERENCES app.discovery_entities(id) ON DELETE CASCADE,
  field_name text NOT NULL, field_value jsonb NOT NULL, source_kind text NOT NULL,
  source_ref text, collected_at timestamptz NOT NULL DEFAULT now(), expires_at timestamptz
);
CREATE TABLE app.post_search_documents (
  post_id uuid PRIMARY KEY REFERENCES app.posts(id) ON DELETE CASCADE,
  creator_id uuid NOT NULL REFERENCES app.creator_profiles(user_id),
  public_text text NOT NULL DEFAULT '', private_context_indexed boolean NOT NULL DEFAULT false,
  lexical tsvector GENERATED ALWAYS AS (to_tsvector('simple', coalesce(public_text,''))) STORED,
  index_version integer NOT NULL DEFAULT 1, refreshed_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE app.search_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), owner_user_id uuid REFERENCES app.profiles(user_id) ON DELETE SET NULL,
  scope_kind text NOT NULL CHECK (scope_kind IN ('creator','saved')),
  scope_owner_id uuid NOT NULL REFERENCES app.profiles(user_id),
  session_key_hash text, locale text NOT NULL DEFAULT 'pt-BR',
  created_at timestamptz NOT NULL DEFAULT now(), expires_at timestamptz NOT NULL
);
CREATE TABLE app.search_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), session_id uuid NOT NULL REFERENCES app.search_sessions(id) ON DELETE CASCADE,
  actor text NOT NULL CHECK (actor IN ('user','assistant','system')),
  text text NOT NULL, structured_filters jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE app.search_feedback (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), search_session_id uuid NOT NULL REFERENCES app.search_sessions(id) ON DELETE CASCADE,
  post_id uuid REFERENCES app.posts(id) ON DELETE SET NULL, rating text NOT NULL CHECK (rating IN ('helpful','not_helpful')),
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 07 ANALYTICS E PRIVACIDADE
CREATE TABLE app.analytics_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), event_name text NOT NULL,
  creator_id uuid REFERENCES app.creator_profiles(user_id), post_id uuid REFERENCES app.posts(id),
  collection_id uuid REFERENCES app.collections(id), banner_id uuid REFERENCES app.banners(id),
  actor_user_id uuid REFERENCES app.profiles(user_id), anonymous_key_hash text,
  session_key_hash text, event_dedupe_key text NOT NULL UNIQUE,
  source_surface text NOT NULL, event_payload jsonb NOT NULL DEFAULT '{}'::jsonb,
  occurred_at timestamptz NOT NULL, received_at timestamptz NOT NULL DEFAULT now(),
  CHECK (jsonb_typeof(event_payload)='object')
);
CREATE TABLE app.creator_metrics_daily (
  creator_id uuid NOT NULL REFERENCES app.creator_profiles(user_id) ON DELETE CASCADE,
  day date NOT NULL, visits bigint NOT NULL DEFAULT 0, profile_link_clicks bigint NOT NULL DEFAULT 0,
  searches bigint NOT NULL DEFAULT 0, saves bigint NOT NULL DEFAULT 0,
  shares bigint NOT NULL DEFAULT 0, PRIMARY KEY(creator_id,day)
);
CREATE TABLE app.post_metrics_daily (
  post_id uuid NOT NULL REFERENCES app.posts(id) ON DELETE CASCADE, day date NOT NULL,
  impressions bigint NOT NULL DEFAULT 0, views bigint NOT NULL DEFAULT 0,
  saves bigint NOT NULL DEFAULT 0, link_clicks bigint NOT NULL DEFAULT 0,
  PRIMARY KEY(post_id,day)
);
CREATE TABLE app.banner_metrics_daily (
  banner_id uuid NOT NULL REFERENCES app.banners(id) ON DELETE CASCADE, day date NOT NULL,
  impressions bigint NOT NULL DEFAULT 0, clicks bigint NOT NULL DEFAULT 0,
  PRIMARY KEY(banner_id,day)
);
CREATE TABLE app.privacy_consents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), user_id uuid NOT NULL REFERENCES app.profiles(user_id),
  purpose text NOT NULL, policy_version text NOT NULL, decision text NOT NULL CHECK (decision IN ('granted','withdrawn','denied')),
  occurred_at timestamptz NOT NULL DEFAULT now(), source text NOT NULL
);

-- 08 BILLING E ENTITLEMENTS
CREATE TABLE app.plans (
  id text PRIMARY KEY, label text NOT NULL, is_active boolean NOT NULL DEFAULT true
);
CREATE TABLE app.plan_prices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), plan_id text NOT NULL REFERENCES app.plans(id),
  currency text NOT NULL CHECK (currency IN ('BRL','USD','EUR')),
  billing_interval text NOT NULL CHECK (billing_interval IN ('month','year')),
  minor_units bigint NOT NULL CHECK (minor_units > 0), stripe_price_id text UNIQUE,
  is_approved boolean NOT NULL DEFAULT false, UNIQUE(plan_id,currency,billing_interval)
);
CREATE TABLE app.subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), creator_id uuid NOT NULL REFERENCES app.creator_profiles(user_id),
  stripe_customer_id text NOT NULL, stripe_subscription_id text UNIQUE,
  plan_id text NOT NULL REFERENCES app.plans(id), state text NOT NULL DEFAULT 'incomplete'
  CHECK (state IN ('incomplete','trialing','active','past_due','unpaid','paused','canceled')),
  currency text NOT NULL CHECK (currency IN ('BRL','USD','EUR')),
  current_period_start timestamptz, current_period_end timestamptz,
  trial_ends_at timestamptz, cancel_at_period_end boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE app.subscription_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), subscription_id uuid NOT NULL REFERENCES app.subscriptions(id),
  provider_event_id text NOT NULL UNIQUE, event_type text NOT NULL, event_payload jsonb NOT NULL,
  received_at timestamptz NOT NULL DEFAULT now(), applied_at timestamptz
);
CREATE TABLE app.entitlements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), creator_id uuid NOT NULL REFERENCES app.creator_profiles(user_id),
  feature_key text NOT NULL, valid_from timestamptz NOT NULL, valid_until timestamptz,
  source_subscription_id uuid REFERENCES app.subscriptions(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  CHECK(valid_until IS NULL OR valid_until > valid_from)
);
CREATE TABLE app.provider_webhook_events (
  provider text NOT NULL CHECK (provider IN ('stripe','bunny','other')),
  provider_event_id text NOT NULL, event_type text NOT NULL, payload_digest text NOT NULL,
  received_at timestamptz NOT NULL DEFAULT now(), processed_at timestamptz,
  processing_state text NOT NULL DEFAULT 'queued', last_error text,
  PRIMARY KEY(provider,provider_event_id)
);

-- 09 PARTNERS (SEM POLITICA INTERNACIONAL/ANUAL INVENTADA)
CREATE TABLE app.partners (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), user_id uuid NOT NULL UNIQUE REFERENCES app.profiles(user_id),
  code text NOT NULL UNIQUE, state text NOT NULL DEFAULT 'pending'
  CHECK (state IN ('pending','approved','rejected','suspended')),
  approved_at timestamptz, created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE app.partner_clicks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), partner_id uuid NOT NULL REFERENCES app.partners(id),
  anonymous_key_hash text, session_key_hash text, event_dedupe_key text NOT NULL UNIQUE,
  occurred_at timestamptz NOT NULL DEFAULT now(), source text
);
CREATE TABLE app.partner_referrals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), partner_id uuid NOT NULL REFERENCES app.partners(id),
  referred_user_id uuid NOT NULL UNIQUE REFERENCES app.profiles(user_id),
  attributed_click_id uuid REFERENCES app.partner_clicks(id),
  attribution_model text NOT NULL DEFAULT 'last_eligible_click',
  attributed_at timestamptz NOT NULL DEFAULT now(), attribution_reason text
);
CREATE TABLE app.partner_commissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), partner_id uuid NOT NULL REFERENCES app.partners(id),
  referral_id uuid NOT NULL REFERENCES app.partner_referrals(id),
  subscription_id uuid NOT NULL REFERENCES app.subscriptions(id),
  eligible_payment_reference text NOT NULL, coverage_period_start date, coverage_period_end date,
  amount_minor bigint NOT NULL CHECK (amount_minor>=0), currency text NOT NULL,
  state text NOT NULL DEFAULT 'pending' CHECK (state IN ('pending','approved','payable','paid','reversed','held')),
  created_at timestamptz NOT NULL DEFAULT now(), paid_at timestamptz,
  UNIQUE(subscription_id,eligible_payment_reference)
);
CREATE TABLE app.partner_payout_batches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), currency text NOT NULL,
  state text NOT NULL DEFAULT 'draft' CHECK (state IN ('draft','approved','processing','paid','failed')),
  approved_by uuid REFERENCES app.profiles(user_id), created_at timestamptz NOT NULL DEFAULT now(), paid_at timestamptz
);
CREATE TABLE app.partner_payout_items (
  payout_batch_id uuid NOT NULL REFERENCES app.partner_payout_batches(id),
  commission_id uuid NOT NULL UNIQUE REFERENCES app.partner_commissions(id),
  PRIMARY KEY(payout_batch_id,commission_id)
);

-- 10 MODERACAO, OPERACAO E NOTIFICACOES
CREATE TABLE app.admin_memberships (
  user_id uuid NOT NULL REFERENCES app.profiles(user_id),
  role text NOT NULL CHECK (role IN ('support','moderator','finance','admin','superadmin')),
  granted_by uuid REFERENCES app.profiles(user_id), created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY(user_id,role)
);
CREATE TABLE app.moderation_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), reporter_id uuid REFERENCES app.profiles(user_id),
  content_type text NOT NULL, content_id uuid NOT NULL, reason text NOT NULL,
  state text NOT NULL DEFAULT 'open' CHECK (state IN ('open','triaged','resolved','dismissed')),
  assigned_to uuid REFERENCES app.profiles(user_id), created_at timestamptz NOT NULL DEFAULT now(), resolved_at timestamptz
);
CREATE TABLE app.audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), actor_id uuid REFERENCES app.profiles(user_id),
  actor_kind text NOT NULL, action text NOT NULL, subject_kind text NOT NULL, subject_id text,
  correlation_id text, before_redacted jsonb, after_redacted jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE app.notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), recipient_id uuid NOT NULL REFERENCES app.profiles(user_id),
  notification_type text NOT NULL, payload jsonb NOT NULL DEFAULT '{}'::jsonb,
  read_at timestamptz, created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE app.notification_preferences (
  user_id uuid NOT NULL REFERENCES app.profiles(user_id), channel text NOT NULL CHECK(channel IN ('email','in_app')),
  notification_type text NOT NULL, enabled boolean NOT NULL DEFAULT true,
  PRIMARY KEY(user_id,channel,notification_type)
);
CREATE TABLE app.outbox_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), aggregate_kind text NOT NULL, aggregate_id uuid,
  event_type text NOT NULL, payload jsonb NOT NULL,
  state text NOT NULL DEFAULT 'pending' CHECK(state IN ('pending','processing','done','failed','dead')),
  dedupe_key text NOT NULL UNIQUE, attempts integer NOT NULL DEFAULT 0,
  next_run_at timestamptz NOT NULL DEFAULT now(), created_at timestamptz NOT NULL DEFAULT now(), processed_at timestamptz
);
CREATE TABLE app.scheduled_jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), job_kind text NOT NULL, object_kind text NOT NULL, object_id uuid NOT NULL,
  run_at timestamptz NOT NULL, state text NOT NULL DEFAULT 'pending'
  CHECK(state IN ('pending','running','done','failed','cancelled','dead')),
  expected_version integer, attempt integer NOT NULL DEFAULT 0,
  claimed_at timestamptz, claimed_by text, next_run_at timestamptz,
  last_error_code text, created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(job_kind,object_kind,object_id,run_at)
);
CREATE TABLE app.idempotency_keys (
  principal_key text NOT NULL, operation text NOT NULL, idempotency_key text NOT NULL,
  request_hash text NOT NULL, response_code integer, response_json jsonb,
  expires_at timestamptz NOT NULL, created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY(principal_key,operation,idempotency_key)
);
CREATE TABLE app.feature_flags (
  flag_key text PRIMARY KEY, enabled boolean NOT NULL DEFAULT false, config jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- 11 INDICES DE INTEGRIDADE / DESEMPENHO (refinar com EXPLAIN ANALYZE)
CREATE INDEX idx_creator_profiles_username ON app.creator_profiles(username);
CREATE INDEX idx_profile_links_creator ON app.profile_links(creator_id,sort_order);
CREATE INDEX idx_follows_creator ON app.follows(creator_id);
CREATE INDEX idx_media_owner_state ON app.media_assets(owner_id,original_state);
CREATE INDEX idx_upload_owner_expiry ON app.media_upload_intents(owner_id,expires_at);
CREATE INDEX idx_variants_asset ON app.media_variants(asset_id);
CREATE INDEX idx_posts_public ON app.posts(creator_id,visible_from DESC,id)
 WHERE lifecycle_state IN ('published','scheduled') AND moderation_state='approved' AND deleted_at IS NULL;
CREATE INDEX idx_posts_creator_updated ON app.posts(creator_id,updated_at DESC);
CREATE INDEX idx_posts_visibility_due ON app.posts(visible_until) WHERE visible_until IS NOT NULL;
CREATE INDEX idx_post_media_media ON app.post_media(media_id);
CREATE INDEX idx_post_links_post ON app.post_links(post_id);
CREATE INDEX idx_tags_key ON app.tags(canonical_key);
CREATE INDEX idx_banners_creator_visible ON app.banners(creator_id,visible_from,visible_until);
CREATE INDEX idx_pins_creator_period ON app.pinned_posts(creator_id,visible_from,visible_until);
CREATE INDEX idx_collections_owner ON app.collections(owner_id,created_at DESC);
CREATE INDEX idx_collection_items_post ON app.collection_items(post_id);
CREATE INDEX idx_saved_posts_post ON app.saved_posts(post_id);
CREATE INDEX idx_community_creator ON app.community_submissions(creator_id,state,created_at DESC);
CREATE INDEX idx_entity_links_entity ON app.post_entity_links(entity_id);
CREATE INDEX idx_search_docs_lexical ON app.post_search_documents USING gin(lexical);
CREATE INDEX idx_search_docs_creator ON app.post_search_documents(creator_id);
CREATE INDEX idx_search_session_owner ON app.search_sessions(owner_user_id,created_at DESC);
CREATE INDEX idx_search_msgs_session ON app.search_messages(session_id,created_at);
CREATE INDEX idx_analytics_creator_day ON app.analytics_events(creator_id,occurred_at DESC);
CREATE INDEX idx_analytics_post_day ON app.analytics_events(post_id,occurred_at DESC);
CREATE INDEX idx_subscription_creator ON app.subscriptions(creator_id);
CREATE INDEX idx_entitlement_creator_feature ON app.entitlements(creator_id,feature_key,valid_until);
CREATE INDEX idx_partner_clicks_partner ON app.partner_clicks(partner_id,occurred_at DESC);
CREATE INDEX idx_partner_commissions_partner ON app.partner_commissions(partner_id,state);
CREATE INDEX idx_reports_state ON app.moderation_reports(state,created_at);
CREATE INDEX idx_notifications_recipient ON app.notifications(recipient_id,created_at DESC);
CREATE INDEX idx_outbox_next ON app.outbox_events(next_run_at) WHERE state IN ('pending','failed');
CREATE INDEX idx_scheduled_next ON app.scheduled_jobs(run_at) WHERE state IN ('pending','failed');
CREATE INDEX idx_audit_actor ON app.audit_logs(actor_id,created_at DESC);

-- Service role has BYPASSRLS but still needs table/sequence privileges.
-- Secret key must NEVER leave server runtime; access is guarded by application policies.
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA app TO service_role;
GRANT USAGE, SELECT, UPDATE ON ALL SEQUENCES IN SCHEMA app TO service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA app GRANT ALL ON TABLES TO service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA app GRANT USAGE, SELECT, UPDATE ON SEQUENCES TO service_role;

-- connect avatar only after media manifest exists
ALTER TABLE app.profiles ADD CONSTRAINT profiles_avatar_asset_fk
 FOREIGN KEY (avatar_asset_id) REFERENCES app.media_assets(id) ON DELETE SET NULL;

-- 12 TRIGGERS updated_at (sem UPDATE manual de timestamp)
DO $$ DECLARE t text; BEGIN
 FOREACH t IN ARRAY ARRAY['profiles','creator_profiles','media_assets','media_processing_jobs','posts',
  'banners','pinned_posts','collections','discovery_entities','subscriptions','post_private_contexts'] LOOP
  EXECUTE format('CREATE TRIGGER trg_touch_%I BEFORE UPDATE ON app.%I FOR EACH ROW EXECUTE FUNCTION app.touch_updated_at()', t,t);
 END LOOP;
END $$;

-- 13 RLS DEFAULT DENY EM TODAS TABELAS, ACESSO POR ROTA SERVER-ONLY.
-- CRITICO: registrar 'app' fora das schemas expostas. Nunca criar POLICY USING(true) universal.
DO $$ DECLARE t text; BEGIN
 FOR t IN SELECT tablename FROM pg_tables WHERE schemaname='app' LOOP
  EXECUTE format('ALTER TABLE app.%I ENABLE ROW LEVEL SECURITY',t);
  EXECUTE format('REVOKE ALL ON TABLE app.%I FROM anon, authenticated',t);
 END LOOP;
END $$;

-- 14 POLITICAS EXPLICITAS E LIMITADAS PARA AUTOACESSO (caso cliente scoped seja usado)
GRANT SELECT ON app.profiles TO authenticated;
-- UPDATE apenas por API server validada: impedir alteracao direta de account_state, roles e moeda.
CREATE POLICY profiles_read_own ON app.profiles FOR SELECT TO authenticated USING (user_id=(select auth.uid()));
GRANT SELECT ON app.creator_profiles TO authenticated;
CREATE POLICY creator_read_own ON app.creator_profiles FOR SELECT TO authenticated USING(user_id=(select auth.uid()));
GRANT SELECT ON app.media_assets TO authenticated;
CREATE POLICY media_read_own ON app.media_assets FOR SELECT TO authenticated USING(owner_id=(select auth.uid()));
GRANT SELECT ON app.posts TO authenticated;
CREATE POLICY posts_read_own ON app.posts FOR SELECT TO authenticated USING(creator_id=(select auth.uid()));
GRANT SELECT ON app.post_private_contexts TO authenticated;
CREATE POLICY context_read_own ON app.post_private_contexts FOR SELECT TO authenticated USING(owner_id=(select auth.uid()));
GRANT SELECT ON app.collections TO authenticated;
CREATE POLICY collections_read_own ON app.collections FOR SELECT TO authenticated USING(owner_id=(select auth.uid()));
GRANT SELECT ON app.saved_posts TO authenticated;
CREATE POLICY saved_read_own ON app.saved_posts FOR SELECT TO authenticated USING(user_id=(select auth.uid()));
GRANT SELECT ON app.follows TO authenticated;
CREATE POLICY follows_read_own ON app.follows FOR SELECT TO authenticated USING(follower_id=(select auth.uid()) OR creator_id=(select auth.uid()));
GRANT SELECT ON app.notifications TO authenticated;
CREATE POLICY notifications_read_own ON app.notifications FOR SELECT TO authenticated USING(recipient_id=(select auth.uid()));
GRANT SELECT ON app.search_sessions TO authenticated;
CREATE POLICY search_sessions_read_own ON app.search_sessions FOR SELECT TO authenticated USING(owner_user_id=(select auth.uid()));
GRANT SELECT ON app.partner_commissions TO authenticated;
CREATE POLICY partner_commissions_read_own ON app.partner_commissions FOR SELECT TO authenticated USING(
 EXISTS(SELECT 1 FROM app.partners pa WHERE pa.id=partner_id AND pa.user_id=(select auth.uid()))
);
-- above policy references app.partners with no authenticated SELECT grant: use exclusively via server;
-- grant+policy on partners if direct client read of partner commissions is activated.
GRANT SELECT ON app.partners TO authenticated;
CREATE POLICY partners_read_own ON app.partners FOR SELECT TO authenticated USING(user_id=(select auth.uid()));

-- 15 SEGURANCA: GRANTS server-only para todo restante; app e views privados.
COMMIT;
