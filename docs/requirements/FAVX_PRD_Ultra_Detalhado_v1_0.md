---
title: "FAVX — PRD ULTRA DETALHADO"
subtitle: "Documento-mestre de requisitos de produto | Creators + Users | Fundação para expansão"
author: "FAVX — Estratégia de Produto"
date: "04 de novembro de 2026"
lang: pt-BR
---

# FAVX — Product Requirements Document (PRD)

**Versão:** 1.0 — baseline de produto para especificação técnica.  
**Data de referência:** 04/11/2026.  
**Status:** documento de consolidação de decisões; itens em aberto sinalizados.  
**Mercados planejados:** Brasil, América Latina, Estados Unidos e Europa.  
**Idioma original:** português do Brasil.  
**Documentos complementares:** TRD; App Flow & Screen Specifications; Design System; Backend & Database; Claude Code Execution Plan.

> **Como ler este documento.** **APROVADO** identifica decisões explicitamente estabelecidas na evolução do FAVX. **REQUISITO DERIVADO** identifica o comportamento necessário para tornar uma decisão implementável, sujeito a validação no detalhamento técnico. **RECOMENDAÇÃO** é uma proposta de produto ainda não homologada como decisão final. **PENDENTE** requer definição antes do desenvolvimento da parte afetada. **FUTURO** pertence ao roadmap e não deve ser implementado como interface no MVP. Nenhuma recomendação aqui deve substituir uma decisão futura expressa.

## Mapa de leitura

- **Fundamentos (seções 0–5):** governança, estratégia, público, métricas, escopo, identidade e permissões.
- **Experiência principal (seções 6–17):** onboarding, perfil, publicação, mídia, agenda, banners, coleções, comunidade, busca e IA.
- **Monetização e operação (seções 18–24):** analytics, Creator Plus, parceiros, administração, comunicação, idiomas e privacidade.
- **Interface e futuro (seções 25–28):** experiência, crescimento, roadmap e requisitos não funcionais.
- **Especificações verificáveis (seção 29):** catálogo normativo com 104 requisitos identificados e critérios de aceite.
- **QA e execução (seções 30–40):** jornadas completas, estados, testes, riscos, pendências, aceite, inventário de telas e rastreabilidade.
- **Anexos:** referências oficiais e legenda de decisões.

_Para navegação por capítulo, utilize o painel de títulos do Word ou o índice de títulos do arquivo Markdown._

## 0. Controle documental e princípios de governança

| Campo | Definição |
|---|---|
| Código | FAVX-PRD-001 |
| Release-alvo | MVP 1.0 — FAVX Creators + FAVX Users |
| Responsável pela aprovação | Fundadora / Product Owner |
| Responsáveis pela implementação | Engenharia, Produto, Design e QA |
| Fonte de verdade | Este PRD para requisitos de negócio; TRD para decisões técnicas; Design System para UI |
| Política de mudança | Alteração deve informar ID do requisito, motivação, impacto, versão e aprovação |
| Entregas futuras | Events; Proof; busca global; FAVX for Brands |

### 0.1. Ordem de precedência

1. Decisões explícitas mais recentes da fundadora têm precedência sobre documentação anterior.
2. Requisitos obrigatórios de privacidade, segurança e legislação prevalecem sobre conveniências de UX.
3. O PRD define o **que** e **por quê**; o TRD define o **como técnico**; o fluxo de telas define o comportamento visual detalhado.
4. Em caso de contradição, registrar uma decisão em `DECISIONS.md` e atualizar todos os documentos dependentes antes da implementação.
5. Propostas não aprovadas não podem ser silenciosamente convertidas em funcionalidades do MVP.

### 0.2. Glossário

- **Creator:** pessoa que publica e organiza recomendações próprias, com página pública de curadoria; não representa automaticamente um estabelecimento comercial.
- **User:** pessoa com conta FAVX que descobre, salva e organiza recomendações; pode ativar a atuação como Creator na mesma identidade.
- **Visitante:** pessoa não autenticada, capaz de consumir páginas públicas e pesquisar no escopo autorizado.
- **Post/recomendação:** registro editorial publicado por um Creator; pode conter mídias, texto, links, categorias, avaliação e informações comerciais.
- **Coleção:** agrupamento de recomendações que pode ser público ou privado conforme titular e configuração.
- **Banner:** unidade de destaque configurável no perfil Creator Plus, com seu próprio ciclo de exibição e indicadores.
- **Fixação:** relação de destaque temporária ou contínua de um post; não é um post separado e não determina sua existência.
- **FAVX Context:** campo privado, editável pelo Creator, usado para enriquecer a compreensão semântica de sua recomendação.
- **Recomendação comunitária:** indicação enviada por terceiros em resposta a solicitação do Creator; nunca atribuída falsamente como autoria própria.
- **Entidade canônica:** representação normalizada de produto, serviço, lugar ou experiência, associável a posts distintos.
- **Exibição pública:** disponibilidade de um conteúdo em páginas, resultados de busca, coleções públicas e links públicos enquanto suas regras permitirem.
- **Analytics privado:** métricas acessíveis somente ao titular autorizado e à operação administrativa legitimada, nunca como placares públicos.

## 1. Resumo executivo e tese estratégica

A FAVX é uma plataforma visual de recomendações, experiências e descobertas. Na primeira versão, oferece a pessoas criadoras um espaço próprio de curadoria, com recomendações pesquisáveis, organização em coleções, links e códigos de indicação, recursos de divulgação e métricas privadas de longo prazo. Para o público, oferece acesso direto, sem cadastro obrigatório para visualizar perfis públicos, pesquisar recomendações, explorar coleções e abrir links externos. Com conta gratuita, esse público poderá salvar recomendações e construir sua própria biblioteca pessoal de descobertas.

A plataforma não deve ser percebida apenas como agregador de links, armazenamento de memórias, loja, rede social centrada em números ou mecanismo de anúncios. Seu ativo estratégico será uma base estruturada de recomendações reais, de contextos relevantes e de sinais agregados de descoberta. Conforme a base amadurecer, essa estrutura permitirá busca global entre diferentes creators e, futuramente, conexões consentidas entre marcas e creators.

### 1.1. Problemas prioritários

**Creators:** (a) stories e feeds têm janela curta de atenção, mas uma recomendação pode continuar valiosa por meses; (b) links, cupons e indicações se perdem em conteúdos dispersos; (c) seguidores têm dificuldade de reencontrar algo já indicado; (d) métricas tradicionais não mostram adequadamente o valor de busca e descoberta no longo prazo; (e) creators têm poucos espaços próprios e organizados para oferecer exposição comercial persistente ou programada.

**Público:** (a) não encontra a recomendação lembrada; (b) precisa perguntar repetidamente “qual era o link?”; (c) quer consultar dicas por tema, data, palavra, local ou contexto; (d) deseja salvar suas descobertas sem expor publicamente listas e interesses; (e) não quer criar conta apenas para consultar uma página pública.

### 1.2. Proposta de valor

**Para Creators:** transformar indicações efêmeras em uma curadoria pesquisável, duradoura, organizada, mensurável e potencialmente monetizável.  
**Para Users:** encontrar, salvar e recuperar recomendações relevantes com uma experiência simples, elegante e visual.  
**Para o ecossistema futuro:** estruturar evidências de interesse e recomendação de modo responsável, habilitando descoberta global e matching comercial autorizado.

### 1.3. Posicionamento e personalidade

A FAVX deve parecer uma tecnologia de ponta acessível, sofisticada, estética e muito bem executada, usada por pessoas que valorizam curadoria e praticidade. A interface deve privilegiar fotografia, espaço em branco, organização visual, cards arredondados e acabamentos sutis; evitar excesso de gamificação, contadores sociais ostensivos, pop-ups promocionais invasivos e linguagem publicitária genérica.

**Tom de voz:** claro, direto, humano, confiante, contemporâneo, útil e não infantilizado. **Microcopy:** priorizar ações e consequências: “Salvar”, “Compartilhar”, “Agendar”, “Encerrar exibição”, “Ocultar”, “Restaurar”, “Baixar original”. **Não dizer:** que uma recomendação foi “verificada” quando não foi, que uma marca possui acesso sem autorização, ou que a IA conhece fatos que não constam de dados confiáveis.

**Herança de identidade:** Manrope como tipografia principal de produto e Instrument Serif como apoio editorial; refinamento visual com formas arredondadas, blur e glassmorphism contidos. A identidade final da marca FAVX, logotipo e eventual reaproveitamento de slogans da fase GalleryX devem ser ratificados no Design System, sem reutilizar automaticamente marcações ou símbolos da marca antiga.

### 1.4. Princípios não negociáveis

1. **Conteúdo antes de popularidade:** não publicar contagens de seguidores, seguindo, views, cliques, impressões ou salvamentos.
2. **Descoberta sem fricção:** visitante acessa conteúdo público sem login; login quando necessário para salvar, gerenciar ou usar recursos privados.
3. **Creator controla sua curadoria:** autoria, edição, privacidade, patrocínio, programação e histórico transparente.
4. **Privacidade por padrão:** dados de audiência individuais não são um ativo compartilhável com marcas.
5. **IA como facilitadora:** classifica, transcreve e interpreta buscas; não inventa produtos, atributos, locais nem opiniões.
6. **Mídia sob controle do titular:** original preservado quando aceito pelo produto, variantes para entrega, download pelo proprietário autorizado.
7. **Arquitetura preparada, produto enxuto:** não lançar Events, Proof, busca global ou marketplace só porque a estrutura os antecipa.
8. **Internacional desde o início:** idiomas, moedas e fusos desacoplados.
9. **Métricas históricas:** coletar eventos desde o lançamento; controlar acesso por plano sem apagar histórico ao reduzir plano.
10. **Rastreabilidade:** ações sensíveis e estados de conteúdo devem ser auditáveis.

## 2. Público, segmentos e necessidades

### 2.1. Segmento prioritário — micro e médios creators de nicho

Criadores com público engajado, frequentemente procurados por indicações, mas sem organização robusta dos links e cupons. Nichos candidatos: beleza, autocuidado, moda, gastronomia, viagens, maternidade, decoração, livros, tecnologia, estilo de vida e experiências locais. O produto deve aceitar recomendações de produtos, serviços, lugares, eventos, conteúdos e experiências, sem moldar todos os posts como produtos compráveis.

### 2.2. Segmento de consumo — seguidor/visitante

Chega por link de bio, story, WhatsApp, busca ou compartilhamento; deseja encontrar algo específico e sair com uma resposta acionável. Seu sucesso não depende de adesão ao plano Plus nem de criar conta. Pode retornar posteriormente para salvar conteúdo ou criar coleções pessoais.

### 2.3. Segmentos secundários

- **Creator profissional/Plus:** procura relatórios, destaques, banners e programação de campanhas.
- **User curador:** organiza suas próprias referências e compartilha coleções sem criar conteúdo autoral público.
- **Parceiro comercial FAVX:** indica creators para assinarem o Plus, acompanhando atribuição e comissões.
- **Equipe FAVX:** suporte, operação, conteúdo, finanças, marketing, moderação e administração.
- **Marca/empresa:** parte apenas do roadmap; deseja encontrar creators com audiência e interesses compatíveis após consentimento.

### 2.4. Jobs to be done (JTBD)

| Persona | Quando... | Quero... | Para... |
|---|---|---|---|
| Creator | indico algo em um story | cadastrar em um lugar permanente | minha audiência encontrar depois |
| Creator | tenho vários links e cupons | organizar por temas e busca | reduzir perguntas repetidas |
| Creator Plus | lanço uma campanha | agendar e encerrar banners | não manter promoções vencidas |
| Creator Plus | reviso performance | consultar séries históricas privadas | comprovar valor da curadoria |
| Visitante | lembro de uma dica antiga | pesquisar por palavra, tema ou data | encontrar sem pedir o link |
| Visitante | não sei descrever exatamente | usar linguagem natural/voz | receber resultados relevantes |
| User | encontro uma recomendação útil | salvar e organizar em coleções | consultar depois |
| Creator | recebo sugestões do público | revisar e publicar com atribuição | valorizar a comunidade sem confundir autoria |

## 3. Resultados de negócio, indicadores e hipóteses

### 3.1. Objetivos do MVP

- Validar que creators publicam e mantêm recomendações atualizadas.
- Validar que visitantes encontram recomendações no escopo de um perfil.
- Validar que conteúdo indexável gera acessos recorrentes e saída útil para links externos.
- Validar disposição de creators a pagar por relatórios e espaços de destaque.
- Construir eventos e taxonomia necessários para futura descoberta global.
- Construir experiência com custos operacionais observáveis, evitando surpresas de mídia/IA.

### 3.2. North Star e métricas

**RECOMENDAÇÃO:** utilizar “sessões qualificadas de descoberta”, definidas como sessões que terminem com ação indicativa de utilidade (por exemplo, clique em indicação, salvamento ou compartilhamento), com controles para ações involuntárias. A métrica final e o denominador devem ser aprovados após instrumentação.

| Camada | Indicadores prioritários | Observação |
|---|---|---|
| Aquisição | visitantes novos, origem, links `by FAVX`, referidos | respeitar consentimento e privacidade |
| Ativação Creator | perfil criado, primeiro post, primeira coleção, perfil compartilhado | coortes de ativação |
| Ativação User | primeiro salvamento, primeira coleção, primeiro retorno | ações privadas |
| Descoberta | buscas, buscas sem resultado, refinamentos, CTR de recomendação | por escopo |
| Uso | criadores ativos, posts publicados, visitantes recorrentes | sem placares públicos |
| Receita | trials, conversão Plus, MRR/ARR, churn, inadimplência | segmentar moeda |
| Qualidade | erro de upload, falha de agendamento, denúncias, reclamações | métricas de segurança |
| Economia | custo de IA, armazenamento, entrega de mídia, margem e comissão | mensurar por recurso |

### 3.3. Metas numéricas

**PENDENTE:** metas trimestrais, funil de conversão, percentis de performance, retenção e orçamento de CAC serão definidas com base em instrumentação e estimativas reais. Números arbitrários não devem ser tratados como compromisso de negócio.

## 4. Estratégia de releases e fronteiras de escopo

| Entrega | MVP 1.0 | Preparação estrutural | Futuro |
|---|---|---|---|
| Conta única User/Creator | Sim | — | — |
| Página Creator pública, busca local | Sim | — | — |
| Posts, mídia, links, cupons, coleções, saves | Sim | — | — |
| Captura de foto/vídeo/áudio e download autorizado | Sim | — | — |
| Agendamento, expiração, arquivamento, edição | Sim | — | — |
| Fixados e banners Creator Plus | Sim | — | — |
| Busca conversacional e por voz no perfil | Sim, com controle de custo | índice semântico evolutivo | — |
| FAVX Context privado | Sim | embeddings/versionamento | — |
| Recomendações comunitárias solicitadas | Sim | autorização/atribuição | — |
| Analytics privado e Creator Plus | Sim | séries históricas | — |
| Partner Portal e Admin | Sim | antifraude/auditoria | — |
| Busca global entre todos os creators | Não | entidades canônicas/índices | Sim |
| FAVX for Brands/marketplace | Não | eventos agregáveis e privacidade | Sim |
| Events, Proof, perfis comerciais | Não | modelagem de identidades/domínios | Sim |
| Publicação automática no Instagram | Não | exportação nativa compatível | A avaliar |
| Comparação automatizada de preços em tempo real | Não | links normalizados | A avaliar |

### 4.1. Fora do MVP explicitamente

