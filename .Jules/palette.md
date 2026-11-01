## 2024-11-01 - Footer Accessibility and Focus Rings
**Learning:** When adding `aria-label` to mapped social media icons and newsletter forms, mapping over a `name` property is essential to build semantic labels dynamically. In dark-themed areas, default focus outlines often disappear, necessitating explicit `focus-visible:ring-offset-[dark-color]` values.
**Action:** Always include a `name` property in link arrays for dynamic `aria-label` generation, and explicitly verify dark-mode contrast on `focus-visible` offset utilities.
