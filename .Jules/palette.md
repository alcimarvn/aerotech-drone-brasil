
## 2025-02-12 - Acessibilidade em Menus Laterais Retráteis
**Learning:** Elementos de navegação que se transformam em botões apenas com ícone (icon-only) quando a interface é retraída perdem o contexto tanto para leitores de tela quanto para usuários visuais (falta de tooltips). Leitores de tela também podem anunciar ícones decorativos de forma redundante se não forem ocultados corretamente.
**Action:** Ao criar ou modificar menus retráteis, vincule dinamicamente os atributos `title` (para tooltips visuais) e `aria-label` (para acessibilidade) ao estado da interface (ex: `isCollapsed`). Além disso, adicione `aria-hidden="true"` aos ícones decorativos internos para evitar anúncios redundantes e inclua `aria-expanded` no botão que controla a expansão.
