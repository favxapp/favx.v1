# Workspace, editor e perfil — entrega iniciada em 16/11/2026

Direção visual: [decisão da Product Owner](decisions/2026-11-16-visual-direction.md). A autorização cobre a construção dos 142 contratos. Este incremento **não conclui os 142 contratos**. O inventário completo e as lacunas permanecem em [coverage-audit.md](coverage-audit.md) e no [registro estruturado](screen-delivery.json).

## Implementação deste incremento

- Manrope também nos títulos; sidebar desktop, navegação mobile flutuante, superfícies claras/glass e componentes arredondados.
- Início da conta, Estúdio Creator com contagens próprias reais, ativação em três etapas e configurações persistidas de idioma/fuso.
- Perfil público com avatar arredondado à esquerda, números de posts/coleções/categorias públicas, bio/redes/compartilhamento e superfície inferior arredondada.
- Editor com abas, imagens, título/texto/tags, categorias editoriais manuais e Context privado. O autosave e o controle de concorrência existentes foram preservados.
- OpenAI: sugestões estruturadas de título, texto, tags e categorias, aplicadas individualmente pelo Creator. Sem publicação automática, URLs geradas ou envio de Context, identidade e links. `store:false`; sem logs dos prompts. Falhas preservam o texto.
- Coleções Creator: criar/editar, selecionar posts próprios, escolher visibilidade, página pública. Posts privados nunca entram na projeção pública da coleção.
- Busca lexical no perfil, filtro por categoria, filtros por estado/título na gestão de posts. Não é busca IA conversacional nem global.
- Ajuda inicial e quatro artigos em seis idiomas; contato por e-mail. Não equivale à central completa de tickets do WEB-006.

## Integrações e variáveis

Todos os segredos são exclusivos do servidor. Configurar **Production** na Vercel, e Preview apenas se quiser testar serviços externos em previews. Um redeploy é necessário depois de alterar variáveis.

| Variável | Finalidade |
|---|---|
| `OPENAI_API_KEY` | Chave da conta OpenAI da FAVX |
| `OPENAI_EDITOR_MODEL` | Opcional; padrão `gpt-6.1-sol`, conferido no catálogo durante a implementação |
| `BUNNY_ORIGINALS_STORAGE_ZONE` | Storage Zone privada, separada da zona pública de avatars/derivados |
| `BUNNY_ORIGINALS_STORAGE_HOST` | Host de armazenamento regional dessa zona |
| `BUNNY_ORIGINALS_ACCESS_KEY` | Senha/API key exclusiva dessa Storage Zone |

Não ligar a zona de originais a uma Pull Zone pública. As variáveis existentes `BUNNY_STORAGE_*` continuam servindo ao avatar. O código recusa reutilizar a mesma zona para os originais. Nunca usar prefixo `NEXT_PUBLIC_` para essas chaves.

Na verificação de 21/11, OpenAI e a zona privada não estavam configurados na Vercel. Chamadas reais a esses serviços não foram homologadas. O app informa indisponibilidade em vez de simular envio ou IA.

## Mídia: implementação e limites

- JPG/PNG/WebP, até 20 MiB no **original**, até 10 imagens por recomendação. Limites técnicos desta implementação; não equivalem à homologação do DEC-16 comercial.
- O navegador envia partes de até 3 MiB por uma API autenticada, ficando abaixo do limite de corpo de requisição da Vercel. Cada parte vai ao Bunny privado; nenhuma credencial vai ao navegador.
- Falha pode ser retomada na mesma sessão com o mesmo arquivo e ID. Retomada após fechar o navegador, vídeo 250 MB, áudio e processamento assíncrono completo ainda não foram implementados.
- Finalização reconstitui e valida os bytes originais, retém uma cópia exata privada e cria WebP de até 1600 px sem recortar a foto. Arquivos animados e imagens acima de 60 milhões de pixels são recusados.
- Derivado também fica privado no storage. A API de exibição verifica titularidade ou vínculo com post atualmente público, antes de servir. `private, no-store` evita reutilização pública de imagem revogada. Não há URL direta de original no payload público.
- Download de original exige sessão, titularidade e conta ativa. Chunks órfãos, janela de retenção e coleta automática ainda exigem operação de limpeza; não há exclusão automática de originais.
- Desvio documentado de POC-M01: transporte inicial por partes via backend, e não upload direto delegado ao Bunny. Não declarar POC geral de mídia concluída.

## Banco e privacidade

Migration `20261120220440_workspace_collections_search_ai_media` aplicada no projeto FAVX `krnznqyxsuktohilmluf`. A CLI tentou gerar o arquivo, mas falhou por diretório HOME somente leitura; o arquivo usa a versão gerada pelo servidor ao aplicar a migration pelo MCP.

Tabelas novas têm grants mínimos e RLS. APIs públicas usam projeções delimitadas; bases de posts/coleções/mídia não são legíveis por anônimos. Context permanece restrito ao titular e ao histórico privado. Teste transacional [workspace_access.sql](../supabase/tests/workspace_access.sql) executado no Supabase real, com rollback integral das identidades e dados de teste.

IA tem teto técnico atômico de 30 pedidos por conta/dia UTC e 600 no projeto/dia. É proteção de custo inicial, não entitlement comercial aprovado; não altera cota de posts. Uso privado não concede SELECT/UPDATE ao cliente. Advisor sem novos avisos de segurança: RLS sem policy em `ai_usage` é intencional, como no histórico privado.

## Ainda faltam

A interface não deve ser tratada como completa: vídeos/áudio/transcrição, biblioteca integral de mídia, alt por item, taxonomy canônica/subcategorias, agenda/ciclo de vida completo, cupons estruturados, biblioteca User e salvos, comunidade, analytics, Plus/Stripe, Partner/Admin, consentimentos e documentação jurídica final. Decisões comerciais e produtos futuros continuam com seus estados de origem.

As coleções ainda não têm ordenação manual, exclusão/restauração e cover de mídia; seleção mostra até 1000 posts recentes e mantém todos os selecionados na edição. A autorização dos 142 contratos não transforma essas lacunas em funcionalidades prontas.

## Verificação deste incremento

- 38 testes automatizados aprovados, incluindo isolamento no banco, regras de mídia e privacidade do input da IA. Typecheck e build de produção aprovados.
- Navegador Chromium com aplicação compilada e serviços externos controlados: upload de PNG de 4.328.213 bytes, falha de uma parte e retry, download original idêntico, proteção do rascunho, publicação e revogação, sugestão editorial e aplicação, autosave/refresh, coleções e busca sem Context privado.
- Layout inspecionado em desktop e 320/390/768 px. Conteúdo fotográfico do onboarding é decorativo; fontes em [fotografia](design/illustrative-photography.md).
- Teste transacional no Supabase real passou com rollback; isso não homologa chamadas reais OpenAI/Bunny, que dependem das variáveis acima.
