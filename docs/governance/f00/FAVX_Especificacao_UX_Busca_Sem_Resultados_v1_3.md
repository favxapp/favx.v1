# FAVX — Especificação de UX e produto: busca sem resultados (v1.3)
**Estado:** proposta para aprovação da Product Owner. **Alvo:** `SRH-008`, `SRH-007`, `SRH-002`, `PUB-005`, busca na biblioteca do usuário. **Objetivo:** preservar confiança, relevância, descoberta e privacidade; não criar conteúdo fictício.

## 1. Princípio e escopo
Busca do MVP ocorre **somente dentro do perfil do creator visitado** ou dentro dos **itens salvos pelo usuário**. Falta de resultado não autoriza pesquisa global, sites externos ou conteúdo de outros creators sem escolha explícita em recurso futuro aprovado. Não tratar a FAVX como motor de recomendações universais antes da busca global existir. **Nenhuma sugestão pode inventar recomendações, locais, recursos, preços, avaliações, disponibilidade ou atributos.** Toda alternativa apresentada como resultado deve estar ligada a post existente, autorizado, vigente, aprovado e elegível naquele escopo.

## 2. Taxonomia obrigatória de estados
| Código | Estado | Diagnóstico | Interface correta | Métrica |
|---|---|---|---|---|
| ZR-01 | zero_real | Query válida e execução concluída com zero itens elegíveis | Mensagem de não encontrado + edição de busca + sugestões verificadas | `search.empty` |
| ZR-02 | filtros_excessivos | Há candidatos, mas filtros eliminam todos | Mostrar filtros ativos e chips de retirada voluntária | `search.empty` com reason_code permitido e sem distinguir itens restritos |
| ZR-03 | correspondência_exata_ausente | Candidatos relacionados, mas não cobrem condições obrigatórias | Mostrar apenas com aviso inequívoco «relacionadas», não «correspondência» | `search_suggestion.shown` |
| ZR-04 | acervo_vazio | Creator ainda não publicou recomendações elegíveis | Estado de perfil novo, CTAs de explorar perfil/voltar, sem IA simulada | `search.empty` |
| ZR-05 | conteudo_restrito | Itens existentes, mas privados, expirados, ocultos, moderados ou de outro creator | Não revelar existência, quantidades ou detalhes dos itens restritos; mesmo UX de zero_real | `search.empty` indistinguível de zero_real em superfícies públicas |
| ZR-06 | falha_ia | Timeout, quota ou modelo indisponível | Aviso técnico + busca textual convencional no mesmo escopo + botão tentar novamente | `search.failed`, `search_fallback.shown` |
| ZR-07 | falha_tecnica | Erro DB, API, rede, conexão ou indexador | Aviso de falha, estado de retry, nunca dizer «nenhum resultado» | `search.failed` |
| ZR-08 | consulta_ambigua | Texto muito curto/vago, múltiplas interpretações sem confiança | Sugerir esclarecimento ou categorias existentes | `search.refined` se confirmada |
| ZR-09 | sem_permissao | Busca em coleção privada/recurso removido | Controle de acesso adequado, voltar ao perfil ou biblioteca; não sugerir resultados privados | auditoria de acesso restrito |
| ZR-10 | voz_indisponivel | Microfone não concedido/transcrição falhou | Entrada de texto manual; não perder a busca existente | `search.failed` com enum reason |

## 3. Fluxo principal SRH-008
1. Receber `scope_type`, `scope_id`, filtros autorizados, idioma, timezone e texto ou transcrição; não obter geolocalização sem permissão.
2. Executar validação de acesso e recorte no **backend**, antes da recuperação textual/vetorial/geo. Jamais confiar em scope enviado só pelo cliente.
3. Verificar elegibilidade temporal, moderação, estado do creator e mídia obrigatória pronta para cada candidato.
4. Se resposta zero, classificar entre vazio real/filtros excessivos/falha, sem revelar conteúdos restritos.
5. Renderizar título curto, contexto explícito («neste perfil» ou «nos seus salvos»), termos editáveis e filtro(s) ativos com rótulo.
6. Sugerir até **três ações úteis**, nesta ordem: editar/refinar a busca; remover filtro específico voluntariamente; explorar categorias ou coleções **que existam** naquele creator. Se não há categorias úteis, não exibir bloco vazio.
7. Mostrar relacionadas somente se existirem itens elegíveis confirmados que atendam às condições essenciais. Se não atenderem, rotular como sugestões **fora de parte dos critérios**, com distinção visível; não colocá-las na lista de resultados exatos.
8. CTA de futura «pedir recomendação ao creator» deve ser **flagged off por padrão** até fluxo, privacidade, abuso e controle de opt-in serem aprovados; jamais enviar mensagem automaticamente.
9. Botão «Limpar filtros» preserva o termo buscado e escopo. «Nova busca» opcional limpa parâmetros após ação explícita.
10. Estado deve funcionar anonimamente sem forçar login para visualizar sugestões públicas. Login só se a pessoa optar por salvar ou enviar pedido que exija conta.

