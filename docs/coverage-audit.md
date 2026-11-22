# Auditoria de cobertura — DOC03 × código

## Por que a entrega ficou abaixo da especificação

A entrega do editor foi reduzida à persistência de texto sem alinhamento suficiente com a expectativa de um editor multimídia assistido por IA. Isso é uma lacuna de implementação, não ausência de requisitos. O Design System define identidade e contratos; reaproveitar cores/fontes não equivale a implementar a experiência.

Os pacotes DOC05/DOC06/F00 recebidos contêm documentação e referências técnicas. Os seis diretórios extraídos conferidos não contêm arquivos de telas `.tsx`, `.jsx` ou `.html`. O ZIP inicial forneceu a fundação do app, já importada. O DOC04 declara explicitamente que wireframes finais pixel-perfect ainda precisam ser produzidos. A documentação completa permanece a fonte para construir as telas.

## Editor: lacunas identificadas na auditoria original

Avanço de 20/11/2026: veja [implementação, configurações e limites](workspace-delivery.md). A tabela abaixo documenta a origem do trabalho; o inventário ao final reflete o estado atualizado.

| Bloco | Fonte | Lacuna atual |
|---|---|---|
| Entrada de arquivos/câmera/voz | CRE-007, MED-001…004 | Seleção, captura, preview, limites originais e direitos |
| Upload e processamento | MED-005…006, POC-M01 | Upload autorizado/retomável, progresso, falha/retry, original privado, derivados públicos |
| Galeria e biblioteca | CRE-007, MED-007…008 | Carrossel misto, ordenação/capa/alt, biblioteca própria, downloads autorizados |
| Assistência de IA | PRD 8.6, MED-009 | Sugestões revisáveis de categorias/tags e transcrição editável; integração real, limites e falhas |
| Taxonomia e Context | CRE-007, PRD | Categorias/subcategorias e contexto privado separado de publicação e IA pública |
| Oferta e transparência | CRE-009 | Cupom com condições/validade/tipo de desconto, ordenação e revisão |
| Agenda e ciclo de vida | CRE-010, CRE-013…016 | Agendamento/início/fim/fuso, arquivamento/lixeira/restauração |
| Revisão e gestão | CRE-008, CRE-011…012, CRE-026 | Prévia completa, processamento/acessibilidade, versões e ações consistentes |

## Direção de UX a recuperar do DOC04

- Editor centrado no conteúdo visual, com entrada de mídia como ação principal; não uma sequência indiferenciada de campos.
- Navegação clara entre conteúdo, links/ofertas, contexto e publicação; estado de salvamento e progresso próximos à ação correspondente.
- Painel contextual de IA com sugestões explicáveis, editáveis e aplicadas somente por escolha do Creator.
- Prévia fiel ao público, fotografia e hierarquia editorial; Manrope também nos títulos conforme decisão de 16/11/2026, branco/grafite e efeitos contidos.
- Comportamento próprio para celular: ações alcançáveis, organização progressiva e feedback por arquivo.
- Homologação visual por tela/estado com referências da Product Owner, sem declarar todos os contratos concluídos porque o build passou.

## Inventário por superfície — atualizado em 21/11/2026

“Parcial” não significa aceita/concluída. O status da especificação é preservado; propostas e itens futuros não são ativados automaticamente por esta auditoria.

Foram encontrados **142 contratos detalhados**: 51 com algum comportamento implementado e 91 sem implementação correspondente. Nenhuma tela foi declarada integralmente homologada nesta auditoria.

