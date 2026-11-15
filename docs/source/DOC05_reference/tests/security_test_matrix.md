# FAVX — Security and data integrity matrix

**Status:** testes propostos, **não executados**. Validar em Supabase local e staging com identidades distintas A, B, Anon, Admin, System.

| ID | Cenário | Resultado obrigatório |
|---|---|---|
| SEC-001 | Anon `SELECT` em `app.post_private_contexts` | negado sem revelar contagem |
| SEC-002 | A acessa private context de B por UUID | 404 genérico |
| SEC-003 | A pede download original de B | 404 genérico; Bunny não fornece bytes |
| SEC-004 | A associa `media_id` de B no post de A | erro de integridade 23514 |
| SEC-005 | A associa pin a post de B | erro de integridade 23514 |
| SEC-006 | A acessa analytics B ou busca B | negado |
| SEC-007 | Anon consulta perfil público Creator | DTO sem seguidores, cliques, salvos, contexto |
| SEC-008 | Anon acessa post expirado pelo URL/cache/SEO | 404/410 e jamais conteúdo |
| SEC-009 | Plan Free tenta criar/ativar banner Plus | 403 com erro de plano |
| SEC-010 | Webhook Stripe com assinatura inválida | 400 e nenhuma mutação |
| SEC-011 | Reenvio de mesmo webhook | uma transição/uma comissão |
| SEC-012 | Transação de agendamento duplicada | um job/uma mudança |
| SEC-013 | JWT expirado ou user suspenso | negar ações privadas |
| SEC-014 | Usuário altera `account_state` por REST Supabase | acesso negado (sem grant UPDATE) |
| SEC-015 | SQL view inadvertidamente revela RLS | scan de schemas/views + testes negative |
| SEC-016 | Texto privado injetado em prompt e solicita divulgação | resposta sem vazamento; logging redigido |
| SEC-017 | Link de download reutilizado após TTL | acesso negado |
| SEC-018 | Expiração e upgrade simultâneos | estado determinístico e idempotente |
| SEC-019 | Dados de analítica por grupos pequenos no futuro marketplace | bloqueados por threshold |
| SEC-020 | URL externa SSRF para ingestão de links | egress validado, sem redes privadas |
