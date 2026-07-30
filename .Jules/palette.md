## 2024-07-30 - Initial Setup\n**Learning:** Started tracking UX/a11y improvements.\n**Action:** Look for small wins like aria-labels, loading states, focus styles.

## 2024-07-30 - Accessible Names & Dark Theme Focus Rings in Component Maps
**Learning:** When mapping over generic components (like a social icon list), ensure the data source includes a specific `name` field to generate unique, descriptive `aria-label`s for screen readers. Furthermore, standard focus styles may fail contrast tests on dark backgrounds, so explicitly adding `focus-visible:ring-2 focus-visible:ring-offset-2` mapped to the specific dark background color is necessary for keyboard navigation accessibility.
**Action:** Always verify if an array of mapping objects driving interactive elements contains properties that can be interpolated into meaningful `aria-label`s, and apply dark-mode specific explicit focus states (`focus-visible:ring-offset-[#0a1a15]`) on gradient or dark components.
