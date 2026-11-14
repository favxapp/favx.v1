---
title: "FAVX — Design System Completo (DOC 04)"
subtitle: "Identidade de produto, fundações, tokens, componentes, padrões e governança"
author: "FAVX — Produto & Design"
date: "05 de novembro de 2026"
lang: pt-BR
---

# FAVX — Design System Completo

**Código:** FAVX-DS-001  
**Versão:** 1.0 — proposta técnico-visual para homologação  
**Data-base:** 05/11/2026  
**Release de referência:** MVP Creators + Users  
**Fontes-mãe:** PRD v1.0, TRD v1.0, DOC 03 v1.0; decisões explícitas da fundadora.  
**Arquivos operacionais relacionados:** `FAVX_DOC04_Design_Tokens_v1_0.tokens.json` e `FAVX_DOC04_Design_Tokens_v1_0.css`.

> **Status e interpretação.** Este documento é uma **especificação de Design System** e não uma declaração de que todas as cores, escalas e componentes já foram aprovados em protótipo. **APROVADO** = direção decidida; **DERIVADO** = operacionalização necessária; **PROPOSTO** = valor de projeto para prototipação/QA visual; **PENDENTE** = depende de decisão explícita; **FUTURO** = não implementar UI no MVP. Sob conflito, prevalecem as decisões mais recentes do produto, depois PRD/TRD para regras funcionais e o DOC 03 para identificação e interação de telas; o DS governa expressão visual, componentes e acessibilidade. Não usar automaticamente antigos símbolos/slogans de GalleryX como marca oficial FAVX.

## Mapa de leitura

- **Identidade, fotografia e fundamentos (0–14):** posicionamento visual, tipografia, cores, radius, glass, responsive, acessibilidade, linguagem e idiomas.
- **Biblioteca e contratos de experiência (15–20):** 75 componentes, padrões compostos, templates e matriz visual das 142 superfícies do DOC 03.
- **Engenharia, governança e qualidade (21–27):** design-to-code, handoff, casos de teste, decisões pendentes e checklist de homologação.

_Para navegar por capítulo, utilize o painel de títulos do Word ou os links de cabeçalho do Markdown._

## Como utilizar este documento

1. **Produto e direção de arte:** validar a essência, os critérios de identidade e os tokens propostos antes de chamar a interface de final.
2. **Designers:** construir biblioteca de componentes por propriedades, estados e responsive variants; não desenhar 142 telas desconectadas.
3. **Claude Code/engenharia:** implementar primeiro foundations e primitives; depois templates e features; nunca hardcodar tokens fora do tema.
4. **QA:** testar contratos de comportamento no DOC 03 e contratos visuais/acessíveis neste documento.
5. **Governança:** registrar aprovações e alterações por ID `DS-*`, screenshots comparativos, versão semântica e data.

---

## 0. Resumo executivo, objetivo e fronteiras

A FAVX é um produto de curadoria e busca de recomendações. Sua estética deve expressar **tecnologia sofisticada com leveza editorial**, com prioridade para conteúdo visual real, comunicação humana, simplicidade operacional e refinamento. O Design System existe para manter a coerência entre páginas públicas, biblioteca, painel Creator, busca por IA, assinatura, parceiros e administração, sem sacrificar desempenho ou acessibilidade.

**Entregáveis deste DOC:** (a) princípios e linguagem de marca aplicada; (b) fundações e tokens; (c) especificação de componentes e estados; (d) padrões de navegação e experiência; (e) regras para situações sensíveis de produto; (f) matriz de aplicação às 142 superfícies do DOC 03; (g) plano de implementação/testes; (h) pendências de aprovação e gestão de mudanças.

**Fora deste DOC:** a especificação definitiva de logo (pendente), DDL e RLS (DOC 05), contratos completos de API (TRD/DOC 05), wireframes finais pixel-perfect (a produzir na camada de design), telas funcionais de marketplace e Events/Proof (futuros).

## 1. Identidade FAVX — essência, atributos e percepção

### 1.1. Direção aprovada

- **Personalidade:** inovadora, internacional, sofisticada, contemporânea, confiável, bem-feita, estética, desejável e funcional.
- **Linguagem visual:** predominância branca, tipografia preta/grafite, composição editorial premium, fotografias grandes, cards arredondados e efeitos contidos de blur/glassmorphism.
- **Tipografia:** Manrope é a família principal do produto; Instrument Serif atua como complemento de títulos institucionais, editoriais e campanhas, não como texto de interface operacional.
- **Experiência:** reduzir fricção para descobrir, organizar, publicar, salvar e pesquisar; os resultados, e não os enfeites, são protagonistas.
- **Fotografia:** direção artística editorial e documental natural; fotografia institucional pode ser selecionada e produzida, enquanto imagens reais da comunidade não devem ser artificialmente uniformizadas.

### 1.2. Três camadas expressivas

| Camada | Papel | Tratamento | Risco a evitar |
|---|---|---|---|
| Marca institucional | Percepção e desejo | Fotografia editorial, serif pontual, composições com respiro | Marketing genérico ou luxo caricato |
| Produto público | Descoberta e curadoria | Cards fotográficos, busca visível, leitura fácil | Rede social com placares de popularidade |
| Aplicação operacional | Produção e gestão | Hierarquia funcional, dados discretos, forms e tabelas legíveis | Glass em campos críticos ou UI excessivamente decorada |

### 1.3. Regras de reconhecimento

O usuário deve identificar FAVX sem depender de uma cor chamativa: pelo ritmo das margens, equilíbrio entre tipografia e fotografia, família de cantos arredondados, microinterações controladas, clareza de conteúdo e assinatura discreta. Quando houver dilema entre “mais efeito” e “mais compreensão”, escolher compreensão.

### 1.4. Anti-padrões de marca

Evitar sombras dramáticas, gradientes saturados como pano de fundo padrão, infinitos ícones decorativos, excesso de stickers/emoji, publicidade disfarçada, métricas sociais públicas, banners piscando, carrosséis automáticos rápidos, vídeos autoplay com áudio, fontes serif em controles e uma estética genérica de painel SaaS para a página pública.

## 2. Marca gráfica, logotipo, assinatura e propriedade

### 2.1. Status do logotipo

**PENDENTE:** a forma final do logotipo/wordmark FAVX não foi homologada. A composição histórica de **quatro cards arredondados em 2×2, com transparência/vidro** pode ser explorada como **motivo proprietário** e ponto de partida; isso não equivale à aprovação do desenho final. As letras G e X associadas à marca anterior **não** devem ser inseridas no símbolo oficial FAVX.

Enquanto não houver arquivo vetorial homologado, apresentar **“FAVX” em lettering tipográfico provisório** somente em protótipos e documentação, identificado como placeholder. Não registrar um emblema gerado automaticamente como símbolo definitivo.

### 2.2. Regras propostas para futuras artes oficiais

- Entregar lockups horizontal e compacto; ícone monocromático; aplicações positivas/invertidas; favicon; avatar; app icon; arquivos vetoriais e exports raster.
- Garantir legibilidade do logotipo a 24 px e do símbolo a 16 px; testar impressão 1 cor, fundo branco e fundo preto; sem blur indispensável no tamanho mínimo.
- Margem de proteção proposta: **1× altura da letra F** em volta do lockup; revisar após aprovação do desenho real.
- Nunca esticar, girar arbitrariamente, contornar em excesso, trocar proporção, aplicar translucidez que prejudique contraste ou produzir sombras decorativas indevidas.

### 2.3. Assinatura “by FAVX”

Aplicar de modo discreto nas páginas públicas, em área secundária, clicável para landing FAVX e com rastreamento de origem consentido. Não cobrir fotos, não transformar em overlay fixo e não competir com a identidade do creator. Em páginas longas, preferir footer, bloco final ou affordance discreta de marca, obedecendo o DOC 03.

### 2.4. Campanhas e slogans

Os slogans herdados da fase anterior podem inspirar tom, mas a aplicação sob a marca FAVX requer nova aprovação. **Não carimbar slogan antigo como assinatura oficial sem decisão explícita.**

## 3. Direção de arte, fotografia e linguagem de imagens

### 3.1. Fotografia institucional

- Priorizar gestos reais, lugares habitados, objetos com textura, luz natural, composição autoral e diversidade de contextos e pessoas.
- Estilo de câmera próximo, documental, ligeiramente imperfeito com intenção; liberdade para cortes editoriais e enquadramentos com respiro.
- Paleta natural, iluminação suave, contraste moderado e cor fiel. Não aplicar filtros globais rígidos ou tratamento “plástico”.
- Alternar cenas de vida real, detalhes de objetos, produtos, ambientes, serviços e pessoas; evitar repetição de modelos e poses padronizadas.
- Em página marketing: hero fotográfico com mensagem curta; preservar áreas de respiro; não sobrepor texto sobre zonas de contraste instável sem superfície de suporte.

### 3.2. Conteúdo da comunidade

A obra do creator é o centro. Não impor LUT, filtro, desfoque, tom artificial nem crop destrutivo ao original. Gerar versões otimizadas responsivas, respeitar orientação, proporções e foco; permitir reordenar carrossel e escolher capa sem alterar arquivo bruto armazenado. Em vídeos, mostrar poster frame adequado; em áudio, componente de reprodução e transcrição quando disponível.

### 3.3. Política de media crops — proposta

| Cenário | Razão sugerida | Comportamento |
|---|---|---|
| Card de descoberta | 4:5 preferencial | `object-fit: cover`; foco ajustável; nunca modificar original |
| Grade compacta | 1:1 | Crop de preview reversível |
| Card paisagem/serviço | 3:2 | Permitir rosto/produto inteiro se crítico |
| Banner de Creator | 16:9 ou 2:1 | Edição responsiva com safe zone de texto |
| Hero institucional | Responsivo, 16:9 a 3:4 | Layout adaptativo; fallback de imagem |
| Story/export Instagram | 9:16 | Gerado sob demanda, nunca sobrescreve original |

### 3.4. Conteúdo sensível e inclusivo

Não inferir etnia, gênero, saúde, aparência física ou renda a partir de imagens para categorizar pessoas. Não fazer recortes humilhantes. Alts devem descrever função/conteúdo relevante, sem presumir características pessoais. Conteúdo patrocinado e inserções de desconto devem ser identificados em texto legível, não só na imagem.

### 3.5. Checklist de fotografia

Verificar autenticidade, licenciamento, atribuição quando necessária, proporção, compressão perceptível, alt, carregamento progressivo, responsividade, direito de imagem, leitura de overlays, capa, original preservado e escolha explícita do creator para personalizações.

## 4. Arquitetura de tokens e fontes de verdade

### 4.1. Camadas

**Base/primitives:** escala neutra, espaço, tipografia, radius, dimensões, motion. **Semânticos:** `surface`, `text-primary`, `action-primary`, `danger` etc., sempre por função. **Componentes:** `button.primary.bg`, `card.border`, `input.focus-ring` etc., com referências aos semânticos. **Templates:** escala e densidade por contexto (público, dashboard, admin). Evitar códigos hex em JSX de features.

### 4.2. Entregáveis técnicos

- `FAVX_DOC04_Design_Tokens_v1_0.tokens.json`: arquivo de tokens em estrutura baseada no formato DTCG 2025.10, para interoperabilidade; propostas, não ratificação visual.
- `FAVX_DOC04_Design_Tokens_v1_0.css`: variáveis CSS de referência light e dark; o tema **light** é o alvo principal MVP, dark é preparação técnica **não compromisso de lançamento**.
- No repositório: `packages/design-tokens` como origem versionada; gerar adaptadores Tailwind, CSS, JS/TS a partir de uma única fonte aprovada.

### 4.3. Convenção

Nomenclatura em inglês, minúsculas, kebab-case nas CSS variables. Exemplos: `--favx-color-ink-strong`, `--favx-radius-xl`, `--favx-space-4`, `--favx-duration-fast`. Tokens podem possuir aliases; referências de componentes precisam manter significado, não depender do nome de cor. Mudança de valor sem alterar semântica = revisão de token; mudança de significado exige revisão de componente.

### 4.4. Regras de governança

Token novo só com caso de uso, contraste testado, variante dark planejada caso dark venha a existir, fallback sem transparência, testes de regressão e responsável. Evitar proliferação de tokens `special-hero-2-variant`, hardcodes arbitrários e “escapadas” locais sem registro.

### 4.5. Inspiração e normas

A especificação DTCG 2025.10 é um formato comunitário estável e não uma Recomendação W3C de standards track; utilizar convenções documentadas em https://www.designtokens.org/tr/2025.10/. Tailwind v4 pode consumir tokens por `@theme`, mas a versão exata deve ser fechada no TRD/lockfile. Acessibilidade-alvo: WCAG 2.2 AA.

## 5. Paleta, semântica e contraste

### 5.1. Filosofia cromática

**APROVADO:** o preto e o branco formam a expressão principal. Cinzas quentes e superfícies de papel são **PROPOSTOS** para dar profundidade editorial sem deslocar a identidade. Azul funcional, verde, âmbar e vermelho são cores semânticas da interface — **não necessariamente cores de marca**. Qualquer acento de campanha deve depender de aprovação específica e nunca determinar affordance sozinho.

**Regra de contraste:** texto normal ≥ 4,5:1; texto grande ≥ 3:1; bordas/indicadores essenciais e estados de foco com contraste adequado ≥ 3:1 quando aplicável. Não tratar texto cinza sobre vidro translúcido como garantidamente legível: avaliar no fundo real e aplicar fallback sólido/overlay quando necessário.

| Token — claro | HEX proposto | Função e restrição |
|---|---|---|

| `color.ink-strong` | `#151515` | heading e dados principais |

| `color.ink-default` | `#242424` | texto de leitura |

| `color.ink-muted` | `#595959` | rótulos secundários (testar sobre superfícies) |

| `color.ink-subtle` | `#676767` | elementos auxiliares (não usar em texto pequeno sem validar) |

| `color.ink-inverse` | `#FFFFFF` | cor de semântica específica |

| `color.canvas` | `#FFFFFF` | fundo primário |

| `color.canvas-soft` | `#FCFBFA` | fundo editorial |

| `color.surface` | `#FFFFFF` | cards |

| `color.surface-subtle` | `#F7F6F4` | seções suaves |

| `color.surface-raised` | `#FFFFFF` | popovers |

| `color.border-default` | `#DEDDDA` | contorno de controle |

| `color.border-subtle` | `#EBEAE8` | divisores discretos |

| `color.border-strong` | `#9F9E9A` | borda de destaque |

| `color.brand-ink` | `#111112` | assinatura institucional |

| `color.brand-paper` | `#FFFFFF` | contraste de marca |

| `color.action-primary` | `#181818` | botão primário |

| `color.action-primary-hover` | `#353535` | hover do primário |

| `color.action-primary-text` | `#FFFFFF` | texto do primário |

| `color.action-secondary` | `#FFFFFF` | botão secundário |

| `color.action-secondary-hover` | `#F4F3F1` | hover secundário |

| `color.action-secondary-text` | `#151515` | texto secundário |

| `color.link` | `#2356B2` | link funcional |

| `color.link-hover` | `#163B80` | hover link |

| `color.focus` | `#2356B2` | foco visível |

| `color.success-text` | `#176443` | feedback de sucesso |

| `color.success-bg` | `#EDF7F0` | fundo sucesso |

| `color.success-border` | `#B5D9C4` | cor de semântica específica |

| `color.warning-text` | `#835500` | feedback atenção |

| `color.warning-bg` | `#FFF8E9` | fundo atenção |

| `color.warning-border` | `#E8D6AC` | cor de semântica específica |

| `color.danger-text` | `#A52222` | erro/destrutivo |

| `color.danger-bg` | `#FFF0EF` | fundo de erro |

| `color.danger-border` | `#E8B4AE` | cor de semântica específica |

| `color.info-text` | `#2356B2` | informações |

| `color.info-bg` | `#EDF3FC` | fundo de informação |

| `color.info-border` | `#B6CAE9` | cor de semântica específica |

| `color.overlay` | `#171717` | escurecimento de modal |

| `color.skeleton` | `#ECEBE8` | skeleton |

| `color.divider` | `#E7E6E3` | separador |

### 5.2. Versão escura — proposta futura

O arquivo `.tokens.json` contém equivalentes dark para suportar expansão, porém **não se deve anunciar ou ativar modo escuro no MVP sem projeto específico e QA em todas as superfícies**. A superfície pública pode incluir peças institucionais de fundo preto pontualmente sem impor dark mode ao produto.

### 5.3. Regras de uso

- Usar preto/grafite em textos e ações primárias; superfície branca/soft dominante.
- Estado de erro usa mensagem + ícone + borda, nunca vermelho isolado.
- Labels de publicidade e descontos devem ser discretos mas inequívocos; sempre texto como “Patrocinado” ou “Oferta”.
- Nunca usar transparência nas mensagens críticas de erro se o fundo afetar leitura.
- Evitar texto integralmente sobre foto, exceto com faixa/overlay com contraste aferido.
- Placeholder não pode substituir label; tooltip não é a única fonte de informação.
- Definir tokens de série para charts com padrões e rótulos, e não depender de contraste entre cores próximas.

## 6. Tipografia e hierarquia editorial

### 6.1. Famílias aprovadas

- `Manrope`: UI, controles, menus, documentos operacionais, metadados, títulos de área, dashboards, search, forms; pesos de 400, 500, 600 e 700 conforme disponibilidade no pacote de fonte.
- `Instrument Serif`: títulos seletivos de marketing/manifesto e composições editoriais, não para texto longo, alertas, labels, números financeiros, calendários nem células de tabela.
- Fallbacks: sans do sistema quando a fonte personalizada falhar; serif de sistema apenas onde existir propósito editorial; fontes devem usar `font-display: swap` ou estratégia equivalente.

### 6.2. Escala proposta (web, desktop)

| Papel | Família | Peso | Tamanho / line-height | Uso |
|---|---|---|---|---|
| Display L | Instrument Serif ou Manrope | Regular / 600 | 56 / 64 px | Hero institucional; até 2 linhas |
| Display S | Instrument Serif ou Manrope | Regular / 600 | 44 / 52 px | Seção editorial |
| H1 | Manrope | 600 | 36 / 44 px | Título principal de aplicativo |
| H2 | Manrope | 600 | 30 / 38 px | Título de módulo |
| H3 | Manrope | 600 | 24 / 32 px | Seção de formulário/coleção |
| H4 | Manrope | 600 | 20 / 28 px | Subgrupo e card destaque |
| Body L | Manrope | 400 | 18 / 28 px | Texto de marketing/introdutório |
| Body | Manrope | 400 | 16 / 24 px | Texto central e forms |
| Small | Manrope | 400/500 | 14 / 20 px | Metadados e navegação |
| Caption | Manrope | 500 | 12 / 16 px | Etiquetas não essenciais; sem conteúdo crítico |

**Mobile ≤ 767 px:** Display L 40/46; Display S 36/42; H1 30/38; H2 26/34; H3 22/30; H4 18/26; Body preserva 16/24. Em áreas densas de admin desktop, 14 px é permitido para metadados, não para conteúdo essencial à tarefa.

### 6.3. Regras tipográficas

- Line-length de texto longo: aproximadamente 55–75 caracteres; usar largura máxima de leitura de 720 px.
- Números de métricas podem usar `font-variant-numeric: tabular-nums` sem aumentar seu destaque público.
- Não usar ALL CAPS como corpo, labels complexas ou longos headings; uppercase pontual editorial apenas quando legível.
- Evitar truncar datas, números, estado de pagamento, valores, títulos de botões ou características essenciais. Permitir quebra de linha.
- `letter-spacing` padrão: normal; reduzir tracking apenas em títulos editoriais amplos quando validado.
- Quando Instrument Serif não cobrir caracteres de pt/it/fr/es, usar fonte alternativa adequada e testar com strings reais.

### 6.4. Conteúdo dinâmico e idiomas

Testar headings em pt-BR, pt-PT, en, es, it, fr; textos com acentos, valores e nomes extensos; diretrizes de truncamento e hyphenation; não codificar largura fixa de botões baseada em textos em português. Manter labels traduzidas em seus próprios recursos.

### 6.5. Hierarquia semântica

