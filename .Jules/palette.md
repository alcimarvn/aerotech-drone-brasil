## 2026-09-21 - Icon-Only Buttons Accessibility and Tooltips
**Learning:** When mapping over arrays to render icon-only links or buttons, adding a descriptive name property to the array objects enables dynamic generation of `aria-label` and `title` attributes. Setting `aria-hidden="true"` on the decorative SVGs prevents redundant screen reader announcements.
**Action:** Always map a `name` attribute alongside the icon and link data to ensure accessibility features are robustly populated for screen readers and visible tooltips.