| ID | Superfície | Status no DOC03 | Código atual | Observação |
|---|---|---|---|---|
| WEB-001 | Landing institucional | MVP P0 | Parcial | Landing com Manrope, composição fotográfica e CTA de autenticação; narrativa institucional completa ainda pendente. |
| WEB-002 | Como funciona | MVP P0 | Não implementado | Sem implementação desta superfície no código atual. |
| WEB-003 | Página de preços e planos | MVP P0 | Não implementado | Sem implementação desta superfície no código atual. |
| WEB-004 | Ajuda — início | MVP P0 | Parcial | Ajuda com busca e categorias de artigos iniciais; catálogo completo pendente. |
| WEB-005 | Artigo de ajuda | MVP P0 | Parcial | Artigos localizados e contato; feedback de utilidade pendente. |
| WEB-006 | Contato e suporte | MVP P0 | Não implementado | Sem implementação desta superfície no código atual. |
| WEB-007 | Termos e políticas | MVP P0 | Não implementado | Sem implementação desta superfície no código atual. |
| WEB-008 | Programa de parceiros — apresentação | MVP P0 | Não implementado | Sem implementação desta superfície no código atual. |
| AUT-001 | Login | MVP P0 | Parcial | Login OTP em operação; revisar contrato visual completo. |
| AUT-002 | Cadastro | MVP P0 | Parcial | Cadastro por OTP integrado ao login; não há jornada completa de onboarding. |
| AUT-003 | Verificação de e-mail | MVP P0 | Parcial | Código de e-mail e mensagens localizadas em operação. |
| AUT-004 | Recuperar acesso | MVP P0 | Não implementado | Sem implementação desta superfície no código atual. |
| AUT-005 | Definir nova senha | MVP P0 | Não implementado | Sem implementação desta superfície no código atual. |
| AUT-006 | Sessão expirada | MVP P0 | Parcial | Proteção de sessão/redirecionamento; recuperação de edição exige revisão por fluxo. |
| AUT-007 | Verificação adicional e conta restrita | MVP P0 | Não implementado | Sem implementação desta superfície no código atual. |
| AUT-008 | Consentimentos iniciais | MVP P0 | Não implementado | Sem implementação desta superfície no código atual. |
| PUB-001 | Perfil público do Creator | MVP P0 | Parcial | Composição visual solicitada, contagens públicas de conteúdo, posts, coleções, busca e categorias; homologação pendente. |
| PUB-002 | Coleção pública Creator | MVP P0 | Parcial | Coleção pública com posts elegíveis, compartilhamento e paginação; cover/ordenação pendentes. |
| PUB-003 | Detalhe público da recomendação | MVP P0 | Parcial | Texto e galeria de imagens com controle de visibilidade; vídeo/áudio demais módulos pendentes. |
| PUB-004 | Entrada de busca no perfil | MVP P0 | Parcial | Campo lexical dentro do perfil; conversa/voz pendentes. |
| PUB-005 | Lista de resultados Creator | MVP P0 | Parcial | Resultados públicos filtrados e paginados; contrato completo pendente. |
| PUB-006 | Coleção compartilhada de User | MVP P0 | Parcial | Seleção compartilhada paginada somente com posts elegíveis, sem identidade do User ou totais privados; link revogado retorna 404. |
| PUB-007 | Pedido comunitário público | MVP P0 | Não implementado | Sem implementação desta superfície no código atual. |
| PUB-008 | Enviar sugestão comunitária | MVP P0 | Não implementado | Sem implementação desta superfície no código atual. |
| PUB-009 | Conteúdo indisponível / link antigo | MVP P0 | Parcial | 404 e slug canônico básicos; faltam estados contextuais. |
| PUB-010 | Prévia segura de compartilhamento | MVP P0 | Parcial | Metadados básicos; revisar previews sociais completos. |
| USR-001 | Início do User / biblioteca | MVP P0 | Parcial | Biblioteca com salvos recentes, coleções e acesso ao Creator; histórico autorizado e telemetria pendentes. |
| USR-002 | Todos os salvos | MVP P0 | Parcial | Salvos próprios com busca lexical, filtros categoria/Creator/data, ordenação e paginação; offline e telemetria pendentes. |
| USR-003 | Item salvo e ações | MVP P0 | Parcial | Detalhe salvo com origem, data, coleções, organizar/remover e placeholder sem conteúdo indisponível; telemetria pendente. |
| USR-004 | Lista de minhas coleções | MVP P0 | Parcial | Coleções próprias com busca, ordenação, criação e exclusão confirmada; arquivamento/restauração e capa na lista pendentes. |
| USR-005 | Detalhe de coleção pessoal | MVP P0 | Parcial | Detalhe, capa, ordem persistida pelo editor, ações de compartilhamento/revogação; telemetria e aceite visual pendentes. |
| USR-006 | Criar ou editar coleção User | MVP P0 | Parcial | Nome, descrição, seleção paginada de salvos, capa de item, reordenação e controle de concorrência; upload de capa independente pendente. |
| USR-007 | Compartilhar / revogar coleção | MVP P0 | Parcial | Ativação explícita, copiar, prévia, revogação imediata e rotação do token; prévia privada é limitada à página atual. |
| USR-008 | Seguindo e seguidores — privado | MVP P0 | Não implementado | Sem implementação desta superfície no código atual. |
| USR-009 | Configurações da conta | MVP P0 | Parcial | Configurações de idioma/fuso persistidas e e-mail da conta; contrato completo pendente. |
| USR-010 | Privacidade e consentimentos | MVP P0 | Não implementado | Sem implementação desta superfície no código atual. |
| USR-011 | Solicitar exportação dos dados | MVP P0 | Não implementado | Sem implementação desta superfície no código atual. |
| USR-012 | Encerrar/excluir conta | MVP P0 | Não implementado | Sem implementação desta superfície no código atual. |
| USR-013 | Central de notificações pessoais | MVP P0 | Não implementado | Sem implementação desta superfície no código atual. |
| CRE-001 | Ativar perfil Creator — introdução | MVP P0 | Parcial | Introdução em cards, mesma conta e etapa seguinte; homologação visual pendente. |
| CRE-002 | Ativar Creator — identidade | MVP P0 | Parcial | Etapa de identidade e username; avatar/bio disponíveis após ativar. |
| CRE-003 | Ativar Creator — finalizar | MVP P0 | Parcial | Conclusão privada, link para perfil e estúdio; checklist completo pendente. |
| CRE-004 | Dashboard Creator Free | MVP P0 | Parcial | Estúdio com CTA, posts recentes e contagens reais; cliques/analytics/agenda pendentes. |
| CRE-005 | Editar perfil Creator | MVP P0 | Parcial | Foto, redes, bio, idioma/fuso e prévia; UI e demais itens precisam de revisão. |
| CRE-006 | Gerenciar publicações | MVP P0 | Parcial | Gestão com busca por título, filtros por estado e paginação; ciclo de vida completo pendente. |
| CRE-007 | Editor de recomendação — conteúdo | MVP P0 | Parcial | Imagens até 20 MiB, abas, autosave, categorias, Context e sugestões IA; vídeo/áudio/taxonomia/agenda pendentes. |
| CRE-008 | Detalhe de gestão de post | MVP P0 | Parcial | Edição disponível; tela específica de gestão não implementada. |
| CRE-009 | Links, cupons, oferta e patrocínio | MVP P0 | Parcial | Links/código simples/patrocínio; faltam oferta e cupom estruturado. |
| CRE-010 | Agendar publicação e encerramento | MVP P0 | Não implementado | Sem implementação desta superfície no código atual. |
| CRE-011 | Revisão e prévia de publicação | MVP P0 | Parcial | Prévia e confirmação de texto; falta checklist multimídia/acessibilidade. |
| CRE-012 | Confirmação de publicação / agendamento | MVP P0 | Parcial | Mensagem de confirmação; não há tela/jornada completa nem agendamento. |
| CRE-013 | Calendário editorial e agenda | MVP P0 | Não implementado | Sem implementação desta superfície no código atual. |
| CRE-014 | Gerenciar rascunhos e agendados | MVP P0 | Parcial | Rascunhos na lista; falta gestão dedicada e agendados. |
| CRE-015 | Ocultos, expirados e arquivados | MVP P0 | Parcial | Ocultação básica; faltam expirados/arquivados. |
| CRE-016 | Lixeira de conteúdo | MVP P0 | Não implementado | Sem implementação desta superfície no código atual. |
| CRE-017 | Coleções Creator — lista | MVP P0 | Parcial | Lista paginada de coleções próprias; cover e gestão completa pendentes. |
| CRE-018 | Editor de coleção Creator | MVP P0 | Parcial | Editor persistido, posts próprios e visibilidade; ordenação/exclusão pendentes. |
| CRE-019 | Solicitações comunitárias — lista | MVP P0 | Não implementado | Sem implementação desta superfície no código atual. |
| CRE-020 | Caixa de recomendações recebidas | MVP P0 | Não implementado | Sem implementação desta superfície no código atual. |
| CRE-021 | Detalhe da sugestão recebida | MVP P0 | Não implementado | Sem implementação desta superfície no código atual. |
| CRE-022 | Criar/editar pedido comunitário | MVP P0 | Não implementado | Sem implementação desta superfície no código atual. |
| CRE-023 | Métricas gerais Creator | MVP P0 | Não implementado | Sem implementação desta superfície no código atual. |
| CRE-024 | Analytics por publicação | MVP P0 | Não implementado | Sem implementação desta superfície no código atual. |
| CRE-025 | Analytics de coleções e busca | MVP P0 | Não implementado | Sem implementação desta superfície no código atual. |
| CRE-026 | Histórico e versões de publicação | MVP P0 | Parcial | Histórico no banco; não há interface de versões. |
| CRE-027 | Gerenciar links do perfil | MVP P0 | Parcial | Redes no editor do perfil; contrato de links completo pendente. |
| MED-001 | Escolha da origem da mídia | MVP P0 | Parcial | Upload de imagens e seletor de câmera; biblioteca, vídeo/áudio pendentes. |
| MED-002 | Capturar foto/vídeo com câmera | MVP P0 | Parcial | Captura de foto via seletor nativo quando suportado; vídeo e teste em aparelhos reais pendentes. |
| MED-003 | Gravar áudio | MVP P0 | Não implementado | Sem implementação desta superfície no código atual. |
| MED-004 | Prévia da mídia original | MVP P0 | Parcial | Preview local de imagem e reordenação/capa; alt/crop completo pendentes. |
| MED-005 | Gerenciador de uploads | MVP P0 | Parcial | Upload por partes com progresso/retry na sessão; retomada após fechar e vídeo pendentes. |
| MED-006 | Processamento de mídia | MVP P0 | Parcial | Validação de original e WebP no servidor; pipeline assíncrono completo pendente. |
| MED-007 | Biblioteca de mídias próprias | MVP P0 | Não implementado | Sem implementação desta superfície no código atual. |
| MED-008 | Opções de download do Creator | MVP P0 | Parcial | Download autenticado do original próprio; variantes e biblioteca completa pendentes. |
| MED-009 | Transcrição e edição de áudio | MVP P0 | Não implementado | Sem implementação desta superfície no código atual. |
| SRH-001 | Campo de busca contextual | MVP P0 | Parcial | Busca lexical de perfil com escopo; salvos e IA pendentes. |
| SRH-002 | Resultados e cards de busca | MVP P0 | Parcial | Cards e paginação de resultados lexicais; contrato completo pendente. |
| SRH-003 | Refinamento conversacional | MVP P0 | Não implementado | Sem implementação desta superfície no código atual. |
| SRH-004 | Busca por voz | MVP P0 | Não implementado | Sem implementação desta superfície no código atual. |
| SRH-005 | Filtros avançados de busca | MVP P0 | Parcial | Filtro por categoria no perfil; filtros avançados restantes pendentes. |
| SRH-006 | Escolha de localização para busca | MVP P0 | Não implementado | Sem implementação desta superfície no código atual. |
| SRH-007 | Falha / fallback da busca IA | MVP P0 | Não implementado | Sem implementação desta superfície no código atual. |
| SRH-008 | Nenhum resultado — orientação contextual | MVP P0 | Parcial | Estado sem resultados e limpar filtros; refinamento contextual completo pendente. |
| PLS-001 | Apresentação Creator Plus / upgrade | MVP P0 | Não implementado | Sem implementação desta superfície no código atual. |
| PLS-002 | Checkout e retorno seguro | MVP P0 | Não implementado | Sem implementação desta superfície no código atual. |
| PLS-003 | Resultado de trial, pagamento e assinatura | MVP P0 | Não implementado | Sem implementação desta superfície no código atual. |
| PLS-004 | Banners — lista e biblioteca | MVP P0 | Não implementado | Sem implementação desta superfície no código atual. |
| PLS-005 | Editor de banner | MVP P0 | Não implementado | Sem implementação desta superfície no código atual. |
| PLS-006 | Detalhes e desempenho de banner | MVP P0 | Não implementado | Sem implementação desta superfície no código atual. |
| PLS-007 | Fixados — gestão e agenda | MVP P0 | Não implementado | Sem implementação desta superfície no código atual. |
| PLS-008 | Gerenciar assinatura e cancelamento | MVP P0 | Não implementado | Sem implementação desta superfície no código atual. |
| PLS-009 | Visão analítica Plus | MVP P0 | Não implementado | Sem implementação desta superfície no código atual. |
| PLS-010 | Paywall contextual de recurso Plus | MVP P0 | Não implementado | Sem implementação desta superfície no código atual. |
| PAR-001 | Programa de parceiros — detalhes | MVP P0 | Não implementado | Sem implementação desta superfície no código atual. |
| PAR-002 | Cadastro/candidatura de parceiro | MVP P0 | Não implementado | Sem implementação desta superfície no código atual. |
| PAR-003 | Status da candidatura | MVP P0 | Não implementado | Sem implementação desta superfície no código atual. |
| PAR-004 | Dashboard Partner | MVP P0 | Não implementado | Sem implementação desta superfície no código atual. |
| PAR-005 | Meu link e materiais | MVP P0 | Não implementado | Sem implementação desta superfície no código atual. |
| PAR-006 | Indicações e comissões | MVP P0 | Não implementado | Sem implementação desta superfície no código atual. |
| PAR-007 | Pagamentos e dados para repasse | MVP P0 | Não implementado | Sem implementação desta superfície no código atual. |
| PAR-008 | Termos e documentação Partner | MVP P0 | Não implementado | Sem implementação desta superfície no código atual. |
| PAR-009 | Histórico de atribuição do parceiro | MVP P0 | Não implementado | Sem implementação desta superfície no código atual. |
| PAR-010 | Ajuda e revisão de comissão | MVP P0 | Não implementado | Sem implementação desta superfície no código atual. |
| ADM-001 | Admin overview e saúde operacional | MVP P0 | Não implementado | Sem implementação desta superfície no código atual. |
| ADM-002 | Gestão de contas User | MVP P0 | Não implementado | Sem implementação desta superfície no código atual. |
| ADM-003 | Detalhe de User e direitos | MVP P0 | Não implementado | Sem implementação desta superfície no código atual. |
| ADM-004 | Gestão de Creators | MVP P0 | Não implementado | Sem implementação desta superfície no código atual. |
| ADM-005 | Detalhe e saúde Creator | MVP P0 | Não implementado | Sem implementação desta superfície no código atual. |
| ADM-006 | Conteúdo e ativos — catálogo | MVP P0 | Não implementado | Sem implementação desta superfície no código atual. |
| ADM-007 | Fila de denúncias e moderação | MVP P0 | Não implementado | Sem implementação desta superfície no código atual. |
| ADM-008 | Detalhe da denúncia e decisão | MVP P0 | Não implementado | Sem implementação desta superfície no código atual. |
| ADM-009 | Taxonomia — categorias e aliases | MVP P0 | Não implementado | Sem implementação desta superfície no código atual. |
| ADM-010 | Localidades e idiomas | MVP P0 | Não implementado | Sem implementação desta superfície no código atual. |
| ADM-011 | Cobrança e assinaturas | MVP P0 | Não implementado | Sem implementação desta superfície no código atual. |
| ADM-012 | Finanças e receita por moeda | MVP P0 | Não implementado | Sem implementação desta superfície no código atual. |
| ADM-013 | Filas, jobs e agendamentos | MVP P0 | Não implementado | Sem implementação desta superfície no código atual. |
| ADM-014 | Operações de mídia e storage | MVP P0 | Não implementado | Sem implementação desta superfície no código atual. |
| ADM-015 | Busca e IA — qualidade/custo | MVP P0 | Não implementado | Sem implementação desta superfície no código atual. |
| ADM-016 | Programa de parceiros — inscrições | MVP P0 | Não implementado | Sem implementação desta superfície no código atual. |
| ADM-017 | Programa de parceiros — pagamentos | MVP P0 | Não implementado | Sem implementação desta superfície no código atual. |
| ADM-018 | Suporte — tickets e SLA | MVP P0 | Não implementado | Sem implementação desta superfície no código atual. |
| ADM-019 | Central de auditoria e segurança | MVP P0 | Não implementado | Sem implementação desta superfície no código atual. |
| ADM-020 | Roles e permissões do admin | MVP P0 | Não implementado | Sem implementação desta superfície no código atual. |
| ADM-021 | Configurações e feature flags | MVP P0 | Não implementado | Sem implementação desta superfície no código atual. |
| ADM-022 | Entidades canônicas e indexação | MVP P0 | Não implementado | Sem implementação desta superfície no código atual. |
| ADM-023 | Política e governança de privacidade | MVP P0 | Não implementado | Sem implementação desta superfície no código atual. |
| ADM-024 | Satisfação e feedback | MVP P0 | Não implementado | Sem implementação desta superfície no código atual. |
| ADM-025 | Notificações e templates transacionais | MVP P0 | Não implementado | Sem implementação desta superfície no código atual. |
| SHR-001 | Centro global de notificações | MVP P0 | Não implementado | Sem implementação desta superfície no código atual. |
| SHR-002 | Central de ajuda contextual | MVP P0 | Parcial | Ajuda inicial acessível no menu; contexto por tela pendente. |
| SHR-003 | Gestão de sessão/dispositivos | MVP P0 | Não implementado | Sem implementação desta superfície no código atual. |
| SHR-004 | Seletor de ambiente User/Creator/Partner | MVP P0 | Não implementado | Sem implementação desta superfície no código atual. |
| SHR-005 | Confirmação de ação destrutiva | MVP P0 | Não implementado | Sem implementação desta superfície no código atual. |
| SHR-006 | Modo offline/reconexão | MVP P0 | Não implementado | Sem implementação desta superfície no código atual. |
| SHR-007 | Páginas 403/404/500 | MVP P0 | Não implementado | Sem implementação desta superfície no código atual. |
| SHR-008 | Notificação e configuração de cookies | MVP P0 | Não implementado | Sem implementação desta superfície no código atual. |
| SHR-009 | Relatar conteúdo / denunciar | MVP P0 | Não implementado | Sem implementação desta superfície no código atual. |
| SHR-010 | Confirmação de cópia e compartilhamento | MVP P0 | Não implementado | Sem implementação desta superfície no código atual. |
| FUT-001 | Busca global — placeholder de roadmap | FUTURO — fora do MVP | Não implementado | Sem implementação desta superfície no código atual. |
| FUT-002 | FAVX for Brands — adesão Creator | FUTURO — fora do MVP | Não implementado | Sem implementação desta superfície no código atual. |
| FUT-003 | FAVX for Brands — interesse/match | FUTURO — fora do MVP | Não implementado | Sem implementação desta superfície no código atual. |
| FUT-004 | Events / Proof / Perfil Comercial | FUTURO — fora do MVP | Não implementado | Sem implementação desta superfície no código atual. |

## 21/11/2026 — biblioteca pessoal

USR-001 a USR-007 e PUB-006 receberam implementação funcional, testes de interface e verificação de isolamento/revogação no Supabase. [Escopo e lacunas](user-library.md). Continuam parciais: não houve aceite integral de produto/visual, nem implantação de histórico autorizado, telemetria e todos os estados complementares dos contratos.
