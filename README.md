# FAVX

Fundação importada do pacote fornecido pela Product Owner em 14/11/2026.
Repositório oficial: [favxapp/favx.v1](https://github.com/favxapp/favx.v1).

Base Next.js App Router, React, TypeScript, Tailwind e Supabase: seis idiomas, login por código de e-mail, sessão e criação/edição de perfil Creator. Inclui o incremento do workspace, editor com imagens/assistência editorial OpenAI e coleções Creator. Consulte [entrega e configurações](docs/workspace-delivery.md) e o [registro dos 142 contratos](docs/screen-delivery.json). Ainda não é a implementação completa do PRD.

## Comece aqui

- [Documentos originais](docs/README.md): PRD, TRD, fluxos, Design System e tokens.
- [Setup e Vercel](docs/setup.md): variáveis e ordem de configuração.
- [Decisões e pendências](docs/decisions/README.md): divergências e pré-requisitos de homologação.
- [Verificação](docs/validation.md): resultados e limites dos checks.
- [AGENTS.md](AGENTS.md) e [skills](.agents/skills/README.md): instruções para desenvolvimento.

## Estrutura

```text
AGENTS.md                Instruções gerais
.agents/skills/           Quatro procedimentos do projeto
docs/requirements/       PRD, TRD e DOC03
docs/design/             DOC04, Word e tokens
docs/decisions/          Decisões e pendências
docs/source/             Proveniência dos anexos
src/                     Aplicação Next.js
supabase/migrations/     Histórico versionado; aplicações em docs/validation.md
tests/                   Testes do pacote
.env.example             Variáveis sem credenciais
```

## Desenvolvimento e revisão

Node.js 24 e npm, com versões de dependências fixadas e lockfile. Checks: `npm ci`, `npm test`, `npm run typecheck`, `npm run build`.

O produto será revisado por URLs Vercel. Após vincular o repositório, branches/PRs geram Previews e `main` alimenta Production. A importação do código não cria automaticamente projeto Vercel ou banco.

## Biblioteca pessoal

[Salvos e coleções User](docs/user-library.md) adicionam biblioteca privada, organização e compartilhamento revogável. O cadastro e as coleções Creator permanecem na mesma conta.

## Escopo atual

Rotas principais: site em seis idiomas e login, `/app/me`, `/app/salvos`, `/app/colecoes`, `/app/settings`, `/app/creator` e suas áreas de perfil/posts/coleções. Perfis e posts públicos em `/:username`; coleções pessoais compartilhadas em `/collections/shared/:token`.
`src/app/site/[locale]` é segmento interno reescrito pelo middleware.

Perfil público, posts, busca contextual lexical, biblioteca pessoal e gestão de conteúdo têm incrementos funcionais. Integrações de mídia e assistência editorial dependem das configurações descritas nos guias; Stripe/assinaturas ainda estão pendentes. Veja a auditoria de cobertura para o estado de cada contrato. Events, Proof, busca global e FAVX for Brands ficam fora do MVP definido.

Segredos e `.env` não são versionados. Documentos mantêm seus status originais; importação não aprova pendências. O [README recebido](docs/source/README-upload.md) foi preservado para rastreabilidade.

[Gestão de posts, histórico, lixeira e biblioteca de mídias](docs/content-management.md).

[Pedidos da comunidade e caixa de sugestões privadas](docs/community.md).
