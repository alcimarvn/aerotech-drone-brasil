## 2024-03-24 - Accessible Icon-Only Buttons in Settings
**Learning:** Icon-only buttons (like Add/Delete) inside complex settings tables or forms frequently lack context for screen readers and visible focus indicators.
**Action:** Always add explicit `aria-label` (dynamic if contextual, e.g., "Delete category X"), `title` for visual tooltips, and ensure standard `focus-visible` styling is applied for keyboard navigation. Hide decorative Lucide React icons using `aria-hidden="true"`.