Título visual não determina sozinho o nível HTML: uma página deve ter H1 lógico, subseções H2, grupos H3; não pular níveis apenas pelo estilo. Componentes de heading devem permitir `as` sem perder token tipográfico.

## 7. Espaçamento, raio, dimensões e densidade

### 7.1. Espaçamento

Escala base **4 px** com semiescalas auxiliares: `space.0` (0), `.5` (2), `1` (4), `1.5` (6), `2` (8), `2.5` (10), `3` (12), `4` (16), `5` (20), `6` (24), `8` (32), `10` (40), `12` (48), `16` (64), `20` (80), `24` (96). Sempre aplicar por token, evitando espaçamentos individuais sem razão documentada.

**Padrões:** label→campo 6–8px; campo→ajuda 6px; grupo de campos 20–24px; blocos de conteúdo 32px; seções de landing 64–96px conforme viewport; cards próximos com gap 12–24px.

### 7.2. Radius

| Token | Valor | Uso recomendado |
|---|---:|---|
| `xs` | 6px | chaves e pequenos estados |
| `sm` | 10px | tags e tooltips |
| `md` | 14px | campos, controles, menus |
| `lg` | 18px | cards operacionais |
| `xl` | 24px | cards de conteúdo/publicação |
| `2xl` | 32px | modais amplos, hero cards |
| `3xl` | 40px | elementos editoriais especiais |
| `pill` | 999px | pills e botões selecionados |

**Regra:** formas arredondadas são característica da marca, mas não justificarão perda de área útil. Bordas internas concêntricas: raio do filho ≈ raio do pai − padding.

### 7.3. Controles, ícones, avatares e alvos

| Elemento | Desktop | Mobile | Observação |
|---|---|---|---|
| Button principal | 44px | 48px | min largura segundo conteúdo; área de toque confortável |
| Button pequeno | 36px visual | área clicável ≥44px | usar área invisível expandida quando necessário |
| Input/select/search | 44–52px | 48–52px | erro e ajuda ocupam espaço próprio |
| Checkbox/radio | 20–24px visual | ≥44px área | label clicável |
| Ícone de ação | 20–24px | 20–24px | botão-ícone mínimo 44×44 |
| Avatar padrão | 40px | 40px | tamanhos xs 24, sm 32, lg 56, xl 80 |
| Target acessível | mínimo WCAG 24px sujeito a exceções | **alvo recomendado 44–48px** | 44px é padrão interno mais exigente, não mínimo normativo AA |

### 7.4. Densidade por área

**Público:** confortável e orientado por fotos. **Creator editor:** confortável, com rótulos e explicações. **Analytics:** média; gráficos com filtros acessíveis. **Admin:** poderá usar densidade compacta em tabelas desktop, mas nunca com controles inferiores ao requisito de acessibilidade ou linhas sem affordance de foco.

## 8. Elevação, blur, glassmorphism e camadas

### 8.1. Princípio

O glassmorphism é **uma assinatura controlada** do FAVX; deve enriquecer atmosfera e hierarquia, não esconder informação. Não usar blur sobre fundos brancos indistintos ou fotos de alto contraste sem proteção.

### 8.2. Receitas propostas

| Superfície | Fundo | Bordas | Blur | Elevação | Onde usar |
|---|---|---|---|---|---|
| Base | branco/superfície | sutil | nenhum | nenhuma | páginas e formulários |
| Card conteúdo | branco/soft | 1px leve | nenhum | sombra card | publicações e coleções |
| Glass floating | branco 82–92% | borda translúcida | 12–16px | shadow leve | controle de galeria, toolbar pontual |
| Glass hero | branco 65–85%, somente se contraste passar | 1px | até 20px | média | campanha/marketing |
| Overlay modal | superfície sólida | borda sutil | blur de fundo opcional | shadow raised | decisões críticas |
| Bottom sheet | superfície sólida | borda superior | nenhum | shadow raised | edição/agendamento no mobile |

### 8.3. Restrição de acessibilidade

O conteúdo central (texto de formulário, ações financeiras, mensagens de validação e informação privada) não deve depender de glass/blur para existir. Implementar fallback quando `backdrop-filter` não for suportado; honrar redução de transparência quando suportada; evitar efeitos na rolagem que causem jank. Shadows não substituem bordas em alto contraste.

### 8.4. Z-index e portais

`base=0`, `sticky=10`, `popover=30`, `drawer=40`, `modal=50`, `toast=60`, `critical=70`. Criar stack contexts intencionais; usar portal/overlay gerenciado; evitar `z-index:999999`. Modal bloqueia interações de baixo nível e devolve foco ao elemento de origem.

## 9. Grids, responsive e safe areas

### 9.1. Breakpoints (propostos)

| Faixa | Largura de viewport | Colunas | Margem lateral |
|---|---|---:|---:|
| Compacto | 320–479px | 4 | 16px |
| Mobile amplo | 480–767px | 4 | 20–24px |
| Tablet | 768–1023px | 8 | 24px |
| Desktop | 1024–1439px | 12 | 32px |
| Wide | ≥1440px | 12 | 40–64px |

Recomendados `max-width` de leitura 720px, formulários 560px, conteúdo 1280px e páginas amplas até 1440px. Testar 320px, 375px, 390px, 768px, 1024px, 1280px e 1440px, além de zoom de 200/400% nos cenários relevantes.

### 9.2. Layout público

Header mínimo; imagem de perfil/bio; busca visualmente importante; coleção e recomendações com grade responsiva de cards. Comportamento de imagens: aspect ratios previsíveis, crop responsivo, skeleton com tamanho reservado para evitar layout shift. Footer “by FAVX” discreto.

### 9.3. Layout autenticado

Em mobile, navegação simplificada e ações primárias acessíveis; em desktop, sidebar e conteúdo principal. Troca User/Creator/Partner nunca substitui identidade do usuário nem mistura permissões. Atalhos e breadcrumbs opcionais conforme densidade, com nome claro da área atual.

### 9.4. Modais e sheets

Desktop: modal central com largura compatível com tarefa (400–720px); mobile: sheet de fundo ou página inteira para edição complexa; manter CTA fora da zona do teclado e respeitar `env(safe-area-inset-bottom)`. Campo de data/hora precisa funcionar com teclado, leitor de tela e seleção por toque.

### 9.5. Layout responsivo não deve retirar informação crítica

No mobile, uma tabela operacional torna-se lista de cards ou layout scrollable controlado; nunca cortar ações de excluir/editar, mensagens de cobrança, status ou período do agendamento sem alternativa equivalente.

## 10. Iconografia, ilustrações e uso de emojis

### 10.1. Biblioteca

Recomendação: uma biblioteca de ícones consistente, por exemplo Lucide, customizada em tamanho e espessura em vez de misturar pacotes; validar licença e compatibilidade antes de fixar. Referência inicial: stroke 1,75–2px, geometria simples, 20px em UI, 16px em labels e 24px em ações de destaque.

### 10.2. Papel dos ícones

Ícone reforça informação textual; nunca substitui rótulo em ações sensíveis. Botões só com ícone precisam de `aria-label` e tooltip quando apropriado. Ícones de vídeo, áudio, arquivo, coleção, calendário, link, cadeado, globo, patrocinado, desconto, localização, busca, captura e download devem ser semanticamente consistentes.

### 10.3. Semânticas reservadas

- Coração: salvar/favoritar, não curtida social por padrão.
- Estrela: evitar confusão com nota pessoal 0–10; a avaliação deve mostrar `9,5/10` com origem.
- Sino: notificações; badge de leitura privado, não reputação.
- Cadeado: contexto privado, coleções restritas e conteúdos protegidos.
- Calendário/relógio: agenda e validade com timezone.
- Download: exclusivo aos originais autorizados; não mostrar em mídia de terceiros.
- Sparkle/IA: ajuda contextual, sem sugerir verificação independente.

### 10.4. Ilustração

Usar ilustrações abstratas minimalistas apenas quando fotos e UI não resolvem a comunicação (estados vazios, onboarding). Não multiplicar personagens cartoon. Emoji pode aparecer em conteúdo criado pelo usuário e microcopy ocasional, não como sistema de ícones operacional.

## 11. Motion, microinterações e feedback sensorial

### 11.1. Valores propostos

`instant=80ms`, `fast=140ms`, `standard=220ms`, `slow=320ms`, `enter=240ms`, `exit=160ms`; curvas sugeridas `ease-out` para entrada, `ease-in` para saída e spring contida em interações não críticas. Nunca introduzir delay artificial para parecer premium.

### 11.2. Aplicações

- Hover botão/card: transição de sombra ou cor 140–220ms, sem escala exagerada.
- Modal/sheet: fade + slide discreto até 12px; preservar foco.
- Salvar: feedback imediato com estado acessível, sem contador público nem chuva de partículas.
- Upload: progresso verdadeiro por arquivo; se indisponível mostrar processamento em etapa distinta; não simular percentuais de IA.
- Toast: entrada discreta, tempo adequado, não ser único feedback após erro crítico.
- Pesquisa com IA: estados “interpretando”, “buscando”, “organizando” quando verdadeiros; nunca mostrar falso streaming de respostas.
- Agendamento: confirmação indica data, horário, fuso e ação automática de encerramento.

### 11.3. Redução de movimento

Honrar `prefers-reduced-motion: reduce`: reduzir ou eliminar deslocamentos e loops, manter mudança semântica instantânea e preservar feedback por texto. Não ativar autoplay com áudio. Carrosséis não devem girar automaticamente sem controles de pausa; preferir manual.

### 11.4. Haptics e sons

Web desktop não exige feedback háptico/sonoro. Se a plataforma receber camada nativa, som e vibração precisam ser opcionais, discretos e desativáveis; não são requisito de MVP.

## 12. Acessibilidade e critérios normativos de UX

### 12.1. Baseline

**WCAG 2.2 AA** é requisito de projeto, confirmado no TRD. Componentes interativos precisam funcionar com teclado, toque, leitor de tela, zoom, contraste e texto aumentado. O teste automatizado é necessário, mas não suficiente; executar auditoria manual.

### 12.2. Contratos obrigatórios

| Aspecto | Regra operacional | Caso de teste |
|---|---|---|
| Contraste | 4,5:1 texto normal, 3:1 texto grande e elementos não textuais relevantes | screenshot e checker em todos os estados |
| Foco | foco visível; não inteiramente oculto por sticky/overlay | Tab/Shift+Tab e scroll |
| Alvo | WCAG 2.2 AA min 24px com exceções; padrão FAVX recomendado ≥44px | mobile real |
| Labels | label persistente para inputs; não depender de placeholder | VoiceOver/NVDA |
| Erros | texto claro, campo associado, resumo nos forms longos | invalidar e corrigir |
| Modais | focus trap, Escape quando seguro, retorno de foco | teclado |
| Navegação | landmarks, skip-link, H1 único | tree de acessibilidade |
| Mídia | controls, captions quando aplicável, transcrição e alt | vídeo/áudio/cross-browser |
| Motion | respeitar redução de movimento | OS reduzido |
| Idioma | `lang` correto em cada idioma/trecho relevante | i18n 6 locales |
| Mensagens | `aria-live` só para status necessários | upload, salvar, busca |
| Reflow | sem perda funcional em 320px e zoom relevante | viewport/zoom |

### 12.3. Componentes com risco alto

**Busca de voz:** botão acessível, indicação “gravando”, pausa/cancelamento, alternativa por texto, permissão de microfone. **Calendário:** digitação e seleção acessíveis, datas inválidas explicadas; UTC armazenado e fuso exibido. **Carrossel:** controle por teclado, aviso de posição “imagem 2 de 5”; sem autoplay. **Resultados de IA:** rótulos de fonte e estados de incerteza. **Media player:** keyboard shortcuts consistentes, legendas, controle de volume e tempo.

### 12.4. Critérios semânticos

Nenhum botão disfarçado de `div` clicável; usar `<button>`, `<a>`, `<input>`, `<form>` corretos. Link deve navegar; button deve executar ação. Em interface React, usar primitives acessíveis e verificar se abstrações não quebram semântica, teclado ou tradução.

## 13. Conteúdo de interface, tom de voz e microcopy

### 13.1. Voz aprovada

Clara, humana, atual, calma e confiante. Evitar excesso de entusiasmo, jargão técnico exposto e promessas sem fonte. Não chamar recomendação de “comprovada” quando é opinião de um creator. Não personificar IA como amiga íntima nem apresentar resultados incertos com falsa autoridade.

### 13.2. Vocabulário controlado

| Intenção | Texto recomendado | Evitar |
|---|---|---|
| Publicar agora | `Publicar` | `Soltar no ar!` |
| Programar | `Agendar publicação` | `Ativar automação` |
| Encerrar | `Encerrar exibição` | `Deletar ao vencer` |
| Ocultar | `Ocultar publicação` | `Despublicar e apagar` |
| Excluir | `Mover para a lixeira` | `Limpar` |
| Restaurar | `Restaurar publicação` | `Voltar no tempo` |
| Download | `Baixar arquivo original` | `Baixar conteúdo` sem informar variante |
| Busca sem resultado | `Não encontramos recomendações com esses critérios neste perfil.` | `A IA não sabe` |
| Favoritar | `Salvar` | `Dar like` |
| Patrocínio | `Patrocinado` | `Parceria` sem marcar publicidade quando aplicável |
| Recomendação da comunidade | `Enviado pela comunidade` | `Indicação do creator` |
| Context privado | `Contexto para a busca · privado` | `Descrição pública` |

### 13.3. Erros e riscos

Fórmula: **o que aconteceu + o que permaneceu seguro + próximo passo possível**. Exemplo: “Não foi possível concluir o envio. Seu rascunho foi preservado. Tentar novamente.” Não prometer rascunho preservado quando não estiver; usar estados de recuperação precisos.

### 13.4. Confirmações irreversíveis

Mostrar nome do item, consequência pública, efeito sobre métricas, disponibilidade de restauração e ação inequívoca. Destrutivo com confirmação mais forte apenas quando necessário; evitar “Tem certeza?” sem contexto.

### 13.5. Fuso, horário e valores

Data e hora exibidas no timezone escolhido; incluir zona textual em operações programadas sensíveis (ex.: `10 nov 2026, 10:00 (America/Sao_Paulo)`). Armazenamento do servidor em UTC; preview local consistente. Valores com `Intl.NumberFormat`, moeda independente de idioma; data/hora com `Intl.DateTimeFormat` e timezone explícito quando necessário.

### 13.6. Comunicação transacional

E-mails, toasts e alertas devem refletir o mesmo estado de sistema, indicar ação e nunca incluir Context privado, dados de audiência individuais ou informações de cobrança fora do âmbito necessário.

## 14. Internacionalização e identidade multilíngue

A interface, notificações, e-mails, textos legais, onboarding, ajuda e estados de erro devem ser localizados em **pt-BR, pt-PT, en, es, it e fr** desde o primeiro lançamento. Conteúdo dos creators não é traduzido automaticamente sem recurso explícito e autorização; preservar texto original e nome próprio.

**Regras:** construir strings via IDs, não concatenação; placeholders de variáveis nomeados; pluralização ICU; moeda separada de locale; botões fluidos; form labels que aceitem expansão de 30–50%; exibir formatos locais de data/telefone/números sem alterar dados originais; testar variantes de inglês/espanhol com termos longos; URLs e atributos SEO/hreflang definidos pelo TRD.

**Decisões de layout:** evitar navegação horizontal rígida que quebre em francês/italiano, truncamento escondendo ação crítica e componentes com largura pelo texto pt-BR. Compensar com wrap, scroll acessível, menus adaptativos ou abreviações homologadas por tradução.

**Qualidade linguística:** revisão humana nos fluxos críticos (pagamento, privacidade, expiração, exclusão, consentimento, patrocínio), suporte a caracteres acentuados e números tabulares. `aria-label` também localizado.

## 15. Biblioteca de componentes — contratos normativos

### 15.1. Taxonomia e construção

Biblioteca organizada em **foundations → primitives → composed components → patterns → screen templates**. Cada componente tem uma única implementação acessível e extensível, com propriedades explícitas, tipos seguros, estados e tokens. Cada `DS-CMP-*` é rastreável a screens do DOC 03 e, quando aplicável, a requisitos do PRD/TRD. O design no Figma e a implementação devem compartilhar nomes, propriedades e semântica.

**Estados mínimos:** default, hover (quando houver ponteiro), focus-visible, pressed, selected, disabled, busy/loading, success, warning, invalid/error e empty conforme o tipo. Não renderizar estados sem utilidade; não confundir `disabled` com permissão negada/upgrade. O recurso Plus bloqueado pede explicação e upgrade; operações proibidas pela autorização devem estar inacessíveis inclusive na API.

**Tipos de variantes:** `size`, `variant`, `tone`, `density`, `orientation`, `interactive`, `loading` e `disabled` apenas quando necessários; evitar combinações inválidas. Componentes não devem receber códigos hex, timing ou radius hardcoded em props de features.

### 15.2. A — Ações e status

#### DS-CMP-001 — Button

**Função:** Ação principal ou secundária. **Anatomia:** label, optional leading/trailing icon, progress, hit area. **Variantes/propriedades:** `primary|secondary|tertiary|text|danger; sm|md|lg`. **Estados a cobrir:** default,hover,focus,pressed,loading,disabled. **Semântica e acessibilidade:** Elemento button real; estado busy com aria-busy; ação não dispara duas vezes. **Responsive:** Mobile mínimo 48px; full-width somente quando fizer sentido. **Regra FAVX/critério de aceite:** Não usar para navegação; no carregamento preservar largura e rótulo. **Teste obrigatório:** componente com teclado e screen reader, estado de carregamento sem salto de layout, sem token hardcoded e com locale alternativo.

#### DS-CMP-002 — IconButton

**Função:** Ação compacta contextual. **Anatomia:** ícone 20–24px, área alvo, tooltip. **Variantes/propriedades:** `ghost|outlined|filled; md|lg`. **Estados a cobrir:** default,hover,focus,pressed,loading,disabled. **Semântica e acessibilidade:** Nome acessível obrigatório, nunca somente ícone. **Responsive:** Hit area ≥44px; posicionar fora de gesto ambíguo. **Regra FAVX/critério de aceite:** Usar em baixar próprio, compartilhar, fechar modal e reordenar. **Teste obrigatório:** componente com teclado e screen reader, estado de carregamento sem salto de layout, sem token hardcoded e com locale alternativo.

#### DS-CMP-003 — Link / InlineLink

**Função:** Navegação interna/externa. **Anatomia:** texto legível, sinalização externa quando pertinente. **Variantes/propriedades:** `default|subtle|external`. **Estados a cobrir:** hover,focus,visited quando aplicável. **Semântica e acessibilidade:** Âncora real com href e indicação de destino novo. **Responsive:** Quebra de linha preservada. **Regra FAVX/critério de aceite:** Links externos afiliados sempre com semântica clara. **Teste obrigatório:** componente com teclado e screen reader, estado de carregamento sem salto de layout, sem token hardcoded e com locale alternativo.

#### DS-CMP-004 — Badge / Tag de estado

**Função:** Identificação textual de estado. **Anatomia:** label, opcional ícone, cor semântica. **Variantes/propriedades:** `neutral|success|warning|danger|info|sponsored|offer`. **Estados a cobrir:** default; status de sistema não requer hover. **Semântica e acessibilidade:** Texto indispensável; sem cor isolada. **Responsive:** Wrap sem empilhar sobre face/foco de foto. **Regra FAVX/critério de aceite:** Usar Patrocinado, Oferta, Agendado, Expirado, Privado. **Teste obrigatório:** componente com teclado e screen reader, estado de carregamento sem salto de layout, sem token hardcoded e com locale alternativo.

#### DS-CMP-005 — Tooltip / HelpPopover

**Função:** Explicação não essencial. **Anatomia:** gatilho + conteúdo + fechamento. **Variantes/propriedades:** `tooltip|popover`. **Estados a cobrir:** open,closed,focus,escape. **Semântica e acessibilidade:** Tooltip em hover/focus; informação essencial fora dela. **Responsive:** Preferir popover acionável ao toque. **Regra FAVX/critério de aceite:** Não conter política ou aviso crítico apenas em tooltip. **Teste obrigatório:** componente com teclado e screen reader, estado de carregamento sem salto de layout, sem token hardcoded e com locale alternativo.

