## 2024-05-14 - Dynamic ARIA Labels in Collapsible Menus
**Learning:** When building responsive or collapsible sidebars where text labels are removed visually to save space (e.g. icon-only mode), the links/buttons lose their accessible name.
**Action:** Dynamically bind `aria-label` (for screen readers) and `title` (for tooltips on hover) to the item's label only when the text is hidden (e.g. `aria-label={isCollapsed ? item.label : undefined}`). Add `aria-hidden="true"` to the inner SVG/Icon to prevent redundant or confusing screen reader announcements.
