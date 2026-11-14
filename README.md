# FAVX

Fundação importada do pacote fornecido pela Product Owner em 14/11/2026.
Repositório oficial: [favxapp/favx.v1](https://github.com/favxapp/favx.v1).

Base Next.js App Router, React, TypeScript, Tailwind e Supabase: seis idiomas, login por código de e-mail, sessão e criação/edição de perfil Creator. É uma fundação em validação, não a implementação completa do PRD.

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
src/                     Aplicação fornecida
supabase/migrations/     Migration fornecida, não aplicada nesta importação
tests/                   Testes do pacote
.env.example             Variáveis sem credenciais
```

## Desenvolvimento e revisão

Node.js 24 e npm, com versões de dependências fixadas e lockfile. Checks: `npm ci`, `npm test`, `npm run typecheck`, `npm run build`.

O produto será revisado por URLs Vercel. Após vincular o repositório, branches/PRs geram Previews e `main` alimenta Production. A importação do código não cria automaticamente projeto Vercel ou banco.

## Escopo atual

Rotas: `/`, `/{pt-br|pt-pt|en|es|it|fr}`, `/{locale}/login`, `/app/me`, `/app/creator/activate`, `/app/creator/profile` e `POST /auth/signout`.
`src/app/site/[locale]` é segmento interno reescrito pelo middleware.

Stripe e Bunny fazem parte da stack, mas não estão integrados. Página pública de Creator, posts, busca, mídia, assinatura e IA ainda não estão implementados. Events, Proof, busca global e FAVX for Brands ficam fora do MVP definido.

Segredos e `.env` não são versionados. Documentos mantêm seus status originais; importação não aprova pendências. O [README recebido](docs/source/README-upload.md) foi preservado para rastreabilidade.
