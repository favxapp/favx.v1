# DOC 05 — Pacote técnico FAVX v1.0

**Status:** documentação e referências SQL; **não implantado/testado em banco real**.

Contém:
- `FAVX_DOC05_Backend_Banco_de_Dados_Completo_v1_0.md` — especificação;
- `FAVX_DOC05_Backend_Banco_de_Dados_Completo_v1_0.docx` — leitura e edição;
- `sql/0001_app_schema.sql` — DDL base **66 tabelas**;
- `sql/0002_optional_vector_geo.sql` — extensões e índices opcionais;
- `sql/0003_seed_safe.sql` — apenas preços confirmados e flags off;
- `sql/0004_visibility_helper.sql` — filtro temporal no banco;
- `sql/0005_ownership_integrity.sql` — validação de associação cross-owner;
- `contracts/openapi.yaml` — contrato HTTP inicial com 50 paths e 64 operações;
- `docs/data_dictionary.csv` — catálogo tabular de todos os campos;
- `diagrams/*.mmd` — arquitetura e ER lógico;
- `tests/schema_smoke_pgtap.sql` — teste smoke **a executar**;
- `tests/security_test_matrix.md` — cenários negativos/IDOR e integridade.

## Validação exigida ANTES de produção

1. `supabase start` em ambiente local com CLI/Docker e Auth/roles.
2. Verificar versão e permissões de `postgis`, `vector`, `pg_trgm` e `pgtap`, atualizar nomenclatura de operadores se necessário.
3. Migrations em transação e rollback/restore drill.
4. Executar pgTAP, testes de grants e RLS com IDs A/B/Anon/Admin.
5. Rodar fixtures de pagamentos e horários sem dados reais.
6. Verificar contrato Bunny e Stripe na conta/sandbox reais.
7. Resolver DEC-01..DEC-25 do PRD antes de ativar seus módulos.

Não use como um deploy automático; leia o DOC 05 e crie PRs incrementais após aprovação.
