## 2024-10-27 - Initial Read
**Learning:** Checking for UX/A11y issues
**Action:** Need to find an issue first

## 2024-10-27 - Dynamic Accessible Names for Icon Links
**Learning:** When mapping over arrays to render icon-only links or buttons (like social media icons), omitting a descriptive `name` or `title` in the array objects prevents the dynamic generation of accessible `aria-label`s and `title`s. This results in inaccessible links for screen reader users and missing visual tooltips.
**Action:** Always include a descriptive `name` property when creating arrays for mapping icon-only interactive elements. Use this property to dynamically bind `aria-label` and `title`. Ensure the internal decorative icon receives `aria-hidden="true"`.