Não implementar feed social global, ranking público de creators, contador público de popularidade, mensagens privadas entre usuários, marketplace de publicidade de marcas, motor global de busca, negociação comercial integrada com empresas, Events/Proof, perfis comerciais completos, pagamento por comissão de vendas externas, scraping massivo de sites, publicação automática em plataformas de terceiros ou importação automática irrestrita de Instagram. São oportunidades futuras que exigem decisão própria.

### 4.2. Dependências de lançamento

Operações de billing internacional, política de conteúdo, termos, consentimentos, processamento de mídia, suporte e custos de IA precisam estar validados antes de abertura pública nos países planejados. A existência de três moedas e seis traduções não substitui verificação de operações, tributos, meios de pagamento, contratos ou privacidade por região.

## 5. Identidade, papéis e matriz de acesso

### 5.1. Identidade única

Uma conta tem um identificador de pessoa único, sessão própria, preferências de idioma/fuso/moeda e capacidade de operar como User, Creator ou ambos. A ativação do papel Creator não duplica conta, perfil de login ou biblioteca de salvos. Assinaturas de Creator Plus pertencem ao contexto comercial do Creator, não a todos os possíveis papéis da identidade.

### 5.2. Papéis de acesso

| Papel | Pode visualizar | Pode alterar | Limites |
|---|---|---|---|
| Visitante | perfis/posts/coleções públicos e busca no escopo | nenhum conteúdo alheio | não vê métricas, listas privadas ou contextos |
| User autenticado | público e sua biblioteca privada | salvos, coleções próprias, dados pessoais | não vê analytics alheios |
| Creator Free | conteúdo próprio e públicos | posts, coleções, links, solicitações | métricas Free restritas |
| Creator Plus | conteúdo próprio + dashboards avançados | banners, fixados e recursos Plus | limites e elegibilidade do plano |
| Remetente comunitário | formulário público de submissão | envio voluntário | não acessa fila privada de submissões |
| Parceiro | dashboard de indicações próprias | dados próprios e requerimentos | não vê dados pessoais de assinantes além do mínimo autorizado |
| Suporte/Moderação | somente recursos autorizados | ações delegadas | acesso logado e limitado |
| Financeiro | billing e comissões necessários | ajustes aprovados | não tem acesso amplo a conteúdo privado |
| Superadmin | operações legitimadas | configurações críticas | autenticação forte, justificativa e auditoria |
| Marca futura | nada comercial por padrão | recursos futuros consentidos | nenhuma API de dados Creator no MVP |

### 5.3. Política-base de dados privados

**APROVADO:** contagens e listas de seguidores/seguindo não são públicas. Visualizações, impressões, salvamentos, cliques, métricas de posts, coleções e banners são privadas. A API pública jamais deve enviar esses valores em payloads ocultos apenas pelo frontend. O proprietário poderá consultar suas próprias relações de seguidores/seguindo; a visibilidade das métricas de conteúdo obedecerá ao plano (Free: cliques gerais no link de perfil; Plus: métricas avançadas).

**REQUISITO DERIVADO:** os registros de seguidores, salvos e interações pertencem também às pessoas que os geraram; o produto deve garantir seus direitos sobre dados, sem transformar listas individuais de audiência em relatórios de terceiros.

## 6. Onboarding, autenticação e conta

### 6.1. Entrada sem autenticação

A visita a uma página Creator pública deve funcionar sem login, inclusive busca, filtros, visualização de posts e abertura de links. Ao clicar em “Salvar” ou outra ação que precise de conta, solicitar autenticação sem perder a intenção: ao retornar, completar o salvamento ou recuperar o contexto anterior. A navegação anônima não deve disparar modal de cadastro automaticamente.

### 6.2. Cadastro e ativação

**Fluxo:** abrir cadastro > escolher método de autenticação permitido > validar credenciais > aceitar termos/avisos necessários > criar identidade User > escolher idioma/fuso (detectável, editável) > acessar salvos e eventualmente ativar Creator. O método mínimo é autenticação segura por e-mail; métodos sociais permanecem **PENDENTES**. O processo deve ter prevenção de contas duplicadas, mensagens de erro claras, proteção contra abuso e recuperação de sessão.

### 6.3. Ativação Creator

Entrar em “Tornar-me Creator” > informar nome público, username único, bio opcional, foto/capa opcional, categorias de interesse > revisar prévia > publicar perfil > receber orientação de criar primeira recomendação e compartilhar. Nunca exigir migração dos dados User para outra conta. Nomes, usernames e imagens passam por validação de políticas e reservas de rota.

### 6.4. Edição e segurança da conta

Recursos obrigatórios: alterar nome, idioma, região, fuso e preferências; atualizar dados de autenticação conforme provedor; sair de sessões; solicitar exportação e exclusão; consultar permissões, notificações e privacidade; obter suporte. Exclusão da conta deve separar retenções legais/financeiras e direitos de titulares, com fluxo de confirmação e eventual cancelamento de assinatura antes de encerramento.

## 7. Perfis públicos e estrutura de publicação Creator

### 7.1. Perfil público

Campos: username, nome de exibição, foto, capa opcional, biografia, links sociais/externos, categorias de curadoria, coleções públicas, posts visíveis, banners elegíveis, busca no perfil e assinatura discreta `by FAVX`. O perfil deve transmitir personalidade editorial, mas preservar legibilidade, leitura rápida e navegação por dispositivos móveis.

### 7.2. Roteamento e compartilhamento

Rota pública no padrão `/{username}` no domínio canônico da FAVX, com namespaces reservados para produto/admin/API. Links profundos para posts e coleções, metadados Open Graph, prévias de compartilhamento e regras de redirecionamento em mudança de username. O domínio definitivo e a política de redirecionamento são detalhes de implantação a confirmar; não assumir que o domínio histórico de outra marca é o canônico.

### 7.3. Links incorporados e prévias

Admitir links externos, incluindo sites de compra, serviços, reservas, playlists e mídia, com preview somente quando tecnicamente possível e autorizado pelos provedores. Links devem abrir de forma segura e identificar corretamente o destino. Links quebrados ou expirados devem possuir estado visível e opção de edição pelo Creator. Não prometer reprodução embutida de qualquer conteúdo de terceiros.

### 7.4. Privacidade social por concepção

Não apresentar contadores públicos de seguidores, seguindo, visitas, cliques, salvamentos, compartilhamentos, reações ou performance. Botão “Seguir” pode existir como ação útil para acompanhar Creator, mas não induzir placar social. O titular visualiza quantidades/listas privadas em área apropriada, não necessariamente no cabeçalho público. Listas próprias não podem ser consultadas por outros via API.

### 7.5. Presença da marca FAVX

Todas as páginas públicas e compartilháveis devem portar identificação sutil `by FAVX` com link institucional rastreável, sem sobreposição intrusiva nem comprometer fotos. Origem, creator, superfície e campanha podem ser registrados em analytics sem expor informações pessoais indevidas. O usuário não é obrigado a adotar elementos de marca em conteúdo privado fora das regras específicas de exportação.

## 8. Conteúdo: posts, formatos e regras editoriais

### 8.1. Estrutura mínima de um post

Identificador; Creator titular; título; descrição; tipo/tema; tags; categorias/subcategorias; mídias ordenadas; links; cupons; avaliação pessoal opcional; informações de patrocínio; localização opcional; estado de vida; data de criação, atualização, publicação e expiração; contextos privados separados; histórico de mudanças relevantes; sinais de indexação e métricas. Campos opcionais não podem aparecer como espaços vazios no público.

### 8.2. Tipos de conteúdo

- Produto físico ou digital.
- Serviço ou profissional (sem criar automaticamente perfil comercial no MVP).
- Lugar: restaurante, bar, hotel, loja, atração ou espaço.
- Experiência, roteiro ou momento.
- Livro, filme, música, podcast ou conteúdo recomendado.
- Evento e atividade (como recomendação editorial; não é FAVX Events).
- Recomendação sem link de compra, mas com texto, áudio ou mídia própria.

### 8.3. Editor

Criar rascunho, auto-salvar alterações, revisar prévia por dispositivo, editar, duplicar, reordenar mídias, corrigir URLs, adicionar ou remover cupom, gerenciar tags/categorias, marcar patrocínio, agendar, publicar, ocultar, arquivar e excluir com confirmação. Ações destrutivas devem explicar impactos sobre links públicos, coleções e salvos. Incluir estado de carregamento, upload parcial, falha de rede, perda de conexão e prevenção de envio duplicado.

### 8.4. Limites aprovados

| Tipo | Limite por item | Regra |
|---|---|---|
| Foto | até 20 MB | dimensão, formato e variantes a definir no TRD |
| Vídeo | até 250 MB e até 10 min | validar tamanho e duração; os dois critérios são cumulativos |
| Áudio | até 20 MB e até 10 min | validar tamanho e duração; os dois critérios são cumulativos |
| Texto da publicação | até 10.000 caracteres | contagem e tratamento de Unicode definidos tecnicamente |
| Armazenamento acumulado | sem limite total de GB/arquivos anunciado ao usuário | observar limites por arquivo, políticas de uso e viabilidade econômica |
| Download acumulado próprio | sem cota acumulada anunciada | controles de segurança/abuso não são limites comerciais de GB |
| Carrossel | recomendação inicial: até 10 itens | confirmar como requisito final antes de codificar |

As regras são aplicadas ao **arquivo original**; otimizações posteriores não autorizam aceitar arquivos acima do máximo original, nem reduzir unilateralmente a qualidade do original preservado.

### 8.5. Mídia de um post

Carrossel misto de fotos/vídeos, ordenação manual, capa, legenda contextual de cada item quando aplicável, prévia e transições acessíveis. Áudio pode complementar o texto ou ser a recomendação principal, com transcrição opcional e modo de publicação de texto, áudio+texto ou áudio isolado. A geração de texto por IA deve ser revisável antes de publicação; transcrição nunca deve ser apresentada como literalmente conferida se não foi revisada.

### 8.6. Categorias, tags e IA

O sistema propõe categorias/subcategorias e tags a partir de conteúdo e contexto disponíveis. O Creator vê sugestões, pode aprovar, acrescentar, editar e excluir. Registrar origem (manual/IA/admin) e versão da taxonomia para permitir reclassificação futura sem apagar escolha manual. Termos ofensivos, ambíguos ou proibidos passam por moderação; sugestões incorretas devem ser reversíveis.

### 8.7. Links, afiliados, cupons e ofertas

Um post pode ter múltiplos links externos com rótulos claros, possibilidade de código promocional, validade, condições, tipo/valor do desconto e indicador de que o link/oferta possui desconto. A cópia de cupom deve informar sucesso sem alterar a experiência de quem não quer comprar. O Creator declara relação comercial quando aplicável. Preços de sites externos não são prometidos como atualizados em tempo real no MVP.

### 8.8. Patrocínio e avaliação

Conteúdo patrocinado deve receber rótulo claro, legível e consistente com a localidade, separado de cupom/desconto; a marca não pode ocultar o aviso por configuração de estilo. **Avaliação do Creator:** escala proposta e alinhada na evolução do produto: de 0 a 10, em passos de 0,5, opcional, exibida como opinião pessoal do Creator (ex.: `9,5/10`). Não é pontuação coletiva nem indicador de verificação factual. Alteração de nota deverá ser auditável e não implica reescrever o histórico agregado de cliques.

## 9. Captura nativa, mídia original e download

### 9.1. Escopo funcional da captura

O editor deverá oferecer “Tirar foto”, “Gravar vídeo” e “Gravar áudio”, quando dispositivo/navegador oferecerem suporte e o usuário conceder permissão. Se o recurso nativo não estiver disponível, apresentar alternativa acessível de upload ou captura pelo aplicativo do dispositivo quando suportado. Não prometer comportamento idêntico entre navegadores, web app instalada e sistemas operacionais.

### 9.2. Pré-publicação

**Fluxo:** solicitar permissão just-in-time > exibir estado de câmera/microfone ativo > capturar > pré-visualizar/reproduzir > salvar rascunho local temporário quando viável > confirmar upload > concluir processamento > publicar ou agendar. Incluir controles de parar, cancelar, descartar, regravar, duração/limite e indicador visível de gravação. Negação de permissão não deve bloquear criação de conteúdo por upload.

### 9.3. Original versus derivado

O FAVX manterá identificação da mídia original e de suas versões derivadas para exibição, thumbnail, streaming e exportações. Variantes podem ser comprimidas, redimensionadas ou convertidas. O original aceito deverá permanecer disponível para o titular enquanto não for removido nos termos do produto, respeitadas políticas e obrigações legais. Metadados sensíveis (como localização EXIF) não devem ser expostos nas variantes públicas por padrão. Preservar metadados internos apenas quando necessários e legitimamente tratados.

### 9.4. Download próprio

O Creator autenticado pode baixar **originais próprios** e variantes próprias de posts publicados, rascunhos e itens ocultados/arquivados, se ainda existentes e autorizados. O sistema deve apresentar escolha “Original” ou “Versão otimizada” quando ambas existirem, com tamanho/formato quando conhecido. Downloads exigem autorização no servidor, URLs temporárias e evento de auditoria apropriado; não devem permitir enumeração ou acesso a arquivos de terceiros.

Captura dentro do FAVX é indício operacional de origem, mas **não constitui prova jurídica automática de autoria**; o titular declara ter direitos de uso sobre o material, inclusive de pessoas retratadas e conteúdos incorporados. Conteúdo enviado de terceiros não vira “próprio” só porque foi carregado pelo Creator. Download público de mídia alheia permanece desabilitado por padrão, salvo autorização explícita/licença futura.

### 9.5. Tratamento de falhas

Permissão negada; aparelho sem câmera; falta de espaço local; conexão interrompida; upload parcial; falha de transcodificação; duração excedida; arquivo inválido; download expirado; mídia removida; disputa de direitos. Cada situação deve ter feedback, ação de recuperação, possibilidade de reenvio quando cabível e identificação de versão. Não afirmar que um arquivo não enviado ao servidor está “salvo na nuvem”.

## 10. Ciclo de vida: agendamento, edição, expiração e exclusão

### 10.1. Estados de publicação

**Draft:** não público, editável. **Scheduled:** tem início futuro, não público até habilitação. **Published:** publicável e dentro da janela permitida. **Hidden:** ocultação manual. **Expired:** data final alcançada. **Archived:** retirado da navegação ativa por decisão do Creator. **Pending deletion:** exclusão solicitada com possibilidade de restauração conforme política. **Deleted:** logicamente indisponível; eventual eliminação material/anonimização posterior.

Os estados devem coexistir com eventos de auditoria, e **não** ser codificados como um único flag `is_published`. A janela de visibilidade é uma condição temporal adicional, não necessariamente uma mudança irreversível de status.

### 10.2. Agenda temporal

Permitir publicar agora, programar início, programar fim ou ambos. Validar término posterior ao início; mostrar fuso horário ativo e prévia humanizada (“10 nov, 10:00 — horário de Brasília”, por exemplo), não presumir fuso pelo idioma. Resolver transições de horário de verão, horários inexistentes e ambiguidades de fuso com comunicação clara. Reagendamento após início deve ter efeitos previsíveis. Jobs falhos precisam de reconciliação: conteúdo expirado **não pode aparecer** só porque a fila atrasou.

### 10.3. Edição de publicado

Alterar conteúdo, links, cupons, categoria, mídia ou datas não apaga métricas históricas. Atualização de conteúdo relevante poderá invalidar cache, reindexar busca e registrar versão. Se editar post já compartilhado, manter URL canônica sempre que possível. **RECOMENDAÇÃO:** informar data de última atualização discretamente quando relevante para ofertas ou informações sensíveis ao tempo.

