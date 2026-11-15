# FAVX — Runbooks de governança, segregação de funções e acesso excepcional
**v1.3 | PROPOSTA — não homologada, não habilita operação real**

## 1. Princípio SoD e governança mínima do lançamento
Toda solicitação de alteração sensível tem `proposal_id`, recurso, valor/moeda (se aplicável), versão, motivo, evidência, ator autenticado e prazo. A **aprovação** deve ser realizada por outra **pessoa humana** com `auth.user_id` diferente, MFA recente, escopo específico e ausência de conflito. Acumular papéis ou ser `superadmin` não suspende essa regra. A validação é atômica no backend e o histórico é append-only.

| Operação | Proposta | Aprovação independente | Execução / aplicação | Regras adicionais |
|---|---|---|---|---|
| Preços | `billing.pricing_propose` | `billing.pricing_approve` | Worker/config deployment autorizado e versionado | Não ativar tarifa sem validação comercial/fiscal |
| Entitlements manuais | `billing.entitlement_adjust_propose` | `billing.entitlement_adjust_approve` | Serviço idempotente após aprovação | Trial/assinatura paga não pode ser forjada por operador |
| Reembolso | `billing.refund_propose` | `billing.refund_approve` | `billing.refund_execute` **ou worker restrito** | Não repetir refund; reconciliar Stripe; executor manual distinto de ambas as pessoas |
| Ajuste de comissão | `partners.commission_adjust_propose` | `partners.commission_adjust_approve` | Serviço idempotente após aprovação | Ledger imutável; estorno como evento separado |
| Payout | `partners.payout_propose` | `partners.payout_approve` | `partners.payout_execute` **ou worker restrito** | Limites por lote, verificações antifraude, reconciliação; executor manual distinto |
| Suspensão definitiva | `users.suspend_propose` | `users.suspend_approve` | Serviço autorizado | Informar motivo e direito de recurso segundo regras aplicáveis |
| Concessão administrativa | `security.roles_propose` | `security.roles_approve` | Serviço com trilha de mudança e MFA | Não conceder escopo além do aprovado |
| Break-glass | `private.*_breakglass_request` | `private.*_breakglass_approve` | Grant temporário por recurso | Exatamente um ativo, somente leitura, no máximo 30 min propostos |

**Três etapas não significam obrigatoriamente três funcionários para cada pagamento:** com **duas pessoas distintas** para proposta e aprovação, a execução pode ser realizada por um *worker de serviço não humano*, restrito, idempotente e com reconciliação. Quando for **execução manual**, deve haver **terceira pessoa distinta**, com `finance_execute` e MFA. A identidade de serviço nunca pode aprovar proposta ou criar solicitação nova por conta própria.

**Bloqueio operacional de release:** antes de publicar cobranças reais, payouts, reembolsos, alterações manuais de benefícios, suspensões e break-glass, a PO deve nomear pelo menos um solicitante e um aprovador humano independentes com backup e horários de atendimento. Para execução manual, também nomear executor distinto. Não inventar nomes; se essas capacidades não existirem, **a operação fica desabilitada**. DEC-14 deve incluir contrato/escala de suporte operacional, responsável por segurança/privacidade, jurídico e contabilidade. A alternativa de executar apenas via serviços autorizados não remove a necessidade de dois humanos na aprovação.

## 2. Procedimento de payout e reembolso
1. Verificar elegibilidade, pagamento/cobrança original, limites, moeda, território, documentação e ausência de conflito.
2. Proponente abre operação com chave idempotente e snapshot imutável de valores e destinatário (dados sensíveis cifrados, nunca em logs).
3. Aprovador humano distinto confirma o mesmo hash de operação após MFA e registra parecer.
4. Execução: worker idempotente com credenciais restritas ou executor humano independente. A validação do servidor nega se proposer == approver ou executor manual coincide com qualquer um.
5. Reconciliar resultado com provedor; registrar tentativa, comprovante de status redigido, failure/retry e reversão sem duplicar transferência.
6. Nunca marcar payout `paid` pelo simples clique do operador; somente pelo resultado verificado do provedor.
7. Testes negativos: autoaprovação, duplo clique, webhook duplicado, concorrência, valor alterado após aprovação, grant expirado, tentativa de executor não segregado.

## 3. Contenção emergencial e suspensão
- `users.temporary_hold`: **apenas risco iminente** de segurança, abuso ou necessidade legal; exige MFA recente, ticket, reason_code e TTL máximo proposto de **24 horas** (pendente de homologação jurídica).
- `users.temporary_hold_review`: segunda pessoa distinta confirma, reverte ou encaminha para suspensão formal em até **24 horas**. O sistema libera automaticamente a contenção temporária expirada se não houver outra restrição legal válida; registra o ocorrido.
- `users.suspend_propose` + `users.suspend_approve`: suspensão não emergencial/definitiva exige proposta e aprovação independentes, fundamentação e possibilidade de contestação.
- Restrição de conteúdo não apaga mídia, registros analíticos ou financeiros; não reativa automaticamente conteúdo expirado.
- Testar abuso de `temporary_hold`, expiração, operador tentando revisar seu próprio hold, falha de scheduler e revisão fora do prazo.

## 4. Contestação e acesso excepcional
- Contestação de moderação: revisor humano diferente da pessoa que tomou a decisão original; evidências mínimas, data, direito de resposta e trilha auditável.
- Break-glass: padrão **NEGADO**, inclusive `superadmin`. Permissões `private.*_breakglass_access` não são atribuídas a papel algum. Solicitar incidente justificado, aprovação por segundo humano com MFA, grant específico e expirável, auditoria de cada leitura e revisão pós-incidente. Não copiar texto de Context ou bytes de originais em logs, relatórios, suporte ou e-mail.
- Sem segundo humano, não emitir grant normal; não improvisar atalho de produção. Processo excepcional alternativo depende de decisão explícita jurídico/segurança e está **fora deste kit**.

## 5. Nomeações e evidências (não preenchidas)
Registrar para cada função: `FUNCAO`, `RESPONSAVEL_PESSOA`, `AUTH_USER_ID_REFERENCIA`, `SUBSTITUTO_PESSOA`, `ESCOPO`, `DATA_DESIGNACAO_UTC`, `VERSAO_POLITICA`, `FONTE_EVIDENCIA`, `VALIDADE`. As células de nome e evidência continuam vazias até a PO fazer a designação. O backend deverá verificar identidade real e não apenas strings do formulário.

## 6. Controle do trabalho F00
F00-A, F00-B, F00-C são sequenciais; um checkpoint aprovado libera somente a **próxima auditoria**, não autoriza aceitar automaticamente DEC/ADR/POC nem publicar código. Leitura de documentos em 150–300 linhas por vez, inventário SHA-256 e `arquivo:linhas` para cada achado; ausência de arquivos = `MISSING_SOURCE`. Informações de segurança, financeiro e propriedade intelectual não entram em fixtures reais ou documentos públicos.