#### DS-CMP-006 — Skeleton / Progress

**Função:** Estado de carregamento. **Anatomia:** placeholder com dimensões reservadas + status. **Variantes/propriedades:** `linear|circular|step|skeleton`. **Estados a cobrir:** loading,completed,failed. **Semântica e acessibilidade:** aria-busy e comunicação textual apropriada. **Responsive:** Não prender a tela inteira sem necessidade. **Regra FAVX/critério de aceite:** Percentual somente quando conhecido, nunca progresso fictício. **Teste obrigatório:** componente com teclado e screen reader, estado de carregamento sem salto de layout, sem token hardcoded e com locale alternativo.

#### DS-CMP-007 — Toast / InlineAlert

**Função:** Feedback breve/persistente. **Anatomia:** ícone + título + mensagem + ação opcional. **Variantes/propriedades:** `success|info|warning|error`. **Estados a cobrir:** visible,dismissed,action. **Semântica e acessibilidade:** aria-live com parcimônia; erros críticos persistentes. **Responsive:** Não bloquear CTA do rodapé. **Regra FAVX/critério de aceite:** Feedback de copiar link, salvar, upload; crítica em alerta inline. **Teste obrigatório:** componente com teclado e screen reader, estado de carregamento sem salto de layout, sem token hardcoded e com locale alternativo.

#### DS-CMP-008 — EmptyState

**Função:** Explicar ausência de conteúdo. **Anatomia:** título + texto + CTA + arte opcional. **Variantes/propriedades:** `no-content|no-results|no-permission|error`. **Estados a cobrir:** initial,filtered,recovery. **Semântica e acessibilidade:** Texto distingue ausência, filtro e problema técnico. **Responsive:** Layout vertical sem banner excessivo. **Regra FAVX/critério de aceite:** Sem dados de busca não afirmar que creator não recomenda nada. **Teste obrigatório:** componente com teclado e screen reader, estado de carregamento sem salto de layout, sem token hardcoded e com locale alternativo.

#### DS-CMP-009 — Divider / Separator

**Função:** Separação estrutural. **Anatomia:** linha sutil ou espaço editorial. **Variantes/propriedades:** `horizontal|vertical`. **Estados a cobrir:** static. **Semântica e acessibilidade:** Separador decorativo não cria ruído de leitor. **Responsive:** Ocultar vertical em mobile quando necessário. **Regra FAVX/critério de aceite:** Nunca substituir hierarquia semântica por apenas linha. **Teste obrigatório:** componente com teclado e screen reader, estado de carregamento sem salto de layout, sem token hardcoded e com locale alternativo.

#### DS-CMP-010 — ConfirmationDialog

**Função:** Confirmar operação sensível. **Anatomia:** título + consequência + alvo + ações. **Variantes/propriedades:** `standard|destructive|financial`. **Estados a cobrir:** open,submitting,error,success. **Semântica e acessibilidade:** Focus trap, retorno de foco, ordem segura e botão específico. **Responsive:** Sheet grande se detalhes longos. **Regra FAVX/critério de aceite:** Texto claro para exclusão, revogação, cancelamento, moderação. **Teste obrigatório:** componente com teclado e screen reader, estado de carregamento sem salto de layout, sem token hardcoded e com locale alternativo.

### 15.3. B — Entrada e formulários

#### DS-CMP-011 — TextInput

**Função:** Entrada de texto de uma linha. **Anatomia:** label, field, help, error, counter quando pertinente. **Variantes/propriedades:** `default|search|url|email`. **Estados a cobrir:** default,focus,filled,invalid,disabled,read-only. **Semântica e acessibilidade:** label associado; autocomplete; mensagem de erro vinculada. **Responsive:** largura 100% e input 16px para evitar zoom indesejado. **Regra FAVX/critério de aceite:** Não confiar apenas em validação client-side. **Teste obrigatório:** componente com teclado e screen reader, estado de carregamento sem salto de layout, sem token hardcoded e com locale alternativo.

#### DS-CMP-012 — TextArea / RichText

**Função:** Descrição e conteúdo editorial. **Anatomia:** label, textarea/editor, toolbar opcional, contador. **Variantes/propriedades:** `plain|editorial|private-context`. **Estados a cobrir:** empty,editing,invalid,saving. **Semântica e acessibilidade:** atalhos consistentes; formatos sem dependência de mouse. **Responsive:** toolbar quebrável e rolagem controlada. **Regra FAVX/critério de aceite:** Context privado tem indicador persistente de privacidade. **Teste obrigatório:** componente com teclado e screen reader, estado de carregamento sem salto de layout, sem token hardcoded e com locale alternativo.

#### DS-CMP-013 — Combobox / Autocomplete

**Função:** Selecionar tags, locais e categorias. **Anatomia:** input, sugestões, ações, estados. **Variantes/propriedades:** `single|multi|async`. **Estados a cobrir:** typing,open,loading,no-results,selected. **Semântica e acessibilidade:** Padrão combobox ARIA com teclado e anúncio. **Responsive:** Menu ancorado e viewport-aware. **Regra FAVX/critério de aceite:** Opções AI sugeridas distinguem sugestões de escolhas do creator. **Teste obrigatório:** componente com teclado e screen reader, estado de carregamento sem salto de layout, sem token hardcoded e com locale alternativo.

#### DS-CMP-014 — Select / Listbox

**Função:** Escolher opção fechada. **Anatomia:** label, trigger, list, selection. **Variantes/propriedades:** `single|multi`. **Estados a cobrir:** open,selected,invalid,disabled. **Semântica e acessibilidade:** Teclado, foco e texto da seleção claros. **Responsive:** Bottom sheet quando lista longa. **Regra FAVX/critério de aceite:** Não ocultar opções de localização/idioma sob texto truncado. **Teste obrigatório:** componente com teclado e screen reader, estado de carregamento sem salto de layout, sem token hardcoded e com locale alternativo.

#### DS-CMP-015 — Checkbox

**Função:** Consentimento e seleção múltipla. **Anatomia:** controle, texto, link de política quando pertinente. **Variantes/propriedades:** `single|group`. **Estados a cobrir:** checked,unchecked,indeterminate,invalid. **Semântica e acessibilidade:** label clicável, estado anunciado. **Responsive:** alvo 44px. **Regra FAVX/critério de aceite:** Consentimento comercial deve ser granular, nunca pré-marcado. **Teste obrigatório:** componente com teclado e screen reader, estado de carregamento sem salto de layout, sem token hardcoded e com locale alternativo.

#### DS-CMP-016 — RadioGroup / Segmented

**Função:** Escolha exclusiva. **Anatomia:** legend + opções + descrição. **Variantes/propriedades:** `radio|segmented`. **Estados a cobrir:** selected,focus,disabled. **Semântica e acessibilidade:** roving tabindex e label claros. **Responsive:** opções podem quebrar linha. **Regra FAVX/critério de aceite:** Não usar segmentado para opções com texto extenso. **Teste obrigatório:** componente com teclado e screen reader, estado de carregamento sem salto de layout, sem token hardcoded e com locale alternativo.

#### DS-CMP-017 — Switch

**Função:** Ativar configuração imediata. **Anatomia:** label + toggle + descrição de efeito. **Variantes/propriedades:** `setting|feature`. **Estados a cobrir:** on,off,loading,disabled. **Semântica e acessibilidade:** Estado on/off anunciado; não para enviar formulário. **Responsive:** touch 44px. **Regra FAVX/critério de aceite:** Separar ligar patrocínio de confirmação legal. **Teste obrigatório:** componente com teclado e screen reader, estado de carregamento sem salto de layout, sem token hardcoded e com locale alternativo.

#### DS-CMP-018 — DatePicker

**Função:** Escolha de data. **Anatomia:** label, input editável, calendário. **Variantes/propriedades:** `single|range`. **Estados a cobrir:** open,invalid,disabled,selected. **Semântica e acessibilidade:** digitação alternativa, grid e navegação por teclado. **Responsive:** modal/sheet adaptado. **Regra FAVX/critério de aceite:** Bloquear datas inválidas com explicação legível. **Teste obrigatório:** componente com teclado e screen reader, estado de carregamento sem salto de layout, sem token hardcoded e com locale alternativo.

#### DS-CMP-019 — TimePicker / Timezone

**Função:** Escolher hora com fuso. **Anatomia:** HH:MM + timezone + resumo humano. **Variantes/propriedades:** `24h|12h por locale`. **Estados a cobrir:** default,invalid,ambiguous-DST. **Semântica e acessibilidade:** exibir timezone; alertar horas inexistentes/repetidas. **Responsive:** inputs grandes em mobile. **Regra FAVX/critério de aceite:** Persistir em UTC mantendo zona originalmente escolhida. **Teste obrigatório:** componente com teclado e screen reader, estado de carregamento sem salto de layout, sem token hardcoded e com locale alternativo.

#### DS-CMP-020 — FormField / FormSection

**Função:** Padronizar campos e erros. **Anatomia:** label, required, help, control, error. **Variantes/propriedades:** `standard|compact`. **Estados a cobrir:** valid,invalid,submitting. **Semântica e acessibilidade:** resumo de erros; required explicitado. **Responsive:** seções empilhadas no mobile. **Regra FAVX/critério de aceite:** Nenhum alerta desaparece antes da correção. **Teste obrigatório:** componente com teclado e screen reader, estado de carregamento sem salto de layout, sem token hardcoded e com locale alternativo.

#### DS-CMP-021 — Chip / FilterChip

**Função:** Aplicar/refinar filtros. **Anatomia:** texto, opcional remove, selected icon. **Variantes/propriedades:** `filter|removable|suggestion`. **Estados a cobrir:** selected,unselected,disabled. **Semântica e acessibilidade:** nome acessível e indicador de seleção. **Responsive:** wrap/scroll com acessibilidade. **Regra FAVX/critério de aceite:** Filtros de busca podem ser removidos individualmente. **Teste obrigatório:** componente com teclado e screen reader, estado de carregamento sem salto de layout, sem token hardcoded e com locale alternativo.

#### DS-CMP-022 — SearchField / VoiceTrigger

**Função:** Entrada de consulta textual ou áudio. **Anatomia:** input, limpar, voz, submit, contexto. **Variantes/propriedades:** `simple|conversational|scoped`. **Estados a cobrir:** idle,typing,listening,transcribing,loading,error. **Semântica e acessibilidade:** microfone com permissão e alternativa textual. **Responsive:** posição de destaque na página Creator. **Regra FAVX/critério de aceite:** Nunca sugerir que procura globalmente no MVP. **Teste obrigatório:** componente com teclado e screen reader, estado de carregamento sem salto de layout, sem token hardcoded e com locale alternativo.

#### DS-CMP-023 — FilePicker / Dropzone

**Função:** Escolha e envio seguro de arquivos. **Anatomia:** drop area, browse, formatos, limite, lista. **Variantes/propriedades:** `single|multi|capture`. **Estados a cobrir:** idle,dragover,uploading,invalid,failed. **Semântica e acessibilidade:** alternativa por botão, não apenas drag-and-drop. **Responsive:** file picker/camera explícitos. **Regra FAVX/critério de aceite:** validar limites originais e notificar rejeição por arquivo. **Teste obrigatório:** componente com teclado e screen reader, estado de carregamento sem salto de layout, sem token hardcoded e com locale alternativo.

#### DS-CMP-024 — RatingSelector

**Função:** Avaliação pessoal de recomendação. **Anatomia:** marcação 0–10 e indicador de passo. **Variantes/propriedades:** `score-10; half-step`. **Estados a cobrir:** empty,selected,editing,disabled. **Semântica e acessibilidade:** controle por teclado; valor anunciado como nota pessoal. **Responsive:** escolha via slider/botões grandes. **Regra FAVX/critério de aceite:** Não converter em rating público agregado. **Teste obrigatório:** componente com teclado e screen reader, estado de carregamento sem salto de layout, sem token hardcoded e com locale alternativo.

#### DS-CMP-025 — CouponEditor

**Função:** Inserir ofertas e códigos. **Anatomia:** código, copiar, validade, condições, tipo. **Variantes/propriedades:** `single|multiple`. **Estados a cobrir:** draft,active,expired,invalid. **Semântica e acessibilidade:** botão copiar acessível; prazo legível. **Responsive:** stack vertical e wrap. **Regra FAVX/critério de aceite:** Não inferir desconto de URL sem confirmação do creator. **Teste obrigatório:** componente com teclado e screen reader, estado de carregamento sem salto de layout, sem token hardcoded e com locale alternativo.

### 15.4. C — Navegação e estrutura

#### DS-CMP-026 — PublicHeader

**Função:** Navegação de páginas públicas. **Anatomia:** marca, CTA, busca quando aplicável, menu. **Variantes/propriedades:** `landing|creator|share`. **Estados a cobrir:** scrolled,menu-open,loading. **Semântica e acessibilidade:** skip-link e navegação por teclado. **Responsive:** header compacto sticky sem cobrir foco. **Regra FAVX/critério de aceite:** Não mostrar seguidores como badge público. **Teste obrigatório:** componente com teclado e screen reader, estado de carregamento sem salto de layout, sem token hardcoded e com locale alternativo.

#### DS-CMP-027 — AppSidebar

**Função:** Navegação User/Creator/Admin. **Anatomia:** itens, seção ativa, conta atual. **Variantes/propriedades:** `user|creator|partner|admin`. **Estados a cobrir:** active,collapsed,open. **Semântica e acessibilidade:** landmark nav e seleção descrita. **Responsive:** substituir por drawer/tab conforme viewport. **Regra FAVX/critério de aceite:** Permissões reais determinam itens renderizados. **Teste obrigatório:** componente com teclado e screen reader, estado de carregamento sem salto de layout, sem token hardcoded e com locale alternativo.

#### DS-CMP-028 — BottomNavigation

**Função:** Acesso rápido em mobile. **Anatomia:** 3–5 itens + labels. **Variantes/propriedades:** `user|creator`. **Estados a cobrir:** active,inactive. **Semântica e acessibilidade:** label sempre visível; alvo 44px. **Responsive:** safe area bottom. **Regra FAVX/critério de aceite:** Não misturar áreas administrativas em nav User. **Teste obrigatório:** componente com teclado e screen reader, estado de carregamento sem salto de layout, sem token hardcoded e com locale alternativo.

#### DS-CMP-029 — Breadcrumbs

**Função:** Orientar hierarquia. **Anatomia:** ancestrais, página atual. **Variantes/propriedades:** `compact|full`. **Estados a cobrir:** normal,overflow. **Semântica e acessibilidade:** ol/current aria e links válidos. **Responsive:** colapsar itens intermediários. **Regra FAVX/critério de aceite:** Não usar caminho como substituto do título. **Teste obrigatório:** componente com teclado e screen reader, estado de carregamento sem salto de layout, sem token hardcoded e com locale alternativo.

#### DS-CMP-030 — Tabs

**Função:** Alternância no mesmo contexto. **Anatomia:** tablist, tab, tabpanel. **Variantes/propriedades:** `line|pills`. **Estados a cobrir:** active,focus,disabled. **Semântica e acessibilidade:** roving tabindex; aria-controls. **Responsive:** scroll acessível e wrap seletivo. **Regra FAVX/critério de aceite:** Não usar tabs para ocultar recurso pago sem explicar. **Teste obrigatório:** componente com teclado e screen reader, estado de carregamento sem salto de layout, sem token hardcoded e com locale alternativo.

#### DS-CMP-031 — Pagination / InfiniteScroll

**Função:** Navegar resultados. **Anatomia:** mais resultados, contador por lote. **Variantes/propriedades:** `pagination|load-more`. **Estados a cobrir:** loading,done,error. **Semântica e acessibilidade:** teclado, foco preservado e links quando útil. **Responsive:** preferir load more controlado. **Regra FAVX/critério de aceite:** Evitar scroll infinito sem saída em arquivos pessoais. **Teste obrigatório:** componente com teclado e screen reader, estado de carregamento sem salto de layout, sem token hardcoded e com locale alternativo.

#### DS-CMP-032 — Avatar / Identity

**Função:** Representar pessoa ou creator. **Anatomia:** foto, fallback com iniciais, alt contextual. **Variantes/propriedades:** `user|creator|partner`. **Estados a cobrir:** image,placeholder,error. **Semântica e acessibilidade:** decorativo ou texto alternativo conforme contexto. **Responsive:** tamanhos por token. **Regra FAVX/critério de aceite:** Não exibir número público de seguidores acoplado. **Teste obrigatório:** componente com teclado e screen reader, estado de carregamento sem salto de layout, sem token hardcoded e com locale alternativo.

#### DS-CMP-033 — ProfileSwitch

**Função:** Alternar User/Creator. **Anatomia:** nome da área, opção, indicação de troca. **Variantes/propriedades:** `popover|menu`. **Estados a cobrir:** open,selected,unavailable. **Semântica e acessibilidade:** explicitar papel, não novo login. **Responsive:** sheet no mobile. **Regra FAVX/critério de aceite:** Um usuário pode ter ambos papéis mesma identidade. **Teste obrigatório:** componente com teclado e screen reader, estado de carregamento sem salto de layout, sem token hardcoded e com locale alternativo.

#### DS-CMP-034 — Footer / by FAVX

**Função:** Fechamento e atribuição. **Anatomia:** links legais, idioma, marca. **Variantes/propriedades:** `public|app|minimal`. **Estados a cobrir:** static. **Semântica e acessibilidade:** links navegáveis e contraste. **Responsive:** não fixo sobre conteúdo. **Regra FAVX/critério de aceite:** Nunca substituir identidade do creator. **Teste obrigatório:** componente com teclado e screen reader, estado de carregamento sem salto de layout, sem token hardcoded e com locale alternativo.

#### DS-CMP-035 — PageShell / ContentArea

**Função:** Container padrão de tela. **Anatomia:** header, aside, main, actions. **Variantes/propriedades:** `public|user|creator|admin|auth`. **Estados a cobrir:** loading,empty,error. **Semântica e acessibilidade:** main único, skip-link, heading. **Responsive:** padding e max-width responsivos. **Regra FAVX/critério de aceite:** Container por contexto, não CSS global improvisado. **Teste obrigatório:** componente com teclado e screen reader, estado de carregamento sem salto de layout, sem token hardcoded e com locale alternativo.

### 15.5. D — Conteúdo editorial e mídia

#### DS-CMP-036 — RecommendationCard

**Função:** Unidade de descoberta. **Anatomia:** mídia, título, creator, contexto, ações. **Variantes/propriedades:** `photo|video|audio|text|carousel`. **Estados a cobrir:** default,hover,saved,expired. **Semântica e acessibilidade:** link principal sem controles aninhados; botões separados. **Responsive:** card vertical responsivo. **Regra FAVX/critério de aceite:** Não mostrar contagens de saves/views; Patrocinado explícito. **Teste obrigatório:** componente com teclado e screen reader, estado de carregamento sem salto de layout, sem token hardcoded e com locale alternativo.

#### DS-CMP-037 — CollectionCard

**Função:** Apresentar coleção. **Anatomia:** capa composta, título, descrição, privacy. **Variantes/propriedades:** `creator|user|shared`. **Estados a cobrir:** default,private,empty. **Semântica e acessibilidade:** capa com alt, links e ações distintos. **Responsive:** 1 coluna em compacto, 2+ em amplo. **Regra FAVX/critério de aceite:** Não revelar salvos privados nem quantidade de seguidores. **Teste obrigatório:** componente com teclado e screen reader, estado de carregamento sem salto de layout, sem token hardcoded e com locale alternativo.

#### DS-CMP-038 — ProfileHero / CreatorBio

**Função:** Identidade pública e navegação. **Anatomia:** avatar, nome, bio, links, busca. **Variantes/propriedades:** `compact|editorial`. **Estados a cobrir:** complete,missing-image. **Semântica e acessibilidade:** hierarquia H1, links acessíveis. **Responsive:** foto e informações empilhadas. **Regra FAVX/critério de aceite:** Sem placar público de seguidores/seguindo. **Teste obrigatório:** componente com teclado e screen reader, estado de carregamento sem salto de layout, sem token hardcoded e com locale alternativo.

