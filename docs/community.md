# Pedidos e sugestões da comunidade — 22/11/2026

Continuação autorizada nas páginas pendentes. Contratos PUB-007/008, CRE-019/020/021/022 e requisitos FAVX-COM-001/002/003/004. Aplica a direção visual aprovada e preserva os documentos originais.

## Fluxos implementados

- `/app/creator/comunidade/pedidos`: lista paginada, filtros por estado e contagem privada de recebimentos. Sem formulário genérico permanente no perfil público.
- `/app/creator/comunidade/pedidos/novo` e `/:id`: pergunta, descrição, categoria, orientações, vencimento opcional em UTC; rascunho/aberto/pausado/encerrado. A abertura exige confirmação, perfil público e data futura. Pausar/encerrar preserva as respostas anteriores. A atualização usa versão esperada para evitar sobrescrita entre janelas.
- `/:username/requests/:id`: link público dedicado, estável por UUID, ativo somente enquanto elegível. Inclui pergunta, instruções, data, compartilhar e CTA de envio. Não inclui respostas, contagens privadas, IDs de contas ou contatos do remetente. Pedido privado, pausado, encerrado, vencido ou de conta/perfil indisponível retorna 404 sem conteúdo anterior. Página dinâmica e não indexável.
- `/:username/requests/:id/enviar`: texto e link HTTPS opcional, confirmação de autorização para revisão privada, prévia e recibo somente após gravação. Visitar é livre; este incremento exige conta para enviar. Login retorna ao pedido por `/app/comunidade/enviar?request=...`, mantendo a validação existente de destinos internos.
- `/app/creator/comunidade/recebidas`: caixa privada paginada, filtros por pedido/estado e acesso ao detalhe. O remetente não recebe acesso à fila nem às outras sugestões.
- `/app/creator/comunidade/recebidas/:id`: conteúdo original, indicação de origem comunitária e autorização recebida. Estados nova/em revisão/selecionada/rejeitada/arquivada com confirmação e concorrência. Selecionar não cria post e não fabrica avaliação pessoal ou Context do Creator.

Seis idiomas, Manrope, sidebar e menu mobile com rolagem, superfícies claras arredondadas, labels, mensagens de erro/sucesso e dialogs nativos. Textos longos são verificados em 320 px. Formulários avisam ao descarregar a página com conteúdo não salvo; cancelar a edição do pedido também exige confirmação quando houver mudanças.

## Decisões e limites

- Conta autenticada e limite técnico de cinco sugestões por hora por conta, global entre pedidos. Não é um limite comercial aprovado. Envio anônimo, CAPTCHA e controles adicionais contra múltiplas contas continuam pendentes.
- Autorização `private-review-v1` cobre apenas envio do texto para revisão privada. Não constitui licença pública de mídia. Publicação a partir de uma sugestão, sua atribuição pública, anexos e licenciamento adicional permanecem pendentes; não há botão que simule essa transição.
- Não inclui notificação por e-mail/push, pedidos de esclarecimento, denúncias/moderação de plataforma, localização estruturada ou taxonomia canônica. O painel permite revisar e rejeitar. Não envia e-mails nos testes.
- Formulário usa UTC explícito para vencimento; não há seletor de fuso próprio. Conteúdo não é salvo automaticamente nem persiste após fechar a aba. Recuperação de formulário após sessão expirada requer continuação futura.
- Encerramento não apaga sugestões. Nenhum prazo de retenção ou expurgo foi inventado.

## Dados e verificação

Migration `20261122174911_community_requests` aplicada no Supabase FAVX `krnznqyxsuktohilmluf`. Tabelas `community_requests` e `community_submissions` com RLS e grants de colunas. Creator ativo consulta e revisa apenas pedidos/respostas próprios. Dados de remetente não entram na projeção da caixa; nem há grant de SELECT para `sender_id` ao cliente autenticado.

Escrita de pedidos e revisão são invoker/RLS. O recebimento é uma função estreita no schema privado, com Auth como única origem da identidade, validação de conta/pedido/consentimento e limite serializado por conta na mesma transação. Ela evita conceder INSERT direto ou leitura de respostas/dados de frequência a remetentes. Confirmação usa UUID do envio; repetir o mesmo envio não cria outro registro nem consome outra posição do limite. Alterar o conteúdo sob o mesmo UUID gera conflito. Consulta pública tem projeção explícita e verifica elegibilidade em cada requisição.

A CLI continua indisponível porque tenta escrever em `/home/agent/.supabase`, somente leitura. A proposta SQL foi verificada em PGlite antes de aplicar via MCP, e versionada com o timestamp efetivamente gerado pelo Supabase.

42 testes automatizados, typecheck e build aprovados. `supabase/tests/community_access.sql` passou no banco real com rollback integral das identidades/registros temporários; advisor sem novos avisos. O teste cobre privacidade, idempotência, limite, titularidade, conflito de revisão e encerramento. Testes locais também cobrem datas vencidas, URLs e consentimento.

`npm run verify:community` verifica UI compilada, server actions e migrations reais em PGlite: rascunho privado, abertura, retorno de login simulado, consentimento/prévia/recibo, caixa privada, conflito entre janelas, isolamento, encerramento preservando respostas, ausência de criação automática de post e larguras 320/390/768/1440. Auth/REST são fixtures locais; não é teste de OTP real. Requer Chromium (`CHROMIUM_PATH`, padrão `/usr/bin/chromium`) e portas 3188/55432 livres. Artefatos em diretório temporário ou `FAVX_TEST_OUTPUT`; build de fixture não deve ser enviado à produção.

O inventário passa a 60 contratos parciais e 82 sem implementação. Nenhuma tela declarada integralmente homologada.
