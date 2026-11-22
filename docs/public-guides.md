# Guia público, contato e recuperação — 22/11/2026

Continuação autorizada nas páginas pendentes: WEB-002, WEB-006, SHR-007 e SHR-010. Fontes: DOC03 e direção visual de 16/11/2026. Originais preservados; nenhuma condição comercial, política jurídica, SLA ou serviço futuro foi ativado.

## Comportamento

- `/:locale/como-funciona`: trilhas publicar/encontrar/salvar, guia contextual, retorno ao destino após login e FAQ. Demonstração interativa de busca explicitamente fictícia, limitada a três exemplos, sem consulta de contas reais. Explica visita livre, conta para salvar e busca dentro de um perfil.
- `/:locale/contato`: canal `suporte@favx.app` definido pela Product Owner. Assunto, categoria, descrição e confirmação explícita; revisão em dialog, abertura do aplicativo de e-mail e cópia manual quando o clipboard é bloqueado. O app prepara a mensagem e não declara que a enviou. Nenhum dado de conta, URL atual, Context ou diagnóstico é anexado automaticamente. O conteúdo permanece apenas na página até o usuário abrir/copiar o e-mail.
- Navegação pública e ajuda apontam para as novas páginas, nos seis idiomas. CTA da landing para o guia. Manrope, cards arredondados, superfícies claras e glass conforme direção aprovada.
- 404 e error boundary oferecem início, ajuda e suporte; falha de operação permite tentar novamente. Idioma da página prevalece sobre idioma do navegador. Apenas referência opaca limitada pode aparecer; mensagem/stack do erro não são renderizados. Recursos privados continuam usando a mesma resposta de indisponibilidade, sem revelar existência.
- Compartilhamento de perfis, recomendações, coleções públicas Creator e pedidos usa feedback após resposta efetiva da plataforma. Clipboard bloqueado mostra e seleciona o link para cópia manual; cancelamento do share nativo limpa a mensagem anterior sem acusar sucesso/erro. Botões impedem ações simultâneas. O rótulo agora é genérico para não chamar um post de perfil.

## Limites explícitos

WEB-006 permanece parcial: o backend de tickets, ID de protocolo, histórico, anexos e integração da operação de suporte ainda não existem. A pessoa envia pelo próprio aplicativo de e-mail e recebe resposta no endereço usado nesse envio. `mailto:` depende de aplicativo configurado; a cópia de texto oferece alternativa. Nenhum e-mail foi enviado pelos testes.

SHR-007 permanece parcial: recuperação visual de 404/erro e fallback global, sem nova rota 403 nem mudança de autorização. O fallback global usa fonte de sistema se Manrope não estiver disponível após falha do layout. O teste força uma falha do provedor para acionar o error boundary; não simula uma falha do layout raiz.

SHR-010 permanece parcial: cobre o componente compartilhado já usado no público e em prévias; o dialog específico de coleções pessoais mantém sua implementação existente. Não foram adicionados UTM, rastreamento, postagem automática em redes ou garantias sobre destino externo. Privacidade/revogação seguem os fluxos existentes.

Não há novas dependências, variáveis de ambiente, tabelas, migrations ou chamadas de IA/Stripe/Bunny. Sem telemetria nova e sem registro de mensagens de suporte no servidor. Conteúdo do formulário não persiste ao sair/recarregar.

## Verificação

`npm run verify:public` compila com provedor de teste e usa Chromium: seis idiomas, trilhas, busca vazia/com resultado, FAQ, destino de login, consentimento/prévia de suporte, URI de e-mail codificada, cópia bem-sucedida/bloqueada, share nativo/sucesso/cancelamento, falha real do error boundary e retry, 404 e layouts 320/390/768/1440. Provider e APIs de clipboard/share são fixtures controladas, sem envio de mensagens nem mudanças em banco. Portas 3190/55434; `CHROMIUM_PATH` opcional, padrão `/usr/bin/chromium`; artefatos em diretório temporário ou `FAVX_TEST_OUTPUT`. Não publicar o build de fixture.

44 testes automatizados, typecheck e build aprovados. A verificação Chromium passou, incluindo recuperação após falha do serviço, formulário sem serialização nativa e alternativa de e-mail com JavaScript desativado. Inspeção visual em desktop/celular e checklist React concluídos. Inventário: 64 contratos parciais e 78 sem implementação; nenhum integralmente homologado.
