## 2024-03-24 - Accessibility improvements for Icon-Only links
**Learning:** Icon-only interactive elements (like social media links or menu buttons) that are missing an `aria-label` or `title` do not provide a visible, on-hover tooltip context for sighted users or screen readers. Also social map links should be updated to include descriptive names for accessibility labels.
**Action:** Always include a `title` attribute alongside the `aria-label` for icon-only interactive elements, and add a descriptive `name` to the mapped objects to allow dynamic generation of these attributes.