#### DS-CMP-039 — PostDetail

**Função:** Detalhe de recomendação. **Anatomia:** mídia principal, título, links, cupons, tags, nota. **Variantes/propriedades:** `public|owner-preview|community`. **Estados a cobrir:** available,expired,unavailable. **Semântica e acessibilidade:** origem autoral e patrocínio explícitos. **Responsive:** scroll e CTA contextual. **Regra FAVX/critério de aceite:** Context privado nunca aparece. **Teste obrigatório:** componente com teclado e screen reader, estado de carregamento sem salto de layout, sem token hardcoded e com locale alternativo.

#### DS-CMP-040 — MediaGallery / Carousel

**Função:** Mídia multiparte. **Anatomia:** slides, controles, contador do carrossel. **Variantes/propriedades:** `images|mixed|fullscreen`. **Estados a cobrir:** loading,ready,error,end. **Semântica e acessibilidade:** operável com teclado, slides nomeados. **Responsive:** swipe + botões; sem autoplay. **Regra FAVX/critério de aceite:** até limite do PRD; preservar ordem definida. **Teste obrigatório:** componente com teclado e screen reader, estado de carregamento sem salto de layout, sem token hardcoded e com locale alternativo.

#### DS-CMP-041 — VideoPlayer

**Função:** Reprodução de vídeo. **Anatomia:** poster, play, timeline, volume, captions. **Variantes/propriedades:** `inline|full`. **Estados a cobrir:** loading,playing,paused,error. **Semântica e acessibilidade:** legendas e controles acessíveis. **Responsive:** aspect ratio preservado. **Regra FAVX/critério de aceite:** não autoplay com som; mostrar processamento. **Teste obrigatório:** componente com teclado e screen reader, estado de carregamento sem salto de layout, sem token hardcoded e com locale alternativo.

#### DS-CMP-042 — AudioPlayer

**Função:** Reprodução de áudio. **Anatomia:** play/pause, tempo, velocidade se aplicável, transcrição. **Variantes/propriedades:** `inline|expanded`. **Estados a cobrir:** loading,recorded,error. **Semântica e acessibilidade:** button real, tempo anunciado. **Responsive:** controles confortáveis. **Regra FAVX/critério de aceite:** áudio do creator e conteúdo de busca são fluxos distintos. **Teste obrigatório:** componente com teclado e screen reader, estado de carregamento sem salto de layout, sem token hardcoded e com locale alternativo.

#### DS-CMP-043 — MediaCapture

**Função:** Captura por câmera/microfone. **Anatomia:** preview, gravação, tempo, encerrar, refazer. **Variantes/propriedades:** `photo|video|audio`. **Estados a cobrir:** permission,recording,paused,review,error. **Semântica e acessibilidade:** avisos claros sobre permissão e gravação. **Responsive:** fullscreen responsivo e safe area. **Regra FAVX/critério de aceite:** preservar original e limite; orientar offline/retry. **Teste obrigatório:** componente com teclado e screen reader, estado de carregamento sem salto de layout, sem token hardcoded e com locale alternativo.

#### DS-CMP-044 — MediaUploadItem

**Função:** Status por arquivo. **Anatomia:** thumb, nome, size, progresso, retry, remove. **Variantes/propriedades:** `image|video|audio|other`. **Estados a cobrir:** queued,uploading,processing,ready,failed. **Semântica e acessibilidade:** estado anunciado e retry acessível. **Responsive:** stack em mobile. **Regra FAVX/critério de aceite:** não afirmar upload concluído antes de confirmação. **Teste obrigatório:** componente com teclado e screen reader, estado de carregamento sem salto de layout, sem token hardcoded e com locale alternativo.

#### DS-CMP-045 — MediaDownload

**Função:** Acesso a arquivo próprio. **Anatomia:** opção original/otimizado, tamanho, CTA. **Variantes/propriedades:** `original|optimized`. **Estados a cobrir:** available,expired,not-authorized,error. **Semântica e acessibilidade:** clareza sobre variante e direitos. **Responsive:** bottom sheet simples. **Regra FAVX/critério de aceite:** controle backend de ownership; nunca terceiros. **Teste obrigatório:** componente com teclado e screen reader, estado de carregamento sem salto de layout, sem token hardcoded e com locale alternativo.

#### DS-CMP-046 — GalleryShareExport

**Função:** Exportar para redes. **Anatomia:** preview, template, branding, salvar/share. **Variantes/propriedades:** `post|collection|story`. **Estados a cobrir:** rendering,ready,failed. **Semântica e acessibilidade:** alternativa salvar local; sem promessa de postagem direta. **Responsive:** preview em 9:16/1:1. **Regra FAVX/critério de aceite:** marca FAVX discreta sem ocultar conteúdo. **Teste obrigatório:** componente com teclado e screen reader, estado de carregamento sem salto de layout, sem token hardcoded e com locale alternativo.

#### DS-CMP-047 — LinkPreview / ExternalCTA

**Função:** Prévia de produto/lugar/link. **Anatomia:** domínio, título, CTA, afiliado quando informado. **Variantes/propriedades:** `simple|enriched`. **Estados a cobrir:** loading,missing,stale. **Semântica e acessibilidade:** destino explícito; navegar fora. **Responsive:** sem pop-ups invasivos. **Regra FAVX/critério de aceite:** não inventar preço atual nem conteúdo indisponível. **Teste obrigatório:** componente com teclado e screen reader, estado de carregamento sem salto de layout, sem token hardcoded e com locale alternativo.

#### DS-CMP-048 — SponsoredDisclosure

**Função:** Indicar conteúdo comercial. **Anatomia:** label Patrocinado + contexto opcional. **Variantes/propriedades:** `inline|card|detail`. **Estados a cobrir:** visible. **Semântica e acessibilidade:** texto sempre presente. **Responsive:** não sobrepor sobre rostos. **Regra FAVX/critério de aceite:** conforme políticas locais e de publicidade. **Teste obrigatório:** componente com teclado e screen reader, estado de carregamento sem salto de layout, sem token hardcoded e com locale alternativo.

#### DS-CMP-049 — CommunityAttribution

**Função:** Identificar sugestão de terceiro. **Anatomia:** nome permitido, rótulo, origem. **Variantes/propriedades:** `anonymous|credited|creator-published`. **Estados a cobrir:** pending,public. **Semântica e acessibilidade:** texto legível e consentimento. **Responsive:** integra card sem confundir autoria. **Regra FAVX/critério de aceite:** Nunca atribuir indicação comunitária ao creator. **Teste obrigatório:** componente com teclado e screen reader, estado de carregamento sem salto de layout, sem token hardcoded e com locale alternativo.

### 15.6. E — Curadoria, busca e IA

#### DS-CMP-050 — CollectionBuilder

**Função:** Organizar e reordenar itens. **Anatomia:** lista, reorder, privacy, cover. **Variantes/propriedades:** `creator|user`. **Estados a cobrir:** draft,saving,saved,conflict. **Semântica e acessibilidade:** reordenação por botões além de drag. **Responsive:** cards empilhados. **Regra FAVX/critério de aceite:** privado por padrão quando user criar coleção. **Teste obrigatório:** componente com teclado e screen reader, estado de carregamento sem salto de layout, sem token hardcoded e com locale alternativo.

#### DS-CMP-051 — SaveAction

**Função:** Salvar recomendação. **Anatomia:** botão, estado, escolha de pasta. **Variantes/propriedades:** `save|unsave`. **Estados a cobrir:** unsaved,saved,busy. **Semântica e acessibilidade:** aviso de login só na ação, não na leitura pública. **Responsive:** hit area confortável. **Regra FAVX/critério de aceite:** salvamento e métricas privados. **Teste obrigatório:** componente com teclado e screen reader, estado de carregamento sem salto de layout, sem token hardcoded e com locale alternativo.

#### DS-CMP-052 — SearchResultCard

**Função:** Resultado contextualizado. **Anatomia:** imagem, título, categoria, fonte, motivo curto. **Variantes/propriedades:** `text|semantic|local`. **Estados a cobrir:** loading,match,uncertain. **Semântica e acessibilidade:** explicar origem sem fatos inventados. **Responsive:** card vertical com ações. **Regra FAVX/critério de aceite:** não revelar campo Context nem metadados privados. **Teste obrigatório:** componente com teclado e screen reader, estado de carregamento sem salto de layout, sem token hardcoded e com locale alternativo.

#### DS-CMP-053 — ConversationComposer

**Função:** Busca refinável por IA. **Anatomia:** campo, enviar, voz, histórico da sessão. **Variantes/propriedades:** `scoped|own-library`. **Estados a cobrir:** idle,recording,thinking,refining. **Semântica e acessibilidade:** retorno de estado e foco. **Responsive:** fixação discreta sem ocultar resultados. **Regra FAVX/critério de aceite:** nunca parecer chat genérico que substitui cards. **Teste obrigatório:** componente com teclado e screen reader, estado de carregamento sem salto de layout, sem token hardcoded e com locale alternativo.

#### DS-CMP-054 — SearchFilterPanel

**Função:** Filtro categoria/data/local. **Anatomia:** chips, checkboxes, date range, location. **Variantes/propriedades:** `sidebar|drawer|inline`. **Estados a cobrir:** open,applied,clear. **Semântica e acessibilidade:** filtros anunciados, reset acessível. **Responsive:** drawer ou sheet mobile. **Regra FAVX/critério de aceite:** mostrar quais filtros restringem o escopo. **Teste obrigatório:** componente com teclado e screen reader, estado de carregamento sem salto de layout, sem token hardcoded e com locale alternativo.

#### DS-CMP-055 — LocationSelector

**Função:** Localização consentida. **Anatomia:** texto, geolocalização opt-in, raio. **Variantes/propriedades:** `manual|device`. **Estados a cobrir:** idle,permission-denied,geocoding,error. **Semântica e acessibilidade:** não pedir precisão sem necessidade. **Responsive:** endereço manual sempre disponível. **Regra FAVX/critério de aceite:** nunca expor latitude precisa sem consentimento. **Teste obrigatório:** componente com teclado e screen reader, estado de carregamento sem salto de layout, sem token hardcoded e com locale alternativo.

#### DS-CMP-056 — SearchEvidence

**Função:** Fonte e contexto de resposta. **Anatomia:** source label, citação/trecho permitido, aviso. **Variantes/propriedades:** `creator|community|verified-source`. **Estados a cobrir:** known,uncertain,missing. **Semântica e acessibilidade:** texto sem jargão de IA. **Responsive:** texto breve e expansível. **Regra FAVX/critério de aceite:** Context privado pode influir no ranking, não virar afirmação pública. **Teste obrigatório:** componente com teclado e screen reader, estado de carregamento sem salto de layout, sem token hardcoded e com locale alternativo.

#### DS-CMP-057 — AIStatus / Transcript

**Função:** Transcrição e interpretação. **Anatomia:** áudio, texto editável, ação confirmar. **Variantes/propriedades:** `voice-query|creator-description|private-context`. **Estados a cobrir:** transcribing,review,approved,failed. **Semântica e acessibilidade:** alternativa digitar/editar. **Responsive:** editor responsivo. **Regra FAVX/critério de aceite:** Nunca publicar transcrição privada por engano. **Teste obrigatório:** componente com teclado e screen reader, estado de carregamento sem salto de layout, sem token hardcoded e com locale alternativo.

#### DS-CMP-058 — PrivateContextEditor

**Função:** Campo FAVX Context. **Anatomia:** rótulo privado, editor texto/áudio, status embedding. **Variantes/propriedades:** `private`. **Estados a cobrir:** draft,transcribing,saved,processing,error. **Semântica e acessibilidade:** aviso claro do uso semântico. **Responsive:** painel protegido e label persistente. **Regra FAVX/critério de aceite:** Dados nunca enviados no payload da página pública. **Teste obrigatório:** componente com teclado e screen reader, estado de carregamento sem salto de layout, sem token hardcoded e com locale alternativo.

#### DS-CMP-059 — SearchEmptyOrCorrection

**Função:** Sem resultado/ambiguidade. **Anatomia:** explicação, filtros ativos, sugestões válidas. **Variantes/propriedades:** `none|clarify|retry`. **Estados a cobrir:** no-match,ambiguous,service-error. **Semântica e acessibilidade:** sugestões controláveis por teclado. **Responsive:** cards e ações de refinamento. **Regra FAVX/critério de aceite:** distinguir não encontrado de falha de IA. **Teste obrigatório:** componente com teclado e screen reader, estado de carregamento sem salto de layout, sem token hardcoded e com locale alternativo.

#### DS-CMP-060 — EntityReference

**Função:** Objeto canônico futuro. **Anatomia:** nome, categoria, fonte, aliases. **Variantes/propriedades:** `local-index|global-future`. **Estados a cobrir:** verified,unverified. **Semântica e acessibilidade:** marcar fonte/limites. **Responsive:** não expor busca global no MVP. **Regra FAVX/critério de aceite:** componente de dados preparado sem UI de global search. **Teste obrigatório:** componente com teclado e screen reader, estado de carregamento sem salto de layout, sem token hardcoded e com locale alternativo.

### 15.7. F — Gestão Creator, pagamento e administração

#### DS-CMP-061 — PublicationScheduler

**Função:** Início/fim da exibição. **Anatomia:** date/time fields, timezone, resumo, validações. **Variantes/propriedades:** `post|banner|pin`. **Estados a cobrir:** draft,scheduled,invalid,conflict,expired. **Semântica e acessibilidade:** explicar ocultação ≠ exclusão. **Responsive:** modal/sheet responsivo. **Regra FAVX/critério de aceite:** post, banner e pin têm ciclo temporal separado. **Teste obrigatório:** componente com teclado e screen reader, estado de carregamento sem salto de layout, sem token hardcoded e com locale alternativo.

#### DS-CMP-062 — ContentStatus / Lifecycle

**Função:** Estado do item. **Anatomia:** label, datas, autor da ação, CTAs. **Variantes/propriedades:** `draft|scheduled|live|hidden|expired|archived|trash`. **Estados a cobrir:** stable,transition,error. **Semântica e acessibilidade:** estado textual independente de cor. **Responsive:** resumo de 2 linhas. **Regra FAVX/critério de aceite:** não alterar histórico se expirar. **Teste obrigatório:** componente com teclado e screen reader, estado de carregamento sem salto de layout, sem token hardcoded e com locale alternativo.

#### DS-CMP-063 — BannerComposer

**Função:** Criar destaque comercial. **Anatomia:** imagem, texto, CTA, calendário, disclosure. **Variantes/propriedades:** `plus`. **Estados a cobrir:** draft,live,scheduled,expired. **Semântica e acessibilidade:** contraste e disclosure em preview. **Responsive:** crop seguro e versão mobile. **Regra FAVX/critério de aceite:** limite de 10 banners Plus; política de slot a confirmar. **Teste obrigatório:** componente com teclado e screen reader, estado de carregamento sem salto de layout, sem token hardcoded e com locale alternativo.

#### DS-CMP-064 — PinManager

**Função:** Fixar/reordenar/agendar. **Anatomia:** listagem + posições + janela temporal. **Variantes/propriedades:** `plus`. **Estados a cobrir:** active,scheduled,conflict,expired. **Semântica e acessibilidade:** reorder por teclado. **Responsive:** lista responsiva. **Regra FAVX/critério de aceite:** limite 6 fixações simultâneas; não expirar post ao desfixar. **Teste obrigatório:** componente com teclado e screen reader, estado de carregamento sem salto de layout, sem token hardcoded e com locale alternativo.

#### DS-CMP-065 — MetricsStat / Chart

**Função:** Métrica privada de Creator. **Anatomia:** número, rótulo, período, variação, fonte. **Variantes/propriedades:** `overview|post|search|banner`. **Estados a cobrir:** loading,empty,insufficient-data. **Semântica e acessibilidade:** tabular numbers, data table alternativa. **Responsive:** scroll/stack sem sumir filtros. **Regra FAVX/critério de aceite:** sem exposição pública; Plus gating; filtros de bot. **Teste obrigatório:** componente com teclado e screen reader, estado de carregamento sem salto de layout, sem token hardcoded e com locale alternativo.

#### DS-CMP-066 — BillingPlan / PriceCard

**Função:** Comparar Free/Plus. **Anatomia:** preço, período, benefits, CTA, termos. **Variantes/propriedades:** `free|monthly|annual`. **Estados a cobrir:** current,trial,available,unavailable. **Semântica e acessibilidade:** moeda explícita; preço completo e período. **Responsive:** cards empilhados. **Regra FAVX/critério de aceite:** R$89,90 mensal; R$899 anual; US$19/€19 mensal; anual USD/EUR pendente. **Teste obrigatório:** componente com teclado e screen reader, estado de carregamento sem salto de layout, sem token hardcoded e com locale alternativo.

#### DS-CMP-067 — SubscriptionStatus

**Função:** Gerenciar trial e cancelamento. **Anatomia:** status, fim período, método, ações. **Variantes/propriedades:** `trial|active|past-due|canceling|canceled`. **Estados a cobrir:** fetching,error,confirmed. **Semântica e acessibilidade:** datas, consequências e links claros. **Responsive:** layout vertical. **Regra FAVX/critério de aceite:** benefícios até fim vigência conforme PRD; não esconder custos. **Teste obrigatório:** componente com teclado e screen reader, estado de carregamento sem salto de layout, sem token hardcoded e com locale alternativo.

#### DS-CMP-068 — PartnerReferralPanel

**Função:** Indicações e comissões. **Anatomia:** link, copiar, relatórios, pagamento. **Variantes/propriedades:** `pending|approved|active`. **Estados a cobrir:** empty,loading,withheld,error. **Semântica e acessibilidade:** saldos e status com rótulos. **Responsive:** cards + tabela responsiva. **Regra FAVX/critério de aceite:** comissão base R$19,90 por assinatura válida; sem upsell. **Teste obrigatório:** componente com teclado e screen reader, estado de carregamento sem salto de layout, sem token hardcoded e com locale alternativo.

#### DS-CMP-069 — AdminTable / DataGrid

**Função:** Gestão operacional. **Anatomia:** table header, filtros, linhas, ações, paginação. **Variantes/propriedades:** `standard|compact`. **Estados a cobrir:** loading,empty,sorted,error. **Semântica e acessibilidade:** tabela semântica, sort anunciado. **Responsive:** cards ou scroll limitado. **Regra FAVX/critério de aceite:** RBAC e audit trail em ações sensíveis. **Teste obrigatório:** componente com teclado e screen reader, estado de carregamento sem salto de layout, sem token hardcoded e com locale alternativo.

#### DS-CMP-070 — AdminAction / Audit

**Função:** Confirmar ação administrativa. **Anatomia:** alvo, permissão, justificativa, confirmação. **Variantes/propriedades:** `moderation|finance|account|support`. **Estados a cobrir:** open,submitting,failed,success. **Semântica e acessibilidade:** explicação de consequência e role. **Responsive:** modal acessível. **Regra FAVX/critério de aceite:** nunca consultar Context privado por rotina. **Teste obrigatório:** componente com teclado e screen reader, estado de carregamento sem salto de layout, sem token hardcoded e com locale alternativo.

#### DS-CMP-071 — NotificationCenter

**Função:** Notificações internas. **Anatomia:** lista, unread, filtros, CTA. **Variantes/propriedades:** `user|creator|partner|admin`. **Estados a cobrir:** new,read,empty,failed. **Semântica e acessibilidade:** não depender de cor no status lido. **Responsive:** drawer ou página. **Regra FAVX/critério de aceite:** mensagens não incluem dados privados sensíveis em previews. **Teste obrigatório:** componente com teclado e screen reader, estado de carregamento sem salto de layout, sem token hardcoded e com locale alternativo.

#### DS-CMP-072 — PrivacyControls

**Função:** Consentimentos e dados. **Anatomia:** toggling, ledger, export, delete. **Variantes/propriedades:** `account|marketplace-future`. **Estados a cobrir:** granted,denied,revoked. **Semântica e acessibilidade:** sem dark patterns e checkbox premarcado. **Responsive:** seções claras. **Regra FAVX/critério de aceite:** marketplace não disponível no MVP; autorização futura granular. **Teste obrigatório:** componente com teclado e screen reader, estado de carregamento sem salto de layout, sem token hardcoded e com locale alternativo.

