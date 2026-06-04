
## 2024-06-04 - Collapsible Sidebar Context Preservation
**Learning:** When sidebars collapse and hide link text (leaving only icons visible), screen readers lose the accessible context of those links unless explicitly provided. This creates a severe navigation barrier.
**Action:** Always dynamically bind `aria-label` and `title` to the collapsed state for navigation items and toggle buttons to preserve context, and use `aria-hidden="true"` on the icons to avoid redundant announcements. Ensure clear `focus-visible` outlines on dark-themed sidebars.
