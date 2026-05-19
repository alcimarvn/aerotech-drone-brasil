
## 2024-05-19 - Accessible Collapsible Sidebars
**Learning:** Collapsible sidebars that reduce navigation links to icon-only buttons create an accessibility gap where screen readers lose context, and sighted users lose visual labels.
**Action:** When implementing collapsible menus, dynamically add `aria-label` and `title` attributes to the items specifically when in the collapsed state. Also, always ensure the main toggle button uses `aria-expanded` correctly and hides decorative icons with `aria-hidden="true"`.
