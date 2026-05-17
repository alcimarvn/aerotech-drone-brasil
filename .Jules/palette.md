## 2024-05-17 - Dynamic ARIA Labels in Collapsible UI

**Learning:** When dealing with collapsible navigational components (like sidebars) that transition from text+icon to icon-only, standard ARIA labels might duplicate context if applied unconditionally, leading to WCAG 2.5.3 (Label in Name) violations or confusing screen reader experiences.

**Action:** Dynamically bind `title` and `aria-label` to the collapsed state (e.g., `aria-label={isCollapsed ? label : undefined}`) to ensure context is only added when the visible text is hidden.
