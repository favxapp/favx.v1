# Editor de recomendações — incremento editorial

## Atualização de 21/11/2026

Este documento preserva o escopo inicial do editor. O [incremento do workspace](workspace-delivery.md) acrescenta imagens em partes, originais privados, assistência OpenAI sob revisão, categorias manuais e Context privado. Consulte esse registro para a configuração e as lacunas atuais; áudio/vídeo e taxonomia canônica continuam pendentes.

## Escopo inicial

Implementa a parte editorial das telas CRE-006, CRE-007, CRE-009 e CRE-011 do DOC03: lista paginada, criar/editar, rascunho privado com autosave e recuperação após refresh, prévia mobile/ampla, revisão com confirmação explícita, publicação e ocultação. Rotas `/app/creator/posts`, `/app/creator/posts/novo`, `/app/creator/posts/:id/editar` e `/:username/p/:slug-:publicId`.

Conteúdo: título, texto até 10.000 pontos de código Unicode, tipo, tags manuais, avaliação pessoal 0–10 em passos de 0,5, múltiplos links HTTPS, código de cupom simples e declaração de patrocínio. Título/texto são obrigatórios na publicação; rascunhos podem estar incompletos. Cupom é um código informado pelo Creator, sem alegação de vigência/preço validado. Edições de um post já público só chegam ao público após nova confirmação; autosave fica restrito aos estados draft/hidden. A publicação exige perfil público e conta/Creator ativos.

Não encerra a CRE-007 completa nem as fases F02/F03: mídia de posts (foto original até 20MB, áudio/vídeo e uploads retomáveis), taxonomia/categorias/IA, contexto privado, agendamento/expiração, cupons estruturados com prazo/condições, duplicação e exclusão continuam pendentes. Não há botão que simule essas operações. O upload de avatar é um derivado público separado e não deve receber originais de posts. A POC-M01 exige armazenamento privado de originais e não pode usar a Pull Zone pública de derivados como substituto.

## Dados e decisões técnicas

- Mudança aditiva na base existente `public`: tabela `creator_posts`, RPC `save_creator_post`, projeção `get_public_posts` e histórico em `favx_private.post_revisions`. Não aplicar o baseline DOC05 inteiro em paralelo com a fundação atual.
- RLS de leitura própria; escrita exige propriedade e conta/Creator ativos. Sem grant de escrita em proprietário, ID público, versão ou timestamps. Sem service role na aplicação.
- RPC invoker com versão esperada evita sobrescrita concorrente; repetição do primeiro salvamento idêntico retorna o mesmo post. Triggers privados limitados atualizam versão/data e guardam revisão na mesma transação.
- Público só recebe campos editoriais permitidos, com filtro de estado publicado, perfil público e conta/Creator ativos. Não recebe UUID interno, owner ID ou histórico. Páginas dinâmicas verificam visibilidade em cada acesso.
- ID público separado do UUID interno: UUID aleatório sem hífens (32 caracteres hexadecimais). A proposta de 12 caracteres da F00 não foi tratada como aprovação. Slug decorativo derivado do título; mudança redireciona canonicamente com 308 (permanente nativo do Next), preservando ID público.
- Limites técnicos revisáveis deste formulário: título 160 caracteres, 20 tags de 30 caracteres, até 20 links com rótulo 80/URL 2048/cupom 80 e declaração 300. Não representam cota comercial de posts.
- Publicação/ocultação são ações explícitas. Rascunhos não se tornam públicos automaticamente. Autosave não repete indefinidamente em falha; preserva conteúdo no formulário e avisa antes de sair.

## Verificação

Testes PGlite aplicam a fundação e a proposta real: usuário A/B/anônimo, publicação sem perfil público, rascunho não público, conteúdo obrigatório, patrocínio, URLs, nota, retry idempotente, conflito, histórico transacional, suspensão e ocultação. Testes do parser cobrem Unicode e entradas inseguras.

Navegador com serviços isolados atravessa a UI e as server actions: campos obrigatórios, autosave, refresh, URL estável, edição concorrente, prévia, confirmação, público/404, ocultação e lista. Layout em 320, 390 e 768px e desktop. Isso não comprova Bunny nem sessão real em produção.

Migration `20261115221433_creator_posts.sql` aplicada no Supabase FAVX em 15/11/2026 (19:14 BRT), a partir do SQL revisado no PR #4. O CLI disponível falhou ao iniciar por tentar gravar em `/home/agent/.supabase` (somente leitura); o arquivo usa o identificador real retornado por `list_migrations`, com conteúdo idêntico ao aplicado via MCP. Não foi inventado timestamp.

A verificação transacional `supabase/tests/creator_posts_access.sql` passou no banco real: privacidade, titularidade, publicação, retry, concorrência, histórico, suspensão e ocultação. Após rollback: zero posts/revisões de teste e apenas o perfil real preexistente. Advisors: nenhuma nova advertência de segurança; info de RLS sem policy em `post_revisions` é intencional (sem grants ao cliente, escrita apenas por trigger privada). Aviso preexistente de proteção de senhas não corresponde ao login OTP atual.

A versão compilada foi testada no navegador com serviços isolados. O avatar passou também com falha simulada de `URL.createObjectURL`, sem `AbortSignal.timeout`, e com rejeição visível de arquivo acima de 2MB. A confirmação do envio real ao Bunny continua pendente na sessão da Product Owner.
