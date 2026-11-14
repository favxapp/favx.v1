---
name: favx-supabase
description: Use ao alterar autenticação, cliente SSR, schemas, queries, RLS, funções ou migrations Supabase da FAVX.
---

# Dados e identidade FAVX

1. Ler `docs/setup.md` e `docs/decisions/README.md`. Confirmar projeto e ambiente antes de escrita externa.
2. Consultar documentação atual. Uma migration anexada não autoriza sua execução.
3. Base usa URL e publishable key; manter cookies coerentes entre middleware e servidor e validar identidade no servidor.
4. Revisar grants e RLS separadamente. Cobrir titularidade e estados de conta/Creator. Não confiar em `user_metadata` para privilégios.
5. Não usar chave administrativa ou `security definer` apenas para contornar políticas; revisar escopo, schema e grants de execução.
6. Criar novas migrations com ferramenta apropriada, preservar as aplicadas e registrar/verificar o ambiente que recebeu cada alteração.
7. Testar usuário A contra dados de B, anônimo, suspensão e falhas intermediárias em múltiplas gravações.

Validação: checks de código mais consultas e testes RLS no ambiente autorizado. Build Next.js não valida SQL; registrar limites se banco não estiver disponível.
