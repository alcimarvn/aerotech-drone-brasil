## 2024-03-23 - Added ARIA attributes to FAQ Accordion
**Learning:** For accordion/FAQ components without native details/summary HTML elements, it is essential to establish relationship and state context for screen readers by adding `aria-expanded` and `aria-controls` to the toggle button, and corresponding `id` and `role="region"` (`aria-labelledby` is also good) to the content panel.
**Action:** Always check interactive components (custom select, accordion, modals) that toggle visibility of content to ensure they have the proper aria state and control associations.