### 10.4. Expiração e efeitos

Ao atingir `visible_until`, o conteúdo deixa de ser exibido em perfil, listas, coleções públicas, busca e recomendações públicas. Links profundos devem indicar indisponibilidade sem revelar dados privados nem inventar conteúdo. Dono continua a encontrá-lo em “Encerrados”, com histórico analítico e opções de editar, reagendar, restaurar ou solicitar exclusão. Salvos privados podem manter uma referência com estado “Indisponível” em vez de desaparecer silenciosamente.

### 10.5. Exclusão e recuperação

Separar **ocultar**, **arquivar**, **excluir logicamente** e **eliminar definitivamente**. Exclusão requer confirmação e explica efeitos sobre URLs, saves, coleções e backups. **RECOMENDAÇÃO:** lixeira recuperável por 30 dias, salvo exigência legal ou solicitação legítima de apagamento mais restritiva. Preservar métricas agregadas não identificáveis quando permitido; não reter indefinidamente dados pessoais por conveniência analítica. A política definitiva de retenção deverá passar por revisão jurídica.

### 10.6. Banners e fixados

Banners têm ciclo próprio: rascunho, programado, visível, oculto, expirado, arquivado e excluído. Um banner não deve desaparecer do dashboard quando termina; cliques/impressões e período de veiculação continuam consultáveis conforme plano.

Fixação é um **vínculo temporário** com post publicado: agendar início e fim de destaque sem necessariamente encerrar o post. Quando a fixação termina, a publicação permanece na ordenação normal se ainda estiver publicada. Se o post expirar, for ocultado ou excluído, nenhuma fixação poderá torná-lo visível. Limite Plus: **6 posts fixados simultaneamente**; agendamentos futuros em janelas sobrepostas também devem respeitar capacidade.

### 10.7. Conflitos de agenda

Mudança de plano, renovação falha, post removido, banner duplicado ou agendas sobrepostas devem ter regras determinísticas. Uma reserva de espaço futuro não pode produzir excedente silencioso. Alterar fuso de perfil não deve reescrever timestamps absolutos já confirmados; mostrar o horário no novo fuso sem mudar instante programado, a menos que o Creator explicitamente reagende.

## 11. Banners, destaques e espaços Plus

### 11.1. Conceito do banner

Banner é uma peça visual de promoção/editorial inserida em regiões previstas do perfil Creator. Pode direcionar a post, coleção, URL externa, campanha ou ação interna permitida. Não é sinônimo de post patrocinado: há banners editoriais, de autopromoção, ofertas, publicidade ou lançamentos. Sempre que houver vínculo comercial material, o rótulo de publicidade deve ser aplicado de forma não opcional quando exigido.

### 11.2. Configuração

Campos necessários: título interno, mídia/capa, texto acessível, CTA, destino, classificação comercial, prioridade/posição, início e fim de veiculação, estado, owner, versão, identificadores de analytics. Editor com preview em mobile e desktop, validação do link e disponibilidade do destino. **APROVADO:** Creator Plus pode manter até 10 banners, com regra exata de contagem de ativos/agendados ainda a definir; **RECOMENDAÇÃO:** validar simultaneidade por slot de exibição e evitar que banners agendados se sobreponham acima da capacidade da superfície.

### 11.3. Exibição

Somente banners elegíveis aparecem. Um banner suspenso por moderação, removido, com assinatura sem direito ativo ou fora da janela de exibição não pode ser servido por cache, feed ou endpoint público. Evitar layout quebrado ou espaço vazio quando nenhum banner estiver ativo. A ordem de banners não deve induzir impressão de relevância editorial quando se tratar de publicidade; o conteúdo de campanha deve ser identificado.

### 11.4. Métricas e encerramento

Registrar impressão efetiva definida pelo padrão analítico, clique e CTR, com datas e superfície. Encerrar banner não exclui seu histórico. Dashboards de campanhas concluídas devem ser disponibilizados somente ao Creator com permissão, mantendo eventos preservados após downgrade conforme política de retenção e acesso. Exportação de dados e comparação de períodos são recursos a considerar no detalhamento Plus.

### 11.5. Destaques e coleções

Fixados e coleções destacadas precisam de ordem manual, preview e possibilidade de programação quando a apresentação for temporária. O limite aprovado na negociação comercial é “até **6 coleções**” no Creator Plus, mas sua interpretação operacional (total ou em destaque) ainda exige decisão expressa antes de implementar cotas. Não converter esse número por inferência em limite para bibliotecas pessoais do User.

## 12. Coleções, salvos e biblioteca pessoal

### 12.1. Coleções do Creator

O Creator organiza posts próprios em conjuntos temáticos com título, descrição, capa opcional, posição e estado de visibilidade. Um post pode integrar múltiplas coleções; sua exclusão ou expiração não deve corromper a coleção. Alterações de ordem devem ser mantidas sem reload completo quando possível, com confirmação de sucesso e tratamento de conflito.

### 12.2. Coleções do User

O User poderá salvar recomendações de diferentes creators e agrupá-las em coleções próprias, privadas por padrão. Poderá alterar título/capa/descrição, reordenar itens, remover, compartilhar uma coleção quando ativar visibilidade por link e revogar compartilhamento quando disponível. Compartilhar uma coleção não transfere direitos de mídia, não publica dados privados do usuário e não concede acesso a posts já indisponíveis.

### 12.3. Salvamento

- Salvar exige autenticação; visitante pode navegar sem conta.
- A mesma pessoa não deve criar salvamentos duplicados idênticos ao clicar repetidamente.
- O Creator pode consultar contagens agregadas de salvamentos conforme plano; não recebe automaticamente lista de usuários que salvaram.
- Salvo mantém referência ao post e sua disponibilidade, não cópia irrestrita do arquivo original.
- Se a recomendação deixa de ser pública, o User recebe estado “Conteúdo indisponível” e opção de remover dos salvos.
- Remover dos salvos não apaga a publicação original.

### 12.4. Privacidade e links compartilháveis

Coleções têm configuração explícita de visibilidade. Link não adivinhável é uma conveniência de compartilhamento, **não** substitui autenticação para itens privados. Para coleções compartilhadas por link, avaliar índice público, possibilidade de revogação e risco de encaminhamento. O autor deve ter preview de “como outra pessoa vê”. Dados como quem salvou, histórico de pesquisas e totais internos não devem compor o payload compartilhado.

### 12.5. Busca na própria biblioteca

Autenticados podem buscar em salvos/coleções próprios por palavras, categoria, creator, data de salvamento, data de criação do post e filtros pertinentes. Datas diferentes precisam de rótulos diferentes para evitar confusão. O escopo privado não deve ser misturado indevidamente com posts públicos de outros creators.

## 13. Seguir creators e relações de audiência

### 13.1. Finalidade

Seguir facilita acompanhar ou recuperar a curadoria de determinados creators, mas não cria ranking social. A ação deve ser reversível e não exigir divulgação pública de relações. Notificações de novos posts ou atualizações dependem de preferências e de um sistema de entrega autorizado.

### 13.2. Modelo de visibilidade

**APROVADO:** números e listas de seguidores/seguindo ficam visíveis ao próprio titular de conta, não ao público; dados analíticos da audiência não aparecem na página pública. Uma pessoa não pode inferir a lista privada de um Creator por endpoints, ordenações, grafos ou mensagens de erro.

### 13.3. Bloqueios e abuso

**REQUISITO DERIVADO:** criar mecanismos de bloqueio/denúncia e mitigação de comportamento abusivo, especialmente se o recurso de seguir e notificações puder criar contato indesejado. Exposição pública de listas seguirá desativada mesmo quando um perfil tiver muitos seguidores.

## 14. Recomendações da comunidade

### 14.1. Premissa

O Creator é curador de suas próprias recomendações. **Não** recebe por padrão indicações externas como se fossem recomendações suas e **não** possui um link genérico permanente de submissão em toda página de Creator. O canal comunitário é um **pedido intencional**, com link dedicado, criado pelo Creator, no qual seguidores podem enviar ideias privadas. O Creator decide se publica alguma submissão e, nesse caso, o conteúdo deverá ser rotulado como recomendação da comunidade/de seguidor.

### 14.2. Solicitação do Creator

O Creator cria um pedido com título/tema, descrição, eventuais categorias/localização, validade, status aberto/pausado/encerrado e endereço compartilhável. Pode publicar o link em stories ou qualquer outro meio. O FAVX identifica esse pedido e permite enviar links, descrições, fotos autorizadas e informações opcionais. Evitar pedir dados pessoais desnecessários do remetente.

### 14.3. Envio do seguidor

Formulário com campos mínimos, prévia de conteúdo, declarações de direitos e consentimentos aplicáveis; confirmação de envio; prevenção de spam e limite de abuso. Submissão é **privada ao Creator** por padrão. O remetente não tem direito de ver o painel de submissões nem de acompanhar outras respostas.

### 14.4. Revisão e publicação

O Creator recebe uma caixa de entrada, pode descartar, editar quando permitido, solicitar esclarecimentos por meio autorizado ou selecionar para publicação. A transição para público exige revisão explícita e atribuição de origem (“Recomendação da comunidade”). Não transformar automaticamente a submissão em endosso pessoal do Creator, nota pessoal ou fato verificado. A regra de licença/autorização para reutilização de mídia de terceiros deve ser tratada no formulário e no processo de publicação.

### 14.5. Moderação e responsabilidades

O Creator pode ocultar/recusar conteúdo; a plataforma pode bloquear denúncias, arquivos indevidos, spam, direitos autorais e exposição de dados. Publicação comunitária deve oferecer meios para reportar abuso e, quando necessário, solicitar remoção/correção. Se o pedido expirar, novos envios ficam indisponíveis sem apagar necessariamente envios já recebidos.

## 15. Busca: texto, filtros, voz, IA e geografia

### 15.1. Estratégia de escopo

No lançamento, buscar **dentro da página do Creator visitado** e **dentro dos salvos/coleções do usuário autorizado**, conforme a superfície. O usuário deve compreender visualmente o escopo, evitando interpretar ausência de resultado local como inexistência na plataforma. A busca global não será exibida no MVP; o modelo de dados deve permitir evolução futura.

### 15.2. Busca convencional

Pesquisar título, descrição, categorias, tags, nomes, metadados relevantes e links normalizados. Aceitar erros de digitação comuns, sinônimos/aliases quando disponíveis, acentuação e variações linguísticas com comportamento especificado. Filtros: categoria/subcategoria; conteúdo/tipo; creator (na biblioteca própria); data; localização quando aplicável; ofertas quando disponíveis. A busca por data deve distinguir criação, publicação, atualização e salvamento.

### 15.3. Intervalos de data

Atalhos recomendados: últimos 7 dias, 30 dias, 90 dias, ano e intervalo personalizado. Datas devem ser avaliadas segundo campo explicitamente selecionado. Conteúdo recém-editado não deve aparecer como “publicado ontem” se foi publicado há anos, salvo filtro de atualização.

### 15.4. Busca conversacional por texto

O usuário descreve o que procura em linguagem natural, refina o pedido e visualiza resultados em cards. A IA interpreta intenções, atributos e restrições, transformando-as em consultas estruturadas, sem substituir a busca efetiva por geração livre de respostas. O usuário pode prosseguir na mesma sessão: “Quero churrascaria perto do Flamengo”, “com espaço kids”, “até uns 20 minutos”; o contexto deve ser mantido com possibilidade de limpar ou recomeçar.

### 15.5. Busca por voz

Botão de microfone com solicitação de permissão, gravação de consulta, transcrição, revisão/edição do texto reconhecido e execução. Não assumir que todo dispositivo suportará gravação no browser. Texto de busca pode ser digitado sem áudio. Processamento de voz e eventual armazenamento exigem informação transparente de finalidade e retenção.

### 15.6. Busca geográfica

Se o usuário disser “próximo de mim”, solicitar geolocalização de forma contextual ou permitir cidade/bairro/endereço manual. Não exigir localização precisa para buscas gerais. Quando busca mencionar bairro/cidade, resolver para uma área com limites e nível de confiança, permitindo expansão por proximidade. Exemplos: Flamengo/Rio de Janeiro; regiões vizinhas quando coerentes. Distâncias exatas, tempo de deslocamento e “aberto agora” só devem ser oferecidos se houver fonte/serviço e precisão adequados.

### 15.7. Ranking e relevância

O sistema combina correspondência textual, semântica, filtros estruturados, proximidade e relevância contextual, mas **não** confunde número de seguidores com qualidade. Conteúdo patrocinado não deve se passar por resultado editorial orgânico; regras de ordenação e rotulagem devem ser claras. O FAVX Context pode ajudar a recuperar candidatos, mas não pode aparecer nas respostas públicas nem servir de fonte para afirmações não autorizadas.

### 15.8. Evidência, transparência e alucinação

Exibir apenas posts públicos elegíveis naquele escopo. Resumos gerados por IA devem corresponder a conteúdo publicamente divulgado, dados verificados ou síntese claramente atribuída; não afirmar “tem espaço kids” apenas porque um contexto privado sugere adequação, sem evidência pública. Quando não houver resultado, informar o motivo provável e oferecer redução de filtros ou reformulação. Nunca inventar restaurantes, produtos, preços, avaliações ou horários.

### 15.9. Estados de experiência

Campo vazio; carregando; transcrevendo; analisando; resultados parciais; sucesso; nenhum resultado; localização negada; áudio indisponível; consulta ambígua; conexão instável; erro técnico; limite de uso atingido; resultado desatualizado; conteúdo expirado entre busca e clique. Todos devem ter microcopy e ação recuperável. Respostas automáticas não devem revelar texto privado de creators ou dados pessoais de usuários.

### 15.10. Contenção de custo e abuso

**REQUISITO DERIVADO:** estabelecer limites técnicos por sessão/IP/conta, caching, modelo de IA proporcional à tarefa, controle de tokens, observabilidade, proteção contra automação abusiva e fallback para busca convencional. A política comercial de cotas de busca por plano permanece **PENDENTE**; a experiência gratuita não deve ser degradada silenciosamente por controles técnicos não comunicados.

## 16. FAVX Context: conhecimento privado do Creator

### 16.1. Objetivo

Dar ao Creator um campo independente da descrição pública para contextualizar experiências, ocasiões, público indicado, características e nuances que melhorem a interpretação e descoberta da recomendação. Esse campo não é publicação, nem substitui informação pública relevante.

### 16.2. Entrada

O Creator pode digitar ou gravar áudio para transcrever, revisar e salvar contexto. Conteúdo privado aceita edição e exclusão. O editor deve informar: “Esse contexto não aparece na publicação pública. Ele ajuda a inteligência da FAVX a compreender sua recomendação e melhorar a relevância das buscas.”

### 16.3. Tratamento

Armazenar contexto em camada isolada e protegida, com controle de autorização, status de processamento, versão e artefatos semânticos derivados. Alterar o contexto solicita atualização de índices/embeddings. O contexto não pode ser incluído em HTML público, APIs de perfil, exportações públicas, metadados SEO, modelos de IA que respondam diretamente ao visitante nem futuro marketplace.

### 16.4. Limites de uso

Pode influenciar **recuperação** de posts relevantes, mas não criar afirmações públicas sobre fatos privados. Se o usuário procura “lugar para jantar romântico” e o contexto privado do Creator indica essa adequação, o post pode ser candidato; o sistema deve limitar o texto exibido às informações públicas confiáveis. Contextos com dados de terceiros sensíveis ou pessoais precisam de moderação, orientações de minimização e exclusão adequada.

## 17. Descoberta global futura: entidades canônicas

### 17.1. Por que preparar agora

