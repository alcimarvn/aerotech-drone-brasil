## 2024-05-24 - Accessibility for Icon-only UI

**Learning:** It's important to provide accessible names for icon-only navigation elements (like hamburger menus) and social media links that only visually indicate their purpose.

**Action:** Consistently add `aria-label` to interactive elements that only display icons, keeping the labels aligned with the primary language of the UI (e.g., "Abrir menu" for Portuguese). Add `aria-hidden="true"` to the decorative inner SVG icons to avoid redundant screen reader announcements.
