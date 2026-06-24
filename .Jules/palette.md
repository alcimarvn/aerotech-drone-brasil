## 2026-06-24 - Collapsible Sidebar Accessibility
**Learning:** When collapsing navigation sidebars to icon-only views, conditionally removing the text element (e.g. `{!isCollapsed && <span>text</span>}`) breaks the accessible name for screen readers, leading to WCAG 2.5.3 (Label in Name) violations.
**Action:** Use a conditionally applied `sr-only` class on the text element instead of unmounting it. Combine this with `aria-hidden="true"` on the decorative icons, and add a dynamic `title` attribute to the parent link for sighted mouse users.
