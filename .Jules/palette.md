
## 2026-09-25 - Accessible Collapsible Sidebars
**Learning:** When creating collapsible UI elements (like sidebars) that reduce navigation items to icon-only buttons, conditionally unmounting the text (e.g., `{!isCollapsed && <span>...</span>}`) removes the accessible name for screen readers, violating WCAG.
**Action:** Instead of unmounting, use a conditionally applied `sr-only` class (e.g., `<span className={cn(isCollapsed && "sr-only")}>`) to visually hide the text while preserving the accessible name for assistive technologies. Additionally, dynamically bind `title` for visual tooltips and ensure decorative icons have `aria-hidden="true"`.
