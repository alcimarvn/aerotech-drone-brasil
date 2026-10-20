## 2023-10-20 - Responsive Text Hiding in Buttons
**Learning:** Responsive classes like `hidden lg:block` inside buttons turn them into icon-only buttons on smaller screens, removing their accessible name if it relied on the visible text. This is a common pattern for profile/menu buttons.
**Action:** When an interactive element contains dynamically rendered text that is hidden on smaller viewports, apply an explicit `aria-label` and `title` to the parent button, and set `aria-hidden="true"` on the inner visual elements to prevent redundant screen reader announcements on larger screens.
