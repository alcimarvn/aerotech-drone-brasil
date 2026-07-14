## 2024-07-14 - Accessible Icon Buttons Pattern
**Learning:** When adding `aria-label` to interactive elements (like links or buttons) that contain decorative SVG icons, screen readers might redundantly announce both the label and the icon's fallback text or roles.
**Action:** Always ensure that decorative inner SVG elements explicitly use `aria-hidden="true"` when their parent container is given an accessible name via `aria-label`.
