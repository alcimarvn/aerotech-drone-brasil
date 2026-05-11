## 2024-05-11 - Dashboard Header Accessibility
**Learning:** When a button contains both a dynamic accessible name (e.g., `aria-label={`Menu de ${session?.user?.name}`}`) and visible text that represents the same information, explicitly applying `aria-hidden="true"` to the inner text container prevents redundant screen reader announcements while ensuring WCAG 2.5.3 (Label in Name) compliance.
**Action:** Always verify if a button with an `aria-label` has child text elements and hide them from screen readers if the text is fully represented in the label.
