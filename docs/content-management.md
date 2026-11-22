# Gestão de conteúdo Creator — incremento de 21/11/2026

Continuação autorizada nas telas pendentes. Contratos CRE-008, CRE-015, CRE-016, CRE-026, MED-007, MED-008 e SHR-005; requisitos FAVX-POST-009/011/012, FAVX-LIFE-002/005/006/007/008 e FAVX-MED-004/005/006. Direção visual aprovada: Manrope, sidebar, superfícies claras arredondadas e fotografia preservada.

## Entrega

- `/app/creator/posts/:id`: gestão privada com conteúdo, mídias, Context, coleções vinculadas (até 50), datas UTC explícitas, versão, editar e abrir público somente quando elegível. Ações confirmadas: ocultar, arquivar, mover para a lixeira, restaurar como rascunho e duplicar como novo rascunho. Duplicação reutiliza os arquivos próprios, sem copiar bytes nem alterar a origem.
- `/app/creator/posts/encerrados`: ocultos e arquivados, busca por título, filtros e paginação. A lista principal deixa arquivos/lixeira nas áreas dedicadas.
- `/app/creator/lixeira`: posts removidos logicamente; restauração preserva ID, referência pública e arquivos, retorna a rascunho. Nunca republica automaticamente. Prazo de 30 dias não aprovado: não há cron de expurgo nem promessa de retenção definitiva.
- `/app/creator/posts/:id/historico`: versões paginadas, snapshots privados e diferenças em relação à versão anterior. Histórico é somente leitura; restauração de versões não oferecida sem regra aprovada.
- `/app/creator/midias` e `/:id`: inventário próprio de imagens, busca por nome, filtro disponível/envio incompleto, detalhes, publicações vinculadas paginadas, download do original e da imagem WebP otimizada. Erro de imagem e falha de download têm feedback e nova tentativa. Arquivos vinculados a posts arquivados continuam acessíveis ao titular.
- Navegação desktop/mobile, seis idiomas, confirmação via dialog nativo, cancelamento, bloqueio de envio repetido e conflito de versão sem sobrescrever outra janela.

## Banco e proteção

Migration `20261122024539_creator_content_management` aplicada no Supabase FAVX `krnznqyxsuktohilmluf`. Amplia os estados com `archived`/`trashed`, sem alterar dados editoriais existentes nem remover conteúdo. Transições usam RPC invoker, RLS de propriedade/conta ativa, versão esperada e trigger que bloqueia retorno direto de arquivo/lixeira a publicado. A coluna de data de mudança de estado fica nula para registros anteriores, sem inventar datas históricas.

Consulta de histórico usa SELECT com RLS na tabela privada de revisões e RPC invoker com campos explícitos. Não concede INSERT, UPDATE ou DELETE do histórico. A leitura é limitada ao titular ativo. Inventário de mídia também é invoker, paginado, sem chave de storage nem ID de proprietário no resultado. Downloads revalidam sessão, conta/Creator ativos, titularidade e estado disponível. Imagens públicas continuam verificando elegibilidade em cada requisição sem cache público.

A CLI instalada falha antes de executar `migration new --help` porque tenta escrever em `/home/agent/.supabase` (somente leitura). A proposta foi validada em PGlite, aplicada via MCP e versionada usando o timestamp efetivamente gerado pelo Supabase. Não foi inventada uma entrada de histórico de migration.

## Verificação

`npm ci`, 40 testes, typecheck e build aprovados. Teste PostgreSQL/PGlite cobre transições, conflito, bloqueio de publicação direta após arquivar, preservação de referência, histórico imutável, acesso cruzado/anônimo/suspenso e revogação de conteúdo/mídia públicos. `supabase/tests/content_management_access.sql` passou no banco real com rollback integral dos registros temporários. Advisor sem novos avisos de segurança; permanecem apenas avisos preexistentes.

`npm run verify:content` executa a aplicação compilada com Chromium, server actions e consultas reais às migrations em PGlite. Auth/REST e transporte Bunny são fixtures locais: nenhum OTP é enviado. Cobre histórico, arquivo, lixeira, restauração, duplicação, conflito entre janelas, downloads, isolamento entre contas e larguras 320/390/768/1440. Requer Chromium (`CHROMIUM_PATH`, padrão `/usr/bin/chromium`), portas 3188/55432 livres e build separado de produção. Artefatos em diretório temporário ou `FAVX_TEST_OUTPUT`.

## Limites de aceite

Não implementa agenda/expiração, analytics, vídeos/áudio, exclusão definitiva, expurgo, lixeira de banners/coleções, remoção independente de assets ou retomada de uploads após fechar a sessão. Upload incompleto é identificável, mas a retomada ainda depende da sessão original do editor. Não restaura snapshots históricos. Ações de conta e outros domínios ainda precisam de confirmação própria. Downloads reais dependem da zona privada Bunny configurada; o teste do transporte foi controlado, não uma comprovação do serviço real.

54 contratos parciais e 88 sem implementação; nenhuma tela declarada integralmente homologada. Os documentos originais permanecem preservados.
