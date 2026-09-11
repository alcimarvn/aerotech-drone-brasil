## 2024-05-24 - Accessible Icon-Only Components

**Learning:** When building icon-only components (like social media links or a hamburger menu button), a single `aria-label` is often not sufficient because sighted users who don't rely on screen readers might not understand the icon's purpose. Providing a `title` attribute adds a visible tooltip on hover, while `aria-label` provides the accessible name for assistive technologies. The visual icon element itself (e.g. `<svg>`) should have `aria-hidden="true"` to prevent screen readers from redundantly announcing the icon along with the `aria-label` on the parent interactive element.

**Action:** Consistently apply `aria-label`, `title`, and `aria-hidden="true"` (on the child icon) when creating or modifying icon-only buttons or links. For dynamically generated items via maps, ensure a specific `name` or description is available to populate these attributes.
