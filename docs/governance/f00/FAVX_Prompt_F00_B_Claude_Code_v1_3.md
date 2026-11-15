# FAVX — F00-B: identidade, permissões, eventos e APIs (v1.3)
**Só executar após aprovação humana rastreável de F00-A. Não iniciar F00-C.**

## Restrições globais obrigatórias
- **Somente auditoria e patches não aplicados:** não executar produto, migrations locais ou remotas, deploy, integrações pagas, acessos a credenciais ou alterações nos seis documentos oficiais. Somente criar `docs/f00/*`.
- Usar fixtures sintéticas. Não consultar conversas, segredos, dados de usuários, Context, cartões, contas bancárias ou mídia real.
- Ler fontes em blocos de **150–300 linhas** ou por seção, inventariando caminho, SHA-256, total de linhas e progresso retomável em `docs/f00/progress.md`. Após cada bloco atualizar range, hash, IDs e próximo bloco.
- Achados precisam de `arquivo:linha_inicial-linha_final` e ID de requisito/tela/endpoint/SQL quando aplicável. Conteúdo não acessível = `MISSING_SOURCE`.
- Nunca afirmar aprovação de DEC/TEC/ADR/POC sem responsável **pessoa**, data, versão, escopo e evidência verificável. `ACEITO_PO` e `ACEITO_TEC` não são usados por inferência.
- Para cada etapa, produzir `docs/f00/f00-b/review.md`, `findings.csv`, `proposed_diffs/`, `coverage.csv`, `blockers.csv` e solicitação objetiva de aprovação.
- **Ao concluir a etapa, PARE.** Prosseguir depende de mensagem explícita da PO aceitando aquela etapa, registrada em `docs/f00/checkpoints.md`. Aceite da etapa de auditoria não é autorização para aplicar patches ao produto nem aceite de DEC específicos.


## Fontes prioritárias
Matriz RBAC e ADM v1.3; runbooks SoD/break-glass v1.3; dicionário/aliases v1.3; registro DEC/TEC/ADR/POC; seções correspondentes dos seis documentos originais, SQL e OpenAPI. Verificar checkpoint F00-A real e hashes.

## Entregáveis F00-B
B1. Conciliar papéis da versão antiga com permissões granulares; matriz completa por operação e ADM-001..025, propondo migration sem executar. Inclua `partners.referrals_read` ADM-016/017.
B2. Testar em proposta a segregação: proponente != aprovador em preços, entitlements, comissão, refund, payout, suspensão e break-glass; em refund/payout, execução separada com `billing.refund_execute`, `partners.payout_execute` por terceiro humano **ou worker idempotente**, sempre após duas autorizações humanas distintas.
B3. Documentar `users.temporary_hold` com motivo, TTL máximo proposto 24h, revisor diferente e expiração segura; separar de suspensão definitiva e de contestação de moderação. Break-glass nunca como grant permanente de papel.
B4. Produzir matriz de pessoas a designar: proponente, aprovador, executor manual opcional, suplentes, jurídico/segurança, monitor de incidentes. **Não inventar nomes.** DEC-14 bloqueia funções sensíveis na release se faltar staffing independente.
B5. Auditar os **78 eventos** canônicos e aliases `auth.*` (**nomes legados**, não eventos atuais), `otp.*`, `login.*`, `signup.*`, `session.*` (**eventos atuais de segurança**), `post_save`, `post_saved`, `creator_search` (ambíguo: **não mapear sem confirmar semântica**), `search_submitted`, `search.query_submitted`, `search.no_results` -> `search.empty`. Verificar JSON Schema, versão, gate de privacidade, consumidor, produtor, idempotência e testes; não migrar consumidores/outbox automaticamente.
B6. Garantir `search.failed.reason` para distinguir IA/voz/serviço; verificar `search_suggestion.shown/clicked`, `search_filter.relaxed`, `search_fallback.shown`, `search_feedback.submitted` e consent.changed; sem raw query ou private Context em telemetria.
B7. Contratos de APIs ausentes e testes negativos: follow/unfollow, block, report/appeal, consent, notifications, data export/delete, share tokens, support, media rights, billing/refund/payout, hold/suspension e break-glass. Conferir owner checks/RLS sem executar migrations.
B8. Relatório de lacunas, staffing/pessoas, matriz de diffs com `arquivo:linhas`, testes SoD e um conjunto mínimo de pedidos de aprovação. **Parar antes de F00-C.**

## Critério de aprovação para F00-B
Permissões vs telas sem gaps, event names/aliases reconciliados, SoD robusto com 2 humanos nas aprovações e execução idempotente, e plano operacional transparente sem inventar equipe.
