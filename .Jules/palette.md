## 2024-05-24 - Accessibility and Context for Collapsed Elements
**Learning:** When creating or modifying collapsible UI elements (like sidebars) that reduce navigation items to icon-only buttons, it is critical to dynamically bind `title` (for visual tooltips) and `aria-label` (for screen readers) to the collapsed state to preserve context. Icons should also be marked with `aria-hidden="true"`.
**Action:** Apply dynamic `title` and `aria-label` properties bound to the collapse state for all interactive elements in sidebars, and apply `aria-hidden="true"` to decorative icons.
