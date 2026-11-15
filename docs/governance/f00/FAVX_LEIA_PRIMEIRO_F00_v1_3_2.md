# FAVX — Leia primeiro: F00 v1.3.2

**Este é o workspace operacional.** Documentos-fonte preservados em `docs/source/`, incluindo os seis documentos v1.0, tokens DOC04 e referências DOC05 (`sql/`, OpenAPI, testes e dicionário de dados). O kit de governança v1.3 original permanece arquivado em `docs/governance/archive/` exclusivamente para proveniência.

1. Iniciar por `docs/governance/f00/FAVX_Prompt_F00_Claude_Code_v1_3_2.md` (que autoriza **somente F00-A**).
2. O manifest operacional é o `FAVX_Manifest_Workspace_v1_3_2.json` na raiz e **não** o antigo `FAVX_Manifest_Integridade_v1_3.json`; antes de qualquer auditoria, executar `python3 scripts/verify_f00_workspace.py`. O script usa somente arquivos locais e não acessa serviços externos.
3. A F00-A deve registrar para cada arquivo status MATCH / MISMATCH / MISSING_SOURCE, bytes e hash. Se estiver ausente/divergente, interromper as análises dependentes; não inventar citações.
4. As regras de staffing e compatibilidade estão em `FAVX_Matriz_Compatibilidade_Funcoes_v1_3_2.csv` e `FAVX_Guia_Designacoes_SoD_v1_3_2.md`. Os nomes ainda devem ser definidos pela PO e estão **em branco**, tal como no arquivo original `FAVX_Designacoes_Pessoas_Operacao_v1_3.csv`.
5. Não fazer deploy, executar migration, operar Stripe ou qualquer provedor externo, gerar custo, consultar segredos ou alterar fontes oficiais. Registrar achados e diffs propostos apenas em `docs/f00/`.
6. Somente após aprovação explícita dos resultados F00-A: usar `docs/governance/f00/FAVX_Prompt_F00_B_Claude_Code_v1_3.md`; e depois C, com outro checkpoint.

**Precedência durante F00-A:** `CLAUDE.md` ativo F00 v1.3.2 e prompt F00-A v1.3.2
substituem expressamente o fluxo de tickets/implementação da versão antiga. `README_COMECE_AQUI.md`
e `templates/FIRST_SESSION_PROMPT.md` são stubs legados e não podem dirigir a primeira sessão.
O registro real está em `docs/governance/f00/FAVX_Registro_Decisoes_DEC_TEC_ADR_POC_v1_3.csv`.

**Política histórica de precedência:** patches v1.3.2 deste workspace substituem apenas os prompts/README A e a política de designação; materiais v1.3 não modificados mantêm seu conteúdo e status de proposta. Arquivos no arquivo compactado histórico não são instruções ativas.