#### DS-CMP-073 — FileRetentionPanel

**Função:** Conteúdo expirado e lixeira. **Anatomia:** lista, prazo, restaurar, excluir. **Variantes/propriedades:** `creator|owner`. **Estados a cobrir:** expired,trash,restored,purged. **Semântica e acessibilidade:** aviso legal sobre recuperação. **Responsive:** ações com confirmação. **Regra FAVX/critério de aceite:** 30 dias como proposta de lixeira, não prazo homologado. **Teste obrigatório:** componente com teclado e screen reader, estado de carregamento sem salto de layout, sem token hardcoded e com locale alternativo.

#### DS-CMP-074 — SupportForm

**Função:** Contato e suporte. **Anatomia:** assunto, descrição, anexos permitidos. **Variantes/propriedades:** `visitor|user|creator`. **Estados a cobrir:** empty,invalid,submitted,error. **Semântica e acessibilidade:** mensagem de privacidade e ticket. **Responsive:** full width mobile. **Regra FAVX/critério de aceite:** não solicitar dados financeiros sensíveis. **Teste obrigatório:** componente com teclado e screen reader, estado de carregamento sem salto de layout, sem token hardcoded e com locale alternativo.

#### DS-CMP-075 — ModerationReport

**Função:** Denúncia de conteúdo. **Anatomia:** categoria, contexto, formulário, status. **Variantes/propriedades:** `public|internal`. **Estados a cobrir:** submitted,reviewing,resolved. **Semântica e acessibilidade:** anonimato/privacidade e estado legíveis. **Responsive:** dialog/sheet. **Regra FAVX/critério de aceite:** não fazer acusações ou expor denunciante. **Teste obrigatório:** componente com teclado e screen reader, estado de carregamento sem salto de layout, sem token hardcoded e com locale alternativo.

## 16. Contratos de padrões compostos e comportamento de fluxos

### 16.1. Sistema de templates

Cada tela no DOC 03 deve ser montada a partir de um dos **templates compostos**: `Marketing`, `PublicCreator`, `PublicContent`, `Library`, `CreatorWorkspace`, `CreationWizard`, `SearchExperience`, `Payment`, `PartnerWorkspace`, `AdminWorkspace`, `Auth`, `Overlay/Utility`, `FuturePlaceholder`. Os templates fornecem `PageShell`, navegação, margens, heading, prioridade de CTA, estados de erro e footer; o conteúdo de domínio entra por slots. No MVP não renderizar `FuturePlaceholder` como rota ativa.

### 16.2. Card de recomendação — regras detalhadas

**Prioridade visual:** mídia → título/descrição curta → dados úteis → ação externa/salvar. A foto pode dominar, mas o título e a funcionalidade precisam ser reconhecíveis sem carregar imagem. Vídeo/áudio devem ter affordance específica; carrossel revela tipo e posição sem parecer um anúncio interativo. Se houver patrocínio, o selo `Patrocinado` deve estar no topo da área informativa e continuar presente no detalhe. Se houver oferta, etiqueta discreta, validade legível e cupom copiável. Nota `9,5/10` é autoria pessoal do creator, nunca avaliação do FAVX ou de usuários.

**Estados:** active, skeleton, mídia falhou (placeholder + título), post oculto/expirado (não indexável publicamente, proprietário ainda vê), link externo indisponível (não ocultar post inteiro), conteúdo comunitário (atribuição). Acesso público sem login; salvar pede autenticação só após clique.

### 16.3. Página pública de creator

Topo com identidade compacta, bio e links; **campo de busca dentro do perfil** relevante e persistente na jornada; coleções e conteúdo em sequência editorial. Não apresentar contadores de seguidores, seguindo, saves, views, impressões, cliques ou outros placares de popularidade. `by FAVX` aparece em região secundária. Os componentes de visualização pública nunca devem aceitar dados do FAVX Context nem dashboards privados como props.

### 16.4. Biblioteca User

Salvamentos e coleções formam **espaço pessoal**, diferente de um feed social. Privacidade da coleção aparece de modo compreensível; compartilhar por link é ato explícito; revogação de link pede confirmação clara. A biblioteca mantém busca própria e estados de posts indisponíveis, sem promover acesso a conteúdo removido. Usuário pode tornar-se creator sem apagar salvos.

### 16.5. Editor e captura

Fluxo em etapas recuperáveis: selecionar/criar conteúdo → mídia/arquivo → descrição → metadados (links, tags, cupom, nota, patrocínio) → Context privado (se habilitado) → agenda → prévia → publicar/agendar. Manter status de salvamento visível, limites unitários na entrada, processo por arquivo e alternativa de texto. Em mídia capturada in-app, apresentar opção `Baixar original` quando arquivo tiver sido armazenado e ownership verificado; não apresentar download de mídia de terceiros. Repetir ou descartar gravação somente com consequência clara.

### 16.6. Agendamento: publicação, banner e fixação

Três fluxos com seletor de início e fim, timezone e resumo antes de salvar. **Expirar post** oculta conteúdo público e preserva histórico; **expirar banner** oculta apenas unidade; **expirar fixação** remove destaque e mantém post visível se publicação principal ativa. Sinais: `Agendado`, `Publicado`, `Expirado`, `Oculto`, `Arquivado`, `Lixeira`. Mostrador público jamais oferece acesso por link a item fora da janela autorizada. O painel privado mostra período de exibição e performance histórica mesmo após fim, enquanto política de retenção permitir.

### 16.7. Busca dentro de perfil, por IA e por voz

Entrada de linguagem natural compacta, com frase livre, voz opcional, filtros estruturados e resultados **visuais**. Em consultas como “churrascaria com espaço kids perto do Flamengo”, exibir chips de categoria, localização e característica quando interpretados; só mostrar estabelecimentos existentes no escopo do creator e com atributos sustentados em dados autorizados. Pergunta de refinamento deve manter escopo de creator. Se geolocalização negada, oferecer seleção manual, não erro bloqueante. Separar resultado vazio, dúvida e falha do serviço.

### 16.8. FAVX Context

Campo separado da descrição e da prévia pública, visivelmente marcado como `Privado — usado para melhorar buscas`. Aceitar texto/áudio e transcrição editável. Nunca incluir o texto bruto no card de busca, preview público, metatags SEO, link compartilhado, código de analytics, logs de cliente ou PDF de export público. Se a IA usar Context para ranking, explicar relevância sem afirmar detalhes privados como fatos públicos sem fundamento publicável.

### 16.9. Creator Plus e métricas

Dashboard Free mostra somente o indicador de cliques no link geral do perfil; histórico e métricas avançadas continuam coletados legalmente e protegidos. Plus desbloqueia análise por item, coleção, busca, tempo e campanha. Em downgrade, substituir painel pago por estado de acesso encerrado + CTA transparente, sem apagar dados nem revelar números ao público. O painel do próprio creator pode mostrar seguidores/seguindo de forma privada, sem dramatizar volume ou tornar a contagem mecanismo de reputação.

### 16.10. Comunidade e autoria

Tela de pedido comunitário mostra creator solicitante, finalidade e privacidade do envio. Creator recebe submissões em fila privada e pode decidir publicar; indicar `Recomendação enviada pela comunidade` e autoria consensual quando houver. Não converter o envio em publicação “própria” do creator por design nem permitir baixar material de terceiro como se fosse mídia de autoria dele.

### 16.11. Partner e Admin

Partner: ferramentas operacionais, dashboards de indicação/comissão e pedidos de pagamento com linguagem financeira precisa; gráficos não exigem estética promocional. Admin: tabelas, filtros, auditoria, RBAC, status de falha, moderação, configuração e relatórios. Em ambos, cores de status são semânticas. A aplicação de glass deve ser mínima para não reduzir legibilidade dos dados.

### 16.12. Estados universais de experiência

- `loading`: skeleton de estrutura real, sem falso dado.
- `empty-first-use`: explica valor e CTA inicial.
- `empty-filtered`: mostrar filtros e ação “Limpar filtros”.
- `offline`: último estado conhecido quando seguro, botão “Tentar novamente”, sem ação financeira duplicada.
- `permission-denied`: motivo humano e alternativa, sem revelar existência de dados privados.
- `expired`: informação diferente de exclusão, com estado privado para proprietário.
- `payment-error`: falha específica sem duplicar cobrança nem afirmar assinatura ativa.
- `upload-failed`: item por arquivo, retry idempotente.
- `AI-unavailable`: busca textual tradicional acessível e aviso de indisponibilidade, sem resultado inventado.
- `sensitive-action`: confirmação, rollback quando possível, rastreamento de auditoria.

### 16.13. Ações privadas versus públicas

Perfis e recomendações públicos podem ser visualizados sem conta, mas ações de salvar, editar, enviar Context, baixar originais, gerenciar billing, configurar parceiro e acessar analytics exigem identidade e autorização. **Não basta ocultar o botão**: backend autoriza. Na UI, oferecer CTA para login apenas quando a ação legitimamente exigir conta, sem interromper a descoberta pública.

## 17. Padrões de páginas, arquitetura de conteúdo e decisões contextuais

### 17.1. Template Marketing

Objetivo: explicar por que a FAVX é diferente de uma rede social e de link-in-bio. Estrutura: header minimal → hero com fotografia editorial predominante → demonstração de curadoria/busca → benefícios concretos → segmentos de uso → prova de produto legítima, sem métricas inventadas → CTA → footer. H1 único; no máximo um CTA primário por seção. O slogan FAVX só após aprovação de marca.

### 17.2. Template Auth

Layout silencioso, formulário central e promessa clara; não impor foto editorial dentro de layout de leitura comprimido. Padrões de email, senha, verificação e recuperação com explicação humana; estados de sessão expirada e bloqueio diferentes. Usuário retorna à ação anterior quando seguro.

### 17.3. Template PublicCreator

Topo editorial com identidade do creator, pesquisa escopada e conteúdo por filtros/coleções. Busca destaca-se sem parecer chat. Perfil acessível sem login; follow/save são ações opcionais com autenticação contextual. Sem placares públicos. Apropriação da personalidade do creator por capas e foto, sem permitir temas que destruam legibilidade.

### 17.4. Template Library

Cabeçalho de biblioteca, pesquisa própria, views por coleção e salvos; privacidade explícita. Listagem com filtros e estados de indisponível; compartilhar coleção com prévia e confirmação do alcance. Componentes simples para não parecer feed infinito.

### 17.5. Template CreatorWorkspace

Navegação por painel, publicações, calendário, banners, coleções, comunidade, métricas (Plus), configurações. Home resume próximos itens agendados, status e ações prioritárias. Listagens operacionais têm filtros por ciclo (rascunho, agendado, visível, expirado, oculto, lixeira) sem apagar histórico.

### 17.6. Template CreationWizard

Orientação por etapas, indicador de progresso apenas quando fiel, preview real e salvamento coerente. Ações continuar/voltar/cancelar, alerta para dados não salvos e passo final com resumo de agenda. Upload e processamento são estados independentes de publicação.

### 17.7. Template SearchExperience

Entrada única, voz opcional, filtros, resultados visuais, explicação de fontes e refinamento. Não usar múltiplos chats disputando atenção nem responder com texto inventado. Avisar quando uma pesquisa só encontrou conteúdo aproximado/sem evidência para restrição solicitada.

### 17.8. Template Payment

Comparação de planos e benefícios com moeda inequívoca; 14 dias de teste quando elegível e sob condições transparentes; texto de preço/taxas, renovação, cancelamento e fim de acesso. Checkout real e status confirmado são fonte de verdade; UI não libera Plus apenas ao clicar em pagar.

### 17.9. Template PartnerWorkspace

Informação operacional, link de indicação copiável, gráficos de conversão e comissão recorrente, estados pendente/validado/pago. Disclosures claros sobre base de cálculo e cancelamento do assinante. Proteger dados de assinantes indicados, mostrar só informações necessárias.

### 17.10. Template AdminWorkspace

Densidade controlada, tabelas responsivas, filtros persistentes, visão por módulo e ação sensível com trilha de auditoria. Admin não é backdoor sem limites: cada controle mostra role e autorização real; abrir contexto privado como rotina é proibido.

### 17.11. Template Error/Utility

Páginas 403/404/500, offline/reconexão, cookies, denúncia e modais de ação definitiva com causas distintas e recovery. Não confirmar sucesso de pagamento, agendamento ou publicação até obter estado servidor.

### 17.12. “Não romper a marca” em estados difíceis

Uma interface premium continua premium quando falha: feedback respeitoso, ações previsíveis, preservação de trabalho, legibilidade e confiança. Evitar pop-ups humorísticos, ilustrações infantis, mensagens genéricas “Ops!” sem solução e gráficos decorativos no lugar de informação.

## 18. Matriz de aplicação às 142 telas do DOC 03

Este inventário mantém os **IDs exatos do DOC 03**, e define a composição visual/tokens dominante para evitar divergência entre designers e Claude Code. **A especificação detalhada de ações, rotas, dados, autorização e estados de cada tela permanece no DOC 03.** Esta matriz adiciona regras de composição e componentes FAVX; não substitui o fluxo existente. Os quatro IDs `FUT-*` estão **fora do MVP** e não devem originar rotas ativas ou CTAs de lançamento.

**Convenções dos templates:** `MKT` Marketing; `AUTH` Autenticação; `PUB` Público; `LIB` Biblioteca; `CRE` Workspace Creator; `MEDIA` Captura/Mídia; `SEARCH` Busca; `PLUS` Creator Plus; `PARTNER` Parceiros; `ADMIN` Administração; `UTIL` Shared/Utility; `FUTURE` apenas conceito. Os prefixos de componente `CMP` remetem a `DS-CMP-###`.

### 18.1. WEB — MKT (8 superfícies)

**Regra global:** aplicar template `MKT`; base de componentes `001,003,026,034,035`. Em todas: escopo/privacidade conforme DOC 03, texto localizável e foco/contraste conforme capítulos 12–14.

| ID e tela | Hierarquia/ênfase visual específica do DOC 03 | Componentes adicionais e decisão de UI |
|---|---|---|

| `WEB-001` — Landing institucional | Hero editorial com proposta curta; demonstração de perfil pesquisável; casos de uso; CTAs Criar perfil, Explorar exemplo e Ver planos; footer legal e idiomas. | CMP-022, CMP-054, CMP-066, CMP-032, CMP-038; moeda/plano fiel ao billing |

| `WEB-002` — Como funciona | Três trilhas: publicar, encontrar e salvar; demonstração de busca por Creator; perguntas frequentes; CTA contextual. | CMP-022, CMP-053, CMP-054, CMP-058, CMP-051; escopo do creator / próprio salvo |

| `WEB-003` — Página de preços e planos | Tabela de recursos Free/Plus; seletor mensal/anual; BRL/USD/EUR compatíveis; termos de renovação; 14 dias; FAQ. | CMP-066, CMP-069; moeda/plano fiel ao billing |

| `WEB-004` — Ajuda — início | Campo de busca de artigos; categorias conta, publicação, mídia, privacidade, plano, parceiros; links contato. | CMP-074, CMP-022, CMP-053, CMP-054, CMP-066, CMP-068; moeda/plano fiel ao billing; escopo do creator / próprio salvo |

| `WEB-005` — Artigo de ajuda | Título, passos, imagens com alt, soluções alternativas, feedback utilidade e contato. | CMP-074, CMP-007; cobrir empty/loading/error e CTA primário |

| `WEB-006` — Contato e suporte | Assunto, categoria, e-mail autenticado quando disponível, descrição, anexo opcional com limites, consentimento. | CMP-074, CMP-072; cobrir empty/loading/error e CTA primário |

| `WEB-007` — Termos e políticas | Documento, data de vigência, índice, link para versões anteriores quando aplicável, contato de privacidade. | CMP-074, CMP-072, CMP-003, CMP-047; cobrir empty/loading/error e CTA primário |

| `WEB-008` — Programa de parceiros — apresentação | Benefícios, elegibilidade, regras gerais, comissões em reais com ressalvas internacionais, CTA Candidatar-se. | CMP-051, CMP-068; status e fuso explícitos; não excluir ao expirar |

### 18.2. AUT — AUTH (8 superfícies)

**Regra global:** aplicar template `AUTH`; base de componentes `011,015,020,035`. Em todas: escopo/privacidade conforme DOC 03, texto localizável e foco/contraste conforme capítulos 12–14.

| ID e tela | Hierarquia/ênfase visual específica do DOC 03 | Componentes adicionais e decisão de UI |
|---|---|---|

| `AUT-001` — Login | E-mail, senha ou método aprovado, recuperar acesso, criar conta, aviso de privacidade; returnTo interno validado. | CMP-072; cobrir empty/loading/error e CTA primário |

| `AUT-002` — Cadastro | Dados mínimos, email, senha, termos versionados, opcional idioma, CTA criar; não exigir perfil Creator. | CMP-032, CMP-038; cobrir empty/loading/error e CTA primário |

| `AUT-003` — Verificação de e-mail | Explicação, endereço parcialmente mascarado, reenviar com cooldown, alterar e-mail. | primitives do template; cobrir empty/loading/error e CTA primário |

| `AUT-004` — Recuperar acesso | E-mail, mensagem genérica de envio, voltar ao login. | primitives do template; cobrir empty/loading/error e CTA primário |

| `AUT-005` — Definir nova senha | Nova senha, confirmação, recomendações, CTA continuar. | primitives do template; cobrir empty/loading/error e CTA primário |

| `AUT-006` — Sessão expirada | Mensagem, destino original, CTA entrar novamente, salvar rascunho local se seguro. | CMP-051; status e fuso explícitos; não excluir ao expirar |

| `AUT-007` — Verificação adicional e conta restrita | Status seguro, canal de revisão, ação permitida, documentação de suporte. | CMP-074; cobrir empty/loading/error e CTA primário |

| `AUT-008` — Consentimentos iniciais | Versões legais, controles independentes, explicação de finalidade, CTA continuar. | CMP-072; cobrir empty/loading/error e CTA primário |

### 18.3. PUB — PUB (10 superfícies)

**Regra global:** aplicar template `PUB`; base de componentes `026,032,036,038,039`. Em todas: escopo/privacidade conforme DOC 03, texto localizável e foco/contraste conforme capítulos 12–14.

| ID e tela | Hierarquia/ênfase visual específica do DOC 03 | Componentes adicionais e decisão de UI |
|---|---|---|

| `PUB-001` — Perfil público do Creator | Avatar/capa elegíveis, nome, username, bio, links, busca contextual, coleções, cards de posts, banners/pins Plus quando ativos, rodapé by FAVX. | CMP-063, CMP-022, CMP-053, CMP-054, CMP-058, CMP-037; status e fuso explícitos; não excluir ao expirar; escopo do creator / próprio salvo |

| `PUB-002` — Coleção pública Creator | Header creator, título, descrição, capa, cards ordenados, filtro/busca na coleção se aprovada, compartilhamento. | CMP-022, CMP-053, CMP-054, CMP-037, CMP-050, CMP-046; escopo do creator / próprio salvo |

| `PUB-003` — Detalhe público da recomendação | Galeria multimídia, título, descrição, categoria, nota pessoal opcional, badges de patrocínio/oferta, links e cupons, coleções relacionadas, autor, share/save. | CMP-036, CMP-039, CMP-037, CMP-050, CMP-003, CMP-047; cobrir empty/loading/error e CTA primário |

| `PUB-004` — Entrada de busca no perfil | Caixa busca, sugestão de categorias do Creator, exemplos de linguagem natural, microfone, chips de filtros, indicador “Neste perfil”. | CMP-043, CMP-022, CMP-053, CMP-054, CMP-032, CMP-038; escopo do creator / próprio salvo |

| `PUB-005` — Lista de resultados Creator | Resumo de escopo, filtros ativos, chips categorias, cards, contagem contextual de itens se não representar popularidade, refinar pergunta. | CMP-058; escopo do creator / próprio salvo |

| `PUB-006` — Coleção compartilhada de User | Nome/descrição autorizados, cards elegíveis, assinatura FAVX, compartilhar. | CMP-037, CMP-050, CMP-067, CMP-046; moeda/plano fiel ao billing |

