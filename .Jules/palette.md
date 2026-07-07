
## 2024-07-25 - Dynamic accessibility for collapsible sidebars
**Learning:** Collapsible sidebars that hide text visually can lose their accessible names for screen readers if the text node is conditionally unmounted (e.g., `{!isCollapsed && <span>text</span>}`).
**Action:** Use Tailwind's `sr-only` class conditionally instead of unmounting the text (`<span className={cn(isCollapsed && "sr-only")}>text</span>`), and dynamically bind `title` attributes to provide tooltips for sighted users when collapsed. Ensure decorative icons are marked with `aria-hidden="true"`.