## 4. Política de relaxamento de consultas
**Automático permitido:** normalizar acentos/caixa, singular/plural, grafias alternativas verificadas, pequenas correções tipográficas e sinônimos de alta confiança; não alterar o sentido essencial. **Somente com confirmação do usuário:** ampliar raio/localização, retirar «espaço kids», «acessível», «vegano», preço máximo ou qualquer atributo de exclusão/segurança, remover datas. Não tratar região aproximada como endereço exato. **Nunca:** buscar em outro creator, expor recomendação privada, inventar candidato ou incluir produto externo como se fosse recomendação.

## 5. Contratos de interface
- Desktop: visual editorial, pesquisa editável no topo, mensagem central concisa, 1–3 CTAs, chips e bloco de categorias existente.
- Mobile: área clicável adequada, botão principal acima da dobra quando possível, bottom sheet para filtros, teclado não oculta CTA nem bloqueia rolagem.
- Se houver zero candidatos reais: nenhum card fictício, imagem genérica representando resultado ou avaliação inventada. Ilustração decorativa opcional, sem indicar existência de itens.
- Acessibilidade: foco preservado após submit; `aria-live` polite anuncia resultado/vazio; erro técnico `role=alert` quando crítico; teclado e leitor de tela; estado reduzido de movimento; contraste AA.
- Performance: skeleton só durante busca; nunca esconder erro com skeleton infinito. Cache precisa incluir `creator_id`, escopo, filtros, locale e versão de índice; expiração/moderação invalida elegibilidade na leitura.
- Privacidade: as pesquisas privadas não aparecem para creator individualmente. Dashboard mostra termos/categorias agregados somente conforme limiar e base legal; sem raw query por padrão.
- Conteúdo patrocinado: não preencher resultados vazios com banner pago como se atendesse às condições; se houver anúncio, rotular claramente e separar de resultados.

## 6. Microcopy canônica — 10 estados × 6 idiomas
**Arquivo normativo proposto:** `FAVX_Microcopy_Busca_ZR_10x6_v1_3.csv` (60 linhas, `pt-BR`, `pt-PT`, `en`, `es`, `it`, `fr`). Cada estado ZR-01..ZR-10 possui título, explicação, CTA principal e secundário, tradução de escopo para creator/biblioteca e flag de revisão humana. **Nenhuma tradução é considerada homologada** até revisão por pessoas fluentes e QA no dispositivo.

| Estado | Significado da comunicação | Nota de segurança e interação |
|---|---|---|
| ZR-01 | Nenhuma recomendação encontrada | Mostrar escopo e até três ações verificadas |
| ZR-02 | Filtros excessivos | Oferecer remoção **voluntária** de filtros |
| ZR-03 | Existem apenas itens relacionados | Separar claramente de correspondências exatas |
| ZR-04 | Creator sem recomendações elegíveis | Não simular acervo ou IA |
| ZR-05 | Conteúdo restrito | **Usar a MESMA microcopy pública do ZR-01** para não revelar existência |
| ZR-06 | Falha da IA | Oferecer busca textual convencional no mesmo escopo |
| ZR-07 | Falha técnica | Informar erro e preservar pesquisa para retry; jamais dizer “zero resultados” |
| ZR-08 | Consulta ambígua | Pergunta de esclarecimento, categorias elegíveis |
| ZR-09 | Sem permissão | Mensagem neutra, sem informar se item privado existe |
| ZR-10 | Voz indisponível | Oferecer digitação sem perder dados inseridos |

Placeholder `{scope}` deve receber tradução local de `SCOPE_CREATOR` ou `SCOPE_SAVED` conforme busca real. Textos de botões só são mostrados quando ação é válida; por exemplo, não oferecer “Explorar coleções” se nenhuma coleção visível existir. O servidor nunca expõe `hidden_match_count` ou motivo de conteúdo restrito. O código interno ZR-05 não viaja ao cliente como indicação de existência privada.

**Eventos canônicos e aliases:** `search.empty` é o nome canônico; `search.no_results` é alias legado. `search.failed` usa `reason` de enum: `ai_provider_timeout`, `ai_quota`, `ai_provider_error`, `network_error`, `backend_error`, `database_error`, `index_error`, `voice_permission_denied`, `voice_transcription_failed`, `voice_device_unavailable`, `unknown`; `engine` distingue IA, texto, híbrido e voz. `search_suggestion.shown`, `search_suggestion.clicked`, `search_filter.relaxed`, `search_fallback.shown`, `search_feedback.submitted` também existem no dicionário v1.3, com schema e testes. Não registrar consulta em texto bruto em telemetria opcional.

