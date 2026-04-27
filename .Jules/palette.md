## 2024-04-27 - Dynamic Tooltips and ARIA Labels for Collapsible Sidebars
**Learning:** Collapsible sidebars that reduce links to icon-only buttons remove accessible names and context for sighted and screen reader users if standard text is hidden via CSS or conditional rendering.
**Action:** When creating or modifying collapsible navigation, always bind dynamic `title` (for sighted users) and `aria-label` (for screen readers) to the collapsed state. Also, explicitly set `aria-expanded` on the toggle mechanism.