| `PUB-007` — Pedido comunitário público | Identidade Creator, pergunta, categoria, instruções, expiração, botão Enviar sugestão, aviso sobre privacidade/autoria. | CMP-049, CMP-072; atribuição de origem |

| `PUB-008` — Enviar sugestão comunitária | Nome do item, categoria/tipo, URL opcional, descrição, mídia apenas se habilitada, identificação opcional/obrigatória conforme política, termos de envio. | CMP-049; atribuição de origem |

| `PUB-009` — Conteúdo indisponível / link antigo | Mensagem neutra, CTA Voltar ao perfil, busca do Creator, link suporte quando aplicável. | CMP-074, CMP-022, CMP-053, CMP-054, CMP-032, CMP-038; escopo do creator / próprio salvo |

| `PUB-010` — Prévia segura de compartilhamento | Título autorizado, descrição pública, imagem derivada segura, URL canônica, by FAVX discreto. | CMP-046; cobrir empty/loading/error e CTA primário |

### 18.4. USR — LIB (13 superfícies)

**Regra global:** aplicar template `LIB`; base de componentes `027,028,035,037,050`. Em todas: escopo/privacidade conforme DOC 03, texto localizável e foco/contraste conforme capítulos 12–14.

| ID e tela | Hierarquia/ênfase visual específica do DOC 03 | Componentes adicionais e decisão de UI |
|---|---|---|

| `USR-001` — Início do User / biblioteca | Blocos Salvos recentes, Minhas coleções, continuar descoberta a partir de páginas já visitadas quando autorizado, navegação de conta e role switch. | CMP-037, CMP-050, CMP-051; cobrir empty/loading/error e CTA primário |

| `USR-002` — Todos os salvos | Lista/grid de cards, filtro categoria/creator/data, busca na própria biblioteca, ordenação, remover salvo e adicionar coleção. | CMP-022, CMP-053, CMP-054, CMP-037, CMP-050, CMP-051; escopo do creator / próprio salvo |

| `USR-003` — Item salvo e ações | Card de origem, coleção(s) pessoais, data de salvamento, ações; placeholder de indisponível. | CMP-037, CMP-050, CMP-051; cobrir empty/loading/error e CTA primário |

| `USR-004` — Lista de minhas coleções | Grid/lista de coleções, visibilidade, número privado de itens, CTA criar, busca e ordenação. | CMP-022, CMP-053, CMP-054, CMP-037, CMP-050; escopo do creator / próprio salvo |

| `USR-005` — Detalhe de coleção pessoal | Nome/capa/descrição, marcação de privacidade, cards reordenáveis, menu compartilhar/editar/remover item. | CMP-037, CMP-050, CMP-072, CMP-046; cobrir empty/loading/error e CTA primário |

| `USR-006` — Criar ou editar coleção User | Nome, descrição, capa opcional, seleção dos salvos, visibilidade privada por padrão, preview de link. | CMP-037, CMP-050, CMP-051, CMP-003, CMP-047; cobrir empty/loading/error e CTA primário |

| `USR-007` — Compartilhar / revogar coleção | Seletor compartilhamento, prévia do que será público, URL, Copiar, Revogar, explicação de links antigos. | CMP-037, CMP-050, CMP-003, CMP-047, CMP-046; cobrir empty/loading/error e CTA primário |

| `USR-008` — Seguindo e seguidores — privado | Duas abas Seguindo/Seguidores, busca privada, card simples do perfil, opção deixar de seguir/bloquear se aprovada. | CMP-022, CMP-053, CMP-054, CMP-032, CMP-038; dados privados; não expor números no público; escopo do creator / próprio salvo |

| `USR-009` — Configurações da conta | Nome, avatar, e-mail, idioma, região, fuso, moeda, privacidade, segurança, notificações. | CMP-071, CMP-072; cobrir empty/loading/error e CTA primário |

| `USR-010` — Privacidade e consentimentos | Tabela de finalidades, consentimento atual, data/versão, acesso a exportação/exclusão. | CMP-072, CMP-069; cobrir empty/loading/error e CTA primário |

| `USR-011` — Solicitar exportação dos dados | Explicação do escopo, formatos quando aprovados, verificação recente, histórico e status de solicitação. | CMP-062; cobrir empty/loading/error e CTA primário |

| `USR-012` — Encerrar/excluir conta | Consequências por papel, pagamentos ativos, confirmação forte, opções exportar e cancelar assinatura. | CMP-010, CMP-073, CMP-067; moeda/plano fiel ao billing |

| `USR-013` — Central de notificações pessoais | Lista por data, lidas/não lidas, tipo, links contextuais, limpar conforme política. | CMP-058, CMP-071, CMP-003, CMP-047; cobrir empty/loading/error e CTA primário |

### 18.5. CRE — CRE (27 superfícies)

**Regra global:** aplicar template `CRE`; base de componentes `027,030,035,061,062`. Em todas: escopo/privacidade conforme DOC 03, texto localizável e foco/contraste conforme capítulos 12–14.

| ID e tela | Hierarquia/ênfase visual específica do DOC 03 | Componentes adicionais e decisão de UI |
|---|---|---|

| `CRE-001` — Ativar perfil Creator — introdução | Benefícios, exemplos de página, etapas, informações públicas, termos autorais, botão Começar. | CMP-032, CMP-038; cobrir empty/loading/error e CTA primário |

| `CRE-002` — Ativar Creator — identidade | Avatar, nome público, username com verificador, bio, preview de link e URLs reservadas. | CMP-003, CMP-047; cobrir empty/loading/error e CTA primário |

| `CRE-003` — Ativar Creator — finalizar | Resumo do perfil, escolha de informações públicas, preview, checklist primeira recomendação e link de perfil. | CMP-036, CMP-039, CMP-032, CMP-038, CMP-003, CMP-047; cobrir empty/loading/error e CTA primário |

| `CRE-004` — Dashboard Creator Free | Checklist, CTA Nova recomendação, últimos posts, avisos de agendamento, bloco cliques no link geral do perfil, convite Plus discreto. | CMP-061, CMP-036, CMP-039, CMP-032, CMP-038, CMP-003; status e fuso explícitos; não excluir ao expirar |

| `CRE-005` — Editar perfil Creator | Nome, username, avatar/capa, bio, links, prévia pública, informações publicáveis e avisos de impacto na URL. | CMP-032, CMP-038, CMP-003, CMP-047; cobrir empty/loading/error e CTA primário |

| `CRE-006` — Gerenciar publicações | Tabela/cards por estado, busca interna, filtros rascunho/agendado/publicado/oculto/expirado/arquivado, ações duplicar/editar/ocultar/excluir, datas TZ. | CMP-010, CMP-073, CMP-061, CMP-022, CMP-053, CMP-054; status e fuso explícitos; não excluir ao expirar; escopo do creator / próprio salvo |

| `CRE-007` — Editor de recomendação — conteúdo | Título, descrição até 10.000 caracteres, galeria, categoria/tags, opção patrocínio, avaliação pessoal 0–10 por 0,5, links, contexto privado, botões Salvar rascunho/Prévia/Agendar/Publicar. | CMP-061, CMP-058, CMP-036, CMP-039, CMP-051, CMP-003; status e fuso explícitos; não excluir ao expirar; isolamento público obrigatório |

| `CRE-008` — Detalhe de gestão de post | Preview privado, estado e janela TZ, tags, links, coleções, ações editar/reagendar/duplicar/arquivar/download/abrir público, trilha de alterações. | CMP-061, CMP-045, CMP-037, CMP-050, CMP-003, CMP-047; status e fuso explícitos; não excluir ao expirar; ownership e variantes de mídia |

| `CRE-009` — Links, cupons, oferta e patrocínio | Repetidor de links com rótulo, ordem, URL; cupons com validade/condição/tipo de desconto; toggle oferta; disclosure de patrocínio. | CMP-003, CMP-047; cobrir empty/loading/error e CTA primário |

| `CRE-010` — Agendar publicação e encerramento | Opções Publicar agora / Em data futura; data/hora inicial; toggle até data/hora; fuso; prévia de janela; resumo de efeitos. | CMP-061; status e fuso explícitos; não excluir ao expirar |

| `CRE-011` — Revisão e prévia de publicação | Prévia mobile/desktop, título, mídia, links, nota, tags, sponsorship, agenda, checklist de processamento e acessibilidade. | CMP-061, CMP-003, CMP-047; status e fuso explícitos; não excluir ao expirar |

| `CRE-012` — Confirmação de publicação / agendamento | Status efetivo ou agendado, hora/fuso, link copiar/compartilhar se público, ação Criar outro, voltar a posts. | CMP-061, CMP-003, CMP-047, CMP-046; status e fuso explícitos; não excluir ao expirar |

| `CRE-013` — Calendário editorial e agenda | Calendário mês/semana + lista acessível, itens por tipo/estado, fuso, sobreposições e avisos Plus. | CMP-061, CMP-018, CMP-019; status e fuso explícitos; não excluir ao expirar |

| `CRE-014` — Gerenciar rascunhos e agendados | Filtros rascunho/agendado, ordem por próxima exibição, alertas de mídia pendente, ações editar/cancelar agendamento. | CMP-061; status e fuso explícitos; não excluir ao expirar; escopo do creator / próprio salvo |

| `CRE-015` — Ocultos, expirados e arquivados | Abas por estado, período, preview autenticado, analytics por plano, ações reagendar/reativar/excluir/baixar. | CMP-010, CMP-073, CMP-061, CMP-065, CMP-066; dados privados; não expor números no público; status e fuso explícitos; não excluir ao expirar |

| `CRE-016` — Lixeira de conteúdo | Lista de removidos, tipo post/banner/coleção, data da solicitação, prazo de restauração quando definido, efeitos da restauração. | CMP-073, CMP-063, CMP-037, CMP-050; status e fuso explícitos; não excluir ao expirar |

| `CRE-017` — Coleções Creator — lista | Grid ordenável com capa, visibilidade, estado, menu ações, CTA criar, aviso de limite comercial se aplicável. | CMP-037, CMP-050; cobrir empty/loading/error e CTA primário |

| `CRE-018` — Editor de coleção Creator | Nome, descrição, capa, busca de posts próprios elegíveis, drag-and-drop com alternativa teclado, visibilidade, preview. | CMP-022, CMP-053, CMP-054, CMP-037, CMP-050; escopo do creator / próprio salvo |

| `CRE-019` — Solicitações comunitárias — lista | Lista ativos/encerrados/rascunhos, datas, URL, quantidade privada de recebimentos, CTA novo pedido. | CMP-049; cobrir empty/loading/error e CTA primário |

| `CRE-020` — Caixa de recomendações recebidas | Submissões por pedido, estados novo/em revisão/selecionado/rejeitado, filtros, privacidade do remetente. | CMP-072; escopo do creator / próprio salvo |

| `CRE-021` — Detalhe da sugestão recebida | Texto/link/mídia elegível, aviso de proveniência, termos de licença, ações rejeitar/publicar com atribuição. | CMP-003, CMP-047; cobrir empty/loading/error e CTA primário |

| `CRE-022` — Criar/editar pedido comunitário | Pergunta, categoria, descrição, vencimento opcional, orientação aos remetentes, privacidade e preview. | CMP-049, CMP-072; cobrir empty/loading/error e CTA primário |

| `CRE-023` — Métricas gerais Creator | Resumo por período, tendências, cards de posts/coleções e busca quando Plus; bloco único de cliques de link perfil quando Free. | CMP-022, CMP-053, CMP-054, CMP-037, CMP-050, CMP-065; dados privados; não expor números no público; escopo do creator / próprio salvo |

| `CRE-024` — Analytics por publicação | Séries de views/impressões, salvamentos, cliques por link, fontes, datas, legenda de métricas, status do post. | CMP-051, CMP-065, CMP-003, CMP-047; dados privados; não expor números no público |

| `CRE-025` — Analytics de coleções e busca | Categorias buscadas, termos normalizados agregados quando aprovados, zero-results, origem dos cliques, coleções mais acessadas. | CMP-022, CMP-053, CMP-054, CMP-037, CMP-050, CMP-065; dados privados; não expor números no público; escopo do creator / próprio salvo |

| `CRE-026` — Histórico e versões de publicação | Linha do tempo criada/editada/agendada/ocultada, ator, versões, status das mídias, detalhamento de diferenças permitido. | CMP-061, CMP-062; status e fuso explícitos; não excluir ao expirar |

| `CRE-027` — Gerenciar links do perfil | Lista reordenável, URL/rótulo/ícone opcional, validação, CTA adicionar, preview mobile. | CMP-032, CMP-038, CMP-003, CMP-047; cobrir empty/loading/error e CTA primário |

### 18.6. MED — MEDIA (9 superfícies)

**Regra global:** aplicar template `MEDIA`; base de componentes `023,043,044,045`. Em todas: escopo/privacidade conforme DOC 03, texto localizável e foco/contraste conforme capítulos 12–14.

| ID e tela | Hierarquia/ênfase visual específica do DOC 03 | Componentes adicionais e decisão de UI |
|---|---|---|

| `MED-001` — Escolha da origem da mídia | Opções Foto por câmera, Vídeo por câmera, Gravar áudio, Escolher do dispositivo; indicação de limites 20MB/250MB/20MB e 10min vídeo/áudio. | CMP-043, CMP-042, CMP-057, CMP-041; cobrir empty/loading/error e CTA primário |

| `MED-002` — Capturar foto/vídeo com câmera | Vídeo/câmera ao vivo, indicador microfone/câmera, alternar câmera quando suportado, timer, stop, retomar/regravar, mini preview. | CMP-043, CMP-041; ownership e variantes de mídia |

| `MED-003` — Gravar áudio | Estado gravando com duração, indicador nível de áudio acessível, pause/stop se compatível, playback, regravar, usar como mídia ou transcrever. | CMP-042, CMP-057; cobrir empty/loading/error e CTA primário |

| `MED-004` — Prévia da mídia original | Player/preview, formato/tamanho/duração quando conhecido, opções Confirmar, Refazer, Descartar, salvar local quando suportado. | CMP-051; cobrir empty/loading/error e CTA primário |

| `MED-005` — Gerenciador de uploads | Linha por arquivo com progresso, checksum/status, tamanho, retry/cancelar, associação ao draft, ordem no carrossel. | CMP-023, CMP-044; cobrir empty/loading/error e CTA primário |

| `MED-006` — Processamento de mídia | Estados enviado/verificando/processando/pronto/falhou, miniatura, qualidade disponível, original verificado, CTA reprocessar quando possível. | primitives do template; cobrir empty/loading/error e CTA primário |

| `MED-007` — Biblioteca de mídias próprias | Grid/lista com tipos, post associado, status, formatos, data, opções download e remoção segundo política. | CMP-045; ownership e variantes de mídia |

| `MED-008` — Opções de download do Creator | Nome, MIME, tamanho conhecido, ações Baixar original / Baixar otimizado, indicação de indisponibilidade e direitos. | CMP-045; ownership e variantes de mídia |

| `MED-009` — Transcrição e edição de áudio | Player, transcript com trechos revisáveis, botão Reprocessar se permitido, escolha Texto/Áudio/Ambos, idioma. | CMP-057, CMP-042; cobrir empty/loading/error e CTA primário |

### 18.7. SRH — SEARCH (8 superfícies)

**Regra global:** aplicar template `SEARCH`; base de componentes `022,052,053,054`. Em todas: escopo/privacidade conforme DOC 03, texto localizável e foco/contraste conforme capítulos 12–14.

| ID e tela | Hierarquia/ênfase visual específica do DOC 03 | Componentes adicionais e decisão de UI |
|---|---|---|

| `SRH-001` — Campo de busca contextual | Input expansível, chip “Neste Creator” ou “Nos meus salvos”, botão voz, limpar, exemplos discretos. | CMP-022, CMP-053, CMP-054, CMP-058, CMP-051; escopo do creator / próprio salvo |

| `SRH-002` — Resultados e cards de busca | Cards visuais, termo, chips aplicados, categorias, localização opcional, refinamento conversacional, indicador de busca lexical/IA se pertinente. | CMP-022, CMP-053, CMP-054, CMP-055; escopo do creator / próprio salvo |

| `SRH-003` — Refinamento conversacional | Histórico curto da sessão, frases enviadas, campo “Refinar busca”, chips de restrições detectadas, ação Começar nova busca. | CMP-022, CMP-053, CMP-054, CMP-062; escopo do creator / próprio salvo |

| `SRH-004` — Busca por voz | Gravação com timer, estado gravando, play opcional, transcrição editável, ação Buscar. | CMP-057, CMP-022, CMP-053, CMP-054; escopo do creator / próprio salvo |

| `SRH-005` — Filtros avançados de busca | Categoria/subcategoria, tipo mídia/post, data de publicação/criação conforme contexto, último 7/30/90 dias/ano/custom, cidade/bairro, botão aplicar/limpar. | CMP-022, CMP-053, CMP-054, CMP-058; escopo do creator / próprio salvo |

| `SRH-006` — Escolha de localização para busca | Campo Cidade/bairro, sugestões geocodificadas, CTA Usar minha localização, resumo do grau de precisão e raio quando habilitado. | CMP-022, CMP-053, CMP-054, CMP-055; escopo do creator / próprio salvo |

| `SRH-007` — Falha / fallback da busca IA | Mensagem não alarmista, opção Buscar por palavras-chave, filtros manuais e tentar novamente. | CMP-022, CMP-053, CMP-054; escopo do creator / próprio salvo |

| `SRH-008` — Nenhum resultado — orientação contextual | Texto “Não encontramos isso neste perfil” ou “nos seus salvos”, chips para remover filtro, pesquisar termos relacionados dentro do escopo. | CMP-022, CMP-054, CMP-058, CMP-051, CMP-032, CMP-038; escopo do creator / próprio salvo |

### 18.8. PLS — PLUS (10 superfícies)

**Regra global:** aplicar template `PLUS`; base de componentes `063,064,065,066`. Em todas: escopo/privacidade conforme DOC 03, texto localizável e foco/contraste conforme capítulos 12–14.

| ID e tela | Hierarquia/ênfase visual específica do DOC 03 | Componentes adicionais e decisão de UI |
|---|---|---|

| `PLS-001` — Apresentação Creator Plus / upgrade | Benefícios analytics avançado, banners, até 6 fixados, coleções Plus pendentes, tabela de preços e 14 dias trial, CTA ver condições. | CMP-063, CMP-064, CMP-037, CMP-050, CMP-065, CMP-066; dados privados; não expor números no público; status e fuso explícitos; não excluir ao expirar |

| `PLS-002` — Checkout e retorno seguro | Resumo do plano, preço/moeda/ciclo, termos, destino Stripe, estado Aguardando confirmação após retorno. | CMP-066, CMP-067; moeda/plano fiel ao billing |

| `PLS-003` — Resultado de trial, pagamento e assinatura | Estado trial/ativo/pendente/falhou/cancelado, validade, cobrança prevista quando conhecida, links portal e ajuda. | CMP-074, CMP-067, CMP-003, CMP-047; moeda/plano fiel ao billing |

| `PLS-004` — Banners — lista e biblioteca | Lista por status/datas, visual miniatura, impressões e cliques Plus, espaço disponível segundo política, CTA criar. | CMP-063; status e fuso explícitos; não excluir ao expirar |

| `PLS-005` — Editor de banner | Imagem/vídeo elegível, título/acessibilidade, link/post/coleção de destino, posição permitida, disclosure se publicidade, preview, data/hora início/fim. | CMP-063, CMP-041, CMP-037, CMP-050, CMP-003, CMP-047; status e fuso explícitos; não excluir ao expirar |

| `PLS-006` — Detalhes e desempenho de banner | Preview, estado, link de destino, intervalo real, impressões/cliques/CTR com glossário, opções editar/ocultar/reactivar/excluir. | CMP-010, CMP-073, CMP-063, CMP-003, CMP-047; status e fuso explícitos; não excluir ao expirar |

| `PLS-007` — Fixados — gestão e agenda | Slots/ordem visual, lista de pins ativos/futuros/encerrados, seletor de post, datas TZ independentes do post, preview. | CMP-061, CMP-064; status e fuso explícitos; não excluir ao expirar |

