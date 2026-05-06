## 2024-05-24 - Dynamic ARIA for Collapsible UIs
**Learning:** When navigating collapsible UI elements (like sidebars) that reduce to icon-only views, static ARIA labels can conflict with visible text when expanded, potentially violating WCAG 2.5.3 (Label in Name).
**Action:** Dynamically bind `aria-label` and `title` to the collapsed state (e.g., `aria-label={isCollapsed ? "Label" : undefined}`). This ensures screen readers announce the label only when the text is visually hidden, preserving context while avoiding redundancy.
