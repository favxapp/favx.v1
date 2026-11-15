# FAVX — F00-A: inventário, requisitos, rotas e visibilidade (v1.3.2)
**Executar exclusivamente esta etapa. Não iniciar F00-B ou F00-C nesta sessão.**

## Restrições globais obrigatórias
- **Somente auditoria e patches não aplicados:** não executar produto, migrations locais ou remotas, deploy, integrações pagas, acessos a credenciais ou alterações nos seis documentos oficiais. Somente criar `docs/f00/*`.
- Usar fixtures sintéticas. Não consultar conversas, segredos, dados de usuários, Context, cartões, contas bancárias ou mídia real.
- Ler fontes em blocos de **150–300 linhas** ou por seção, inventariando caminho, SHA-256, total de linhas e progresso retomável em `docs/f00/progress.md`. Após cada bloco atualizar range, hash, IDs e próximo bloco.
- Achados precisam de `arquivo:linha_inicial-linha_final` e ID de requisito/tela/endpoint/SQL quando aplicável. Conteúdo não acessível = `MISSING_SOURCE`.
- Nunca afirmar aprovação de DEC/TEC/ADR/POC sem responsável **pessoa**, data, versão, escopo e evidência verificável. `ACEITO_PO` e `ACEITO_TEC` não são usados por inferência.
- Para cada etapa, produzir `docs/f00/f00-a/review.md`, `findings.csv`, `proposed_diffs/`, `coverage.csv`, `blockers.csv` e solicitação objetiva de aprovação.
- **Ao concluir a etapa, PARE.** Prosseguir depende de mensagem explícita da PO aceitando aquela etapa, registrada em `docs/f00/checkpoints.md`. Aceite da etapa de auditoria não é autorização para aplicar patches ao produto nem aceite de DEC específicos.


## Fontes prioritárias
1. `docs/governance/f00/FAVX_Consolidacao_Decisoes_PreDesenvolvimento_v1_3.md`, seções 0, 1, 5.1, 5.2, 11, 12.
   Manifest operacional: `FAVX_Manifest_Workspace_v1_3_2.json` (raiz). Documentos oficiais: `docs/source/`. Anexos DOC05: `docs/source/DOC05_reference/`. Design Tokens: `docs/source/FAVX_DOC04_Design_Tokens_v1_0.*`.
2. Registro **no caminho exato** `docs/governance/f00/FAVX_Registro_Decisoes_DEC_TEC_ADR_POC_v1_3.csv` (não procurar na raiz e não declarar `MISSING_SOURCE` por caminho abreviado); 6 documentos oficiais v1.0; migrations/SQL e OpenAPI DOC05; inventário dos anexos completos.
3. Para cada item citar fonte original e proposta de correção sem alterar a fonte.

## Entregáveis F00-A
A1. Inventário completo com paths, bytes, SHA-256, contagem de linhas, referências e anexos faltantes; criar `progress.md` retomável. **Antes de ler ou auditar as fontes, validar todos os SHA-256 e tamanhos listados em `FAVX_Manifest_Workspace_v1_3_2.json` (na raiz do workspace), usando **`python3 scripts/verify_f00_workspace.py`** (Python >= 3.9), e registrar `MATCH`, `MISMATCH` ou `MISSING_SOURCE` por arquivo. Comparar os arquivos de governança herdados da v1.3 com o manifest histórico dentro do kit v1.3 arquivado, sem confundir o manifest histórico com o manifest operacional novo. Um `MISMATCH`/`MISSING_SOURCE` bloqueia a auditoria dependente desse arquivo: registrar e solicitar correção, nunca presumir leitura. Nenhum arquivo inexistente é considerado lido.
A2. Conferir 101 requisitos identificados + três I18N que faltam; não incluir `FAVX-PRD-001` no catálogo nem tratar `FAVX-MED-010` como tela.
A3. Diferenças entre os seis documentos de `favx.app`, URLs de perfil/publicação/coleção, prefixos de idioma, reservas multilíngues e `/app/creator/*`/`/app/partner/*`.
A4. Proposta de migração (não executar) `public_id`, `slug`, unicidade, parser pelo **último** sufixo e redirects por nome antigo; segurança e SEO.
A5. Visibilidade de posts `scheduled|published` por horário, conta/profile elegíveis, moderação `approved`, mídia pronta; cenas textuais sem mídia e definição de `post_media_ready_for_publication` apenas como contrato proposto.
A6. Índice de divergências com localizações exatas; diffs previstos com testes de leitura por timezone, redirects e casos privados. Relatório de decisões que exigem aceite da PO.

## Critério de aprovação para F00-A
Inventário 100% do que foi realmente disponibilizado, divergências com fonte/linha, predicado único proposto sem cron como pré-condição e nenhum arquivo normativo alterado. Entregar revisão e **parar aguardando autorização explícita para F00-B**.
