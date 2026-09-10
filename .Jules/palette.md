## 2024-09-10 - Focus Rings & Social Links A11y

**Learning:** In dark-themed layouts (like the footer gradient from `#0a1a15` to `#050c0a`), browser default focus outlines are nearly invisible. Icon-only buttons mapped from arrays often lack accessible names, preventing screen readers from identifying their purpose.
**Action:** Always provide explicit contrast-aware focus styles (e.g., `focus-visible:ring-emerald-500 focus-visible:ring-offset-[#0a1a15]`), add descriptive properties (like `name`) to mapped configuration arrays to dynamically bind `aria-label` and `title`, and hide decorative SVGs with `aria-hidden="true"`.
