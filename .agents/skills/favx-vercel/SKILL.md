---
name: favx-vercel
description: Use ao vincular FAVX à Vercel, configurar variáveis, preparar deploy ou investigar falhas de build e runtime.
---

# Deploy FAVX

1. Ler `docs/setup.md`, `package.json`, `vercel.json` e `.env.example`.
2. Identificar equipe/projeto existentes antes de criar recursos. Repositório `favxapp/favx.v1`, app na raiz, framework Next.js.
3. Verificar as duas variáveis Supabase consumidas. Preview usa recursos de teste; não copiar segredos de produção.
4. Rodar instalação reproduzível, testes, tipos e build. Diferenciar falha de compilação de configuração ausente no runtime.
5. Publicar dentro da autorização da tarefa; preferir Preview para revisão. Não alterar proteção/acesso como efeito colateral.
6. Verificar URL, idiomas, rotas protegidas e logs. OTP e persistência exigem banco/e-mail e contas de teste apropriados.
7. Mudança de variável exige novo deploy. Tokens de Vercel/GitHub não pertencem ao código da aplicação.

Validação: informar URL e commit, resultado do build e fluxos verificados. Plugin conectado não prova configuração de projeto, banco ou deploy.
