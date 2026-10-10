## 2024-10-10 - Footer Accessibility Refactor
**Learning:** Interactive elements mapped over arrays (like social icons) often miss `aria-label` and `title` because the accessible name is lost inside the array mapping. Additionally, form elements like newsletter inputs frequently miss visually hidden labels, leading to accessibility violations.
**Action:** Add descriptive `name` fields directly into the mapped array data, explicitly use `title` alongside `aria-label` for tooltips, and ensure form inputs have a `sr-only` label associated via `htmlFor` and `id`.
