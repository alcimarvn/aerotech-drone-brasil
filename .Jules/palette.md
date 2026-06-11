## 2024-05-15 - Dynamic ARIA and Title for Collapsible Elements
**Learning:** When creating collapsible UI elements (like sidebars) that reduce navigation items to icon-only buttons, it is crucial to dynamically bind `title` (for visual tooltips) and `aria-label` (for screen readers) to the collapsed state. This preserves context for both sighted mouse users and screen reader users when the visible text is hidden.
**Action:** Apply dynamic `aria-label={isCollapsed ? label : undefined}` and `title={isCollapsed ? label : undefined}` patterns to links and buttons inside collapsible components.
