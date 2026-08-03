## 2024-05-18 - Footer Social Links & Newsletter Accessibility
**Learning:** Icon-only social links mapped from arrays often lack accessible names, and forms without visual labels need sr-only labels to ensure screen readers can navigate them effectively.
**Action:** Always include a `name` property in arrays that render icon-only interactive elements to dynamically set `aria-label`, and use `sr-only` class to hide labels while keeping them accessible.