**Futuro CTA “Pedir recomendação ao creator”:** é **uma solicitação da audiência ao creator**, e não o mesmo fluxo em que um seguidor *envia uma recomendação* em resposta a pedido do creator (`FAVX-COM`). Dependerá de novo requisito/fluxo de aceite PO, opt-in do creator, rate limit, controle de abuso e política de privacidade. A feature flag permanece **desligada**, sem criar endpoint ou mensagens automáticas agora.

## 7. Exemplo preciso
Consulta: «churrascaria com espaço kids no Flamengo» em `/:username`. Se só existem churrascarias sem espaço kids, o sistema deve dizer que **não encontrou correspondência com todos os critérios**. Pode apresentar chip «Remover filtro espaço kids» com ação explícita, nunca exibir uma das churrascarias como se tivesse espaço kids. Se não existem churrascarias ou restaurantes no perfil, mostrar coleções reais e CTA de reformular. Se a IA falhar, rodar fallback textual e dizer que houve problema técnico, não alegar ausência de resultados.

## 8. Requisitos de API e dados para Claude Code (não implementar nesta F00)
- `search_response`: `status` em {`ok`,`empty`,`fallback`,`error`,`unauthorized`}; `scope` validado no servidor; `match_type` exato/relacionado; `applied_filters`; `relaxation_suggestions` com justificativa e condição de consentimento; `index_version`; `trace_id` pseudônimo.
- Não devolver `hidden_match_count` nem dados que permitam inferir posts privados.
- Resolver «existem categorias/coleções válidas?» a partir de acervo público elegível do mesmo creator e data corrente, não por geração de IA.
- Telemetria sem raw query; IDs e categorias de intenção agregadas apenas onde permitido. Eventos canônicos: `search.empty`, `search_suggestion.shown/clicked`, `search_filter.relaxed`, `search_fallback.shown`, `search.failed`, `search_feedback.submitted`.
- Controles de custo e rate limit, sem consumir chamada de IA só para construir o texto de estado vazio. Templates i18n determinísticos.

## 9. Critérios de aceite verificáveis
- `ZR-T01` busca sem resultados mostra scope correto, 1–3 ações úteis e mantém texto inserido.
- `ZR-T02` zero real não exibe conteúdos fabricados nem origens externas.
- `ZR-T03` nenhuma sugestão mistura publicações de outros creators.
- `ZR-T04` conteúdos ocultos, expirados, moderados e privados não aparecem nem são inferíveis por contagem.
- `ZR-T05` timeout e erro do provedor aparecem como falha/fallback, não `empty`.
- `ZR-T06` escolha explícita requerida para ampliar raio/remover «espaço kids» ou outros requisitos rígidos.
- `ZR-T07` sugestões geradas a partir de categorias/coleções existentes e elegíveis; bloco ausente quando não houver.
- `ZR-T08` com 0 posts elegíveis, não solicitar login nem criar cartões vazios artificiais.
- `ZR-T09` voz falha => texto manual acessível; busca anterior preservada.
- `ZR-T10` casos 320px/390px, leitor de tela, teclado, dark incidental e foco adequados.
- `ZR-T11` traduções revisadas por humano, inclusive variante para salvos.
- `ZR-T12` analytics de busca não revelam consultas individuais ao creator; sem query em eventos de browser/erro.
- `ZR-T13` conteúdo patrocinado não aparece como resultado exato se não corresponder.
- `ZR-T14` termo buscado e chips restaurados após login voluntário/retorno.
- `ZR-T15` cache de resultados não contorna expiração de posts.
- `ZR-T16` API de sugestão não cria solicitação comunitária sem ação/consentimento.
- `ZR-T17` eventos de empty/refine/suggestion usam IDs e schemas versionados do dicionário.
- `ZR-T18` testes de relevância incluem sinônimos multilíngues, com testes em seis idiomas e zero vazamento de Context.

## 10. Integração documental proposta
Atualizar por diff: PRD (busca/resultados vazios + critérios), TRD (falhas de IA/escopo e cache), DOC03 (`SRH-008` e `SRH-007`, estados de `PUB-005`/`USR`), DOC04 (componentes de estado vazio, chips, feedback), DOC05 (DTO e eventos), DOC06 (tarefas e E2E). Requer aprovação de PO antes de alterar originais.

## 11. Testes adicionais da versão 1.3
- **ZR-T19:** snapshot de microcopy para cada um dos dez estados em seis locales; links, gênero e comprimento testados; sem revisão humana não habilitar comunicação comercial definitiva.
- **ZR-T20:** ZR-05 e ZR-01 geram textos, HTTP e payloads indistinguíveis para visitante não autorizado; nenhum motivo privado chega a analytics do creator.
- **ZR-T21:** `search.failed` distingue falha de IA (`ai_provider_timeout`) de voz (`voice_permission_denied`), sem classificar como `search.empty`; fallback mantém mesmo escopo.
- **ZR-T22:** CTA futuro de pedir recomendação permanece invisível e sem side effects com flag desligada; não se confunde com envio comunitário do PRD.
