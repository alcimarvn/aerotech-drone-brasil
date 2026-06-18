## 2024-06-18 - Sidebar Collapsible State Accessibility
**Learning:** When navigating a collapsible sidebar menu that reduces links to icon-only buttons on collapse, screen readers lose context of what the button does since the visible text is hidden.
**Action:** Dynamically bind `title` (for visual tooltip) and `aria-label` (for screen readers) on navigation links specifically to the collapsed state. Do not use `aria-label` when expanded to avoid redundant announcements.
