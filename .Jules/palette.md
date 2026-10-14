## 2024-06-19 - Added ARIA labels to social media links in Footer
**Learning:** Found social media links mapped over an array without `aria-label`s, which causes screen readers to announce the destination URL or "link" with no meaningful context. The map was missing a descriptive name property.
**Action:** Always include a `name` property in social media link arrays (e.g., `{ name: "Instagram", ... }`) and dynamically bind it to the `aria-label` (and `title` for visual tooltips) on the interactive element. Also ensure icons inside them have `aria-hidden="true"`.
