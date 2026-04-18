## 2024-04-18 - Missing ARIA label in header
**Learning:** Found a common pattern where mobile navigation triggers (icon-only `<Button>`s rendering `<Menu />`) were missing `aria-label` attributes for screen readers, while the nested icons lacked `aria-hidden`.
**Action:** Always ensure icon-only interactive elements in layouts are accompanied by descriptive `aria-label`s, and the nested icon SVG is explicitly hidden from screen readers.
