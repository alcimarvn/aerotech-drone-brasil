## 2026-03-18 - Missing ARIA Labels on Icon-Only Buttons
**Learning:** Found an accessibility pattern specific to this app's dashboard components: primary navigation and action buttons (like sidebar collapse and notifications) often use icon-only `<Button size="icon">` components without `aria-label`s, making them invisible or confusing to screen readers.
**Action:** When adding new icon-only buttons using the UI component library in this dashboard, always ensure an `aria-label` (and optionally `title`) is provided to describe the action.
