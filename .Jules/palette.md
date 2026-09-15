## 2026-09-15 - Enhanced Footer Accessibility
**Learning:** Footer interactive elements like social links and newsletter forms lacked accessible names and clear keyboard focus indicators, making them difficult to use for screen reader and keyboard-only users. Applying `sr-only` labels and `focus-visible` utility classes greatly improves the experience without impacting visual design.
**Action:** Always ensure icon-only buttons have an `aria-label`, decorative icons have `aria-hidden='true'`, inputs have associated labels, and all interactive elements have visible focus states.
