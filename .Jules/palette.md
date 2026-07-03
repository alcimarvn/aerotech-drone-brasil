## 2024-05-24 - Dynamic Accessible Names for Mapped Icon-Only Links
**Learning:** When rendering lists of icon-only interactive elements (e.g., social links) using an array `.map()`, adding a descriptive property (like `name`) to the source objects is crucial for providing dynamic `aria-label`s and `title` tooltips.
**Action:** Always include a textual descriptor alongside the icon and href in mapped arrays for interactive elements, use it for the accessible name, and hide the decorative inner icon using `aria-hidden="true"`.
