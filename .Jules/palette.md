
## 2023-10-27 - Sidebar Menu Accessibility
**Learning:** Collapsing sidebars that hide text conditionally without `sr-only` remove context for screen readers entirely. Adding `aria-expanded` and visual tooltips improves both non-sighted and sighted UX when standard visual text is hidden.
**Action:** Always prefer `className={cn(..., isCollapsed && "sr-only")}` over conditional unmounting for core navigation elements.
