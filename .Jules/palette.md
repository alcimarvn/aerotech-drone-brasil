## 2026-10-05 - Accessible Icon-Only Links in Arrays
**Learning:** When rendering icon-only links via array mapping, providing a `name` property allows dynamic generation of `aria-label` and `title` for better accessibility and tooltips. The decorative SVG inside should also have `aria-hidden="true"`.
**Action:** Always include descriptive `name` properties in data arrays used to map icon-only interactive elements to ensure dynamic accessible names can be generated.
