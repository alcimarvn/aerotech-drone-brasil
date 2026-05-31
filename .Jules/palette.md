## 2023-10-27 - Social Icons and Newsletter Accessibility
**Learning:** In the Aerotech Drones interface, social links are mapped dynamically from an array without `name` properties, which makes it challenging to provide screen readers with descriptive text out of the box when using only Lucide icons.
**Action:** When adding accessible names (`aria-label`) to mapped icon arrays, modify the array itself to include a `name` property to bind the dynamic `aria-label={item.name}` correctly, while hiding the decorative icon with `aria-hidden="true"`.
