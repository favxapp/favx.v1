# FAVX — Registro consolidado de decisões e correções pré-desenvolvimento
**Data:** 08/11/2026  • **Versão:** proposta 1.2  • **Destino:** Claude Code / governança F00  • **Escopo:** PRD, TRD, DOC03–DOC06

> **Status:** esta é uma recomendação consolidada para aprovação de Product Owner, não evidência de homologação. Não alterar o estado dos ADRs nem fazer deploy/migrations em produção automaticamente. Provas de conceito e revisões legais condicionam os módulos indicados.

## 0. Regras soberanas
1. FAVX é `favx.app`, MVP Creators + Users, apenas busca local por creator, seis idiomas (pt-BR, pt-PT, EN, ES, IT, FR) e BRL/USD/EUR separados de locale; busca global, Events, Proof e Brands são futuros.
2. Privacidade de seguidores/seguindo, salvamentos, buscas e demais métricas: sem números públicos. Context e originais privados, autorizações por recurso. Nenhum dado comercial de audiência é compartilhado por padrão.
3. Eventos de analytics registrados desde a fundação, inclusive Free, sujeitos às bases legais/consentimentos necessários. Free exibe apenas clique geral da página; Plus libera histórico avançado. Followers próprios não são métricas públicas.
4. Expiração torna conteúdo indisponível nas consultas públicas por predicado temporal na leitura, não por cron. Retenção de métricas agregadas dentro da política; excluir é ação separada.
5. Imagens ≤20MB, vídeos ≤250MB e 10min, áudio ≤20MB e 10min; texto ≤10000 caracteres, carrossel ≤10 mídias como proposta; limites no arquivo original. Original retido privado e download permitido somente por direito/propriedade.
6. Dev, staging e produção isolados (DB/keys/webhooks/mídia). Branch `main` = produção; `develop` = staging; nunca fazer deploy PROD ou migration PROD sem aprovação explícita.

