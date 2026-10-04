## 2026-10-04 - Dynamic Accessibility for Icon Maps
**Learning:** When generating interactive icons (like social media links) via a .map() loop, applying a structural `name` property to each array item is critical to allow dynamic binding of `aria-label` and `title`.
**Action:** Always include a descriptive string property in mapping arrays for purely visual components so they can be parsed by screen readers and provide tooltips without creating redundant visually hidden spans.
