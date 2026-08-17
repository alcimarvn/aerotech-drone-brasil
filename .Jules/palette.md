## 2024-03-24 - Accessible Icon-Only Lists
**Learning:** When mapping over icon-only buttons or links (like social media icons), screen readers need context that isn't visually present.
**Action:** Always include a `name` property in the mapped array data and bind it to `aria-label` on the wrapper element, while explicitly setting `aria-hidden="true"` on the decorative icon SVG itself to prevent redundant announcements. Add visible focus indicators for keyboard navigation.
