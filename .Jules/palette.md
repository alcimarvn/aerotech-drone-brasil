## 2024-10-19 - Footer Accessibility and Form UX

**Learning:** Interactive `<form>` components in global layouts like Footers often miss visually-hidden labels (`sr-only`) and explicit focus rings against dark themes. Furthermore, dynamically mapped social icons need individualized descriptive names to populate dynamic `aria-label` and `title` attributes.
**Action:** Always ensure mapped generic icon links include descriptive `name` metadata, explicitly link `sr-only` `<label>` elements to inputs using `htmlFor`/`id`, and enforce explicit `focus-visible` styles with correct offsets on dark backgrounds.
