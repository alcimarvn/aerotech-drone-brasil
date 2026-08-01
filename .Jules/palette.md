
## 2024-05-18 - ARIA Labels and Focus Rings on Dark-Themed Footers
**Learning:** When adding `aria-label` to dynamically mapped icon-only links in dark footers, default browser outlines are often invisible.
**Action:** Always provide explicit focus rings with offsets tailored for dark backgrounds (e.g., `focus-visible:ring-emerald-500 focus-visible:ring-offset-[#0a1a15]`) and ensure decorative icons have `aria-hidden="true"`. Use a `sr-only` class for form inputs without visual labels instead of solely relying on `aria-label` to provide maximum compatibility with screen readers.
