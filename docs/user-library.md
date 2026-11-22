# Biblioteca e coleções pessoais — incremento de 21/11/2026

Contratos USR-001 a USR-007 e PUB-006, requisitos FAVX-ID-003 e FAVX-COL-002/003/004/005. Continuação autorizada pela Product Owner após a entrega do workspace Creator. Aplica a direção visual aprovada e mantém o papel User na mesma conta do Creator.

## Comportamento implementado

- `/app/me` e entrada `/app`: biblioteca privada, salvos recentes e coleções; acesso ao Estúdio/ativação permanece disponível.
- `/app/salvos`: busca lexical dentro dos próprios salvos, filtros por categoria/Creator/data inicial, ordenação recente/antiga e paginação de 24 itens. A data inicial representa meia-noite UTC da data escolhida.
- `/app/salvos/:id`: publicação de origem, data de salvamento, coleções relacionadas, organizar/remover. Se o post ficar indisponível, somente referência mínima e data permanecem; título, corpo, Context e mídia não são copiados para o salvo.
- Salvar no detalhe público: operação idempotente. Sem sessão, um POST explícito grava intenção HttpOnly por 15 minutos e encaminha ao login. O retorno mantém a query do destino. A tela autenticada consome a intenção por server action; GET/prefetch não fazem gravações. A pessoa também pode confirmar manualmente. Não modifica o fluxo de envio/verificação de OTP.
- `/app/colecoes`, `/nova`, `/:id`, `/:id/editar`: criar, buscar, editar nome/descrição, selecionar salvos de vários Creators, reordenar e escolher capa entre imagens elegíveis dos selecionados. Exclusão de coleção exige confirmação e preserva salvos/posts. Remoção de salvo atualiza suas associações na mesma transação.
- Compartilhar exige ação explícita. Cada ativação após revogar gera novo token; links antigos permanecem inválidos. `/collections/shared/:token` só projeta a seleção autorizada e posts ainda públicos. Não divulga identidade do User, UUIDs de salvos, totais internos ou outras coleções. Página dinâmica, não indexável.
- Seis idiomas e navegação desktop/mobile; estados vazios, indisponibilidade, erro e conflito de edição.

## Dados e decisões

Tabelas `user_saves` e `user_collections` com RLS, acesso próprio e conta ativa. Sem service role. Escrever pelo PostgREST direto não contorna propriedade/estado/itens selecionados. Limite de 200 itens é uma proteção técnica desta implementação, não um limite comercial aprovado. Coleções privadas por padrão; token só é criado pelo trigger na habilitação explícita. Versões evitam sobrescrita de edição concorrente.

As projeções públicas privilegiadas ficam em `favx_private`, com `search_path` vazio e grants delimitados; bases privadas não têm SELECT anônimo. O lookup de post é deliberadamente público somente para posts elegíveis. Nenhuma contagem de saves ou audiência foi acrescentada ao perfil público.

A CLI Supabase instalada não inicia porque tenta criar `/home/agent/.supabase` em diretório somente leitura. SQL foi preparado como proposta e validado em PGlite antes de aplicar; a migration `20261121165355_user_library` foi aplicada no projeto FAVX `krnznqyxsuktohilmluf`, usando a versão gerada pelo servidor.

## Limites e pendências de aceite

Não inclui histórico de navegação/telemetria (dependentes de consentimento), busca semântica/voz, funcionamento offline, seguidores/seguindo, notificações, exportação ou encerramento de conta. Coleção não oferece duplicação, arquivamento/restauração ou upload independente de capa; usa imagem já publicada de um item. A lista de coleções usa capa neutra, enquanto a capa escolhida aparece no detalhe e na seleção compartilhada. Alterações no formulário são salvas por ação explícita, com aviso ao sair; não há autosave nesse formulário.

Prévia privada mostra somente itens elegíveis da página atual; a página compartilhada possui sua própria paginação de itens elegíveis. Ativação de Creator continua independente e não altera a biblioteca. Os contratos continuam marcados como parciais até validação integral das telas/estados e aceite visual; o registro não deve ser usado para alegar conclusão das 142 telas.

## Verificação

39 testes automatizados aprovados, typecheck e build. Chromium com aplicação compilada, server actions reais e Postgres PGlite sob RLS percorreu intenção de salvar/retorno simulado de sessão, idempotência, busca sem Context, capa/ordem/refresh, conflito entre janelas, compartilhar/revogar/rotacionar, placeholder de indisponível, remoção com limpeza de associações e exclusão de coleção preservando salvos. Layout em 320/390/768 px e desktop. Auth e transporte REST foram controlados no teste; não houve envio de OTP.

No Supabase FAVX real, `supabase/tests/user_library_access.sql` passou com rollback integral das identidades e dados de teste. Advisor sem novos avisos de segurança; permanece o aviso anterior sobre proteção de senha e os INFO de tabelas intencionalmente sem políticas de acesso direto.

### Reproduzir a verificação de navegador

Em um checkout de teste, com Node 24 e Chromium instalado: `npm ci` e `CHROMIUM_PATH=/usr/bin/chromium npm run verify:library`. O comando compila com configuração de fixtures e usa portas locais 3188/55432. Não é o build a enviar à produção. Playwright Core está fixado no lockfile; não instala navegador automaticamente. Capturas/logs vão a diretório temporário ou `FAVX_TEST_OUTPUT`. Os fixtures de Auth/REST/Bunny são locais, e as consultas passam pelas migrations reais em PGlite; nenhum e-mail é enviado.
