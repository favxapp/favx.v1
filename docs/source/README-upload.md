# FAVX — incremento 1

Fundação (Next.js App Router, TypeScript, Tailwind, tokens do DOC04, i18n estrutural em 6 idiomas), login por **e-mail OTP**,
sessão e **criação/edição do perfil Creator** com persistência no Supabase.

## Fora do escopo deste incremento (não implementar antes da aprovação)
Página pública `/:username`, recomendações, busca, mídia, agendamento, pagamentos, IA e compartilhamento por token (bloqueado pela POC-T01).

## Rotas
`/` → idioma negociado · `/{pt-br|pt-pt|en|es|it|fr}` · `/{locale}/login` · `/app/me` · `/app/creator/activate` · `/app/creator/profile` · `POST /auth/signout`.
O diretório `src/app/site/[locale]` é um segmento interno (rewrite do middleware); `site` é slug reservado.

## Variáveis de ambiente
Ver `.env.example`. Apenas URL e chave **publicável** (públicas por desenho). Nenhum `service_role` neste app.

## Banco
`supabase/migrations/*.sql`: schema `public` com RLS e privilégios por coluna. Desvio registrado: o DOC05 prevê schema privado `app` acessado só pelo servidor com
`service_role`; neste incremento usamos `public` + RLS porque o conector disponível não fornece `service_role` e para não expor chave secreta.

## Login OTP — configuração obrigatória no Supabase (Dashboard > Authentication > Email Templates)
Os modelos **Magic Link** e **Confirm signup** precisam conter `{{ .Token }}` para o código de 6 dígitos chegar no e-mail, por exemplo:
`<p>Seu código FAVX: <strong>{{ .Token }}</strong></p>`.
O SMTP padrão do Supabase tem limite baixo e só envia para membros da equipe; para uso real configure um SMTP próprio.

## Testes
`npm test` (runner nativo do Node; a Vercel executa `npm test && npm run build`).