Creators diferentes podem recomendar o mesmo restaurante, hotel, bolsa ou serviço usando nomes, links, imagens e sinônimos distintos. A estrutura deve permitir associação de posts a **uma entidade canônica** sem exigir que o Creator perca sua individualidade editorial.

### 17.2. Estruturas de domínio

Entidade de produto/serviço/lugar; alias/nomes alternativos; categoria; fontes; identificadores externos quando legítimos; links normalizados; atributos com proveniência e confiança; relação post-entidade; embeddings; eventuais duplicatas e merges reversíveis. Uma entidade pode receber múltiplas recomendações de creators distintos, cada qual preservando sua autoria, avaliação, mídia e contexto privativo.

### 17.3. O que NÃO será lançado agora

Não exibir busca sobre toda a base, ranking global, ficha agregada de entidade, contagem global de creators por produto ou resumos transversais como se fossem recurso disponível. A preparação consiste em dados, taxonomia, índices e governança. Lançamento futuro dependerá de volume, qualidade, moderação e testes de precisão.

## 18. Métricas privadas, analytics e satisfação

### 18.1. Regra principal

Coletar eventos relevantes desde o primeiro dia em todos os planos; **não tornar métricas de engajamento públicas**. Creator Free visualiza apenas o indicador básico aprovado de cliques no link geral de seu perfil, enquanto Plus desbloqueia dashboards avançados sem apagar ou reiniciar histórico ao fazer upgrade. Após downgrade, histórico continua preservado e oculto, não exibido indevidamente por endpoint.

### 18.2. Catálogo conceitual de eventos

| Evento | Momento de registro | Observações |
|---|---|---|
| `profile_view` | página pública carregada de modo válido | bot e deduplicação precisam de regra |
| `profile_outbound_click` | clique em link geral externo | métrica básica Free |
| `post_impression` | post realmente visível conforme critério | não contar requisição de API como impressão |
| `post_open` | abertura de detalhe | separar de impressão |
| `post_link_click` | ação em URL do post | destino e origem |
| `post_save` / `post_unsave` | alteração efetiva do estado | sem duplicação por clique repetido |
| `post_share` | acionamento de compartilhamento | nem sempre equivale a compartilhamento efetivo |
| `collection_open` | visualização de coleção | sem dados pessoais públicos |
| `banner_impression` | banner atendeu limiar de visibilidade | campanha/posição |
| `banner_click` | CTA do banner acionado | campanha/posição |
| `creator_search` | consulta efetuada no perfil | preservar privacidade de texto sensível |
| `search_result_click` | ação sobre resultado de busca | escopo e posição |
| `follow` / `unfollow` | estado confirmado | contagens privadas |
| `media_download` | arquivo próprio solicitado/autorizado | auditoria e custos |
| `trial_started` / `subscription_paid` | confirmação de billing | fonte financeira, idempotente |
| `partner_attribution` | atribuição persistida | regras antifraude |

### 18.3. Métricas Creator Plus

Visões gerais por período; visitas ao perfil; usuários únicos com margem de erro/qualificação quando necessário; tendências de crescimento; impressões e aberturas de posts; cliques em links; salvamentos agregados; compartilhamentos acionados; performance de coleções; banners e CTR; termos/categorias buscados em agregação segura; origem e superfície de acesso; atividade por período; conteúdo com melhor descoberta. Todos com data, período, definição, fonte e avisos contra conclusões indevidas.

### 18.4. Janela histórica e downgrade

A instrumentação não começa no upgrade. O plano define **acesso ao dashboard**, não existência de eventos. Cancelamento mantém recursos Plus até o fim do período pago; quando entitlement expirar, dashboards deixam de ser acessíveis e recursos pagos saem da apresentação pública conforme regras. Métricas históricas continuam armazenadas segundo política de retenção e podem voltar a ser consultadas ao reativar Plus.

### 18.5. Identificação de audiência

A audiência é representada por dados agregados necessários. Análises de região, preferência e busca devem minimizar riscos de identificação. Não disponibilizar ao Creator listas nominais de quem visualizou ou salvou, mesmo que exista métrica agregada. Informações de seguidores, quando presentes, permanecem privadas ao titular conforme acesso explícito, sem integração automática ao futuro brand marketplace.

### 18.6. Satisfação

**RECOMENDAÇÃO:** incluir no Admin métricas de qualidade e satisfação separadas de métricas de audiência, como formulários de feedback, problemas reportados, avaliações voluntárias da experiência e eventualmente pesquisa estruturada. Não inferir automaticamente “satisfação do Creator” apenas por cliques, seguidores ou ausência de reclamação; declarar método, amostra e nível de confiança.

### 18.7. Governança de dados

Eventos têm finalidade, retenção, propriedade, tratamento de identificadores, consentimento quando aplicável e capacidade de exclusão/anonimização. Logs de segurança não devem virar ferramentas de marketing. Relatórios devem impedir consultas que permitam reidentificar audiências muito pequenas.

## 19. Creator Plus, preços, assinatura e entitlement

### 19.1. Planos

| Item | Free | Creator Plus |
|---|---|---|
| Perfil público e publicação básica | Sim | Sim |
| Busca e organização das recomendações | Sim | Sim |
| Métrica visível de cliques no link geral | Sim | Sim |
| Métricas avançadas de posts/coleções/busca | Não | Sim |
| Banners | Não | Sim, até 10 conforme regra de capacidade |
| Posts fixados | Não | Sim, até 6 simultâneos |
| Coleções Plus | — | Até 6, interpretação operacional pendente |
| Agendamento de posts | Sim, premissa de MVP | Sim |
| Agendamento de banners e fixações | Não se inexistentes no Free | Sim |
| Upload/download e conteúdos próprios | Conforme regras gerais | Conforme regras gerais |

**IMPORTANTE:** agendamento de posts é requisito geral de produto aprovado na conversa; eventual diferenciação comercial por plano não foi aprovada e não deve ser inventada. Para coleções pessoais do User não foi definida cota.

### 19.2. Preços aprovados

- Brasil: Creator Plus **R$ 89,90/mês** ou **R$ 899/ano**.
- Mercado em USD: **US$ 19/mês**.
- Mercado em EUR: **€ 19/mês**.
- Trial: **14 dias gratuitos**.
- Mensagem comercial anual: economia aproximada equivalente a **dois meses** em relação à mensalidade cheia, observadas as moedas e tabelas locais.
- Cancelamento: a qualquer momento, respeitando acesso até o final do período pago e regras do trial.

**PENDENTE:** anual USD/EUR; impostos e tratamento de tributos; pricing e documentação fiscal por país; política de cartão/métodos; resultados de testes de precificação e teto econômico de mídia/IA. Não converter automaticamente moedas por câmbio a cada tela.

### 19.3. Jornada de assinatura

Visitar benefícios > comparar planos e ciclos > ver tributos/preço final aplicável > entrar/registrar-se > iniciar trial ou checkout > confirmar status do provedor > atualizar entitlement > disponibilizar recursos Plus > permitir acesso à gestão, faturas, atualização de método, cancelamento e reativação. Billing deve confiar no backend/webhooks e não apenas no retorno de uma tela de sucesso.

### 19.4. Estados comerciais

Trial ativo; pagamento pendente; ativo; renovação em processamento; vencido/inadimplente; cancelamento programado; encerrado; reativado; estornado/chargeback. Cada estado deve definir o entitlement, comunicação, acesso a dados, recursos ativos e possibilidade de resolução. A regra de concessão de benefícios precisa ser consistente entre assinatura mensal e anual.

### 19.5. Efeito do downgrade

Não excluir posts, coleções, mídia nem analytics por downgrade. Ao terminar entitlement Plus: ocultar banners e fixações Plus na experiência pública, conservando suas configurações e métricas; esconder dashboard Plus sem apagar eventos; manter perfil e recomendações básicas. Reativação deve restaurar acesso aos dados e permitir recuperar recursos Plus sujeitos a regras de capacidade e validade das datas.

### 19.6. Reembolsos

Aplicar lei local, regras dos processadores e análise documentada de exceções. Não prometer reembolso irrestrito ou automático sem política aprovada. Reembolsos, disputas e chargebacks devem repercutir em faturamento, entitlement e comissões de parceiros quando cabível.

## 20. Programa de parceiros

### 20.1. Objetivo e regra comercial

Indicar novas assinaturas e acompanhar receita atribuída. **APROVADO:** comissão de **R$ 19,90 recorrentes por mês**, por assinatura-base originada por parceiro e que permaneça ativa e efetivamente paga. Comissões não incidem sobre adicionais; cessam quando a assinatura deixa de gerar pagamento válido. Para precificação, comissão é componente adicional a ser coberto após custo, impostos e margem-alvo, em vez de corroer margem pretendida.

### 20.2. Atribuição

**APROVADO:** modelo de **último clique** elegível. Cada link terá identificador de parceiro/campanha e eventos rastreáveis. **PENDENTE:** janela de atribuição, regras cross-device, perda de cookie, autocadastro, transferências de parceiro, reatribuição e precedência de cupons. Atribuição deve ser auditável e ter proteção contra alterações pós-pagamento oportunistas.

### 20.3. Cadastro e aprovação

Página de candidatura com dados pessoais/comerciais mínimos, aceitação de termos, verificações de integridade, análise administrativa, decisão e comunicação. Parceiro aprovado recebe link exclusivo, materiais, dashboard, histórico e canais de suporte. Suspensão deve interromper novos benefícios conforme termos, mantendo trilha de auditoria.

### 20.4. Portal do parceiro

Indicadores: cliques elegíveis, cadastros, trials, assinaturas pagas atribuídas, assinaturas ativas, comissões pendentes/liberadas/pagas/estornadas, extrato por período, status de pagamento e suporte. Não expor listas completas de dados pessoais dos assinantes; apresentar somente o mínimo contratual e legalmente permitido.

### 20.5. Payouts

Cálculo de comissões a partir de pagamentos confirmados, reconciliados com reembolsos/chargebacks; lançamento único/idempotente por período e assinatura; aprovação e lote de pagamento; registro de comprovante/nota quando aplicável; saldo e contestação. **PENDENTE:** ciclo, valor mínimo, requisitos fiscais, tratamento de pagamentos anuais e equivalência monetária fora do Brasil. Não afirmar que uma assinatura anual gera necessariamente 12 pagamentos mensais de comissão sem política aprovada.

### 20.6. Antifraude

Detecção de autoindicação, cliques automatizados, múltiplas identidades, tentativas de atribuição retrospectiva e fraude de pagamento. A suspensão/reversão de comissão exige trilha e canal de contestação. Informações bancárias e fiscais devem ter acesso restrito por papel.

## 21. Administração, moderação, suporte e operação

### 21.1. Painel administrativo — visão geral

O Admin será funcional no MVP, com permissões por função, dashboards operacionais e trilha de auditoria. Módulos: visão executiva; usuários/identidades; creators; posts/mídia; coleções; denúncias/moderação; categorias/tags; assinaturas/faturas; parceiros/atribuição/comissões; suporte; relatórios; falhas técnicas; configurações; i18n; parâmetros/feature flags; logs de mudanças críticas.

### 21.2. Gestão de usuários e creators

Pesquisar por identificador, username e indicadores administrativos legitimados; consultar perfil básico, estado de conta, data de criação, situação do plano, uso funcional, denúncias, alertas, histórico de suporte e atividade agregada. Ações: suspender, reativar, revisar conteúdo, ajustar classificação com justificativa, solicitar verificação, revogar tokens/sessões em incidente, aplicar exceção de plano por autorização específica. Proibir “entrar como usuário” com acesso irrestrito e sem trilha; impersonação de suporte exige mecanismo controlado ou não deve existir.

### 21.3. Saúde e satisfação dos creators

Dashboard interno pode exibir perfis com baixa ativação, ausência de posts, falhas recorrentes de upload, quedas de acessos, risco de churn, tickets abertos e feedback voluntário. Dados devem ter definição e qualidade; “satisfação” baseada em respostas de pesquisa não equivale a quantidade de visitas. O Admin não deve usar inferências sensíveis ou compartilhar relatórios individualizados com marcas no MVP.

### 21.4. Gestão de conteúdo e moderação

Fila de denúncias com motivo, evidência, prioridade, responsável e SLA; decisão auditável (manter, restringir, ocultar, remover, suspender, solicitar correção); recurso/contestação quando apropriado. Conteúdos com direitos autorais contestados, dados pessoais não consentidos, publicidade enganosa, spam, assédio ou risco a usuários devem ter políticas documentadas. Moderar mídias, textos, áudio, cupons, URLs externas, recomendações comunitárias e banners; não apenas posts principais.

### 21.5. Financeiro e assinaturas

Visualizar MRR/ARR por moeda, receita efetivamente recebida, trials, renovações, atrasos, chargebacks, reembolsos, comissões, divergências de webhook e estornos. Alterações de entitlement financeiro requerem permissão especial, justificativa e registro de antes/depois. Nenhum dashboard administrativo deve esconder divergências entre dados internos e processador de pagamento.

### 21.6. Operação de mídia e IA

Painel para falhas de ingestão, arquivos órfãos, processamento pendente, retries, custos e erros, de preferência sem acesso casual a arquivos privados. Disponibilizar ferramentas de suporte: reprocessar, invalidar cache, reindexar um post, reconciliar agendas e conferir integridade de mídia. Toda ação com possível efeito público exige confirmação e log.

### 21.7. Taxonomia e localização

Equipe autorizada poderá gerenciar categorias/subcategorias, aliases, traduções, termos inadequados e termos regionais; versionar alterações para não causar corrupção de classificação. A futura entidade canônica exige revisão humana de fusões de alto impacto, evitando juntar lugares/produtos homônimos.

### 21.8. RBAC e auditoria

Funções mínimas recomendadas: `support`, `moderator`, `finance`, `growth/partner_ops`, `analyst`, `admin`, `superadmin`. Cada função recebe apenas ações necessárias; consultar registros sensíveis e exportar dados deve exigir escopo explícito, com logging de operador, timestamp, entidade, ação, justificativa e outcome. A matriz definitiva de permissões será formalizada no Backend & Database.

## 22. Notificações, suporte e comunicação

### 22.1. Canais

E-mail transacional e centro de notificações no produto; push é **PENDENTE**. Mensagens de marketing dependem de preferências/consentimento e não podem ser confundidas com avisos essenciais de segurança ou cobrança. Todos os templates precisam suportar seis idiomas, fuso correto, links seguros e versão de conteúdo.

### 22.2. Gatilhos previstos

Cadastro/verificação; alteração de credenciais; criação/ativação Creator; postagem agendada; falha de publicação ou processamento; conteúdo expirado; recurso moderado; nova submissão comunitária; resultado de denúncia; início/fim de trial; pagamento confirmado/falhado; cancelamento; atualização de cartão; aprovação de parceiro; nova comissão liberada; payout processado; solicitação de dados pessoais.

### 22.3. Preferências

Definir notificação obrigatória versus opcional, frequência/agrupamento, canais e idioma. Um Creator não deve receber dezenas de e-mails redundantes por um lote de conteúdo agendado; agrupar mensagens quando apropriado. Entregas falhas precisam de retry e estado de falha interna.

### 22.4. Central de ajuda

Acesso consistente a FAQ, termos, privacidade, suporte, denúncias, billing e resolução de falhas. Registrar tickets, categoria, prioridade, status e vínculo a identidade, sem exigir exposição de conversas privadas ao suporte. Disponibilizar links contextuais em fluxos com maior risco de abandono (upload, pagamento, perda de sessão).

## 23. Internacionalização, regionalização e conteúdo multilíngue

