## 2024-08-27 - Accessible Icon Links

**Learning:** When generating icon-only links from array maps, passing the `name` property from the data array explicitly into `aria-label` allows scalable and localized screen reader support, whereas relying solely on icon names or components can be inaccessible or redundant.

**Action:** Ensure that data structures driving mapped icon links always include a descriptive label to bind to `aria-label`, and hide the decorative icon itself with `aria-hidden="true"`. Use explicit dark-theme aware `focus-visible` classes rather than default browser outlines.
