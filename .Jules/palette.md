
## 2026-06-15 - Context Preservation and Focus Visibility on Dark-Themed Collapsible Sidebars
**Learning:** When sidebars collapse and interactive elements (links, settings, logout) become icon-only, crucial context is lost for both screen readers and visual users. Furthermore, default browser focus rings often lack sufficient contrast against dark backgrounds like `bg-slate-900`.
**Action:** Dynamically bind `aria-label` and `title` to the collapsed state (e.g., `aria-label={isCollapsed ? label : undefined}`) to preserve context. Always apply explicit high-contrast focus rings (e.g., `focus-visible:ring-2 focus-visible:ring-white`) to interactive elements on dark themes to ensure clear keyboard navigation visibility.