### 23.1. Idiomas aprovados

**pt-BR, pt-PT, en, es, it e fr**. Toda experiência de lançamento deve suportar os seis: autenticação, perfil, dashboard, mensagens, validação, empty states, checkout sob controle da aplicação, e-mails e políticas de conteúdo. Não considerar seis idiomas concluídos apenas porque botões principais estão traduzidos.

### 23.2. Moedas

**BRL, USD, EUR** desde o lançamento. Moeda não é deduzida obrigatoriamente de idioma. Armazenar preços como valores e moeda com integridade; mostrar custos, impostos e ciclo da assinatura sem conversão implícita enganosa. País, moeda, idioma e fuso são dimensões distintas. Para EUR/USD, preço anual é **PENDENTE**.

### 23.3. Fuso, data e horário

Exibir datas no idioma/território e horário no fuso escolhido pelo Creator; armazenar instantes absolutos para agendamento e histórico, preservando referência do fuso no momento do agendamento. Informar claramente a diferença entre horário de criação, publicação, edição e expiração. Datas de promoções/cupons precisam de regras locais consistentes; “até dia 10 às 10h” não pode virar “até final do dia” por erro de formatação.

### 23.4. Conteúdo produzido por creators

Interface multilíngue não significa tradução automática compulsória de posts. Textos dos creators permanecem no idioma original a menos que versão traduzida seja criada/autorize geração futura. Busca semântica pode interpretar sinônimos multilíngues, mas textos exibidos não devem fingir tradução humana revisada. Administração deve conhecer idioma original e o de classificação.

### 23.5. SEO internacional

Metadados, idiomas, títulos, URLs canônicas, páginas institucionais e `hreflang` pertinentes, considerando o real estado de tradução. Evitar indexar conteúdos privados, expirados ou permissões somente por obscuridade de URL. O roadmap de busca global deverá evitar duplicação semântica entre idiomas.

## 24. Privacidade, segurança, direitos e confiança

### 24.1. Princípio do tratamento mínimo

Coletar somente dados necessários para a funcionalidade e analytics definidos, explicar finalidades, aplicar retenção proporcional e oferecer direitos do titular. Para IA, evitar enviar informação pessoal desnecessária em prompts ou logs; dados privados do FAVX Context ficam fora de respostas públicas e do futuro marketplace. Não criar perfis inferidos sensíveis a partir de histórico de busca.

### 24.2. Privacidade de buscas e localização

Consultas podem revelar assuntos íntimos ou sensíveis. No MVP, não expor histórico bruto de pesquisas a creators, parceiros ou marcas. Analytics de busca deve usar agregação e mascaramento; definir thresholds para resultados pouco frequentes. Localização precisa é opt-in contextual, com alternativa manual. Dados geográficos devem ter precisão reduzida onde possível e política de exclusão.

### 24.3. Conteúdo e mídia

Uploads exigem verificações de tipo/tamanho, proteção contra arquivos maliciosos, regras de exibição e reporte; arquivos não públicos devem ficar protegidos de acesso direto. O Creator é responsável por conteúdo que envia e por autorizações de pessoas retratadas; a FAVX deve manter processo de denúncia e resposta proporcionais. Imagens de pessoas e arquivos de áudio não devem ser usados para identificar indivíduos sem base legal e finalidade aprovada.

### 24.4. Patrocínio e confiança

Distinguir recomendação pessoal, publicidade, cupom/desconto e recomendação comunitária. Uma nota numérica não converte opinião em verificação. Links afiliados e relações materiais devem ser transparentes segundo regras aplicáveis. Conteúdo de terceiros e informações comerciais precisam de documentação editorial, não de alegações de certificação inexistente.

### 24.5. Direitos dos titulares

Prever solicitações de acesso, correção, portabilidade quando aplicável, eliminação, oposição e revisão de tratamentos, com autenticação e registro. Proteger dados de faturamento sujeitos à guarda obrigatória; separar registros financeiros mínimos de conteúdo operacional eliminável. Políticas de retenção e bases legais precisam de revisão formal para os mercados de lançamento.

### 24.6. Menores de idade

**PENDENTE de decisão e revisão jurídica:** idade mínima de uso, tratamento de dados de adolescentes/crianças, responsável legal e regras de participação de menores em conteúdo. Até aprovação, o projeto deve **não** presumir autorização irrestrita para coletar e perfilar dados de menores.

### 24.7. Bases de referência

O produto deverá alinhar governança e privacidade à LGPD no Brasil e avaliar requisitos europeus de proteção de dados e regras regionais de consumo antes da expansão. Acessibilidade terá WCAG 2.2 nível AA como referência de produto. Referências oficiais e verificação legal constam no anexo; este PRD não substitui assessoria jurídica.

## 25. Experiência, acessibilidade, UI e conteúdo de interface

### 25.1. Direção visual aprovada

Visual-first, editoral premium, minimalismo sofisticado, imagens predominantes, branco/preto como base neutra conforme sistema de temas, cards arredondados, blur e glassmorphism de modo seletivo, microinterações discretas e atenção especial aos detalhes mobile. **Manrope** para navegação/texto funcional, **Instrument Serif** para títulos editoriais pontuais. Não saturar com gradientes, sombras pesadas, transparência que prejudique contraste ou tipografia ornamental em formulários.

### 25.2. Experiência responsiva

Mobile-first sem sacrificar produtividade em desktop: perfil público adaptável; editor acessível por celular e computador; upload e câmera em dispositivos suportados; dashboard legível; formulários de agendamento com fuso visível; tabelas de analytics com alternativa acessível. Menus e controles devem ter targets confortáveis, sem exigir hover.

### 25.3. Acessibilidade

Meta **WCAG 2.2 AA**, incluindo contraste, foco visível, navegação por teclado, labels/erros, alvos de toque apropriados, suporte a leitores de tela, redução de movimento, alternativa textual para mídia, captions/transcrições quando necessárias e fluxos de autenticação acessíveis. Para gráficos, disponibilizar resumo e dados tabulares. Blurs/transparências não podem comprometer legibilidade.

### 25.4. Microcopy por ação

- “Agendar publicação”: exibir fuso e confirmação da data.
- “Encerrar exibição”: explicar que não apaga conteúdo ou métricas.
- “Desfixar”: explicar que o post permanece publicado.
- “Excluir”: explicar disponibilidade de restauração e efeitos sobre links.
- “Baixar original”: informar arquivo, formato/tamanho e natureza do download.
- “Salvar”: indicar necessidade de conta e retornar ao contexto.
- “Recomendação da comunidade”: identificar origem sem sugerir autoria do Creator.
- “Pesquisa sem resultado”: oferecer refinamento sem alegar inexistência global.
- “Trial”: exibir período, condições de cobrança e data prevista de mudança quando aplicável.

### 25.5. Componentes que precisarão ser detalhados no Design System

App shell e navegação; card de recomendação; card de coleção; mídia com carrossel; componente de áudio; botões de salvar/compartilhar/copiar; badge de publicidade; avaliação 0–10; search bar com entrada por voz; chat/search refinement; filtros e chips; date/time picker; seletor de fuso; calendário de conteúdos; editor de post; crop/reorder de mídia; upload progress; banner preview; estados de agendamento; dashboards e gráficos; tabelas responsivas; diálogos destrutivos; toasts/alerts; onboarding; billing; partner portal; admin; assinatura `by FAVX`.

## 26. Publicação, SEO, compartilhamento e crescimento orgânico

### 26.1. Objetivo de distribuição

Cada creator deve ter motivo prático para divulgar sua página: organizar links e cupons, responder perguntas recorrentes, mostrar recomendações e permitir busca eficiente. Cada coleção/post público deve ser compartilhável de modo claro, com visual consistente e sem impor cadastro ao destinatário.

### 26.2. Share e exportação

Recurso de copiar link, share sheet quando disponível, prévia Open Graph e exportação de arte/preview para publicar em redes sociais. Compartilhar com Instagram não significa publicar automaticamente por API. Ao exportar conteúdo próprio, respeitar direitos de uso e manter branding do FAVX quando definido pelo fluxo; não inserir marcas d'água irreversíveis no arquivo original do Creator.

### 26.3. Growth loops de produto

Visitante acessa recomendação > reconhece utilidade > segue link/compartilha > descobre FAVX por identificação sutil > cria conta para salvar > organiza coleção > eventualmente ativa Creator. O sistema deverá medir essas transições sem se apoiar em contagens públicas. Estratégia de aquisição por parceiros e indicação de criadores deve respeitar regras de consentimento e atribuição.

### 26.4. Indexação e remoção

Perfis, posts e coleções públicas elegíveis poderão receber SEO técnico; conteúdos privados, em rascunho, expirados, ocultos, moderados ou excluídos devem não ser servidos como públicos. Indexação de mecanismos externos não é remoção instantânea da web; fornecer respostas adequadas e indicar que caches de terceiros podem levar tempo a atualizar.

## 27. Roadmap futuro: Events, Proof e FAVX for Brands

### 27.1. FAVX Events — FUTURO

Espaço para compartilhamento colaborativo de momentos e mídias de eventos, com convites e identidade visual personalizada, QR/link e recursos para participantes. Regras anteriores de mídia e planos constituem insumo histórico, mas **não** são escopo de build do MVP Creators. A arquitetura de identidade e mídia poderá ser reutilizada sem criar tabelas/telas de Events antes de priorização.

### 27.2. FAVX Proof — FUTURO

Experiências reais e provas sociais associadas a profissionais/empresas, com autorização específica de envio, publicação e eventual uso publicitário; perfis comerciais e acessos em equipe. Exige governança própria de consentimento, direitos, moderação e limites comerciais, não deve ser confundido com recomendações pessoais do Creator.

### 27.3. FAVX for Brands — FUTURO

Marketplace opcional para matching de marcas e creators. O Creator adere voluntariamente e, na direção acordada, manifesta interesse na marca **antes de liberar dados comerciais específicos**. Marcas recebem somente métricas agregadas autorizadas, não histórico individual de pesquisa, listas de pessoas que salvaram, localização precisa, contextos privados ou dados identificáveis da audiência.

### 27.4. Dados preparatórios no MVP

Eventos categorizados, relações de recomendação/entidade, métricas agregáveis, origem de tráfego, definição de audiência, consentimento e trilhas de autorização, sem disponibilizar portal de marcas ou API de consulta comercial. Não criar autorização comercial abrangente pré-marcada. No futuro: cadastro de empresas, preferências comerciais, consentimentos por escopo, matches, acesso temporário, trilhas de acesso, campanhas e negociação.

### 27.5. Princípio do matching futuro

Compatibilidade temática, regional, de audiência agregada e histórico real de interesse; não simplesmente seguidores. Evitar equivaler busca/salvamento a intenção certa de compra. Métricas com amostra pequena não devem ser compartilhadas em granularidade que possibilite reidentificação. Revogar consentimento precisa interromper novos acessos; compartilhamentos já feitos podem exigir política contratual e tratamento jurídico específico.

## 28. Requisitos não funcionais de produto (para desdobramento no TRD)

| Dimensão | Requisito de produto | Validação |
|---|---|---|
| Disponibilidade | páginas públicas e editor devem ter resiliência a falhas parciais | SLO numérico a validar no TRD |
| Desempenho | acesso inicial rápido em rede móvel, carregamento progressivo de imagens | orçamentos web a definir |
| Acessibilidade | WCAG 2.2 AA como alvo | auditorias automática + manual |
| Segurança | autorização servidor + RLS + proteção de mídia privada | testes negativos de acesso |
| Privacidade | analytics privada e anonimização apropriada | revisão e testes de vazamento |
| Processamento de mídia | upload direto, variantes e status consistentes | testes por tipo/tamanho/falha |
| Agendamento | visibilidade obedecendo relógio mesmo com atraso de jobs | testes de fronteira temporal |
| Escalabilidade | suportar aumento de dados/creators sem mudar produto fundamental | teste de carga e custos |
| Confiabilidade de billing | entitlements por fonte de verdade, webhooks idempotentes | replay e falha de webhook |
| Custos | telemetria por operação de IA/mídia/busca | relatório operacional |
| I18n | 6 idiomas + 3 moedas com dados independentes | QA por locale |
| Observabilidade | logs, métricas, tracing e alertas sem vazar conteúdo privado | teste operacional |
| Integridade | não perder posts/métricas durante downgrade, edição ou expiração | testes de persistência |
| Backup/recuperação | plano de recuperação de banco e mídia | ensaio de restauração |
| SEO | rotas canônicas e remoção de conteúdo não público | crawler e smoke test |

**RECOMENDAÇÃO para planejamento, não promessa:** investigar alvo de LCP móvel no percentil 75 de até 2,5 s para páginas-chave e definir metas de disponibilidade/latência com medição real. SLOs devem ser homologados após protótipo técnico, mix de mídia e orçamento.

## 29. Catálogo normativo de requisitos funcionais e critérios de aceite

As regras abaixo são a referência funcional rastreável do produto. **P0** = necessário para lançamento; **P1** = desejável na primeira evolução, mas não impede o lançamento salvo dependência; **FUT** = fora do MVP. Caso algum P0 exija custo ou tecnologia ainda não validada, registrar risco e decisão de release; não marcar como concluído apenas por existir uma interface.

### 29.1. Identidade e papéis

- **FAVX-ID-001 · P0 · Conta única:** a pessoa mantém uma identidade User e pode ativar Creator sem recriar salvos, sessão ou preferências. **Aceite:** ativar Creator e retornar ao espaço User preserva todos os registros.
- **FAVX-ID-002 · P0 · Visita anônima:** abrir perfil/post/coleção pública não obriga login. **Aceite:** usuário sem cookies de sessão consegue consultar conteúdo público e pesquisa local.
- **FAVX-ID-003 · P0 · Salvar com retorno:** ao tentar salvar sem sessão, autenticação preserva post e ação. **Aceite:** após login bem-sucedido o post é salvo uma única vez.
- **FAVX-ID-004 · P0 · Username único:** usernames conflituosos, reservados ou inválidos são rejeitados. **Aceite:** concorrência de criação não produz duplicação; erro é compreensível.
- **FAVX-ID-005 · P0 · Preferências:** usuário altera idioma, região e fuso independentemente. **Aceite:** alterar idioma não troca moeda nem horário programado.
- **FAVX-ID-006 · P0 · Sessões:** autenticação, logout, recuperação de acesso e expiração se comportam com segurança. **Aceite:** sessão revogada não acessa dados privados por URL antiga.
- **FAVX-ID-007 · P0 · Exclusão da conta:** usuário solicita encerramento e recebe informações de consequências e retenção. **Aceite:** solicitações geram trilha, sem eliminação ilegal de obrigações financeiras.
- **FAVX-ID-008 · P0 · Autorização:** nenhuma chamada privada depende apenas de esconder botão. **Aceite:** requisições anônimas ou de outro usuário são negadas no servidor e RLS.

### 29.2. Perfil, links e identidade Creator

