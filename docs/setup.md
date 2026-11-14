# Configuração e primeiro deploy

## Base atual

Next.js com Supabase Auth por e-mail OTP. Stripe e Bunny ainda não são usados pelo código. Nenhum projeto Supabase ou Vercel foi selecionado nesta importação.

## Variáveis necessárias agora

Em Vercel → Project → Settings → Environment Variables:

| Nome | Origem | Uso |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | URL do projeto Supabase escolhido | Middleware e cliente SSR |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | API Keys → publishable key do mesmo projeto | Auth e consultas sujeitas a RLS |

Ambas são públicas por desenho. O código atual não exige `APP_URL`, chave administrativa Supabase, token GitHub ou token Vercel.
Sem essas variáveis, o middleware das páginas localizadas falha; passar no build não comprova configuração de runtime.

Preview usa recursos de teste; Production usa recursos destinados à produção. Development serve à execução local, não aos previews online.
Depois de mudar variáveis, fazer novo deploy. `.env.example` é versionado sem valores; `.env` e variantes locais são ignorados.

## Ordem de integração

1. Escolher o projeto Supabase de teste e verificar seu estado atual.
2. Revisar a migration e resolver as pendências de `docs/decisions/README.md` antes de aplicá-la.
3. Importar `favxapp/favx.v1` na equipe Vercel apropriada: framework Next.js, Root Directory na raiz, branch de produção `main`.
4. Configurar as duas variáveis nos ambientes correspondentes. O build está em `vercel.json`.
5. Fazer deploy e verificar home, idiomas e redirecionamento de rotas protegidas pela URL gerada.
6. Com banco e e-mail configurados, testar OTP, sessão, perfil Creator e isolamento entre usuários.

A importação do código não executa operações nesses serviços. Primeiro deploy não equivale a lançamento homologado.

## Pré-requisitos do login

- Tabelas e políticas da migration precisam existir no projeto correto para perfil Creator funcionar.
- Templates de Magic Link e confirmação de cadastro devem incluir `{{ .Token }}` para entregar o código digitado na interface.
- Confirmar tamanho e validade do OTP; o parser fornecido aceita de 6 a 10 dígitos.
- O envio padrão do Supabase tem limites e restrições de destinatários. Configurar SMTP antes de atender usuários reais.
- Configurar Site URL e redirects autorizados com as URLs reais e restritas da aplicação, conforme os fluxos adotados.

## Integrações posteriores

Stripe: chave secreta e segredo do endpoint de webhook; chave publicável somente se houver Stripe.js. Começar em modo de teste.
Bunny: Storage Zone, host regional e chave específica da zona no servidor; URL CDN se adotada. Fechar os nomes das variáveis com a implementação.

## Checks de engenharia

```sh
npm ci
npm test
npm run typecheck
npm run build
```

Testes unitários não acessam serviços. `next/font/google` baixa Manrope e Instrument Serif no build e precisa de rede.
A revisão do produto usa URLs Vercel; uma cópia local pode ser usada para checks de engenharia.

## Conectores e skills

Plugins/MCPs autenticam o assistente; variáveis autenticam a aplicação. Uma conexão de plugin não seleciona banco nem vincula automaticamente Vercel ao repositório.
As skills em `.agents/skills/` são procedimentos, não servidores MCP, e não contêm credenciais.
