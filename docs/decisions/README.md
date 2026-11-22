# Decisões e pendências da fundação

Registro de 14/11/2026. Importação preserva documentos e comportamento do pacote; não homologa toda a arquitetura ou as funcionalidades ainda não verificadas.

## Direções explícitas da Product Owner

- Repositório `favxapp/favx.v1`; serviços GitHub, Supabase, Vercel, Stripe e Bunny Storage.
- Estrutura `AGENTS.md`, `.agents/skills`, `docs`, `src` e configuração de ambiente.
- Revisão online pela Vercel desde a primeira versão; segredos fora do Git.

## Adaptações da importação

- `AGENTS.md` usa a capitalização reconhecida pelo Codex.
- Código do ZIP na raiz; documentos originais sem sufixo de download nos nomes.
- README original preservado em `docs/source/`; README da raiz descreve o estado da importação.
- Dependências fixadas e lockfile registram as versões dos checks. Node.js 24 foi alinhado ao runtime de validação.
- O PostCSS transitivo do Next.js recebeu override para a versão corrigida já usada diretamente pelo projeto, sem upgrade de major do Next.js.
- Build Vercel passa a executar testes, typecheck e compilação. Ver `docs/validation.md`.

## Pendências antes de validar a aplicação integrada

| Tema | Evidência e impacto | Próximo passo |
|---|---|---|
| DOC05 e DOC06 ausentes | Código cita decisões e arquitetura não fornecidas | Receber documentos ou definir decisões necessárias explicitamente |
| Schema `public` + RLS | Pacote declara desvio de DOC05 com schema `app` e acesso administrativo | Revisar autorização antes de aplicar SQL; limitações do conector não determinam arquitetura |
| Contas suspensas | Update de Creator verifica `creator_state`, mas não `profiles.account_state`; demais policies exigem revisão dos estados | Definir regras e testar contas ativas/suspensas antes de disponibilizar cadastro real |
| RPC de username | Função `security definer` no schema `public`, concedida a autenticados | Revisar necessidade, escopo e exposição antes da migration |
| Edição de perfil | Dois updates independentes permitem salvamento parcial | Definir operação transacional e testar falha intermediária |
| Slugs e rotas | Lista A-03/F00-A ausente; código usa idiomas na raiz e reserva `site` | Harmonizar com usernames e manter seed SQL/código sincronizados |
| Banco e OTP | Nenhum alvo ou SMTP verificado nesta importação | Selecionar ambiente, revisar migration e configurar e-mail |
| Design | DOC04 inclui tokens e componentes propostos | Homologar telas e estados; importação não é aprovação visual |
| Stripe e Bunny | Stack definida, sem código de integração | Implementar por incremento após definir contratos |

Build e testes unitários não encerram essas pendências. A migration recebida é somente versionada nesta etapa.

## Atualização de 15/11/2026 — perfil Creator

DOC05, DOC06 e pacotes F00 recebidos; ver [conciliação e incremento](../creator-profile.md). Login OTP confirmado pela Product Owner. O próximo incremento adiciona foto, redes, perfil público, compartilhar e validação de username. A política de renomeação continua pendente. A Product Owner autorizou explicitamente a aplicação da proposta. A migration 20261115155702 foi aplicada no Supabase FAVX e os testes transacionais de acesso A/B/anônimo, suspensão e atomicidade passaram, com rollback das identidades de teste. Não considerar concluídas as fases F02/F03 nem homologada a POC geral de mídia.

## Atualização de 15/11/2026 — editor editorial

A Product Owner pediu avançar na criação de posts. Ver [escopo e decisões do editor](../posts-editor.md): CRE-006/007/009/011 parciais, com rascunho/persistência/publicação de texto. Migration 20261115221433 aplicada e verificada no Supabase; não implica conclusão de mídia, agendamento ou do baseline DOC05.

## Atualização de 21/11/2026 — direção visual e workspace

A Product Owner autorizou aplicar as referências e construir as 142 telas. [Decisão visual](2026-11-16-visual-direction.md): Manrope em toda a interface, sidebar desktop, glass e organização do perfil indicada. OpenAI escolhido explicitamente. [Incremento e limites](../workspace-delivery.md) e [registro por ID](../screen-delivery.json) distinguem implementação parcial e pendências; não representam aceite integral das telas.

## Atualização de 21/11/2026 — biblioteca pessoal

A Product Owner pediu avançar nas pendências. O [incremento de biblioteca](../user-library.md) implementa salvos e coleções User separados das coleções autorais de Creator, com compartilhamento explícito revogável. Não ativa busca global, rastreamento de navegação, produtos futuros ou condições comerciais propostas.