- **FAVX-PRO-001 · P0 · Página Creator:** exibe foto/nome/bio, posts, coleções, busca, links e branding discreto. **Aceite:** dados ausentes não geram blocos quebrados.
- **FAVX-PRO-002 · P0 · URL pública:** links profundos mantêm rota canônica e recursos de compartilhamento. **Aceite:** abrir por URL direta carrega sem entrar pelo perfil.
- **FAVX-PRO-003 · P0 · Sem métricas públicas:** nenhum número de seguidores, views, saves, cliques ou impressões consta no HTML/JSON público. **Aceite:** inspeção de resposta e DOM não revela esses campos.
- **FAVX-PRO-004 · P0 · Listas privadas:** somente titular consulta próprios seguidores e seguindo. **Aceite:** outro usuário não consegue enumerar relações por paginação/API.
- **FAVX-PRO-005 · P0 · Links externos:** CTA abre destino seguro, com tracking proporcional e falha tratável. **Aceite:** URLs inválidas são recusadas; links corretos abrem o destino esperado.
- **FAVX-PRO-006 · P0 · by FAVX:** páginas públicas possuem marca sutil com origem mensurável. **Aceite:** link institucional não cobre mídia nem prejudica navegação por teclado.
- **FAVX-PRO-007 · P0 · Preview compartilhável:** páginas públicas elegíveis possuem metadados e imagem adequados. **Aceite:** preview não exibe conteúdo privado/oculto.

### 29.3. Editor e publicações

- **FAVX-POST-001 · P0 · Rascunho:** é possível criar e voltar sem publicar. **Aceite:** draft não aparece publicamente nem em buscas anônimas.
- **FAVX-POST-002 · P0 · Título/descrição:** validar campos, aplicar limite de texto de 10.000 caracteres e feedback de limite. **Aceite:** backend rejeita excedente inclusive por chamada direta.
- **FAVX-POST-003 · P0 · Multimídia:** fotos/vídeos/áudio e carrossel possuem ordem e preview. **Aceite:** reordenar não perde legenda nem vínculo ao arquivo correto.
- **FAVX-POST-004 · P0 · Múltiplos links:** Creator inclui, remove, ordena e rotula URLs distintas. **Aceite:** analytics separa cliques por link e post.
- **FAVX-POST-005 · P0 · Cupons:** suportar cupom, validade, condições e sinalizador de desconto. **Aceite:** cupom vencido não é tratado como oferta garantida atual.
- **FAVX-POST-006 · P0 · Categorias/tags:** IA sugere, Creator valida e pode editar manualmente. **Aceite:** postagem não publica sugestões ainda em revisão como endosso automático.
- **FAVX-POST-007 · P0 · Patrocínio:** declarar relação material e exibir identificação adequada. **Aceite:** rótulo permanece legível em card e detalhe quando aplicável.
- **FAVX-POST-008 · P0 · Nota pessoal:** Creator atribui nota opcional de 0–10, com incrementos de 0,5. **Aceite:** nota é tratada como avaliação do Creator, não média comunitária.
- **FAVX-POST-009 · P0 · Edição pós-publicação:** alterar post preserva URL, identificador e métricas. **Aceite:** série histórica anterior ainda é consultável.
- **FAVX-POST-010 · P0 · Duplicação:** copiar post cria novo identificador sem copiar métricas ou interações. **Aceite:** posts original e duplicado evoluem independentemente.
- **FAVX-POST-011 · P0 · Conteúdo próprio:** proprietário consulta mídias mesmo quando post está oculto/arquivado, sujeito às regras de exclusão. **Aceite:** vínculo proprietário-mídia é validado no servidor.
- **FAVX-POST-012 · P0 · Indisponibilidade:** remover ou expirar post não vaza dados em preview, cache ou coleção. **Aceite:** URL pública retorna estado apropriado e busca exclui o conteúdo.

### 29.4. Captura, upload e download

- **FAVX-MED-001 · P0 · Câmera:** em dispositivo compatível, capturar foto/vídeo mediante permissão explícita. **Aceite:** negar permissão oferece alternativa de upload.
- **FAVX-MED-002 · P0 · Microfone:** gravar áudio próprio, reproduzir, descartar, regravar. **Aceite:** câmera/microfone param ao cancelar/sair conforme plataforma.
- **FAVX-MED-003 · P0 · Upload validado:** foto até 20 MB; vídeo 250 MB/10 min; áudio 20 MB/10 min. **Aceite:** validar tamanho, extensão/MIME real e duração nos tipos relevantes.
- **FAVX-MED-004 · P0 · Original preservado:** otimização produz derivado identificado sem substituir silenciosamente o original. **Aceite:** hash/tamanho da versão original consultada permanece consistente.
- **FAVX-MED-005 · P0 · Download próprio:** autenticar ownership e emitir download de original/derivado elegível. **Aceite:** tentativa de baixar arquivo alheio retorna acesso negado.
- **FAVX-MED-006 · P0 · Sem download público padrão:** botão de download de mídia alheia não existe e URL privada é inacessível. **Aceite:** não basta remover botão; requisição direta falha.
- **FAVX-MED-007 · P0 · Falha de processamento:** mostrar status e retry/ação apropriada. **Aceite:** mídia com falha não é tratada como publicação íntegra.
- **FAVX-MED-008 · P0 · Resiliência de upload:** interrupção de rede não duplica registros nem declara sucesso indevido. **Aceite:** retry seguro mantém estado consistente e mensagem acionável.
- **FAVX-MED-009 · P0 · Exif público:** variantes de imagem não vazam metadados de localização por padrão. **Aceite:** inspeção das versões de entrega não encontra coordenadas sensíveis.
- **FAVX-MED-010 · P0 · Transcrição:** áudio pode gerar texto editável e publicar como áudio, texto ou ambos. **Aceite:** Creator pode revisar/corrigir antes de tornar o texto público.

### 29.5. Agendamento, expiração e histórico

- **FAVX-LIFE-001 · P0 · Publicação futura:** Creator define início e vê confirmação com fuso. **Aceite:** antes do instante não aparece em nenhuma superfície pública; depois aparece se elegível.
- **FAVX-LIFE-002 · P0 · Encerramento futuro:** Creator define `visible_until`. **Aceite:** a partir do instante final o conteúdo não é retornado publicamente, mesmo com job atrasado.
- **FAVX-LIFE-003 · P0 · Horários inválidos:** fim anterior/igual ao início é bloqueado. **Aceite:** feedback específico e nenhuma agenda inválida é salva.
- **FAVX-LIFE-004 · P0 · Timezone:** instante absoluto preserva intenção e mostra fuso. **Aceite:** alteração de idioma não antecipa/atrasa agendamento.
- **FAVX-LIFE-005 · P0 · Ocultação manual:** retirar imediatamente da experiência pública sem excluir registro. **Aceite:** histórico analítico continua consultável pelo titular autorizado.
- **FAVX-LIFE-006 · P0 · Arquivamento:** conteúdo é retirado da navegação e permanece gerenciável. **Aceite:** URL pública respeita estado privado e owner vê entrada arquivada.
- **FAVX-LIFE-007 · P0 · Exclusão protegida:** confirmação, indisponibilidade pública, trilha e política de restauração. **Aceite:** restaurar dentro da janela retoma estado consistente, se permitido.
- **FAVX-LIFE-008 · P0 · Métricas preservadas:** edição/expiração/ocultação não zera histórico. **Aceite:** dados antes/depois continuam conciliáveis.
- **FAVX-LIFE-009 · P0 · Reconciliação:** falhas de scheduler são reparadas sem expor conteúdo expirado. **Aceite:** testes com fila parada e relógio avançado não expõem registros expirados.
- **FAVX-LIFE-010 · P0 · Links antigos:** conteúdo indisponível responde sem vazamento e sem quebrar sessão. **Aceite:** visitante vê estado apropriado e não payload antigo.

### 29.6. Banners, fixados e capacidade de Plus

- **FAVX-PLUS-001 · P0 · Banner CRUD:** criar/editar/ocultar/programar/encerrar banner. **Aceite:** banner só aparece dentro de janela válida e entitlement ativo.
- **FAVX-PLUS-002 · P0 · Banner analytics:** impressões e cliques são agregados por peça e período. **Aceite:** encerramento não apaga série histórica.
- **FAVX-PLUS-003 · P0 · Fixação independente:** agendar fixação sem alterar ciclo do post. **Aceite:** ao desfixar, post permanece em sua posição normal se publicado.
- **FAVX-PLUS-004 · P0 · Limite de fixações:** máximo de 6 fixados simultâneos, inclusive agendas sobrepostas. **Aceite:** sétima sobreposição é recusada com explicação.
- **FAVX-PLUS-005 · P0 · Capacidade de banner:** até 10 conforme política de contagem validada. **Aceite:** backend impede extrapolar limite quando configuração final for aprovada.
- **FAVX-PLUS-006 · P0 · Downgrade:** banners/fixados deixam de aparecer ao fim do benefício, sem eliminação de configuração/métricas. **Aceite:** reativação recupera dados existentes.
- **FAVX-PLUS-007 · P0 · Patrocínio transparente:** peças pagas recebem identificação apropriada. **Aceite:** disclosures não desaparecem em previews ou cards pequenos.

### 29.7. Coleções, salvos e comunidade

- **FAVX-COL-001 · P0 · Coleções Creator:** criar/editar/reordenar/retirar itens mantendo integridade. **Aceite:** um post em duas coleções não duplica sua fonte.
- **FAVX-COL-002 · P0 · Coleções User:** salvar recomendações de múltiplos creators em coleção privada. **Aceite:** ninguém mais visualiza por adivinhação de ID.
- **FAVX-COL-003 · P0 · Compartilhamento:** User pode disponibilizar coleção via configuração explícita e link. **Aceite:** preview não mostra salvos privados fora da coleção autorizada.
- **FAVX-COL-004 · P0 · Salvo idempotente:** salvar duas vezes não duplica vínculo. **Aceite:** um clique repetido equivale a um único estado salvo.
- **FAVX-COL-005 · P0 · Post indisponível:** referência salva passa a estado indisponível sem expor original. **Aceite:** User mantém organização com opção de remover.
- **FAVX-COM-001 · P0 · Pedido deliberado:** Creator ativa solicitação dedicada de sugestões comunitárias. **Aceite:** nenhum formulário genérico é exposto por padrão em todo perfil.
- **FAVX-COM-002 · P0 · Submissão privada:** remetente envia conteúdo; só Creator autorizado e moderação legítima acessam. **Aceite:** outras pessoas não listam nem encontram submissões.
- **FAVX-COM-003 · P0 · Publicação seletiva:** Creator revisa e publica com atribuição de origem. **Aceite:** público identifica “comunidade/seguidor”, não “minha indicação” automática.
- **FAVX-COM-004 · P0 · Moderação:** denúncias e conteúdos impróprios são tratáveis. **Aceite:** conteúdo bloqueado não permanece em cache público.

### 29.8. Busca e inteligência

- **FAVX-SRCH-001 · P0 · Busca local:** busca do perfil só retorna posts visíveis daquele Creator. **Aceite:** postagem alheia ou expirada nunca aparece como resultado local.
- **FAVX-SRCH-002 · P0 · Busca pessoal:** usuário busca em seus salvos sem expor resultados a outros. **Aceite:** sessão de terceiros não consulta biblioteca privada.
- **FAVX-SRCH-003 · P0 · Filtros:** categoria, data e atributos aplicáveis refinam resultados. **Aceite:** alteração de filtro refaz consulta mantendo escopo.
- **FAVX-SRCH-004 · P0 · Semântica:** IA transforma descrição livre em filtros/consulta, sem inventar resultados. **Aceite:** cards sempre têm post público real como fonte.
- **FAVX-SRCH-005 · P0 · Refinamento:** mensagens sucessivas mantêm contexto da busca até limpar. **Aceite:** segunda pergunta restringe primeira no mesmo escopo.
- **FAVX-SRCH-006 · P0 · Voz:** transcrição editável para consulta. **Aceite:** permissão negada abre caminho de digitação.
- **FAVX-SRCH-007 · P0 · Geografia:** busca contextual por bairro/cidade/localização opcional. **Aceite:** negativa de geolocalização não impede busca manual.
- **FAVX-SRCH-008 · P0 · Privacidade de contexto:** FAVX Context pode apoiar recuperação mas nunca aparecer em resultado ou resposta. **Aceite:** testes com strings-canário privadas não as revelam.
- **FAVX-SRCH-009 · P0 · Estados vazios:** sem resultados oferece refinamento e comunica escopo. **Aceite:** não informa “não existe na FAVX” quando só buscou num Creator.
- **FAVX-SRCH-010 · P0 · Custo/abuso:** limites técnicos e fallback mantêm serviço seguro. **Aceite:** abuso automatizado não gera custos indefinidos; usuário legítimo recebe erro claro.
- **FAVX-SRCH-011 · P0 · Entidades:** posts elegíveis podem ser relacionados a entidades canônicas de modo auditável. **Aceite:** identificadores permitem várias recomendações sobre o mesmo item sem fundi-las.
- **FAVX-SRCH-012 · FUT · Busca global:** abrir pesquisa cross-creator somente após liberação de feature flag e critérios de qualidade. **Aceite futuro:** autorias e atribuições preservadas e controles de spam/moderação ativos.

### 29.9. Analytics e privacidade

- **FAVX-ANA-001 · P0 · Instrumentação Free:** eventos relevantes são registrados no Free desde o início. **Aceite:** upgrade exibe histórico preexistente permitido.
- **FAVX-ANA-002 · P0 · Métrica Free:** dashboard Free exibe somente cliques no link geral do perfil. **Aceite:** endpoints do Free não revelam indicadores Plus.
- **FAVX-ANA-003 · P0 · Dashboard Plus:** métricas por post, coleção, busca e banner com períodos. **Aceite:** a mesma regra de deduplicação é aplicada em períodos comparáveis.
- **FAVX-ANA-004 · P0 · Dados não públicos:** vistas e cliques não constam de payloads públicos. **Aceite:** auditoria de API confirma zero campos analíticos privados.
- **FAVX-ANA-005 · P0 · Desempenho consistente:** edição/expiração/downgrade preservam métricas coletadas. **Aceite:** consulta histórica após reativação mantém série coerente.
- **FAVX-ANA-006 · P0 · Busca agregada:** não revelar consultas individuais identificáveis ao Creator. **Aceite:** grupos abaixo do limiar definido são suprimidos/generalizados.
- **FAVX-ANA-007 · P0 · Definições:** interfaces explicam impressão, clique, visualização e outros indicadores. **Aceite:** mesmo indicador tem definição uniforme em post, banner e dashboard.

### 29.10. Billing, parceiros e admin

- **FAVX-BIL-001 · P0 · Preços:** BRL 89,90/mês, BRL 899/ano, USD 19/mês e EUR 19/mês exibidos conforme opção/país. **Aceite:** sem conversão dinâmica silenciosa.
- **FAVX-BIL-002 · P0 · Trial:** 14 dias com condições claramente apresentadas. **Aceite:** data de início/fim e gatilhos de cobrança não são ambíguos.
- **FAVX-BIL-003 · P0 · Webhook:** acesso Plus só acompanha evento financeiro validado. **Aceite:** replay de webhook não duplica assinatura nem altera entitlement indevidamente.
- **FAVX-BIL-004 · P0 · Cancelamento:** cancelamento possível e recursos permanecem até fim do período pago. **Aceite:** timeline de entitlement corresponde ao billing.
- **FAVX-BIL-005 · P0 · Downgrade:** dados históricos preservados, features Plus ocultadas. **Aceite:** reupgrade desbloqueia dashboards antigos sem reset.
- **FAVX-PAR-001 · P0 · Parceiro:** candidatura, aprovação, link e dashboard próprios. **Aceite:** usuário não aprovado não se atribui comissão.
- **FAVX-PAR-002 · P0 · Último clique:** atribuição seleciona último clique elegível na janela aprovada. **Aceite:** auditoria permite reconstruir decisão.
- **FAVX-PAR-003 · P0 · Comissão:** R$19,90 por mês de assinatura-base ativa e paga, sem adicionais. **Aceite:** inadimplência/cancelamento suspendem novos lançamentos.
- **FAVX-PAR-004 · P0 · Estorno:** reembolso/chargeback ajusta comissões conforme política. **Aceite:** balanço não paga duas vezes e expõe motivo de ajuste.
- **FAVX-ADM-001 · P0 · RBAC:** suporte/moderação/financeiro possuem permissões separadas. **Aceite:** ações administrativas negadas por função geram log de tentativa.
- **FAVX-ADM-002 · P0 · Auditoria:** mudanças sensíveis registram operador, entidade, antes/depois e motivo. **Aceite:** revisão de incidente reconstrói sequência temporal.
- **FAVX-ADM-003 · P0 · Moderação:** denúncias podem resultar em ação reversível quando cabível. **Aceite:** conteúdo suspenso deixa todas as superfícies públicas.
- **FAVX-ADM-004 · P0 · Monitoramento:** admin consulta falhas de upload, processamento, agendamento e cobrança. **Aceite:** existe painel/alerta acionável para falha recorrente.