| `PLS-008` — Gerenciar assinatura e cancelamento | Plano, moeda, ciclo, próxima cobrança, método via portal, cancelar, políticas, consequências de downgrade. | CMP-066, CMP-067; moeda/plano fiel ao billing |

| `PLS-009` — Visão analítica Plus | KPIs com definições, tendências, filtro de período, cards por post/coleção/banner, buscas agregadas, exportação se aprovada. | CMP-063, CMP-022, CMP-053, CMP-054, CMP-037, CMP-050; status e fuso explícitos; não excluir ao expirar; escopo do creator / próprio salvo |

| `PLS-010` — Paywall contextual de recurso Plus | Recurso desejado, benefício, comparação transparente, CTA conhecer Plus, voltar sem perder edição. | CMP-058; cobrir empty/loading/error e CTA primário |

### 18.9. PAR — PARTNER (10 superfícies)

**Regra global:** aplicar template `PARTNER`; base de componentes `027,065,068,069`. Em todas: escopo/privacidade conforme DOC 03, texto localizável e foco/contraste conforme capítulos 12–14.

| ID e tela | Hierarquia/ênfase visual específica do DOC 03 | Componentes adicionais e decisão de UI |
|---|---|---|

| `PAR-001` — Programa de parceiros — detalhes | Seções como funciona, comissão base, condições de elegibilidade, FAQ, termos, CTA inscrever. | CMP-068; status e fuso explícitos; não excluir ao expirar |

| `PAR-002` — Cadastro/candidatura de parceiro | Identidade/contato, canais promocionais, país, aceite termos, declarações antifraude, submissão. | CMP-074, CMP-068; cobrir empty/loading/error e CTA primário |

| `PAR-003` — Status da candidatura | Status recebida/em análise/aprovada/rejeitada/mais informações, última atualização, canais de contato. | CMP-074; cobrir empty/loading/error e CTA primário |

| `PAR-004` — Dashboard Partner | Cards cliques elegíveis, inscrições, subscrições ativas, comissões a liberar/liberadas/pagas, gráfico temporal, alertas. | CMP-068; cobrir empty/loading/error e CTA primário |

| `PAR-005` — Meu link e materiais | Link único, Copiar, QR se aprovado, exemplos de uso, restrições de marca e canais, materiais licenciados. | CMP-003, CMP-047; cobrir empty/loading/error e CTA primário |

| `PAR-006` — Indicações e comissões | Tabela por período/status com identificador não pessoal, base ativa paga, valor R$19,90, motivo de estorno, totais. | CMP-068, CMP-069; cobrir empty/loading/error e CTA primário |

| `PAR-007` — Pagamentos e dados para repasse | Identificação fiscal/bancária por país se cabível, pagamentos previstos/realizados, mínimo e datas pendentes, histórico. | CMP-062; cobrir empty/loading/error e CTA primário |

| `PAR-008` — Termos e documentação Partner | Versões dos termos, documentos exigidos se aplicáveis, status, orientações e suporte. | CMP-074; cobrir empty/loading/error e CTA primário |

| `PAR-009` — Histórico de atribuição do parceiro | Resumo de cliques/cadastros/conversões por data e origem permitida; regras de último clique; motivos genéricos inelegíveis. | CMP-068, CMP-062; cobrir empty/loading/error e CTA primário |

| `PAR-010` — Ajuda e revisão de comissão | Formulário motivo, período, referência agregada, anexo opcional, histórico de tickets. | CMP-074, CMP-068, CMP-062; cobrir empty/loading/error e CTA primário |

### 18.10. ADM — ADMIN (25 superfícies)

**Regra global:** aplicar template `ADMIN`; base de componentes `027,069,070,071`. Em todas: escopo/privacidade conforme DOC 03, texto localizável e foco/contraste conforme capítulos 12–14.

| ID e tela | Hierarquia/ênfase visual específica do DOC 03 | Componentes adicionais e decisão de UI |
|---|---|---|

| `ADM-001` — Admin overview e saúde operacional | Indicadores agregados crescimento/ativação/receita/falhas, alertas e incidentes, recortes por período, atividade Creator e filtros de país. | primitives do template; escopo do creator / próprio salvo |

| `ADM-002` — Gestão de contas User | Busca com campos permitidos, filtros status/país/data, lista minimizada, acesso a caso e ações apropriadas. | CMP-022, CMP-053, CMP-054; escopo do creator / próprio salvo |

| `ADM-003` — Detalhe de User e direitos | Status, papéis, localidade, pedidos de privacidade, histórico de suporte, ações RBAC; dados financeiros só à role adequada. | CMP-074, CMP-072, CMP-062; cobrir empty/loading/error e CTA primário |

| `ADM-004` — Gestão de Creators | Lista com status de perfil, plano, produção, atividade, flags, filtros, busca autorizada. | CMP-022, CMP-053, CMP-054, CMP-066, CMP-032, CMP-038; moeda/plano fiel ao billing; escopo do creator / próprio salvo |

| `ADM-005` — Detalhe e saúde Creator | Perfil, status, onboarding, atividade, seguidores agregados internos, uso/acesso, indicadores de satisfação com fonte explícita, suporte, flags. | CMP-074, CMP-032, CMP-038; dados privados; não expor números no público |

| `ADM-006` — Conteúdo e ativos — catálogo | Listagem por tipo/estado/moderação/data, busca segura, contagens agregadas, ação ver caso. | CMP-022, CMP-053, CMP-054, CMP-075, CMP-070; escopo do creator / próprio salvo |

| `ADM-007` — Fila de denúncias e moderação | Fila pendente/em revisão/resolvido, severidade, categoria, origem, timestamp e responsável, filtros. | CMP-075, CMP-070; escopo do creator / próprio salvo |

| `ADM-008` — Detalhe da denúncia e decisão | Conteúdo e evidência autorizada, história, política aplicável, decisões advertir/ocultar/suspender/remover, motivo obrigatório. | CMP-075; cobrir empty/loading/error e CTA primário |

| `ADM-009` — Taxonomia — categorias e aliases | Árvore de categorias/subcategorias, traduções, aliases, status, contagem interna de posts associados, merge controlado. | primitives do template; cobrir empty/loading/error e CTA primário |

| `ADM-010` — Localidades e idiomas | Catálogo locales, chaves pendentes, status, strings críticas, formatos de data e moeda, logs de revisão. | primitives do template; cobrir empty/loading/error e CTA primário |

| `ADM-011` — Cobrança e assinaturas | Lista de assinatura/planos/status por moeda, eventos Stripe, próxima cobrança, fallbacks e discrepâncias, ações aprovadas. | CMP-066, CMP-067; moeda/plano fiel ao billing |

| `ADM-012` — Finanças e receita por moeda | MRR/ARR segregado BRL/USD/EUR, trials/conversão, pagamentos, estornos, impostos se configurados, período. | CMP-067; cobrir empty/loading/error e CTA primário |

| `ADM-013` — Filas, jobs e agendamentos | Filas processamento/expiração/indexação/notificação, atraso, retries, DLQ, últimas reconciliações e histórico. | CMP-061, CMP-071, CMP-062; status e fuso explícitos; não excluir ao expirar |

| `ADM-014` — Operações de mídia e storage | Filas por status, erros por MIME/tamanho, storage egress, originais sem derivado, órfãos, limpeza autorizada. | primitives do template; cobrir empty/loading/error e CTA primário |

| `ADM-015` — Busca e IA — qualidade/custo | Custos por feature, tokens, taxa zero-result, latência, erros, auditoria de alucinação com amostras autorizadas, flags e budget. | CMP-022, CMP-053, CMP-054; escopo do creator / próprio salvo |

| `ADM-016` — Programa de parceiros — inscrições | Lista candidatos, canais, documentos autorizados, status, risco, check de termos. | CMP-068; status e fuso explícitos; não excluir ao expirar |

| `ADM-017` — Programa de parceiros — pagamentos | Comissões pendentes/aprovadas/ajustadas/pagas, assinaturas-base, motivos de estorno, payout por ciclo e moeda. | CMP-067, CMP-068; status e fuso explícitos; não excluir ao expirar; moeda/plano fiel ao billing |

| `ADM-018` — Suporte — tickets e SLA | Listagem por prioridade, assunto, dono, SLA, status, filtros e atribuição. | CMP-074; escopo do creator / próprio salvo |

| `ADM-019` — Central de auditoria e segurança | Busca por recurso/ator/ação/período, before/after redigido, IP mascarado/justificado, exportação restrita. | CMP-022, CMP-053, CMP-054; escopo do creator / próprio salvo |

| `ADM-020` — Roles e permissões do admin | Lista equipes/roles, ações por domínio, convites, período de acesso, justificativas, log. | primitives do template; cobrir empty/loading/error e CTA primário |

| `ADM-021` — Configurações e feature flags | Parâmetros por ambiente/região, flags por feature, diff de versão, confirmação e rollback. | primitives do template; cobrir empty/loading/error e CTA primário |

| `ADM-022` — Entidades canônicas e indexação | Identidades de produto/lugar, aliases, ligação a posts, evidências, merge/unmerge, status de embeddings/indexação. | primitives do template; cobrir empty/loading/error e CTA primário |

| `ADM-023` — Política e governança de privacidade | Fila de exportação/eliminação/retificação, prazo, status, política vigente, justificativas e trilha. | CMP-072; cobrir empty/loading/error e CTA primário |

| `ADM-024` — Satisfação e feedback | Pesquisas respondidas, reclamações categorizadas, satisfação por coorte com tamanho de amostra, correlação com uso operacional. | CMP-022, CMP-054, CMP-007; cobrir empty/loading/error e CTA primário |

| `ADM-025` — Notificações e templates transacionais | Templates em seis locales, placeholders, event triggers, estado e teste de preview, preferências. | CMP-071; cobrir empty/loading/error e CTA primário |

### 18.11. SHR — UTIL (10 superfícies)

**Regra global:** aplicar template `UTIL`; base de componentes `007,010,035`. Em todas: escopo/privacidade conforme DOC 03, texto localizável e foco/contraste conforme capítulos 12–14.

| ID e tela | Hierarquia/ênfase visual específica do DOC 03 | Componentes adicionais e decisão de UI |
|---|---|---|

| `SHR-001` — Centro global de notificações | Menu/lista contextual, número PRIVADO de não lidas se aprovado, data, resumo curto, CTA destino. | CMP-058, CMP-071; cobrir empty/loading/error e CTA primário |

| `SHR-002` — Central de ajuda contextual | Artigos conforme contexto, contato, código de erro copiável sem segredos, status. | CMP-074, CMP-058; cobrir empty/loading/error e CTA primário |

| `SHR-003` — Gestão de sessão/dispositivos | Sessões ativas aproximadas, logout individual/todos, troca de senha, verificação de e-mail, alertas. | primitives do template; cobrir empty/loading/error e CTA primário |

| `SHR-004` — Seletor de ambiente User/Creator/Partner | Opções só para roles ativos, ambiente atual, atalho conta, ativar Creator se ainda não tiver. | primitives do template; cobrir empty/loading/error e CTA primário |

| `SHR-005` — Confirmação de ação destrutiva | Nome exato do recurso, consequência imediata, prazo de recuperação se aprovado, botão destrutivo separado, opção cancelar. | primitives do template; cobrir empty/loading/error e CTA primário |

| `SHR-006` — Modo offline/reconexão | Faixa offline, fila local se segura, status do rascunho, CTA retentar, timestamp última sincronização. | primitives do template; cobrir empty/loading/error e CTA primário |

| `SHR-007` — Páginas 403/404/500 | Título acessível, explicação neutra, tentar novamente, início, ajuda; request ID não sensível. | CMP-074; cobrir empty/loading/error e CTA primário |

| `SHR-008` — Notificação e configuração de cookies | Explicação essencial/opcional, aceitar/rejeitar/personalizar, link política, controle persistente. | CMP-071, CMP-003, CMP-047; cobrir empty/loading/error e CTA primário |

| `SHR-009` — Relatar conteúdo / denunciar | Tipo de ocorrência, comentário, anexos se apropriado, aviso uso de dados, protocolo. | primitives do template; cobrir empty/loading/error e CTA primário |

| `SHR-010` — Confirmação de cópia e compartilhamento | Link canônico, botão copiar, share sheet nativo quando suportado, fallback, aviso de acesso conforme privacidade. | CMP-072, CMP-003, CMP-047, CMP-046; cobrir empty/loading/error e CTA primário |

### 18.12. FUT — FUTURE (4 superfícies)

**Regra global:** aplicar template `FUTURE`; base de componentes `060,072`. Em todas: escopo/privacidade conforme DOC 03, texto localizável e foco/contraste conforme capítulos 12–14.

| ID e tela | Hierarquia/ênfase visual específica do DOC 03 | Componentes adicionais e decisão de UI |
|---|---|---|

| `FUT-001` — Busca global — placeholder de roadmap | FUTURO: busca entre creators, entidades canônicas, atribuição, filtros globais, ranking e anti-spam. | CMP-022, CMP-053, CMP-054; **FUTURO / não montar rota no MVP**; escopo do creator / próprio salvo |

| `FUT-002` — FAVX for Brands — adesão Creator | FUTURO: apresentação comercial, dados de audiência agregados, controles granulares, revogação. | primitives do template; **FUTURO / não montar rota no MVP** |

| `FUT-003` — FAVX for Brands — interesse/match | FUTURO: marca, interesse Creator, score explicável, perfil comercial liberado sob autorização. | CMP-032, CMP-038; **FUTURO / não montar rota no MVP** |

| `FUT-004` — Events / Proof / Perfil Comercial | FUTURO: produtos em projetos de especificação separados, mesmo Design System e identidade quando apropriado. | CMP-032, CMP-038; **FUTURO / não montar rota no MVP** |

### 18.13. Cobertura obrigatória e validação da matriz

- Quantidade de IDs de origem: **142**. **138 superfícies do MVP** e **4 futuras** (`FUT-*`); esse número descreve telas/superfícies do DOC 03, não 142 arquivos/páginas Next.js independentes.
- Uma feature de layout do DOC 03 pode ser um modal, uma página, um estado ou um subfluxo; não criar rota por ID automaticamente.
- Uma mesma tela pode usar múltiplos layouts conforme role/viewport; rastrear variantes em Storybook e screenshots.
- A composição de componentes aqui é **orientativa**, não contrato de dados. Os requisitos funcionais específicos permanecem no DOC 03.
- Cada ID do MVP deve ter: template aplicado, estado default, empty, loading, error, auth/entitlement quando aplicável, versão mobile e desktop, strings 6 idiomas, keyboard/screen reader e screenshot baseline.
- Cada `FUT-*` deve ser explicitamente marcado como não entregável do MVP para impedir implementação prematura.

## 19. Microinterações e estados de negócio — contratos de alta criticidade

### 19.1. Agendar publicação

**Tela:** CRE-010. Campo início (data/hora/zona), opcional encerramento, resumo “Visível de [data] até [data]”. Se fim ≤ início, erro inline com correção; se não houver fim, informar permanência até ocultação/ação posterior. CTA `Agendar publicação`. Na prévia (CRE-011) mostrar como público verá; após sucesso, exibir confirmação com intervalo; se falhar, manter dados sem anunciar sucesso.

### 19.2. Expirar publicação

Em CRE-015 e CRE-008, mostrar estado `Expirado` acompanhado de data do encerramento, ações `Reativar`, `Duplicar` ou `Mover para lixeira` de acordo com permissões e regras. Apresentar histórico sem zerar métricas. Em link público, mostrar indisponibilidade genérica; não revelar conteúdo privado oculto.

### 19.3. Agendar fixação

Em PLS/CRE, fixação é recurso Plus distinto do ciclo do post. UI explica “Ao terminar, a publicação continua visível normalmente” quando a janela do post principal permitir. Resolver conflitos com limites simultâneos antes de confirmar; preview de ordem de fixados.

### 19.4. Agendar banner

BannerComposer exibe campos criativos, tipo de CTA, legenda/Patrocinado quando devido, prazo e prévia mobile/desktop; banner expira com encerramento de exibição e relatório histórico intacto. Não usar contagem de performance como argumento público.

### 19.5. Excluir versus ocultar

Menu distingue `Ocultar` (reversível, sem lixeira), `Arquivar` (retirar do circuito ativo e organizar), `Mover para lixeira` (inicia prazo de recuperação quando definido) e `Excluir permanentemente` (condicionada à política e autorização). Cada ação indica consequência; não colocar as quatro no mesmo tom visual.

### 19.6. Download próprio

Exibir botão apenas quando creator tem propriedade/autorização comprovada e o original existe. Ao selecionar, apresentar `Arquivo original` e `Versão otimizada` se ambas disponíveis. Em conteúdo de terceiro, não oferecer botão; via URL direta, backend também deve negar. Download de captura ao vivo segue as mesmas autorizações.

### 19.7. Captura e upload

Permissão de câmera/microfone contextual, gravação com indicação inequívoca de ativo, revisão antes de enviar, barra real de upload e estado de processamento separado. Conteúdo não publicado não surge em público por erro de cache. Se offline, exibir status local apropriado sem prometer preservação quando navegador puder limpar cache.

### 19.8. Pesquisa com áudio

Três estados diferentes: `Gravando`, `Transcrevendo`, `Buscando recomendações`. Botão para descartar gravação, alternativa de digitar e confirmação do texto transcrito antes de executar quando houver risco de interpretação. Geolocalização pedida somente se busca beneficiar-se dela; permitir digitar bairro/cidade.

### 19.9. Comparação de planos

Preço e período devem vir de configuração validada pelo billing. Não inventar preço anual USD/EUR; apresentar apenas opções habilitadas. Não transformar vantagens inacessíveis do Plus em CTA enganoso nem ocultar fim do trial/renovação.

### 19.10. Privacidade visual e de API

A UI **não deve receber** números públicos de seguidores/views/saves, dados brutos de consultas ou FAVX Context em props de página pública; remover CSS do elemento não é proteção. Mesmo nas prévias públicas, renderizar payload mínimo do backend, com testes em JSON e DOM.

### 19.11. Marketplace futuro

Quando criado, participação e compartilhamento serão opt-in granular, por interesse do creator em marca elegível. No MVP nenhuma tela de opt-in de marketplace precisa existir; somente padrões de privacidade futura e tokens reutilizáveis de consentimento são previstos.

## 20. Visualização de dados, gráficos e tabelas

### 20.1. Princípios de charts privados

Gráficos respondem perguntas reais (“qual publicação foi mais clicada no último mês?”), não geram espetáculo. Ordem: título, período, definição de métrica, gráfico legível, tabela alternativa/valores, fonte e limites da amostra. Números de seguidores/seguindo, views, salvamentos, cliques e buscas só no painel autorizado e nunca na página pública.

### 20.2. Padrões de visualização

| Pergunta | Gráfico recomendado | Cuidados |
|---|---|---|
| Evolução de cliques/visitas | linha temporal | zero explícito, datas e tooltip acessível |
| Top conteúdos | barras horizontais | rótulos completos, ordenar corretamente |
| Tipos de mídia | barras ou donut se poucas categorias | tabela alternativa, proporções soma consistente |
| Termos/categorias de busca | barras e tabela | grupos pequenos suprimidos, sem queries pessoais |
| Funil de parceiro | etapas + tabela | denominadores definidos, sem dedução enganosa |
| Receita e assinaturas (admin) | linha/barra e tabela | moeda, impostos e período explicitados |
| Performance de banner | linha + CTR | impressões/cliques com definições consistentes |

### 20.3. Escala cromática de dados

Usar série neutra escura para principal, cinzas variados para secundárias e azul funcional somente quando houver necessidade de foco/ação. Para mais de quatro séries, complementar com traçado, padrão, legenda e filtros; não depender de distinção vermelho/verde. **Paleta analítica definitiva a homologar** com testes de daltonismo e contraste.

### 20.4. Estados especiais

Sem amostra suficiente = explicitar indisponibilidade, não mostrar “0% de satisfação” por falta de pesquisa. Bot/métrica filtrada = nota metodológica. Comparação de datas inválida = erro recuperável. Dados não autorizados = painel bloqueado por entitlement, não gráfico zerado. Dados históricos continuam visíveis ao titular quando elegível, mesmo após expiração de post.

