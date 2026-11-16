# Perfil Creator — incremento de 15/11/2026

## Pedido e entrega

Pedido explícito: foto, redes com logos e opção de adicionar, visualizar perfil público, compartilhar/copiar link, check/X no username e validação de obrigatórios. Referências: PRD FAVX-ID-001/002/004/008 e FAVX-PRO-001/002/003/005; DOC03 CRE-001/002/003/005/027 e PUB-001; DOC06 F03, EX-03-04 e marco M1.

Fluxo: identidade (nome + username obrigatórios) → personalização (foto, bio, redes, idioma/fuso) → prévia → opção explícita de publicar → salvar → abrir/compartilhar. Foto, bio e redes são opcionais conforme PRD; ao adicionar uma rede, seu link completo passa a ser obrigatório. A confirmação de disponibilidade é informativa: índice único no banco decide a criação em caso de concorrência. Username existente continua imutável, preservando a pendência de política de renomeação/redirecionamento.

Há 15 redes no catálogo inicial: Instagram, TikTok, YouTube, Facebook, Threads, X, Bluesky, LinkedIn, Pinterest, Twitch, Discord, Telegram, WhatsApp, Snapchat e Spotify. URLs são HTTPS e precisam pertencer à rede escolhida. Não há conexão OAuth nem importação de dados sociais neste incremento.

## Configuração Bunny

| Variável (server-only) | Origem |
|---|---|
| BUNNY_STORAGE_ACCESS_KEY | Password/AccessKey específica da Storage Zone, não a chave da conta ou de Stream |
| BUNNY_STORAGE_ZONE | Nome exato da Storage Zone ligada à Pull Zone |
| BUNNY_STORAGE_HOST | Host regional exibido no painel, sem esquema/caminho; exemplo storage.bunnycdn.com ou ny.storage.bunnycdn.com |
| BUNNY_CDN_URL | URL HTTPS da Pull Zone; informada pela Product Owner: https://favxdevderivados.b-cdn.net/ |

As chaves Stream cadastradas são para vídeo e não são usadas por fotos. Cadastrar essas variáveis no ambiente Vercel correspondente e redeployar. Preview deve ter recursos/credenciais de teste. Não copiar segredos Production para Preview automaticamente.

O `.env` local existente está ignorado pelo Git. `.env.local` também é ignorado. Não é preciso duplicar as chaves para executar na Vercel; arquivos locais servem apenas à execução no computador. Somente `.env.example`, vazio, deve ser versionado.

JPG/PNG/WebP até 2 MiB e 16 megapixels; o servidor verifica bytes, recorta ao centro, normaliza orientação e produz WebP 512×512 sem EXIF. AccessKey nunca é enviada ao navegador. O upload exige sessão, mesma origem e conta/Creator ativos. A chave do objeto contém namespace aleatório, não user_id. Esta é uma foto pública de apresentação; não é o pipeline de originais de posts descrito no DOC05. O original não é armazenado. Objetos antigos precisam de política de retenção/limpeza antes de escala; uma falha de persistência tenta remover o novo objeto.

## Banco e conciliação documental

O projeto existente usa `public.profiles` e `public.creator_profiles` com RLS. DOC05 propõe schema privado `app` e um baseline maior. Substituir a base ativa não está no escopo desta entrega. Os SQLs recebidos foram preservados em `docs/source/DOC05_reference`, sem execução. O workspace 1.3.2 é a versão mais recente enviada; seus prompts F00 não são executados automaticamente, e propostas continuam propostas.

`supabase/migrations/20261115155702_creator_public_profile.sql` é a mudança aditiva aplicada no projeto FAVX (`krnznqyxsuktohilmluf`) após autorização explícita da Product Owner em 15/11/2026 e testes em PostgreSQL embarcado (PGlite): namespace/foto, links sociais, política de conta ativa, salvamento transacional, projeção pública explícita e validação de username com autenticação. Não publica perfis existentes automaticamente. A projeção pública não retorna user_id, estado interno, preferências, e-mail ou métricas. Perfis privados/suspensos retornam vazio. Funções que leem além de RLS ficam no schema não exposto `favx_private`, com search_path vazio, grants específicos e wrappers invoker; não expor esse schema na Data API.

A migration foi aplicada via MCP Supabase com sucesso; a versão `20261115155702` foi retornada pelo histórico real de migrations e registrada no Git com o mesmo SQL aprovado. A proposta original permanece em `supabase/proposals/` como registro. O CLI não inicializou neste ambiente, então o identificador foi obtido do provedor, sem inventar timestamp.

