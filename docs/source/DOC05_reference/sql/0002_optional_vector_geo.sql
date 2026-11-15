-- 0002_extensoes_opcionais.sql — executar APOS POC / aprovado em ambiente.
-- Extensoes podem exigir habilitacao admin e catalogo Supabase atualizado.
BEGIN;
CREATE SCHEMA IF NOT EXISTS extensions;
CREATE EXTENSION IF NOT EXISTS postgis WITH SCHEMA extensions;
CREATE EXTENSION IF NOT EXISTS vector WITH SCHEMA extensions;
CREATE EXTENSION IF NOT EXISTS pg_trgm WITH SCHEMA extensions;
-- NOTA: dimensão 1536 é CONFIGURACAO DE REFERENCIA, depende do modelo validado.
-- Na troca de modelo/dimensao, migrar via backfill, nao sobrescrever vetores silenciosamente.
CREATE TABLE IF NOT EXISTS app.post_embeddings (
 post_id uuid PRIMARY KEY REFERENCES app.posts(id) ON DELETE CASCADE,
 embedding extensions.vector(1536) NOT NULL, model_id text NOT NULL,
 source_revision integer NOT NULL, updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS app.context_embeddings (
 post_id uuid PRIMARY KEY REFERENCES app.posts(id) ON DELETE CASCADE,
 embedding extensions.vector(1536) NOT NULL, model_id text NOT NULL,
 source_generation integer NOT NULL, updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS app.entity_locations (
 entity_id uuid PRIMARY KEY REFERENCES app.discovery_entities(id) ON DELETE CASCADE,
 location extensions.geography(Point,4326) NOT NULL, source text NOT NULL,
 precision_meters integer CHECK(precision_meters>=0), updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_entity_locations_gist ON app.entity_locations USING gist(location);
CREATE INDEX IF NOT EXISTS idx_post_embeddings_hnsw ON app.post_embeddings USING hnsw (embedding extensions.vector_cosine_ops);
CREATE INDEX IF NOT EXISTS idx_context_embeddings_hnsw ON app.context_embeddings USING hnsw (embedding extensions.vector_cosine_ops);
CREATE INDEX IF NOT EXISTS idx_entities_name_trgm ON app.discovery_entities USING gin(canonical_name extensions.gin_trgm_ops);
ALTER TABLE app.post_embeddings ENABLE ROW LEVEL SECURITY;
ALTER TABLE app.context_embeddings ENABLE ROW LEVEL SECURITY;
ALTER TABLE app.entity_locations ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON app.post_embeddings,app.context_embeddings,app.entity_locations FROM anon,authenticated;
COMMIT;
