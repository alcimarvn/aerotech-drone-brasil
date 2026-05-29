
## 2024-05-18 - Collapsible Navigation Accessibility
**Learning:** When building collapsible sidebars that hide text labels and leave only icons, standard navigation items lose their accessible names and context for both visual users and screen reader users.
**Action:** Dynamically bind `aria-label` and `title` to the item's visible text when the sidebar is in its collapsed state, explicitly set `aria-hidden="true"` on the interior icon elements, and ensure focus indicators are highly visible against dark themes using `focus-visible:ring-2`.
