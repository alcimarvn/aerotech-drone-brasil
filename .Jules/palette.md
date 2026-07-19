## 2026-07-19 - Accessible Icon-only Links in Dark Themes
**Learning:** Icon-only links without accessible names fail WCAG, and default browser focus rings are often invisible against dark gradients.
**Action:** Always add a descriptive `name` property when mapping arrays to render icon links to dynamically create `aria-label`s, add `aria-hidden='true'` to the SVGs, and apply explicit `focus-visible` ring offsets tailored to the dark background.
