# Verificação da importação

Executada em 14/11/2026 no ambiente de trabalho, com Node.js 24.22.1 e npm 11.9.0.

| Check | Resultado |
|---|---|
| Instalação limpa `npm ci --ignore-scripts` | Concluída a partir do lockfile |
| `npm test` | 17 testes aprovados; nenhum ignorado |
| `npm run typecheck` | Sem erros |
| `npm run build` | Compilação e geração das oito rotas concluídas |
| `npm audit` após atualização transitiva | Zero vulnerabilidades reportadas pelo registro consultado |
| PostCSS no lockfile | 8.5.33, incluindo a dependência do Next.js |
| Integridade dos originais | SHA-256 dos sete arquivos documentais conferidos |
| Tokens CSS | Documento original e `src/app/tokens.css` idênticos |
| Segredos | `.env` ignorado; modelo sem valores; nenhum padrão de credencial encontrado nos textos candidatos |
| Skills | Quatro arquivos `SKILL.md`, com nome e descrição |

## Ajustes técnicos

Versões resolvidas foram fixadas em `package.json`, com lockfile. Node.js foi fixado na major 24, usada nos checks.
O PostCSS 8.4.31 originalmente trazido pelo Next.js apresentou advisories; override para 8.5.33 removeu os apontamentos sem mudar a major do framework. Instalação limpa e checks foram repetidos após a correção.
`vercel.json` inclui testes, typecheck e build. O comportamento dos arquivos em `src/` e o SQL recebido não foram alterados nesta importação.

O runner Node emite aviso de inferência de módulos nos testes TypeScript; não houve falha de execução. Quebras de linha Markdown dos documentos originais foram preservadas.

## Limites

- Nenhuma migration aplicada; banco, RLS, OTP, SMTP e persistência não foram testados ponta a ponta.
- Nenhum deployment Vercel criado ou verificado nesta importação.
- O build foi feito sem credenciais reais. Para abrir as páginas, o runtime precisa das duas variáveis Supabase descritas em `setup.md`.
- Não houve homologação visual, teste de navegador ou revisão integral de todos os requisitos do PRD.
- Auditoria de dependências e busca de padrões de segredo são checks limitados, não garantia de ausência de vulnerabilidades ou dados sensíveis.

As pendências para integração estão em [decisões](decisions/README.md).

## 21/11/2026 — workspace e editor com mídia/IA

38 testes aprovados, typecheck sem erros e build de produção concluído. Ver [escopo, integrações e limites](workspace-delivery.md). Migration `20261120220440_workspace_collections_search_ai_media` aplicada no projeto FAVX; teste transacional `supabase/tests/workspace_access.sql` passou com rollback de todas as fixtures.

Teste Chromium com serviços controlados percorreu editor, upload de imagem 4,3 MB em partes, retry, original byte a byte, autosave, sugestão editorial, revisão/publicação, criação/edição de coleção, perfil e busca públicos, ocultação e revogação da mídia. Context e identidade não constam do pedido enviado à IA. Imagens de rascunho e originais não são legíveis por anônimos. Layout sem overflow em 320/390/768 px e desktop. A integração externa real permanece pendente das variáveis OpenAI e Bunny privado.

## 21/11/2026 — biblioteca e coleções User

Ver [registro de comportamento, validação e limites](user-library.md). 39 testes, typecheck e build aprovados. Migration `20261121165355_user_library` aplicada no Supabase FAVX. Probe transacional de isolamento, salvamento idempotente, compartilhamento explícito, revogação, indisponibilidade e limpeza de associações passou com rollback. Chromium atravessou UI/server actions e PostgreSQL sob RLS, incluindo concorrência e layouts responsivos. O retorno de sessão foi simulado; não foi enviado OTP real.

## 21/11/2026 — gestão de conteúdo

40 testes, typecheck/build e Chromium com UI/ações reais + PGlite sob RLS passaram. O teste transacional `supabase/tests/content_management_access.sql` também passou no Supabase real, com rollback integral. Escopo, reprodução e limites em [gestão de conteúdo](content-management.md).

## 22/11/2026 — comunidade

42 testes, typecheck/build e verificação da aplicação compilada com PGlite sob RLS. `supabase/tests/community_access.sql` passou no Supabase real com rollback integral. Fluxos, reprodução e limites: [comunidade](community.md).

## 22/11/2026 — guia público, contato e recuperação

44 testes, typecheck, build e Chromium aprovados. Navegador verificou seis idiomas, trilhas/FAQ/busca demonstrativa, validação e prévia de suporte, cópia/fallback, compartilhamento/cancelamento e recuperação de falha com nova consulta ao servidor. Layouts 320/390/768/1440 sem overflow; alternativa de contato sem JavaScript verificada. Nenhum e-mail enviado ou dado de banco alterado. [Escopo e limites](public-guides.md).
