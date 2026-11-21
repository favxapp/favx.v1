---
name: favx-ui
description: Use ao alterar telas, componentes, estilos, tokens, acessibilidade e traduções da interface FAVX.
---

# Interface FAVX

1. Consultar contrato da tela no DOC03 e fundações/componentes no DOC04 pelo índice `docs/README.md`.
2. Reutilizar `src/app/tokens.css`, `tailwind.config.ts` e componentes existentes. Manrope é a fonte de toda a interface, inclusive títulos (decisão explícita de 16/11/2026). Não usar Instrument Serif. Consultar docs/decisions/2026-11-16-visual-direction.md e as referências da Product Owner.
3. Respeitar direção clara, branca e grafite; não inventar marca final.
4. Implementar estados de operação e validar foco, teclado, labels e anúncio de mensagens.
5. Manter os seis catálogos em `src/lib/i18n/messages/` com chaves e placeholders consistentes.
6. Verificar mobile/desktop, textos longos e ausência de dados/métricas privados na interface pública e metadados.

Validação: checks da aplicação e inspeção visual quando disponível. Registrar limites de verificação. Alterações de tokens exigem comparação com `docs/design/` e registro da decisão.
