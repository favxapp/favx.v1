# FAVX — Compatibilidade e designação de pessoas (complemento v1.3.1)

**Estado:** PROPOSTO / NÃO HOMOLOGADO. Este complemento não altera as designações v1.3 nem autoriza nenhuma ação real.

## Conjunto mínimo de pessoas

- **Financeiro (operações sensíveis):** ao menos duas pessoas humanas distintas — solicitante e aprovador. A execução pode ocorrer por **worker de serviço restrito e auditado** após a aprovação; se manual, exige uma **terceira pessoa humana** distinta de ambas. Não basta criar usuários técnicos de serviço para fingir a segunda aprovação.
- **Segurança, contenção e break-glass:** responsável e revisor humano independente (duas pessoas distintas). O autor de um `temporary_hold` não pode validar a própria revisão; a pessoa que requisitou acesso excepcional não o aprova. Para suspensão permanente, proposta e aprovação independentes.
- **Pode haver acúmulo transversal de funções na equipe pequena**, mas isso depende da matriz `FAVX_Matriz_Compatibilidade_Funcoes_v1_3_1.csv` e de impedir conflito **por operação**, inclusive histórico de quem iniciou, revisou e executou. Mesmo quando um par está como `PERMITIDO`, isso não autoriza a pessoa a revisar sua própria ação.
- **Preferência de governança:** não utilizar sistematicamente as mesmas duas pessoas como único par aprovador nos domínios financeiro e segurança; onde for inviável, documentar riscos residuais, limites monetários e revisão externa periódica. Não presumir independência de um prestador que participa da mesma operação.
- **Funções jurídicas/fiscais e revisores de tradução** podem ser prestadores externos, desde que sejam identificados, tenham acesso mínimo e haja registro do trabalho. Não se exige empregado CLT. O que é exigido é identidade, independência material e disponibilidade real.

## Sem equipe designada

- F00, ambiente local, documentação e testes com dados sintéticos **podem prosseguir**.
- Cobrança real, alteração manual de preços/entitlements, estorno, payout, suspensão definitiva e acesso break-glass **não podem ser habilitados** antes de completar designação e validação de SoD.
- Em caso de emergência real e sem revisor habilitado, não inventar bypass de superadmin; adotar contenção técnica previamente homologada, com política própria e base legal. Este kit não habilita exceção operacional.

## Conjunto de evidências para liberação

Preencher `FAVX_Designacoes_Pessoas_Operacao_v1_3.csv`: nome da pessoa real, identificador autenticado, substituto, escopo, data, evidência de nomeação e status. A matriz de incompatibilidades **não preenche** essas células. Validar em simulações as tentativas de autoaprovação, aprovação cruzada após substituição de papéis, executor manual igual a proponente/aprovador, break-glass autoprovado, revisão da própria contenção, MFA expirado e concessão indevida por superadmin.

## Release gate de operação sensível

1. Verificar pessoas distintas e substitutos elegíveis para financeiro e segurança.
2. Verificar que os papéis estão limitados por ambiente, recurso e operação; aprovar MFA e trilha append-only.
3. Testar negação de execução quando não houver aprovação humana distinta ou quando a revisão estiver atrasada.
4. Homologar política de incidentes, reembolsos e retenção com profissionais jurídicos/fiscais responsáveis.
5. Registrar pessoa que autorizou, data UTC, versão da política, evidência e expiração; sem isso o gate permanece **bloqueado**.

**Importante:** `INCOMPATIVEL` na matriz significa que as duas funções **não podem ficar com a mesma pessoa** no release em que ambas operem; `CONDICIONAL` exige controles descritos; `PERMITIDO` autoriza o acúmulo apenas no nível organizacional, nunca autorrevisão por transação.
