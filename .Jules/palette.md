
## 2024-06-25 - Melhoria de acessibilidade no cabeçalho do painel
**Learning:** Adding dynamic ARIA labels to user profile dropdown buttons helps screen readers announce the user context without relying solely on nested text content. Combining this with `aria-hidden="true"` on the decorative elements inside the button (like avatars and icons) prevents redundant announcements.
**Action:** Always verify that interactive buttons containing both icons and text have an explicit, summarized accessible name if the inner structure is complex, and hide purely visual elements from the accessibility tree.