## 1. Registro DEC-01…DEC-25
| ID | Tema | Recomendação canônica | Estado | Afeta |
|---|---|---|---|---|
| DEC-01 | Coleções | Coleções pessoais e criadas pelo creator sem limite de quantidade nos dois planos; até seis coleções destacadas no Plus, nenhuma destacada no Free. Favoritos/salvamentos não contam como coleções. | `PROPOSTO` | Catálogo de entitlements; UI; PRD; DOC03; SQL |
| DEC-02 | Banners | Plus até dez campanhas de banner ativas ou agendadas (rascunhos e histórico não contam), com no máximo 1 hero e 2 espaços secundários simultaneamente; sem sobreposição no mesmo slot. Atribuição de patrocínio obrigatória. | `PROPOSTO` | Calendarização, slots, SQL, UI e regras de conflito |
| DEC-03 | Trial | 14 dias, acionado explicitamente uma vez por pessoa elegível; não exigir cartão; se não houver pagamento consentido ao fim, voltar a Free sem cobrança; evitar trials sucessivos fraudulentos. | `PROPOSTO` | Stripe testes, elegibilidade, entitlements, webhooks |
| DEC-04 | Anual USD/EUR | Sugestão USD 190 e EUR 190 por ano (dez mensalidades de USD/EUR 19); BRL 899 por ano mantido. Impostos, preços exibidos e disponibilidade por país sujeitos à validação. | `VALIDAR_JURIDICO` | Stripe price IDs por região, NF, impostos |
| DEC-05 | Atribuição de parceiros | Último clique válido em janela de 30 dias; atribuição congelada no cadastro/checkout; código de referência alternativo para cross-device; consentimento/legítimo interesse avaliado e anti-autorreferência; inscrição depende de aprovação. | `PROPOSTO` | Referral ledger, consent, tracking |
| DEC-06 | Comissão/payout | R$ 19,90 por mês de serviço pago válido do plano-base, com competência mensal também no anual; não incide em add-ons; payout mensal após período de segurança de 30 dias e mínimo sugerido de R$ 100; estornos ajustam comissões; internacional sujeito à revisão. | `VALIDAR_JURIDICO` | Ledger imutável, parceiros BRL, payout |
| DEC-07 | Lixeira | 30 dias para recuperação; restauração volta como draft ou hidden, jamais republish automático. Após prazo, executar purga de mídia/PII conforme retenção, backups e leis. O prazo de retenção pós-cancelamento do Creator não está homologado; NÃO presumir 90 dias nem aplicar regra histórica de outro módulo automaticamente. | `VALIDAR_JURIDICO` | Lifecycle, media purge, restore, retention |
| DEC-08 | Download e direitos | Download do original somente pelo creator proprietário e por titulares com direito explícito. Metadados rights_type, source_type, capture_origin, ownership_declaration, license; conteúdo externo não vira cópia local automaticamente. | `PROPOSTO` | Uploads, autorizações, media download |
| DEC-09 | Free/fair use | Posts, uploads e capacidade acumulada sem limite fixo comercial de GB, respeitados limites por arquivo. Política de uso justo contra abuso, distribuição automatizada não autorizada e uso incompatível; nenhuma cota oculta de posts. IA separada da promessa ilimitada. | `PROPOSTO` | Abuse detection, pricing/terms |
| DEC-10 | IA e custos | Free tem busca textual/filtros; Plus tem conversacional. Rate limits/budgets configuráveis por sessão, creator e global; breaker e fallback textual. Não anunciar número ilimitado de consultas IA. Fechar limites finais após POC de custos. | `VALIDAR_POC` | AI gateway, quotas, metering |
| DEC-11 | Geolocalização | Mapbox Geocoding v6 como candidato para bairros/cidades; uso permanente somente em contrato/modo permitido. Busca de estabelecimentos via adapter POI separado. Geolocalização precisa só com permissão e sem histórico por padrão. | `VALIDAR_POC` | Geocoder adapter, PostGIS, privacy |
| DEC-12 | Métricas | Impressão: >=50% do card visível por >=1 s contínuo; cliques no link de destino por ação real. Guardar bruto e único separadamente; únicos deduplicados por sessão+recurso em 24h, com restrições de privacidade e bots filtrados. | `PROPOSTO` | Event dictionary, dedupe, aggregation |
| DEC-13 | Idade | Contas inicialmente 18+; visitas anônimas públicas sem conta, sujeitas a regras locais e conteúdo. Política legal e implementação de prevenção de abuso obrigatórias antes do go-live. | `VALIDAR_JURIDICO` | Onboarding, privacy, terms |
| DEC-14 | Atendimento/moderação | Formulário/e-mail, fila de denúncias com triagem por gravidade, bloqueio de conteúdo e recurso. Publicar prazo aspiracional só se a operação conseguir cumpri-lo; equipe e runbook definidos antes do lançamento. | `PROPOSTO` | Support inbox, admin, escalation |
| DEC-15 | Marca | Manrope + Instrument Serif, paleta majoritariamente branca/preta, cards arredondados, blur e glass editorial mantidos. Logo final, ícones e licença de fontes precisam de verificação/homologação. | `PROPOSTO` | DOC04 assets, brand |
| DEC-16 | Carrossel | Até 10 itens de mídia por carrossel, mistos imagem/vídeo, com ordenação, alt text, capa e limites unitários do original. | `PROPOSTO` | Editor, media constraints |
| DEC-17 | Notificações | No lançamento: transacionais por email e inbox in-app funcional; sem push. Não notificar novo follower por padrão; preferências/opt-out para comunicações não essenciais. | `PROPOSTO` | Notifications, email |
| DEC-18 | Login | Passwordless e-mail OTP como fluxo preferido, sessão Supabase; Google OAuth é P1 opcional; MFA exigido para admins; proteções para abuso de envio OTP. | `PROPOSTO` | Auth UX, RLS, session |
| DEC-19 | Avaliação | Creator pode avaliar opcionalmente de 0 a 10 em incrementos de 0,5; identificar sempre como nota pessoal do creator, não rating comunitário. | `PROPOSTO` | DB constraints, UI |
| DEC-20 | Conteúdo/legal | Política editorial nos 6 idiomas, denúncia, remoção, apelação, copyright, licenças e identificação de publi/afiliado. Textos legais validados por profissional. | `VALIDAR_JURIDICO` | Moderation, terms, i18n |
| DEC-21 | Domínios e rotas | favx.app canônico; /:username na raiz, /:username/p/:slug-:shortId para post, /:username/c/:slug-:shortId coleção; /app/creator/* privado; institucionais /:locale/..., rotas e slugs reservados em todas as línguas; 301 ao renomear. | `PROPOSTO` | Router, slug resolver, redirects, SEO |
| DEC-22 | Bunny | Bunny preferred para Stream/CDN/storage, ainda condicionado à prova de upload 250MB, original privado, recuperação, proteção CDN e custo total. Se Bunny Storage não oferecer upload direto seguro, aceitar object storage alternativo para originais via adapter. | `VALIDAR_POC` | Media provider architecture |
| DEC-23 | Stripe e impostos | Stripe como plataforma principal de billing; validar meios recorrentes, países atendidos, faturamento, impostos, reembolso e operação CNPJ. Cobrança por país com flag, sem disponibilizar até homologado. | `VALIDAR_JURIDICO` | Regional launch, checkout |
| DEC-24 | Metas | North star: buscas úteis e recomendações efetivamente encontradas. Funil: ativação creator (>=5 recomendações), página compartilhada, primeira busca, primeira ação útil, retorno em 30 dias e upgrade. Metas numéricas calibrar beta. | `PROPOSTO` | Analytics KPIs |
| DEC-25 | Governança de dados | Matriz dado-finalidade-base legal-origem-consentimento-retenção-eliminação-país; LGPD/GDPR e transferências; minimização, agregação e revogação. Revisão jurídica externa antes do lançamento público. | `VALIDAR_JURIDICO` | Privacy data registry |

## 2. TEC-01…TEC-10
| ID | Tema | Direção técnica | Gate |
|---|---|---|---|
| TEC-01 | Jobs | PostgreSQL job state/outbox + pg_cron para reconciliar e workers idempotentes; avaliar Vercel Queues (em Beta) como transporte de eventos, não agenda exclusiva de longo prazo. | VALIDAR POC-J01 e prova de recuperação/custo |
| TEC-02 | Uploads | Browser -> upload seguro/reiniciável sem Vercel transportar 250MB; Bunny Stream TUS vídeo; original em storage privado compatível e downloads autenticados. Verificar que Bunny Storage não exija expor AccessKey. | VALIDAR POC-M01; alternativa S3/R2 se necessário |
| TEC-03 | Email | Resend como candidato primário, via provider adapter, SPF/DKIM/DMARC, domínios/envios por ambiente; sandbox/test recipients em staging. | Teste DNS e entregabilidade |
| TEC-04 | Analytics | Eventos de negócio próprios no PostgreSQL e agregações; PostHog somente como camada complementar de análise e com consentimento e minimização por jurisdição. | Aprovação legal cookies e ETL |
| TEC-05 | Embeddings | FTS/trigram + pgvector + PostGIS; embedding multilíngue OpenAI por adapter, versionado e reindexável, filtros de creator antes de retornar resultado. | POC-S01 e A01 |
| TEC-06 | Cache e expiração | Original privado via download temporário; mídia pública cacheável com purge e TTL moderado; conteúdo de campanha sensível usa token/TTL curto. API/listagens/busca fazem predicate temporal na leitura. | POC-J01; não prometer revogar bytes já baixados |
| TEC-07 | Entidade jurídica | Uma entidade brasileira inicial, flags para habilitar região e forma de cobrança apenas após validação tributária, consumer law, NF, processamento e retenção. | Advogado/contador/Stripe |
| TEC-08 | Marketplace futuro | Registrar entidades e métricas agregadas desde dia 1; IDs imutáveis e consentimentos futuros; não implementar tabelas de matches/campanhas até validação. | Nenhum bloqueio MVP |
| TEC-09 | Direitos/moderação | Rights/provenance no media_assets, denúncias, takedown, fluxo de disputa e evitar cópias automáticas de mídia externa; analisar conteúdos proibidos. | Políticas/fluxos revisados juridicamente |
| TEC-10 | Supabase | Dev local + projetos separados staging/prod, selecionar região primária após teste de latência, produção paga com backups; backup de objetos Bunny separado; ensaio de restauração. | RPO/RTO são metas de operação a homologar |

## 3. POCs bloqueantes — condições observáveis
### POC-M01 — Media 250 MB
- **Executar:** Safari iOS e Android Chrome, upload interrompido e retomada, checksum antes/depois, original privado e download, transcode/preview, tokens e egress; comparar Bunny Stream + Storage e alternativa.
- **Aceitar somente se:** Upload recuperável, original byte-identical, nenhuma credencial secreta no cliente, economia comprovada.
- **Entregar:** código reproduzível isolado, fixtures sintéticos, logs sem segredos, resultados quantificados, custo estimado, limitações, recomendação e ADR atualizado.

### POC-S01 — Search scope
- **Executar:** 10k/100k posts sintéticos, seis idiomas, filtragem por creator, PostGIS, FTS+vector, teste de nomes iguais entre creators e injeções/contexto malicioso.
- **Aceitar somente se:** Zero retorno cross-owner, ranking relevante segundo dataset rotulado, metas p95 aprovadas.
- **Entregar:** código reproduzível isolado, fixtures sintéticos, logs sem segredos, resultados quantificados, custo estimado, limitações, recomendação e ADR atualizado.

### POC-J01 — Expiração
- **Executar:** Transições T-1s, T e T+1s, concorrência, cron offline, cache quente, timezone DST, pausa e pin separado.
- **Aceitar somente se:** A consulta pública deixa de considerar o item a partir de T, sem depender de cron; CDN segue política documentada.
- **Entregar:** código reproduzível isolado, fixtures sintéticos, logs sem segredos, resultados quantificados, custo estimado, limitações, recomendação e ADR atualizado.

### POC-B01 — Stripe
- **Executar:** Trial no-card, conversão, churn, anual, refunds, webhooks duplicados e desordenados, idempotência, retries.
- **Aceitar somente se:** Entitlements derivados de estados válidos reconciliados com Stripe, sem grants por redirect.
- **Entregar:** código reproduzível isolado, fixtures sintéticos, logs sem segredos, resultados quantificados, custo estimado, limitações, recomendação e ADR atualizado.

### POC-A01 — IA
- **Executar:** pt-BR pt-PT EN ES IT FR; transcrição, busca conversacional, métricas de falso positivo, custo/consulta, rate limits e fallback.
- **Aceitar somente se:** Sem fatos inventados ou vazamentos de Context; custo médio e p95 medidos, limites homologados.
- **Entregar:** código reproduzível isolado, fixtures sintéticos, logs sem segredos, resultados quantificados, custo estimado, limitações, recomendação e ADR atualizado.

## 4. ADRs 001–014 do TRD — decisão proposta por item
| ID | Tema original do TRD | Tratamento | Nota |
|---|---|---|---|
| ADR-001 | Monólito modular Next.js | ACEITAR DIREÇÃO | Reavaliar apenas após dados reais de performance/equipe. |
| ADR-002 | Supabase Auth/Postgres com RLS | ACEITAR DIREÇÃO | Testar permissões/grants e RLS antes de lançar. |
| ADR-003 | Bunny + originais privados | CONDICIONAL POC-M01 | Não fixar storage até upload/download/qualidade/custo aprovados. |
| ADR-004 | FTS + pgvector + PostGIS | CONDICIONAL POC-S01 | Buscar e pontuar somente dentro de creator; benchmark obrigatório. |
| ADR-005 | Jobs duráveis + outbox | ACEITAR PRINCÍPIO; TECNOLOGIA CONDICIONAL | Postgres como fonte canônica, transporte a validar. |
| ADR-006 | Stripe Billing | CONDICIONAL POC-B01 + JURÍDICO | Pagamentos locais e emissão fiscal ainda não comprovados. |
| ADR-007 | DTOs públicos whitelist | ACEITAR DIREÇÃO | Nunca retornar estruturas privadas genéricas. |
| ADR-008 | Índice de Context privado separado | ACEITAR DIREÇÃO COM PRIVACIDADE | Ranking pode indiretamente sugerir contexto; limitar atributos. |
| ADR-009 | Métricas first-party + analytics tool | ACEITAR DIREÇÃO | Governança e consentimento por região. |
| ADR-010 | Predicate temporal + cron reconcile | ACEITAR DIREÇÃO | Visibilidade na leitura é invariável. |
| ADR-011 | i18n sem colisão username | ACEITAR DIREÇÃO | Rotas /:locale institucionais, root username resolver. |
| ADR-012 | Soft delete + purge | ACEITAR PRINCÍPIO; RETENÇÃO CONDICIONAL | 30 dias lixeira propostos, legal revisa retenção e backups. |
| ADR-013 | Feature flags server-controlled | ACEITAR DIREÇÃO | Deny by default; gates por ambiente e entitlement. |
| ADR-014 | Comissão versionada e auditável | ACEITAR DIREÇÃO; PAYOUT CONDICIONAL | Ledger a partir de eventos Stripe reconciliados. |

**Protocolo:** só marcar `accepted` no registro de arquitetura após Product Owner aceitar este pacote ou decisões individuais, e após POCs nos itens condicionais. Cada ADR precisa conter contexto, alternativas, tradeoffs, custos, privacidade, rollback e responsável.

## 5. Correções cruzadas dos seis documentos
A lista do relatório original contém 20 itens numerados, embora o texto resuma “18 divergências”. Não eliminar os itens 19 e 20; normalizar 20 grupos D01–D20.
| Grupo | Tema | Alteração |
|---|---|---|
| D01 | Domínio | Substituir favx.com por favx.app; consolidar DEC-21; redirects e canonicals. |
| D02 | Rota post | /:username/p/:slug-:publicId; adicionar slug e public_id no banco, API por UUID e parse pelo sufixo válido; preservar redirects. |
| D03 | Painel | /app/creator/*; /app/me/*; /app/partner/* (área autenticada); /admin/*. Candidatura pública sob /:locale/partners/apply. |
| D04 | Institucionais/i18n | /:locale/pricing|help|login|signup|partners|legal|contact; registro root pro username; locale reserved. |
| D05 | Slugs reservados | Lista gerada de todas rotas institucionais, internas e de todas traduções; teste para conflitos. |
| D06 | Admin roles | Permissões granulares RBAC, não enum de cinco roles embutido no schema; migração revisada. |
| D07 | Bloqueio | Manter blocked_users; criar produto e endpoints de bloqueio, sem prometer bloquear leitura anônima de perfil público. |
| D08 | Seguidores | Contagens/listas privadas; texto transparente ao seguir; sem e-mail por follow. |
| D09 | Visibilidade | Uma função SQL/predicate e mesmas invariantes para endpoints, busca, CDN auth; mídia mínima READY. |
| D10 | Mídia expirada | Sem novas autorizações/publicação a partir de T; tokens/caches; nunca prometer revogar bytes previamente obtidos. |
| D11 | Ratings | 0–10 step 0,5; constraint CHECK round(2*rating)=2*rating. |
| D12 | Lixeira | 30 dias e restaurar como draft/hidden; exclusão lógica antes de purga. |
| D13 | Login | E-mail OTP passwordless; Google opcional depois; MFA admin. Revisar PRD 6.2, AUT-001 a AUT-005, AUT-007, USR-009, SHR-003 e segurança administrativa. |
| D14 | Context leak | Teste adversarial de inferência de ranking e segregação; aviso creator e indexar só atributos seguros. |
| D15 | Eventos | Convenção objeto.ação; catálogo completo separado entre comportamento e outbox, incluindo fixação, mídia, Context, denúncia, consentimento, media.verified, banner.activated etc. Ver CSV v1.3. |
| D16 | Jornadas | Renomear PRD-J01..J12 e FLOW-J01..J24; tabela alias mapping nos arquivos e testes. |
| D17 | Plano de construção | DOC06 F00-F19 única sequência normativa; M0..M9 somente marco visual mapeado; events desde fase foundation. |
| D18 | Requisitos | 101 catalogados + FAVX-I18N-001/2/3 = 104; FAVX-PRD-001 não é requisito; MED-010 é requisito não tela. Ajustar verify_package.py. |
| D19 | Design tokens | Border essencial substituir por token >=3:1 (ex #8A8986 sobre branco); focus ring acessível, 320px min, sombras/glass/z-index num único source JSON. |
| D20 | Bunny e flags | Bunny preferred conditional; flags P0 enabled no release após POC e QA, false em dev/staging até validação. |

### 5.1. Rotas canônicas e migração explícita

```text
/                                      landing pública
/:username                             perfil Creator público (slug raiz reservado)
/:username/p/:slug-:publicId           post público, slug decorativo e publicId estável
/:username/c/:slug-:publicId           coleção Creator pública
/:locale/pricing                       página institucional, locale em pt-br|pt-pt|en|es|it|fr
/:locale/partners                      apresentação pública de parceria
/:locale/partners/apply                candidatura pública de parceiro
/app/me/*                              biblioteca, salvos e preferências do usuário
/app/creator/*                         painel Creator autenticado
/app/partner/*                         painel Partner autenticado e área de candidatura/status
/admin/*                               administração autorizada
/api/v1/*                              APIs por ID interno
```

**Regra canônica:** o DOC 03 atualmente usa `/partner/*`. A escolha proposta para a área autenticada é `/app/partner/*`; gerar matriz de rotas antigas → novas, tratar deep links e redirects GET idempotentes para rotas legadas, sem redirect automático de POSTs com dados sensíveis. `partner` e `partners` permanecem namespaces reservados. Uma candidatura pública pode iniciar em `/:locale/partners/apply` e, quando exigir sessão, retomar em `/app/partner/apply`.

**Mudança no banco é obrigatória, mas não nesta F00:** `app.posts` e `app.collections` precisam de `slug text` e `public_id text NOT NULL UNIQUE`, com geração criptograficamente segura, unicidade transacional e índice; sugere-se public ID aleatório de 12 caracteres alfanuméricos com alfabeto inequívoco (alfabeto definido na migration). Não confundir com `id uuid` usado nas APIs. Para conteúdo preexistente, executar backfill transacional em migration controlada antes de tornar NOT NULL. `/:slug-:publicId` deve ser analisado **do fim para o começo**, usando último hífen apenas se o sufixo satisfizer o formato do publicId; o slug pode conter hífens. Resolver exclusivamente por publicId, confirmar o creator associado, consultar versão atual do slug e emitir 301 apenas para GET canônico quando slug/username mudou. Nunca usar slug como único identificador.

Reservar usernames sobre todos os prefixos de idioma, rotas de produto, institucional, aliases antigos e traduções. Critérios de canonicalização, i18n/SEO e snapshots ficam para revisão sem implantar redirects reais nesta F00.

### 5.1A. Mapa proposto de migração das telas Partner do DOC 03

| Tela | Rota anterior no DOC03 | Rota canônica proposta | Regra |
|---|---|---|---|
| PAR-001 | `/parceiros/programa` | `/:locale/partners` | Institucional público; preservar locale |
| PAR-002 | `/partner/candidatar-se` | `/:locale/partners/apply` | Candidatura pública; autenticação retorna ao formulário |
| PAR-003 | `/partner/status` | `/app/partner/application/status` | Exigir sessão do candidato |
| PAR-004 | `/partner` | `/app/partner` | Painel do parceiro aprovado |
| PAR-005 | `/partner/links` | `/app/partner/links` | Links e materiais próprios |
| PAR-006 | `/partner/comissoes` | `/app/partner/commissions` | Comissões privadas |
| PAR-007 | `/partner/pagamentos` | `/app/partner/payouts` | Repasse e dados sensíveis |
| PAR-008 | `/partner/documentos` | `/app/partner/documents` | Documentação do parceiro |
| PAR-009 | `/partner/indicacoes` | `/app/partner/referrals` | Histórico de atribuição próprio |
| PAR-010 | `/partner/suporte` | `/app/partner/support` | Atendimento autenticado |

Essas rotas são **propostas de homologação**, não endpoints já existentes. Preservar aliases e redirecionamentos GET antigos com validação do `returnTo`, sem divulgar dados de outro parceiro. A tradução do texto da UI não exige traduzir o segmento interno da rota em todos os idiomas.

### 5.2. Predicado público canônico — sem depender de promoção por job

O SQL existente usa `lifecycle_state`, `moderation_state='approved'`, `creator_profiles.is_public`, `creator_profiles.creator_state` e `profiles.account_state`. Qualquer proposta de migração precisa preservar a semântica temporal **sem exigir `lifecycle_state='published'` quando o post está agendado**.

```sql
-- SQL ILUSTRATIVO para revisão F00; não aplicar como migration sem POC-J01.
-- A função definitiva também deve validar mídia pronta em função server-side.
SELECT p.lifecycle_state IN ('published', 'scheduled')
   AND p.moderation_state = 'approved'
   AND p.deleted_at IS NULL
   AND (p.visible_from IS NULL OR p.visible_from <= at_time)
   AND (p.visible_until IS NULL OR at_time < p.visible_until)
   AND EXISTS (
      SELECT 1
      FROM app.creator_profiles cp
      JOIN app.profiles u ON u.user_id = cp.user_id
      WHERE cp.user_id = p.creator_id
        AND cp.is_public = TRUE
        AND cp.creator_state = 'active'
        AND u.account_state = 'active'
   )
   AND app.post_media_ready_for_publication(p.id);
```

`app.post_media_ready_for_publication` é **contrato funcional a especificar e testar**, não função existente. Deve retornar TRUE para posts legitimamente textuais/sem mídia obrigatória; para posts com mídia, exigir origem/autorização, estado de processamento adequado, variante de exibição pronta e moderação, diferenciando incorporação externa de mídia armazenada. Uma tentativa de marcar `scheduled` só pode ocorrer após ação explícita de agendamento validada; `draft/hidden/archived/pending_deletion/deleted` nunca são visíveis. Cron reconcilia materializações, caches e notificações — não habilita visibilidade pública. Banners/fixações devem usar elegibilidade temporal própria mais a do post-base quando aplicável. Limites CDN e bytes previamente distribuídos permanecem conforme D10.

### 5.3. Dicionário de eventos canônico — fonte única proposta v1.3

`FAVX_Dicionario_Eventos_v1_3.csv` estabelece 78 eventos com nomes canônicos `objeto.verbo`, versionamento, payload JSON Schema estrito, produtor, consumidor, finalidade, privacidade, idempotência, teste e responsável humano ainda não designado. `FAVX_Aliases_Eventos_v1_3.csv` mapeia nomenclaturas legadas do PRD, TRD, DOC 03, DOC 05 e kit 1.1/1.2. **Alias ambíguo `creator_search` exige validação da semântica, não pode ser convertido automaticamente.**

`otp.*`, `login.*`, `signup.*` e `session.*` são eventos de segurança; não dependem de opt-in de analytics opcionais. `auth.*` são nomes legados; `post_save`, `post_saved`, `creator_search`, `search_submitted` e `search.query_submitted` devem ser conciliados. Eventos de business outbox permanecem distintos de analytics comportamental; nunca fazer renomeação que quebre consumidores sem adapter e teste. `consent.changed` cobre concessão e revogação com action, e `context.updated` substitui `context.updated_by_creator` somente após confirmar payload/consumidores.

Para busca: `search.empty` é o canônico de `search.no_results`; `search.failed` contém `reason` enumerado para distinguir erro de IA, erro de serviço e indisponibilidade de voz. O dicionário contempla `search_suggestion.shown/clicked`, `search_filter.relaxed`, `search_fallback.shown` e `search_feedback.submitted`. ZR-05 não pode revelar que existem itens restritos nem por payload nem por contagem. **Contratos são propostas, não código já implantado.**

### 5.4. RLS, RBAC e endpoints faltantes
API deverá incluir owner checks e contratos autenticados para: follow/unfollow; blocked users (POST/DELETE/GET); denúncias; notifications/preferências; consentimento; exportação e exclusão de conta; share token para coleção; suporte; contestação de moderação; direitos/download de mídia; desativação de perfis. Em cada endpoint testar anônimo/owner/outro usuário/admin com permission e estados deleted/expired/blocked.
Não acrescentar todas as rotas como novo escopo de design; completar contratos exigidos por funcionalidades já previstas no PRD. Alinhamento de `app.blocked_users` com autenticação e RLS, incluindo criação e revogação com checagem de ambas as pontas.

### 5.4A. Matriz administrativa, segregação e execução (v1.3)

`FAVX_Matriz_RBAC_Admin_v1_3.csv` é a matriz granular proposta. Os papéis são agrupamentos e não concedem acesso por si sós; autorização sempre exige permissão, scope, contexto, estado e MFA apropriado. `FAVX_Mapeamento_ADM_RBAC_v1_3.csv` vincula cada uma das 25 telas administrativas às permissões por ação. A migração do CHECK de cinco papéis do DOC 05 para grants normatizados é **somente diff proposto**, não execução.

Operações financeiras têm etapas separadas: **proposta** (finance_ops), **aprovação** (finance_approve por pessoa distinta), e **execução** `billing.refund_execute` ou `partners.payout_execute` por terceiro executor humano (`finance_execute`) **ou worker idempotente de serviço restrito** após as duas pessoas. A aplicação não pode aceitar autoaprovação nem pelo superadmin. Suspensão emergencial usa `users.temporary_hold` por até 24h **propostos**, com `users.temporary_hold_review` por outro humano; suspensão definitiva requer proposta e aprovação distintas.

`partners.referrals_read` deve constar nas telas ADM-016 e ADM-017. Break-glass não é privilégio permanente de papel, incluindo `superadmin`: grant por ativo e incidente, TTL máximo proposto 30min, aprovação independente, logs redigidos e revisão posterior. **O release 1.0 não pode ativar operações sensíveis sem pessoas reais designadas e evidência de segregação; isso é pendência DEC-14.** Ver `FAVX_Runbooks_Governanca_SoD_BreakGlass_v1_3.md`.

### 5.4B. Impactos transversais de OTP passwordless

A decisão proposta **DEC-18 ainda exige aceite de produto e POC de entregabilidade**. Se selecionada, revisar obrigatoriamente:

| Fonte | Tela ou seção | Correção proposta |
|---|---|---|
| PRD | Seção 6.2 e 6.4 | Cadastro/login por e-mail e código temporário, sem senha obrigatória; atualizar recuperação de conta e sessões |
| DOC03 | `AUT-001` | Solicitar e-mail, enviar OTP, inserir código, reenviar com cooldown, mensagens neutras, preservar retorno seguro |
| DOC03 | `AUT-002` | Cadastrar por e-mail+OTP+termos; retirar senha/força de senha, evitar contas duplicadas |
| DOC03 | `AUT-003` | Verificação por código de uso único; expiração, limite de tentativas e alteração de e-mail |
| DOC03 | `AUT-004` | Reenviar código/recuperar conta por e-mail; não chamar 'redefinir senha' |
| DOC03 | `AUT-005` | Reutilizar o ID como 'Verificação de segurança / acesso recuperado' ou marcar como fluxo obsoleto no alias; não remover ID sem migração de referências |
| DOC03 | `AUT-006/007` | Sessão expirada; reautenticação para ação sensível; MFA/admin sem burlar OTP |
| DOC03 | `AUT-008` | Aceite versionado de termos e consentimentos separado de OTP |
| DOC03 | `USR-009`, `SHR-003` | Configurações de segurança/sessões sem troca de senha; logout geral e autenticação adicional |
| TRD/DOC05 | Auth e logs | Rate limit, código de uso único, verificação anti-replay, TTL, entrega de e-mail, recuperação e MFA-admin; não registrar OTP em logs |
| DOC06 | Backlog, E2E e i18n | Atualizar testes de abandono, reenvio, erro, restrição, e-mail lento e retorno de salvar pós-login nos seis idiomas |

Não retirar proteções só porque o login é sem senha. MFA de staff exige verificação de capacidade do provedor, fluxo seguro de inscrição e recuperação, autorização forte para operações críticas e ambiente separado.

### 5.5. Segurança do Context
O Context é privado no banco, API e embeddings; pode ser usado para rankear somente atributos apropriados de recomendação. Creator deve receber aviso para não inserir segredos/dados pessoais. Geração de justificativas deve se basear em dados públicos verificáveis, nunca no Context privado. Exigir testes de inferência por rankings, queries diferenciais e canários; documentar risco residual de inferência como tradeoff do produto.

### 5.6. Design tokens
Corrigir contraste de borda funcional para >=3:1 no background correspondente; exemplo inicial `#8A8986` sobre branco (~3.5:1), confirmar em cada estado/tema. Borda decorativa pode ser sutil se não for único sinal de limite. Unificar border, shadow, blur, z-index e motion em JSON fonte, CSS gerado. Suporte mínimo 320px; testar 320, 360, 390, 768 e desktop; foco visível e WCAG 2.2 AA.

## 6. Estratégia realista de release sem descumprir o escopo aprovado
**F00 Governança:** reconciliar 6 DOCs, 104 requisitos, 142 superfícies (4 futuras), tokens, APIs, ADRs e register; não alterar produção.
**Alpha técnica local:** login/Creator/User, editor mínimo, original seguro, publicação privada + pública, busca textual e evento analytics, feature flags. Não é lançamento.
**Beta fechada:** dois nichos de creators, upload real, agendamento, salvos/coleções, busca local e métricas; POCs M/S/J/A aprovadas. Medir ativação e custo.
**Release comercial 1.0:** completar benefícios aprovados do Plus, trial e billing após POC-B01, partners core, suporte/moderação, seis idiomas críticos e legal; gate segurança e acesso; flags ativadas pela pessoa autorizada.
**Após 1.0:** busca global, marcas/matching, Events, Proof, push e importação social avançada permanecem fora do lançamento até decisão específica.

## 7. Definition of Ready, segurança e governança
Cada ticket implementável exige PRD ID + TRD ID + DOC03 screen ID (se houver) + endpoint + migration + evento + feature flag + teste. Bloquear codegen do módulo se POC ou DEC crítica estiver aberta. `DEC accepted by PO` não implica `TEC production verified`.
Ambientes: dev local com dados falsos; staging isolado em projetos separados, prod real. Branches feature/* -> develop -> main com PR, CI e aprovação explícita. Nenhum segredo em prompt, logs, docs ou repositório.
Controle de lançamentos: backups e exercício de restore; exclusão/exportação da conta; painel de denúncia; canal de suporte; plano de incidentes; aprovação legal; validação de pagamento por país; teste dos seis idiomas nos fluxos críticos; teste de acessibilidade; custos IA e CDN monitorados.

## 8. Riscos de operação e métricas
Metas numéricas do beta (hipóteses, não compromissos): 80%+ dos creators convidados completarem onboarding básico; pelo menos 5 recomendações em 7 dias por creator ativado; p95 da busca textual dentro de meta definida na POC; zero falhas de segurança de escopo; 100% de cancelamento/expiração refletido no backend na fronteira temporal; AI spend sob teto configurado. Calibrar com dados reais.
Supabase backups do banco não equivalem a backup dos objetos armazenados no Bunny. Avaliar RTO/RPO end-to-end, sem assumir que o restore do Postgres restaura mídias. Chaves e provedores devem existir separadamente por ambiente.

## 9. Validação humana / bloqueios antes de produção
1. Product Owner homologar DEC de produto e UX, em especial coleções, banners, OTP e trial.
2. Engenharia executar POCs e publicar relatórios reproduzíveis, sem declarar provedores definitivamente aprovados antes disso.
3. Jurídico/contabilidade revisar menores, direitos de uso, LGPD/GDPR, transferência, impostos, reembolsos, parceiros e termos.
4. Operação escolher responsáveis por moderação, suporte, traduções humanas, incidentes e custos.
5. Design homologar logo, tokens de contraste, microcopy e identidade final.

## 10. Execução F00 em três etapas, com aceite intermediário

O *único ponto de entrada* é `FAVX_Prompt_F00_Claude_Code_v1_3.md`, que encaminha para:
- **F00-A** — inventário, reconciliação 104 requisitos, domínio/rotas/slug e predicado público;
- **F00-B** — RBAC/SoD, pessoas, eventos/aliases, APIs e segurança;
- **F00-C** — UX dos dez estados de busca em seis idiomas, POCs, Design System, dimensionamento integral da 1.0 e rastreabilidade.

Cada etapa produz artefatos **somente em `docs/f00/`**, patches propostos e checkpoint para aprovação da PO antes de iniciar a seguinte. Nenhum checkpoint aceita automaticamente DEC, TEC, ADR ou POC; nenhuma etapa altera os seis documentos oficiais, deploy, SQL remoto ou infraestrutura paga.

## 11. Protocolo de estado e homologação

O registro v1.3 aceita apenas: `PROPOSTO`, `VALIDAR_POC`, `VALIDAR_JURIDICO`, `ACEITO_PO` e `ACEITO_TEC`. Cada linha inclui bloqueios e observações para permitir múltiplas condições. `PROPOSTO` não significa rejeitado nem aprovado. Nenhum item foi elevado a `ACEITO_PO` ou `ACEITO_TEC` nesta revisão. POCs são registros próprios (cinco linhas), não somente referências textuais. Aceites precisam ter pessoa responsável, data, versão e evidência associada. O registro de propostas nunca substitui validação jurídica, testes e autorização para execução remota.

## 12. Histórico e correções da versão 1.3 — consolidado, sem adendos

1. Atualizada a matriz de permissões com execução de refund/payout, `temporary_hold`/revisão e leitura de referrals mapeada a ADM.
2. SoD explicita duas pessoas humanas distintas na proposta/aprovação e execução por worker limitado ou terceiro executor manual; staffing DEC-14 bloqueia atividades sensíveis no lançamento.
3. Alias de eventos estendido a nomes do PRD/TRD/DOC03, incluindo `auth.*` como legado de segurança; `search.failed.reason` distingue IA/voz/erro técnico.
4. A taxonomia ZR-01..ZR-10 possui microcopy própria nos seis idiomas em CSV; ZR-05 usa deliberadamente a mesma cópia pública de ZR-01 para proteger privacidade.
5. F00 foi dividida em etapas A/B/C com aprovação entre etapas; documentos são lidos em blocos, com SHA-256 e citações `arquivo:linhas`.
6. As 142 superfícies têm bloqueios individuais por ID, critérios funcionais e estimativas em branco até engenharia validar. SRH-008 alpha textual depende da POC-S01; recursos IA da beta dependem da POC-A01.
7. Regras anteriores de domínio `favx.app`, rotas `/app/partner/*`, posts `scheduled|published` e retenção sem confirmação de 90 dias permanecem explicitadas nas respectivas seções normativas.
8. CTA futuro “pedir recomendação ao creator” é fluxo diferente do recebimento comunitário `FAVX-COM`; desligado até decisão de PO.

## 13. Referências técnicas históricas

Este kit revisa as propostas v1.0 sem reescrever automaticamente PRD, TRD, DOC03, DOC04, DOC05, DOC06 e migrations. Na etapa F00, o Claude deve propor diffs, obter aceite e só então aplicar mudanças aprovadas aos arquivos versionados.
