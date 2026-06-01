## 2024-10-27 - [A11y Pattern] Handling Icon-Only Interactive Elements

**Learning:** When addressing accessibility for interactive components that only visually render an icon (such as social media links, mobile menu triggers, and form submission buttons), a common anti-pattern is leaving screen reader users without context.

**Action:** Consistently apply an explicit \`aria-label\` (or structurally hidden `<label>` for inputs) detailing the action or destination, and use \`aria-hidden="true"\` on the inner SVG/icon elements (e.g. `<Menu />` or `<Send />`) to prevent redundant or confusing screen reader announcements.
