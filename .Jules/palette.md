## 2024-05-18 - Acessibilidade na Sidebar
**Learning:** Collapsible sidebars that hide text require dynamic `aria-label` and `title` attributes that adapt to the collapsed state to ensure context is preserved for both screen readers and hover states. When text is visible but might be hidden, setting `aria-hidden="true"` on the accompanying icon prevents redundant or confusing screen reader announcements.
**Action:** Always dynamically bind `aria-label` and `title` based on the collapsed state of UI elements, and ensure focus rings have sufficient contrast against dark backgrounds.
