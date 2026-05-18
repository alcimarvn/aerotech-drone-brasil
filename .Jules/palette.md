## 2024-05-18 - Dynamically Binding Accessible Names to Collapsible UI Elements
**Learning:** When sidebars or navigation menus collapse, textual labels are often removed from the DOM, leaving only icons. This breaks accessibility for screen reader users and reduces context for mouse users if visual tooltips are absent.
**Action:** Dynamically bind `aria-label` (for screen readers) and `title` (for visual tooltips) attributes to the collapsed state variable. Additionally, ensure the nested decorative icons use `aria-hidden="true"` to prevent redundant reading by assistive technologies.
