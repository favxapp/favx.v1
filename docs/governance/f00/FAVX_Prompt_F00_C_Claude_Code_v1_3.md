# FAVX — F00-C: UX de busca, POCs, esforço e rastreabilidade (v1.3)
**Executar somente após aprovações explícitas das etapas F00-A e F00-B.**

## Restrições globais obrigatórias
- **Somente auditoria e patches não aplicados:** não executar produto, migrations locais ou remotas, deploy, integrações pagas, acessos a credenciais ou alterações nos seis documentos oficiais. Somente criar `docs/f00/*`.
- Usar fixtures sintéticas. Não consultar conversas, segredos, dados de usuários, Context, cartões, contas bancárias ou mídia real.
- Ler fontes em blocos de **150–300 linhas** ou por seção, inventariando caminho, SHA-256, total de linhas e progresso retomável em `docs/f00/progress.md`. Após cada bloco atualizar range, hash, IDs e próximo bloco.
- Achados precisam de `arquivo:linha_inicial-linha_final` e ID de requisito/tela/endpoint/SQL quando aplicável. Conteúdo não acessível = `MISSING_SOURCE`.
- Nunca afirmar aprovação de DEC/TEC/ADR/POC sem responsável **pessoa**, data, versão, escopo e evidência verificável. `ACEITO_PO` e `ACEITO_TEC` não são usados por inferência.
- Para cada etapa, produzir `docs/f00/f00-c/review.md`, `findings.csv`, `proposed_diffs/`, `coverage.csv`, `blockers.csv` e solicitação objetiva de aprovação.
- **Ao concluir a etapa, PARE.** Prosseguir depende de mensagem explícita da PO aceitando aquela etapa, registrada em `docs/f00/checkpoints.md`. Aceite da etapa de auditoria não é autorização para aplicar patches ao produto nem aceite de DEC específicos.


## Fontes prioritárias
`FAVX_Especificacao_UX_Busca_Sem_Resultados_v1_3.md`, `FAVX_Microcopy_Busca_ZR_10x6_v1_3.csv`, backlog 142 v1.3, plano 12 workstreams v1.3, tokens e DOC04, seis docs oficiais, POCs e registro DEC/TEC/ADR.

## Entregáveis F00-C
C1. Auditar 10 estados ZR, **60 combinações de idioma** (pt-BR, pt-PT, en, es, it, fr), placeholders de scope e variantes de CTA. Teste deliberado: ZR-05 e ZR-01 devem ser indistinguíveis para usuário não autorizado; conteúdo privado nunca vaza pela razão de busca. Traduções seguem `PENDENTE_REVISAO_HUMANA` até validação.
C2. Validar os 18 testes ZR-T01..ZR-T18 e quatro novos ZR-T19..ZR-T22, incluindo falha IA vs voz, fallback, zero real vs falha, limite de CTAs, itens reais, acesso anônimo e filtros rígidos sem relaxamento automático. CTA de pedir dica ao creator é **futuro**, desligado, diferente do fluxo FAVX-COM de seguidores enviando recomendações.
C3. Plano das cinco POCs M01 (mídia 250MB/retomada/original), S01 (scope/relevância textual/semântica), J01 (fronteira temporal), B01 (webhooks/trial/entitlement) e A01 (busca+transcrição em seis idiomas/custo); apenas plano e fixtures, **não executar nem contratar serviço pago**.
C4. Validar Design System: tokens, contraste dos inputs e bordas, viewport 320px, blur, a11y, movimento reduzido, fontes e identidade final sem tratar proposta como homologada.
C5. Auditar backlog 142 por ID: cada linha deve possuir critério de aceite específico, DEC/POC apropriados, owner e estimativas não inventados. Confirmar SRH-008 em alpha apenas com **POC-S01 (busca textual)**; `POC-A01` bloqueia apenas camada de IA na beta. Registrar 138 P0 + 4 futuras sem corte de escopo tácito.
C6. Dimensionar esforço real de **12 workstreams** em cenários otimista/provável/pessimista com premissas de equipe/capacidade, dependências e caminho crítico, orçamento de mídia/IA, revisão humana de seis idiomas, suporte, QA e testes; não inferir horas da contagem 142 e não assumir prazo sem evidência.
C7. Rastreabilidade DEC/TEC/ADR/POC → PRD → TRD → DOC03 → API/SQL/RLS → evento → teste → dono humano → estado/evidência. Entregar patches não aplicados e lista priorizada de decisões para PO.

## Critério de aprovação para F00-C
Cobertura de 142 itens, 10 estados/6 idiomas, cinco POCs planejadas, estimativas transparentes ou pendentes justificadas e matriz final de diffs; **não aplicar modificações oficiais sem novo aceite explícito**.