O teste transacional `supabase/tests/creator_profile_access.sql` passou no Supabase: duas contas temporárias, isolamento entre titulares, visitante, público/privado, conta e Creator suspensos, username e rollback de salvamento parcial. Toda a transação foi revertida, incluindo as identidades de teste. A consulta de catálogo confirmou que as três RPCs públicas usam security invoker.

## Verificação

`npm test` inclui isolamento entre duas identidades, ausência de dados privados na projeção, recusa de anônimo, suspensão, rollback de salvamento parcial, colisão de username, validação de links e processamento de foto. São testes em banco embarcado e transportes simulados; não comprovam entrega real no Bunny. O teste transacional adicional foi executado no Supabase de produção, com rollback de todos os dados de teste. A confirmação final de foto e CDN depende de upload pela aplicação.

## Origem dos ícones

SVGs de redes selecionados de Simple Icons 16.37.0 (CC0), vendorizados para carregar apenas os ícones necessários. LinkedIn usa o desenho de marca da distribuição histórica Simple Icons. Nomes e marcas pertencem aos respectivos titulares. Fonte: https://github.com/simple-icons/simple-icons.

### Evidências desta entrega

- 29 testes aprovados; TypeScript e build aprovados; auditoria npm sem vulnerabilidades.
- Navegador com backend simulado: seleção de rede, edição refletida na prévia, salvar, público anônimo sem ID/e-mail privado, 404, username ocupado/disponível e nome obrigatório.
- Desktop 1280 px e celular 390 px; sem overflow horizontal. As quatro variáveis Bunny estão cadastradas em Production. O upload e a entrega reais ainda precisam ser confirmados em uma sessão autenticada.
- `BUNNY_CDN_URL` cadastrado em Production com a origem pública informada. As chaves existentes não foram lidas nem copiadas para o Git.

As imagens abaixo usam dados fictícios e não são uma conta real.

![Edição e prévia em desktop](previews/creator/desktop.png)

[Prévia no celular](previews/creator/mobile.png) · [Username disponível e campo obrigatório](previews/creator/username.png)


### Revisão de segurança do banco

O advisory de RPC pública com SECURITY DEFINER deixou de aparecer após a mudança. Permanecem os avisos anteriores: [RLS sem policy em reserved_slugs](https://supabase.com/docs/guides/database/database-linter?lint=0008_rls_enabled_no_policy), deliberadamente sem leitura direta pelo cliente, e [proteção de senhas vazadas](https://supabase.com/docs/guides/auth/password-security#password-strength-and-leaked-password-protection), relacionada ao uso de senhas; o fluxo atual é OTP. Isso não substitui uma auditoria integral.

## Correção de upload — 15/11/2026

Após relato de seleção sem foto/feedback, o upload passa a mostrar nome do arquivo, prévia durante envio e erro de carregamento da CDN. A verificação de origem aceita `APP_URL` e a URL explícita do deployment além da origem interna, mantendo rejeição de origens arbitrárias. O host Bunny aceita hostname ou URL HTTPS raiz, espaços externos e regiões de três letras (Sydney); credenciais não seguem redirects. Erros registram somente etapa e código/status, sem arquivo, dados pessoais ou chave. A causa específica da tentativa da Product Owner não constava dos logs retidos; não declarar upload real validado só com mocks.

A segunda rodada de investigação do avatar substitui a mensagem opcional por estados explícitos (envio, salvo, erro), com retorno sempre visível e tamanho do arquivo. Toda preparação fica protegida por tratamento de erro; a prévia local é opcional e não bloqueia envio. O timeout usa AbortController para compatibilidade entre navegadores. A usuária relatou Chrome/PNG; a reprodução com seu arquivo/serviço real ainda está pendente.

## Avatar de até 20MB e entrega alternativa

A Product Owner solicitou limite superior a 2MB. O formulário passa a aceitar JPG/PNG/WebP de até 20MB e otimiza o avatar no navegador antes do POST; o servidor continua validando bytes e gerando o derivado de 512px. O limite de transporte de 2MB é interno, não o limite do arquivo escolhido. Originais de avatar não são preservados; essa regra não se aplica aos originais de posts.

A URL CDN do avatar existente retornou 404 em duas requisições independentes (com/sem Referer). O novo endpoint `/api/media/avatar/:namespace/:file` tenta CDN e, em falha, lê exclusivamente o prefixo `avatars/` do Storage configurado. Nunca aceita URL arbitrária, não envia AccessKey à CDN, não segue redirects e só devolve WebP com tamanho limitado. Derivados de avatar já eram públicos por URL no desenho anterior; a rota não dá acesso a originais ou outras pastas. Cache por caminho imutável evita transferências repetidas.

A associação Pull Zone → Storage Zone ainda precisa ser conferida no Bunny. O fallback restaura a entrega sem expor a credencial nem exigir alteração de dados do perfil.
