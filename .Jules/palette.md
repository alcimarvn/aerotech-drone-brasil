## 2026-06-09 - Missing ARIA Labels on Icon-only Buttons
**Learning:** Icon-only action buttons (like delete, edit) throughout the dashboard often lack `aria-label` attributes and have `aria-hidden="true"` missing on the SVG itself. This makes them invisible or confusing to screen readers.
**Action:** When creating or fixing icon-only buttons, always ensure the parent `<button>` has a descriptive `aria-label` (and optionally `title` for hover tooltips) and the child SVG has `aria-hidden="true"`.
