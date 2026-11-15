-- NOTA: testes pgTAP de exemplo; testar em ambiente Supabase local, não em produção.
-- Instalar pgtap separadamente se disponivel.
BEGIN;
CREATE EXTENSION IF NOT EXISTS pgtap WITH SCHEMA extensions;
SELECT plan(12);
SELECT has_schema('app');
SELECT has_table('app','posts');
SELECT has_table('app','post_private_contexts');
SELECT has_table('app','analytics_events');
SELECT has_table('app','partner_commissions');
SELECT has_table('app','scheduled_jobs');
SELECT has_table('app','media_assets');
SELECT has_table('app','subscriptions');
SELECT has_index('app','posts','idx_posts_public');
SELECT has_index('app','post_search_documents','idx_search_docs_lexical');
SELECT is((SELECT relrowsecurity FROM pg_class c JOIN pg_namespace n ON n.oid=c.relnamespace
 WHERE n.nspname='app' AND c.relname='post_private_contexts'),true,'context RLS enabled');
SELECT is((SELECT relrowsecurity FROM pg_class c JOIN pg_namespace n ON n.oid=c.relnamespace
 WHERE n.nspname='app' AND c.relname='analytics_events'),true,'events RLS enabled');
SELECT * FROM finish();
ROLLBACK;
