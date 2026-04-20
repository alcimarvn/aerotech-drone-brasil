
## 2024-04-20 - Collapsible Sidebar Accessibility Pattern
**Learning:** When collapsing sidebars, entirely removing text labels (via conditional rendering like `{!isCollapsed && <span>Label</span>}`) turns navigation links into unlabelled icon-only links for screen readers, breaking accessibility.
**Action:** Instead of unmounting the text, use a visually-hidden utility class (like Tailwind's `sr-only`) when collapsed: `<span className={isCollapsed ? "sr-only" : ""}>Label</span>`. Additionally, adding dynamic `title` attributes on the links when collapsed provides native tooltips for mouse users, greatly improving UX without custom tooltip components.
