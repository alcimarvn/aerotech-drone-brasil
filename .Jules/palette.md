## 2024-08-10 - Add aria-labels and keyboard navigation to floating components
**Learning:** Found multiple floating UI components and mobile menus with icon-only buttons lacking `aria-label`s, which is critical for screen reader accessibility in this application. Also discovered some `button` elements missing basic keyboard focus outlines.
**Action:** Always verify icon-only buttons, sheet triggers, and custom UI elements like notification dismiss buttons have an `aria-label`. Will add them across `floating-cta`, `live-notifications`, `footer`, and `header` files.