### 29.11. I18n, acessibilidade e futuro

- **FAVX-I18N-001 · P0 · Seis idiomas:** fluxo principal possui pt-BR, pt-PT, en, es, it e fr. **Aceite:** QA percorre cadastro, perfil, post, busca, billing e admin com localidade selecionada.
- **FAVX-I18N-002 · P0 · Três moedas:** BRL/USD/EUR são tratadas independentemente de língua. **Aceite:** pt-PT pode exibir EUR e en pode exibir BRL conforme contexto.
- **FAVX-I18N-003 · P0 · Datas:** fuso e formatação coerentes em agendamento/expiração. **Aceite:** testes em fusos diferentes preservam o instante.
- **FAVX-UX-001 · P0 · Acessibilidade:** fluxos essenciais obedecem a padrões WCAG 2.2 AA. **Aceite:** QA automatizado e navegação manual por teclado/leitor de tela.
- **FAVX-UX-002 · P0 · Responsividade:** páginas essenciais funcionam em telas pequenas e desktop. **Aceite:** não há ação crítica inacessível por viewport.
- **FAVX-UX-003 · P0 · Estados de interface:** loading, empty, success, error e offline têm feedback. **Aceite:** falha não deixa botão girando indefinidamente.
- **FAVX-FUT-001 · FUT · Marcas:** compartilhamento comercial exige opt-in e autorização específica do Creator. **Aceite futuro:** marca sem consentimento não acessa relatórios de audiência.
- **FAVX-FUT-002 · FUT · Dados agregados:** nunca expor histórico individual de busca/salvo nem FAVX Context. **Aceite futuro:** relatório só mostra agregações com limiares de privacidade.
- **FAVX-FUT-003 · FUT · Events/Proof:** não aparecem como áreas funcionais do MVP. **Aceite:** navegação de lançamento só tem módulos de escopo real.

## 30. Jornadas ponta a ponta e contratos comportamentais

### 30.1. Jornada J-01 — visitante encontra recomendação

**Pré-condições:** Creator tem post público dentro da janela de visibilidade. **Disparo:** visitante abre link de bio do Creator. **Caminho ideal:** página pública > busca por termo/categoria > resultados visuais > abre post > consulta detalhes, avaliação pessoal, links/cupons > copia código ou abre site externo. **Resultado:** tarefa resolvida sem login. **Instrumentação:** origem, busca agregada, post open, link click, evento `by FAVX` se acionado. **Falhas:** post expirado durante navegação; link externo quebrado; busca vazia; rede lenta. **Proteção:** sem mostrar views/saves/followers em página ou API pública.

### 30.2. Jornada J-02 — visitante salva após autenticar

**Pré-condições:** post público. **Disparo:** toque em “Salvar”. **Caminho:** prompt de autenticação contextual > login/criação de conta > retornar ao mesmo post > salvar > escolher coleção existente ou criar nova > confirmação. **Exceções:** link expirou enquanto usuário se cadastrava (apresentar indisponibilidade); duplicidade de salvamento (confirmar estado salvo); sessão interrompida (permitir retomar). **Aceite:** nenhum perfil adicional criado inadvertidamente, e estado salvo pertence à identidade autenticada.

### 30.3. Jornada J-03 — usuário ativa Creator

**Disparo:** User deseja publicar recomendações próprias. **Caminho:** opção de ativação > username e apresentação > validação/preview > perfil Creator publicado > criar primeira recomendação > compartilhar URL. **Invariantes:** salvos, coleções e preferências anteriores permanecem; papel User continua disponível; métricas públicas não surgem na ativação.

### 30.4. Jornada J-04 — Creator registra recomendação gravando no FAVX

**Disparo:** Creator está em um lugar e deseja recomendar experiência em tempo real. **Caminho:** novo post > câmera/microfone > permissão > capturar foto/vídeo ou áudio > revisar > complementar texto > links/categoria/nota/contexto privado > salvar rascunho ou publicar/agendar > processamento e exibição > baixar original posteriormente. **Exceções:** câmera indisponível (upload), upload interrompido (retomar/repetir), transcrição incorreta (corrigir), limite de duração (interromper com mensagem), arquivo ainda processando (bloquear promessa de mídia pronta). **Aceite:** o original do Creator permanece separado da variante de entrega e o público não pode baixá-lo por URL privada.

### 30.5. Jornada J-05 — post agendado com encerramento

**Disparo:** Creator quer promoção temporária. **Caminho:** concluir conteúdo > ativar “Agendar” > selecionar início e fim com fuso > confirmar > ver em “Agendados” > editar antes da data > publicação automática > encerramento automático > ver em “Encerrados” com métricas. **Exceções:** fim anterior ao início; horário de verão; post moderado; conteúdo não processado; calendário de outro fuso; scheduler indisponível. **Aceite:** visibilidade deve ser válida pela data real, independentemente de reconciliação assíncrona.

### 30.6. Jornada J-06 — campanha com banner e post fixado

**Pré-condição:** Creator Plus ativo. **Caminho:** configurar banner e CTA > definir período > configurar fixação de post com período independente > visualizar prévia/agenda > publicar > monitorar métricas > encerrar apenas fixação e banner > manter post publicado se elegível. **Exceções:** capacidade de slots, post que vai expirar antes da fixação, downgrade no meio de campanha, CTA inválido, moderação. **Aceite:** banner e fixação encerrados não aparecem, e o post mantém seu próprio ciclo de vida.

### 30.7. Jornada J-07 — Creator recebe recomendação comunitária

**Disparo:** Creator pergunta “quais livros vocês indicam?”. **Caminho:** cria solicitação específica > compartilha link > seguidor envia uma indicação privada > Creator recebe notificação/painel > valida autoria, qualidade, links e direitos > publica com rótulo comunitário ou descarta. **Exceções:** envio anônimo abusivo; solicitação fechada; postagem com foto de terceiro não autorizada. **Aceite:** indicação não surge automaticamente no feed como opinião do Creator.

### 30.8. Jornada J-08 — busca conversacional contextual

**Disparo:** visitante digita “quero um restaurante com espaço kids perto do Flamengo”. **Caminho:** interpreta intenção > aplica escopo do Creator + atributos + localização > retorna cards reais > visitante refina “com comida brasileira” > resultados atualizados > abre post. **Exceções:** Creator não recomendou restaurantes desse tipo (informar nenhum resultado no perfil); localização ambígua (solicitar bairro/cidade); atributo só no contexto privado (não afirmar atributo em resposta); IA indisponível (busca textual). **Aceite:** nenhuma recomendação de fora do escopo surge como recomendação daquele Creator.

### 30.9. Jornada J-09 — upgrade, trial, downgrade

**Disparo:** Creator Free quer métricas avançadas. **Caminho:** benefícios > escolher plano/moeda > informar condições do trial de 14 dias > ativar elegibilidade financeira > Plus disponível > consultar métricas antigas > criar banner e fixações > cancelar > benefícios até fim do período > fim de entitlement > recursos Plus ocultos > reativar > histórico preservado. **Exceções:** falha de pagamento, chargeback, atraso de webhook, mudança de moeda, trial usado anteriormente. **Aceite:** não perde posts nem métricas com downgrade, e o público nunca vê dados privados.

### 30.10. Jornada J-10 — parceiro acompanha comissão

**Caminho:** inscrição > aprovação > gera link > compartilha > prospect acessa > trial/cadastro > pagamento confirmado > comissão mensal elegível criada > disponibilização de saldo > solicitação/pagamento conforme política. **Exceções:** clique inválido, último clique de outro parceiro, cancelamento, estorno, assinatura anual, cliente inadimplente. **Aceite:** não há comissão por adicional ou pagamento inexistente e todos os ajustes são rastreáveis.

### 30.11. Jornada J-11 — moderação remove conteúdo publicado

**Disparo:** denúncia confiável. **Caminho:** moderação analisa evidência > aplica ação proporcionada > conteúdo removido do público/search/cache > notifica Creator com motivo e recurso quando cabível > preserva evidências conforme política. **Exceções:** post em coleção compartilhada, banner apontando para post suspenso, link em cache social, conteúdo com transcrição. **Aceite:** nenhum caminho público recupera mídia restrita.

### 30.12. Jornada J-12 — exportação/eliminação de dados

**Disparo:** titular solicita acesso/portabilidade/eliminação. **Caminho:** autenticação e validação > explica escopo > registra protocolo > exporta dados cabíveis e originais próprios existentes > informa dados sujeitos a guarda legal > executa exclusão/anonimização conforme política > confirma conclusão. **Aceite:** não inclui dados de terceiros, documentos internos ou informações que comprometam direitos de outros titulares.

## 31. Estados de tela e mensagens funcionais obrigatórias

| Superfície | Estado | Comportamento de referência |
|---|---|---|
| Perfil público | Sem posts | mostrar apresentação e convite editorial sem métricas sociais |
| Perfil público | Post expirado | não renderizar como publicado; link profundo informa indisponibilidade |
| Editor | Upload em curso | progresso e instrução sobre não fechar se necessário |
| Editor | Upload falhou | opção de tentar novamente sem perder título/texto |
| Editor | Rascunho recuperado | informar quando dados vêm de versão salva |
| Captura | Permissão negada | explicar habilitação e oferecer upload |
| Busca | Sem resultados | indicar “neste perfil”, sugerir ampliar/rever filtros |
| Busca | IA temporariamente indisponível | oferecer pesquisa textual/manual |
| Busca | Voz não reconhecida | permitir editar/transcrever novamente |
| Conteúdo | Link externo inválido | desabilitar CTA com informação ao Creator; visitante recebe opção segura |
| Agendamento | Intervalo inválido | mostrar campo e causa; não salvar |
| Agendamento | Conteúdo não pronto | informar bloqueio/pendência e ação de resolução |
| Creator Plus | Trial ativo | exibir fim, condições e gestão |
| Creator Plus | Pagamento falhou | orientar atualização sem revelar dados de pagamento |
| Creator Plus | Benefício expirou | ocultar recursos Plus do público e manter dados no painel |
| Comunidade | Solicitação fechada | não aceitar novos envios; explicar encerramento |
| Comunidade | Conteúdo descartado | não publicar nem atribuir autoria ao Creator |
| Biblioteca | Post salvo indisponível | manter referência/estado e permitir remover |
| Admin | Evento financeiro divergente | alerta de reconciliação e trilha, não atualização manual silenciosa |
| Parceiro | Comissão em análise | exibir estado e origem, sem prometer data ainda não definida |

## 32. Matriz de casos extremos e testes de regressão

### 32.1. Temporalidade e publicação

1. Agendar post para agora+1 minuto e alterar o fuso da conta antes da publicação.
2. Agendar expiração para um instante durante troca de horário de verão.
3. Publicar post enquanto o upload de vídeo ainda processa; verificar regra de prontidão.
4. Expirar post com aba pública aberta e abrir seu link de detalhe novamente.
5. Desligar o worker de agendamento e avançar o relógio; garantir que consulta pública filtra conteúdo expirado.
6. Fixar post e agendar seu encerramento antes do fim da fixação; garantir precedência do post.
7. Programar sete fixações com janelas parcialmente sobrepostas; recusar violação da capacidade.
8. Cancelar Plus durante campanha; manter até entitlement final, depois ocultar banner/fixação.
9. Tentar restaurar post já definitivamente eliminado; explicar indisponibilidade sem recriar dados de terceiros.
10. Alterar a data final de um banner expirado; permitir reprogramação conforme autorização, sem perda de métricas.

### 32.2. Mídia e direitos

1. Foto de 20 MB exatos aceita; foto 20 MB+1 byte é recusada, segundo cálculo técnico definido.
2. Vídeo com 9min59s mas 250 MB+1 byte é recusado; vídeo 10min+1s e menor é recusado.
3. Áudio de 20MB/10min validado com metadados inconsistentes (detectar no processamento).
4. Capture em dispositivo sem microfone; alternativa por upload funciona.
5. Download do próprio original após publicação e após arquivamento.
6. Usuário A altera ID da mídia para baixar original do usuário B; acesso negado.
7. Documento de imagem com GPS EXIF; versão pública não revela GPS.
8. Mídia reprocessada mantém vínculo de original e não duplica analytics.
9. Áudio transcrito incorretamente pode ser revisado; reprocessamento não muda publicação sem revisão.
10. Falha de envio com retomada não cria mídia órfã visível ou post duplicado.

### 32.3. Busca e proteção

1. Consulta “aberto agora” sem fonte de horários: não apresentar certeza.
2. Consulta refinada encontra zero posts locais; não recorrer silenciosamente a resultados globais.
3. Post com contexto privado “senha-canário” recuperável por teste interno; resposta pública não contém a senha-canário.
4. Pesquisa de bairro homônimo; solicitar esclarecimento de cidade/estado.
5. Geolocalização negada; campo de local manual continua funcional.
6. Creator oculta post durante busca; resultados seguintes não retornam post; clique antigo informa indisponibilidade.
7. Conteúdo modificado após indexação; cache público não retorna descrição antiga privada ou removida.
8. Busca por termo sensível em volume pequeno; dashboard Creator agrega/suprime para evitar identificação.
9. User tenta consultar a biblioteca privada de outra pessoa via ID; acesso negado.
10. Um produto com duas recomendações de creators distintos mantém autorias e URLs independentes.

### 32.4. Receita, atribuição e identidade

1. Stripe envia webhook duas vezes; entitlement e comissão criados uma única vez.
2. Cliente inicia checkout mas não paga; nenhum Plus definitivo ou comissão confirmada.
3. Assinatura é cancelada e depois reativada; períodos de comissão rastreáveis.
4. Parceiro A recebe clique e depois parceiro B; último clique elegível prevalece na janela definida.
5. Cobrança anual em EUR; política de comissão mensal internacional não está inventada enquanto PENDENTE.
6. Upgrade de conta com User/Creator preserva salvos e informações comuns.
7. Admin suporte tenta executar função financeira sem autorização; negar/logar.
8. Visitante inspeciona payload de perfil: não encontra contagens/métricas privadas.
9. Creator Free tenta acessar endpoint de analytics Plus: negar mesmo que métricas estejam registradas.
10. Remover conta gera fluxo de retenção legal sem tornar dados pessoais acessíveis por links antigos.

## 33. Matriz de dependências entre produto e documentação técnica