### 20.5. Tabelas

Cabeçalhos semânticos, ordenação e paginação controladas, uso de números tabulares, status textuais e ações com rótulos. No mobile, cards ou scroll com indicação, sem cortar controles decisivos; coluna de ações acessível. Exportação só quando autorizada e com indicação de sensibilidade dos dados.

## 21. Design-to-code, arquitetura dos componentes e biblioteca

### 21.1. Organização de projeto recomendada

```text
packages/design-tokens/
  src/tokens.json          # origem aprovada; exports gerados
  dist/tokens.css
packages/ui/
  src/primitives/
  src/components/
  src/patterns/
  src/templates/
  src/styles/
apps/web/
  app/[locale]/...
  features/{content,search,media,library,billing,partner,admin}/
  stories/ ou storybook/ conforme decisão de tooling
```

Nomes e pastas são **PROPOSTOS**, sujeitos ao TRD e validação de tooling. `tokens.json` anexo deve ser importado/normalizado como origem do projeto e não duplicado em `globals.css` e arquivos Tailwind manualmente.

### 21.2. API de componentes

Props devem separar apresentação e comportamento: `variant`, `size`, `density`, `status`, `isLoading`, `disabled`, `aria-label`, `onClick`, `href`, `children`, `locale` quando necessário. Expor slotted content em templates; não passar objetos `user` inteiros quando apenas nome/foto necessários. IDs de teste estáveis e sem dado pessoal: `data-testid="favx-save-action"` ou semelhante.

### 21.3. Bibliotecas de base

Componentes acessíveis (ex.: primitives alinhadas a Radix/shadcn adaptadas), ícones consistentes, estilos Tailwind e TypeScript. Shadcn não é identidade: sua estética de fábrica **não** deve ser copiada sem aplicação dos tokens, radii, sombras e tipografia FAVX. Toda dependência deve passar por política de segurança/licença.

### 21.4. Figma e documentação viva

Páginas propostas: `00 Foundations`, `01 Tokens & Modes`, `02 Primitives`, `03 Components`, `04 Patterns`, `05 Templates`, `06 Screens — Public`, `07 Screens — User`, `08 Screens — Creator`, `09 Screens — Partner/Admin`, `10 QA & Archive`. Cada componente exibe states, variantes, notas de accessibility, ID DS-CMP, restrições de uso e link ao ticket/code story. Naming consistente: `Button / variant=Primary / size=Md / state=Default`.

### 21.5. Storybook e testes

Criar stories de todos os estados relevantes, com 6 idiomas e viewports. Executar screenshot regressions para componentes críticos e templates; testes de teclado e axe, mais avaliação manual. Não validar apenas screenshot: foco, leitura assistiva, formulário e controles de mídia exigem testes comportamentais.

### 21.6. Organização de releases

- **Foundations:** fontes, tokens, contraste, reset CSS, breakpoints.
- **Primitives:** botão, campo, badge, modal, tooltip, alert.
- **Content primitives:** mídias, cards, perfil, coleção, salvamento.
- **Functional patterns:** upload, editor, busca, agendamento, analytics, checkout.
- **Templates:** páginas do DOC 03 por grupo.
- **Governança:** QA visual, audit, tokens changelog e registro de decisões.

### 21.7. API sem dados sensíveis

Componentes de páginas públicas usam view models públicos dedicados, sem `context_private`, `analytics_raw`, listas de seguidores ou IDs pessoais de audiência. Componentes admin/Creator têm wrappers de autorização e skeleton privado; nunca reutilizar props internas para páginas públicas apenas escondendo CSS.

## 22. Processo de design, handoff e Definition of Done

### 22.1. Para aprovar um novo componente

1. Definir caso de uso e problema resolvido.
2. Referenciar IDs de telas DOC 03 e regras de produto.
3. Verificar se padrão existente resolve; evitar duplicação.
4. Descrever anatomia, props, variantes, estados, responsividade e tokens.
5. Prototipar light desktop/mobile, com textos reais em 6 idiomas.
6. Auditar teclado, leitor, contraste, zoom, motion, touch.
7. Validar custo de renderização e estabilidade visual.
8. Registrar decisão visual e implementar story/testes.
9. Aprovar design e QA de engenharia antes de publicar.

### 22.2. Design handoff por tela

Entregar: `screen_id`, template, link do frame, variants e states, tokens consumidos, texto i18n, mapa de foco, event/analytics names, permissões, especificação de empty/loading/error, mobile/tablet/desktop, mídias, comportamento com voz, vídeo, geografia, casos de risco, screenshot baselines, link do PRD/TRD/DOC03.

### 22.3. Definition of Ready

Tela tem objetivo, role, navegação, CTA, estados e dados definidos no DOC 03; não há decisão comercial não aprovada; existe componente DS adequado e variante mobile; i18n, a11y e privacidade documentados.

### 22.4. Definition of Done

UI implementada com tokens; testes unitários de estados; integração com dados autorizados; Cypress/Playwright ou equivalente para caminho crítico; regressão visual; performance; QA mobile real; tradução dos 6 idiomas; acessibilidade; analytics sem PII; logs e edge cases. Design review fecha screenshot de referência, não só “parece bonito”.

### 22.5. Performance visual

Preferir assets responsivos AVIF/WebP quando suportado, poster frames e carregamento lazy sob dobra; reservar dimensions; limitar blur e sombras pesadas em listas; evitar muitas superfícies com backdrop-filter na mesma viewport. Fontes locais/subset e preload criterioso; a performance não pode ser sacrificada por efeito editorial.

## 23. Matriz de QA visual, acessibilidade e comportamentos

| ID | Cenário | Amostra | Aceite esperado |
|---|---|---|---|

| DS-QA-001 | Contraste de texto | Light public, input, tooltip, modal e dark proposto | Teste checker + inspeção visual; AA |

| DS-QA-002 | Focus ring | Tab por página pública/Creator | Foco sempre visível, não obscuro |

| DS-QA-003 | 320px e zoom | 375px + 320px + 200%/400% | Sem perda funcional ou scroll horizontal indevido |

| DS-QA-004 | Locales longos | fr/it/pt-PT/es | CTAs e descrições não truncados |

| DS-QA-005 | Prévia compartilhada | Profile e Collection públicas | by FAVX discreto e sem métricas privadas |

| DS-QA-006 | Post patrocinado | card, detalhe, preview | rótulo textual claro |

| DS-QA-007 | Privacidade de métricas | PUB-001, PUB-003, User views | sem números públicos nem vazamento em DOM/JSON |

| DS-QA-008 | Busca escopada | perfil do Creator | sem sugerir busca global ativa |

| DS-QA-009 | Busca por áudio | permissão negada e transcrição | alternativa por texto e estados reais |

| DS-QA-010 | Fonte de IA | resultado sem evidência | não inventa atributos, rótulo correto |

| DS-QA-011 | FAVX Context | editor e HTML público | entrada privada, nunca renderizada no público |

| DS-QA-012 | Salvar sem sessão | link público → save | login contextual e retorno |

| DS-QA-013 | Media capture | foto, vídeo e áudio | permissão, status e prévia presentes |

| DS-QA-014 | Download de original | creator próprio vs mídia de terceiro | só autorizado; variantes claras |

| DS-QA-015 | Upload falho | arquivo grande/falha de rede | erro específico, retry, sem progresso falso |

| DS-QA-016 | Agendamento inválido | fim antes do início | erro inline, não agenda |

| DS-QA-017 | Timezone DST | fuso e hora ambígua | alerta e resumo UTC consistente |

| DS-QA-018 | Expiração de post | fim programado | público oculta, owner histórico |

| DS-QA-019 | Expiração de pin | desfixar após janela | post original continua visível |

| DS-QA-020 | Expiração de banner | fim de campanha | sem banner público; analytics preservado |

| DS-QA-021 | Lixeira e restore | soft delete | consequência e prazo proposta claros |

| DS-QA-022 | Comissões e moeda | partner dashboard | sem inventar anual estrangeiro, R$19,90 claro |

| DS-QA-023 | Cancelamento Plus | fim de período | texto consequente, sem CTA enganosa |

| DS-QA-024 | Acessibilidade de carrossel | teclado e swipe | posição e controles acessíveis |

| DS-QA-025 | Tabela admin mobile | 320/390px | ações e estado permanecem legíveis |

| DS-QA-026 | Sem imagem | card editorial | foco visual e texto preservados |

| DS-QA-027 | Sem JS | landing e links principais | conteúdo básico legível/navegável |

| DS-QA-028 | Redução de movimento | OS reduce | sem animação desnecessária |

| DS-QA-029 | Erro de checkout | falha provider | não anuncia assinatura ativa |

| DS-QA-030 | Revogar coleção compartilhada | link revogado | estado público coerente |

| DS-QA-031 | Comunidade | post vindo de envio de terceiro | atribuição visível |

| DS-QA-032 | Formulário com erro | cadastro, publicação, partner | erro associado e foco no resumo |

| DS-QA-033 | Glossário de métricas | analytics Creator Plus | definições acessíveis |

| DS-QA-034 | Fluxo Admin crítico | moderação/financeiro | confirmar ação + log + role |

| DS-QA-035 | Aviso de desconto | cupom vencido | label e condição verdadeiros |

| DS-QA-036 | Loading estados | upload, busca, pagamento | sem layout jump e feedback falso |

| DS-QA-037 | Filtros de data | 7/30/90 e custom | chips e clear por teclado |

| DS-QA-038 | Sem resultados | busca Creator | não confunde erro com ausência |

| DS-QA-039 | Dark tema preparado | feature desativada MVP | não expõe tema inconsistente por padrão |

| DS-QA-040 | Futuras rotas | FUT-001..004 | sem links/CTAs funcionais no MVP |

### 23.1. Critérios de bloqueio de release

Bloqueia release: vazamento de métricas ou Context privado, associação errada de autoria, acesso a download de terceiro, checkout com valor/renovação incorreto, expiração falhando no público, foco ausente em ações-chave, contraste de texto essencial abaixo do requisito AA, versão mobile sem CTA crítico, ausência de idioma no fluxo de pagamento/privacidade, componente de consentimento enganoso.

### 23.2. Testes automatizados e manuais

Automatizar lint de tokens e CSS, unit tests de componentes, acessibilidade axe, keyboard E2E, screenshots em 320/390/768/1280 e locales representativos; testes manuais de leitor de tela e redução de movimento. Validação em navegadores relevantes (Chromium/WebKit/Firefox) e aparelhos iOS/Android. Fotos reais e layouts longos testados com dados de produção anonimizados, nunca dados pessoais reais.

## 24. Decisões, recomendações e lacunas antes da homologação

| ID | Tema | Estado | Próximo ato |
|---|---|---|---|
| DS-DEC-001 | Manrope UI + Instrument Serif editorial | APROVADO | selecionar arquivos/weights e licença |
| DS-DEC-002 | Predominância branca, tipografia escura, estética editorial | APROVADO | validar comps reais |
| DS-DEC-003 | Cards arredondados, blur e glass contidos | APROVADO | aprovar tokens exatos |
| DS-DEC-004 | Fotografia institucional editorial e conteúdo real sem padronização | APROVADO | diretrizes de sourcing e QA |
| DS-DEC-005 | FAVX wordmark/símbolo final | PENDENTE | logo, aplicações, exports e licenciamento |
| DS-DEC-006 | Motivo quatro cards arredondados 2×2 | PROPOSTO COMO HERANÇA | validar relação com logo FAVX |
| DS-DEC-007 | Paleta neutra e cores semânticas HEX deste DOC | PROPOSTO | testar protótipos e contraste |
| DS-DEC-008 | Escalas de tipografia, radius, motion e espaço | PROPOSTO | homologar por telas críticas |
| DS-DEC-009 | Glass opacity/blur e shadows | PROPOSTO | QA mobile e performance |
| DS-DEC-010 | Modo escuro | FUTURO/OPCIONAL | não prometer no MVP |
| DS-DEC-011 | Biblioteca Lucide e camada de primitives | PROPOSTO | validação técnica/licença |
| DS-DEC-012 | Slogans herdados da marca anterior | PENDENTE | nova aprovação FAVX |
| DS-DEC-013 | Template responsive dos 142 IDs | DERIVADO | protótipos e aprovação por grupo |
| DS-DEC-014 | Notas pessoais 0–10 com incrementos de 0,5 | CONSOLIDADO EM PRD, validar UI | testar slider, valor, leitor |
| DS-DEC-015 | Padrão gráfico para métricas | PROPOSTO | testes de legenda, amostra e contraste |
| DS-DEC-016 | Idade mínima/legal e regras de conteúdo | PENDENTE JURÍDICO/PRD | definir antes de UI de consentimento |
| DS-DEC-017 | Política de lixeira e recuperação | PENDENTE | 30 dias é proposta, não fato final |
| DS-DEC-018 | USD/EUR anual e preços regionais | PENDENTE | definir com pricing/billing |
| DS-DEC-019 | Inventário/rotação de banner Plus | PENDENTE | regra de limite de slots |
| DS-DEC-020 | Licença, fonte e idioma dos instrumentos de mídia | PENDENTE TÉCNICO | POC e QA antes de produção |
| DS-DEC-021 | Parceiros: payout mínimo e periodicidade | PENDENTE | não esconder termos na UI |
| DS-DEC-022 | Sistema visual FAVX for Brands | FUTURO | não desenvolver agora |
| DS-DEC-023 | Sistema visual Events e Proof | FUTURO | respeitar foundations e criar padrões próprios depois |
| DS-DEC-024 | Alta densidade de admin | PROPOSTO | validar usabilidade e contraste |
| DS-DEC-025 | Padrão de iconografia de nota versus coração | PROPOSTO | protótipo para não confundir avaliação/salvar |

**Governança de decisão:** qualquer token `PROPOSTO` deve entrar em branch/protótipo, receber teste e aprovação. A aprovação do documento como artefato **não implica** que paleta, marca gráfica, slogans, dark mode ou preços pendentes tenham sido automaticamente aprovados para produção.

## 25. Rastreabilidade aos cinco documentos e plano para Claude Code

| Fonte | Papel na implementação do Design System | Como usar |
|---|---|---|
| DOC 01 — PRD | Verdade de produto, regras de negócio e limites | conferir cada affordance com requisito funcional |
| DOC 02 — TRD | Stack, segurança, i18n, performance e RLS | componentes não podem anular garantias técnicas |
| DOC 03 — App Flow | ID, papel, rota/superfície, ações, estados e exceções | aplicar templates e IDs do capítulo 18 |
| DOC 04 — Design System | Identidade visual, tokens, padrões, componentes e QA | fonte de verdade da interface |
| DOC 05 — Backend & DB | View models, endpoints e autorizações implementáveis | dados públicos estritamente separados dos privados |
| DOC 06 — Execution Plan | Ordem, tickets, dependências e testes | implementar por foundations→components→patterns→screens |

### 25.1. Sequenciamento recomendado para Claude Code

**DS-EPIC-01** preparar tokens, escala e import da fonte (com validação de licenças). **DS-EPIC-02** criar primitives com stories/a11y. **DS-EPIC-03** montar cards/media + layouts públicos. **DS-EPIC-04** criar editor/uploads/captura. **DS-EPIC-05** calendário/agenda/banner/pin/estado de conteúdo. **DS-EPIC-06** busca IA, voz e resultados. **DS-EPIC-07** salvos/coleções/comunidade. **DS-EPIC-08** Plus, billing, partners. **DS-EPIC-09** admin e acessibilidade operacional. **DS-EPIC-10** QA visual multidispositivo e 6 idiomas.

### 25.2. Guardrails para geradores de código

- Nunca inventar marca FAVX, slogans, valores de billing, números de métricas ou produtos recomendados para preencher UI final.
- Não criar modos de dark, marketplace, Proof, Events ou busca global como entregáveis do MVP.
- Não substituir componentes por HTML div clicável e não usar dados de Context privado em páginas públicas.
- Não assumir que CSS `display:none` protege dado; autorização sempre no servidor.
- Reutilizar token e componente existentes; criar novo apenas com justificativa e story.
- Não declarar tarefa concluída sem capturas/screenshots, testes e auditoria de idioma e acessibilidade.

### 25.3. Entregável mínimo por screen ID

`screen_id`, `template`, `components[]`, `responsive_states[]`, `aria_contract`, `copy_i18n_ids[]`, `privacy_contract`, `loading_error_empty`, `events`, `screenshots`, `e2e_ids[]`, `source_prd_trd_doc03`. Cada entrega referenciada a commit/PR para auditoria.

## 26. Checklist final de homologação do Design System

- [ ] A marca FAVX tem logo/símbolo vetorial homologado e não herda letras G/X da marca antiga.
- [ ] Typography Manrope/Instrument Serif verificada nos 6 idiomas e licenças.
- [ ] Tokens light contrastados e aprovados em marketing, perfil, editor e admin.
- [ ] Raios, sombras, blur e escala aprovados por protótipos comparativos.
- [ ] Biblioteca tem componentes DS-CMP-001 a DS-CMP-075 implementados ou explicitamente mapeados para fase adequada.
- [ ] Todos os 138 IDs MVP do DOC 03 têm template/estados definidos; 4 FUT não têm rota ativa.
- [ ] Cards e perfis públicos não exibem seguidores, saves, views nem outros placares.
- [ ] FAVX Context permanece privado inclusive no DOM, metadados e payload.
- [ ] Original/derivado/direitos de download estão claros em cada fluxo de mídia.
- [ ] Agendamento post/banner/pin mostram data, hora, fuso, consequências e estados.
- [ ] Conteúdo expirado/oculto não aparece publicamente; métricas permanecem na área autorizada.
- [ ] Conteúdo da comunidade tem atribuição correta e controles de autoria.
- [ ] Busca mantém escopo local e não inventa informações, mesmo ao usar contexto oculto.
- [ ] Creator Plus e Partner exibem preços/condições validados e não inventam planos pendentes.
- [ ] WCAG 2.2 AA auditada com ferramentas e testes manuais, inclusive 320px/zoom/motion.
- [ ] Todos os textos críticos em pt-BR, pt-PT, en, es, it, fr revisados.
- [ ] Visual regression e Storybook cobrem variantes críticas e quebra de mídia.
- [ ] Marcas, logos, slogans, cores, raios e regras comerciais pendentes estão registradas para aprovação.
- [ ] DOC 05 e DOC 06 incorporarão contratos de UI e IDs de rastreabilidade sem divergências.

**Resultado de aprovação:** um Design System coerente, acessível, testável, reconhecível como FAVX e pronto para ser traduzido em componentes reutilizáveis. A aprovação visual final exige protótipos reais das jornadas-chave; o texto e os arquivos de tokens são sua fundação, não substitutos desses protótipos.

## 27. Referências e notas de aplicação

1. FAVX — PRD Ultra Detalhado v1.0, 04/11/2026 (fonte interna de produto).
2. FAVX — TRD Ultra Detalhado v1.0, 04/11/2026 (fonte interna técnica).
3. FAVX — DOC 03 App Flow & Screen Specifications v1.0, 04/11/2026 (fonte interna de telas).
4. WCAG 2.2 — W3C: https://www.w3.org/TR/WCAG22/ e tradução pt-BR: https://www.w3.org/Translations/WCAG22-pt-BR/.
5. Design Tokens Format Module 2025.10 (DTCG Community Group Report): https://www.designtokens.org/tr/2025.10/; documento comunitário, não Recomendação W3C de standards track.
6. Tailwind CSS — theme variables: https://tailwindcss.com/docs/theme. Verificar versão escolhida no lockfile.
7. MDN — prefers-reduced-motion: https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/%40media/prefers-reduced-motion.
8. WebAIM Contrast Checker e tecnologias assistivas podem apoiar testes, mas não substituem auditoria humana.

**Encerramento:** o DOC 04 v1.0 fixa diretrizes visuais aprovadas, fornece proposta operável de tokens e componentes, e cria rastreabilidade para as 142 superfícies. Valores propostos devem ser homologados em frames representativos antes do freeze visual. Próximo documento: **DOC 05 — Backend & Database Completo**, seguido do DOC 06 — Execution Plan para Claude Code.
