## 2024-07-28 - Dynamic ARIA Labels in Mapped Icon-Only Links
**Learning:** When mapping over an array to render icon-only links, the array objects must include a descriptive name property to allow dynamic generation of accessible `aria-label`s for each item, otherwise screen readers cannot announce the link's purpose.
**Action:** Ensure all arrays used to render icon-only buttons or links contain a `name` or `label` property, and bind it to the `aria-label` attribute in the map function.