| Bloco | Depende de | Documento que detalhará implementação |
|---|---|---|
| Conta e perfis | Auth, identidade única, RLS, slugs | TRD; Backend & Database; App Flow |
| Editor multimídia | upload/processing/originals, validação | TRD; Backend & Database; Design System |
| Agendamento | timestamps, fuso, workers, query de elegibilidade | TRD; Backend & Database; App Flow |
| Busca contextual | FTS, embeddings, taxonomia, IA, privacidade | TRD; Backend & Database; App Flow |
| Analytics | evento, consentimento, agregação, entitlements | Backend & Database; TRD |
| Creator Plus | catálogo de planos, webhooks, acesso | TRD; Backend & Database; App Flow |
| Partner Portal | atribuição, pagamentos, LGPD, admin | Backend & Database; TRD |
| Admin e moderação | papéis, auditoria, denúncia, suporte | Backend & Database; App Flow |
| i18n | biblioteca localidade, formato de data/moeda, SEO | TRD; Design System |
| FAVX for Brands futuro | autorização, dados agregados, matching | TRD evolutivo; PRD futuro |

## 34. Riscos estratégicos, mitigação e decisões de release

| Risco | Impacto | Mitigação no produto | Status |
|---|---|---|---|
| Custo alto de vídeo e originais ilimitados | margens negativas | telemetria, otimização de entrega, abuso e política de uso lícito | Crítico / avaliar custos |
| Custo variável de busca por IA | explosão de custos Free | caching, modelo proporcional, fallback, limites técnicos | Crítico / TRD |
| Vazamento de métricas privadas | quebra de confiança e risco legal | isolamento de API/RLS e teste negativo | Não negociável |
| IA inventar atributos de lugares | induzir visitante a erro | respostas sempre baseadas em fontes e escopo | Não negociável |
| Conteúdo com direitos duvidosos | litígios e remoção | termos, licenças, denúncia, moderação | Alto |
| Complexidade de múltiplos países | tributação e compliance | operação por país/forma de cobrança validada | Alto |
| Conteúdo efêmero não mantido | baixa utilidade da busca | onboarding, agendamento, lembretes e qualidade | Alto |
| Spam em submissões comunitárias | baixa confiança e custos | moderação, limites e fluxo privado | Médio/alto |
| Catálogo de entidades duplicado | busca global ruim no futuro | aliases, revisão de merges, proveniência | Médio/alto |
| Dependência de serviços externos | indisponibilidade/custo | fallback e fronteiras claras | Médio/alto |
| Limites Plus imprecisos | retrabalho comercial/técnico | resolver ambiguidades antes de implementar quotas | Alto |
| Falta de suporte e monitoramento | experiência degradada | admin, dashboards operacionais e incidentes | Alto |

## 35. Decisões em aberto — fila obrigatória de Product Owner

Abaixo estão **decisões realmente pendentes**, não lacunas que o time pode resolver arbitrariamente durante coding. Priorização: **BLOQUEIA** (bloqueia feature/lançamento), **ANTES DE CODAR** (bloqueia implementação do módulo), **PODE ITERAR** (pode ficar configurável ou ser definido em experimentos).

| ID | Tema | Questão a decidir | Prazo lógico |
|---|---|---|---|
| DEC-01 | Coleções Plus | “Até 6 coleções” limita total ou coleções destacadas? Qual regra para Free? | ANTES DE CODAR |
| DEC-02 | Banners | “Até 10” significa cadastrados, simultâneos ou slots; onde aparecem e qual ordem? | ANTES DE CODAR |
| DEC-03 | Trial | Elegibilidade de novos trials, método de pagamento antecipado e conversão | BLOQUEIA billing |
| DEC-04 | Moedas | Preços anuais em USD/EUR, taxas, impostos e disponibilidade regional | BLOQUEIA venda internacional |
| DEC-05 | Parceiros | Janela de último clique, tratamento cross-device e autocadastro | BLOQUEIA atribuição |
| DEC-06 | Parceiros | Comissões em planos anuais e em USD/EUR; calendário de payout | BLOQUEIA pagamento |
| DEC-07 | Retenção | Lixeira (30 dias sugeridos), logs, originais, eventos e eliminação | BLOQUEIA política final |
| DEC-08 | Conteúdo | Licenças de download/compartilhamento de mídia e direitos de terceiros | BLOQUEIA lançamento de mídia |
| DEC-09 | Plano Free | Limites comerciais de post/coleção/banner e eventual fair use, sem criar cota de GB | ANTES DE CODAR |
| DEC-10 | Busca | Regras de uso por conta/IP, latência/custo, fallback e orçamento | BLOQUEIA busca com IA |
| DEC-11 | Localização | Provedor de geocodificação, precisão permitida e política de retenção | ANTES DE CODAR |
| DEC-12 | Analytics | Definição de impressões, deduplicação, limiares, cookies/consentimento | BLOQUEIA métricas públicas/privadas |
| DEC-13 | Usuários | Idade mínima e regras para menores | BLOQUEIA operação legal |
| DEC-14 | Suporte | Canais, SLA, equipe/horários, processos de moderação | BLOQUEIA operação |
| DEC-15 | Visual | Logo FAVX, cores/tokens finais, slogans já na nova marca | ANTES DO DESIGN SYSTEM FINAL |
| DEC-16 | Carrossel | Confirmar máximo sugerido de 10 mídias por post | ANTES DE CODAR |
| DEC-17 | Notificações | Push ou somente e-mail/in-app; preferências padrão | PODE ITERAR |
| DEC-18 | Contas | Social login e verificação de conta/creator | PODE ITERAR |
| DEC-19 | Avaliação | Confirmar escala 0–10 e passo 0,5 como regra comercial final | ANTES DE CODAR |
| DEC-20 | Conteúdo sensível | Política editorial, denúncia, revisão, apelação e idiomas de moderação | BLOQUEIA lançamento |
| DEC-21 | Domínio | URL canônica exata, reserva de slugs e políticas de redirecionamento | ANTES DE CODAR |
| DEC-22 | Infra | Validar suporte de Bunny a originais, mídia, vídeo, storage e custos | BLOQUEIA arquitetura de mídia |
| DEC-23 | Pagamentos | Validar viabilidade Stripe e documentos fiscais por mercado/ciclo | BLOQUEIA lançamento comercial |
| DEC-24 | Métricas | Metas de ativação, retenção, churn e economia de unidade | PODE ITERAR |
| DEC-25 | Privacidade | Consentimento, base legal e retenção por finalidade/país | BLOQUEIA coleta em produção |

### 35.1. Recomendações-padrão enquanto pendente

Para não paralisar o design exploratório, usar **hipóteses de trabalho não vinculantes**: biblioteca do User privada por padrão; 30 dias de lixeira como sugestão; sem publicação automática externa; carrossel com 10 itens sugeridos; nenhum dado de audiência individual compartilhado; `by FAVX` discreto; busca textual como fallback de IA; conteúdo expirado invisível no público; geolocalização sempre opcional. No código, hipóteses devem ficar configuráveis e expressamente marcadas para aprovação, não “hardcoded como consenso”.

## 36. Critérios de prontidão para desenvolvimento e lançamento

### 36.1. Definition of Ready por feature

Uma feature está pronta para engenharia quando possui: objetivo; escopo; regra de negócio; permissões; entradas/saídas; estados; wireframe/fluxo aplicável; eventos analytics; critérios de aceite; dependências; avaliação de segurança/privacidade; impacto de tradução; tratamento de falha; decisões pendentes resolvidas ou isolamento por feature flag.

### 36.2. Definition of Done por feature

Código revisado, testes unitários/integrados/e2e aplicáveis, RLS/autorização negativa validada, instrumento de analytics com verificação, i18n nos seis idiomas, estados de erro, acessibilidade essencial, observabilidade, documentação de suporte e aceite de Produto. Para pagamentos/agendamento/privacidade, incluir teste de reconciliação e rollback.

### 36.3. Gatilhos de bloqueio de release

- Exposição pública de informações privadas de métricas, FAVX Context ou audiência.
- Possibilidade de download não autorizado de original alheio.
- Post/banners expirados acessíveis publicamente por cache/API.
- Billing conferindo Plus sem validação adequada ou cobrando sem termos claros.
- Falhas que provoquem perda silenciosa de originais aceitos ou posts.
- Ausência de fluxo de denúncia/moderação e exclusão/privacidade operacional.
- Busca de IA que rotineiramente gere estabelecimentos/atributos inexistentes como fatos.
- Inconsistência crítica de horários de agendamento por fuso.

### 36.4. Checklist de aceitação de release

- [ ] Onboarding de visitante, User, Creator e Plus testados em desktop e mobile.
- [ ] Post básico, áudio, vídeo, foto e carrossel aceitos dentro dos limites e recusados fora.
- [ ] Captura nativa e fallback sem permissão testados em matriz de dispositivos.
- [ ] Download próprio, negação a terceiros e original/derivado testados.
- [ ] Post/banner/fixado com início/fim e expirados protegidos em API/cache.
- [ ] Busca local, filtros, voz, refinamento e fallback sem inventar conteúdo.
- [ ] Contextos privados protegidos, inclusive contra exposição por IA.
- [ ] Salvos/coleções/compartilhamento e recomendações comunitárias testados.
- [ ] Free e Plus exibem somente métricas permitidas; não há contadores públicos.
- [ ] Trial, renovação, cancelamento, atraso e webhook duplicado testados.
- [ ] Comissão parceiro e último clique testados com política final aprovada.
- [ ] Admin RBAC, suporte, denúncias, moderação e audit logs operacionais.
- [ ] Seis idiomas e três moedas revisados com fuso de agendamento.
- [ ] Acessibilidade/SEO/performance validados para os fluxos principais.
- [ ] Políticas legais, fiscais, privacidade, menores, reembolsos e termos revisadas.
- [ ] Monitoramento, runbooks e plano de incidentes disponíveis à operação.

## 37. Matriz de telas a especificar no DOC 03 (App Flow)

O PRD descreve o comportamento e as regras; a especificação de telas posterior deverá detalhar hierarquia, componentes, microcopy, modais, condições, estados e transições. A lista é um inventário funcional, não aprovação de layout.

| Área | Telas/superfícies necessárias |
|---|---|
| Institucional | landing, planos, termos, privacidade, ajuda, contato |
| Autenticação | entrar, cadastrar, verificar, recuperar, sessão expirada |
| User | início/biblioteca, salvos, coleções, editar coleção, compartilhar, configurações |
| Creator público | perfil, busca, resultados, post, coleção, pedido comunitário, enviar sugestão |
| Creator privado | dashboard, meu perfil, posts, editor, mídia, agendados, encerrados, lixeira |
| Creator Plus | upgrade, trial, checkout, gestão, banners, fixados, analytics |
| Busca | entrada, voz, filtros, refinamentos, resultados e estados vazios |
| Comunidade | criar pedido, pedidos ativos, caixa de submissões, revisão e publicação |
| Parceiros | inscrição, status, link, dashboard, comissões, pagamentos e documentos |
| Admin | dashboard, usuários, creators, conteúdo, mídia, taxonomia, moderação, finanças, parceiros, suporte, logs, configurações |
| Comuns | notificações, preferências, consentimentos, exclusão de conta, erros e carregamentos |

## 38. Sequenciamento de produto para o Claude Code (sem substituir o DOC 06)

**Ordem de dependência sugerida:**

1. Repositório, padrões, ambientes, CI e autenticação segura.
2. Identidade única, perfis, permissões/RLS, i18n e roteamento público.
3. Biblioteca de mídia, upload, derivados, captura e download com autorização.
4. CRUD de posts, editor, categorias, tags, links, cupons, patrocínio e rating.
5. Ciclo de vida e agendamento robusto com timestamps, jobs e auditoria.
6. Perfil público, coleções, salvos e relações de seguir privadas.
7. Busca local estruturada, entidades canônicas, contexto privado e IA conversacional/voz.
8. Recomendações comunitárias, denúncias/moderação e notificações.
9. Instrumentação de analytics desde Free, agregação privada e dashboards Plus.
10. Billing/entitlements Creator Plus, banners e fixados.
11. Parceiros, comissões, conciliação e operação financeira.
12. Admin completo, suporte, observabilidade e QA end-to-end multi-idioma.

**Observação:** é um sequenciamento funcional; o plano definitivo deve incluir milestones, pequenos PRs, testes, migrations, feature flags, runbooks, setup de ambiente, custos e checkpoints de aprovação. Não antecipar construção do marketplace ou Events/Proof.

## 39. Rastreabilidade e manutenção do PRD

### 39.1. Regra de alteração

Toda alteração deve identificar código do requisito (ex.: FAVX-LIFE-002), descrição anterior, nova decisão, justificativa, superfícies afetadas, efeito em billing/analytics/privacidade, mudanças em TRD/fluxos/Design System/backend e cenários a retestar. Priorizar versionamento sem apagar histórico decisório.

### 39.2. Artefatos de rastreabilidade recomendados

- `docs/PRD.md` — documento fonte.
- `docs/TRD.md` — arquitetura e requisitos técnicos.
- `docs/APP_FLOW.md` — telas e jornadas.
- `docs/DESIGN_SYSTEM.md` — tokens e componentes.
- `docs/BACKEND_DATABASE.md` — schemas, API, RLS, migrations.
- `docs/CLAUDE_CODE_PLAN.md` — execução por sprint/milestone.
- `docs/DECISIONS.md` — decisões datadas e responsáveis.
- `docs/REQUIREMENTS_TRACEABILITY.md` — requisito → tela → endpoint → teste.

Esses caminhos são convenções propostas para repositório futuro, não arquivos afirmados como já existentes.

## 40. Conclusão e declaração de baseline

O FAVX MVP será uma experiência completa de **Creators + Users**, com publicação multimídia, captura e download de originais próprios, agendamento e encerramento temporal de posts/banners/fixados, curadoria por coleções, salvos pessoais, busca local inteligente, FAVX Context privado, recomendações comunitárias solicitadas, métricas privadas desde o primeiro dia, Creator Plus, Partners e Admin operacional. Seu público encontrará recomendações sem login compulsório; sua arquitetura nascerá preparada para busca global e FAVX for Brands, sem lançar esses módulos prematuramente.

Esta versão 1.0 é **baseline de escopo**, não autorização para inventar soluções onde há PENDENTE. Todas as decisões de produto registradas são implementáveis em princípio, mas precisam dos cinco documentos complementares e das validações técnicas, jurídicas, fiscais e de custos. Antes de executar cada módulo, confirmar as decisões críticas enumeradas na seção 35.

## Anexo A — Referências normativas e fontes de produto

**Decisões do FAVX:** histórico de especificações e aprovações da Product Owner até 04/11/2026, consolidado neste documento; precedência para escolhas mais recentes.  
**LGPD (Brasil):** Lei 13.709/2018 — texto atualizado da Câmara dos Deputados: https://www2.camara.leg.br/legin/fed/lei/2018/lei-13709-14-agosto-2018-787077-normaatualizada-pl.html  
**Acessibilidade:** W3C, Web Content Accessibility Guidelines 2.2: https://www.w3.org/TR/WCAG22/ ; visão geral oficial: https://www.w3.org/WAI/standards-guidelines/wcag/  
**Europa:** European Commission, data protection: https://commission.europa.eu/law/law-topic/data-protection_en  
**Observação:** links normativos orientam avaliação, sem substituir análise jurídica do produto e dos países de operação.

## Anexo B — Convenção de status e decisão

- **APROVADO:** decisão explícita ou requisito definitivamente incorporado pela Product Owner.
- **REQUISITO DERIVADO:** detalhe necessário à implementação coerente, revisável no refinamento.
- **RECOMENDAÇÃO:** hipótese/proposta, ainda sujeita a decisão.
- **PENDENTE:** definição não obtida; jamais converter silenciosamente em regra definitiva.
- **FUTURO:** norte de arquitetura/roadmap; não desenvolver interface de produto no MVP.

---

**FAVX — PRD 1.0 · Documento-mestre de produto · 04/11/2026**
