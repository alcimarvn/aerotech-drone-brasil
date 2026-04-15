## 2024-05-19 - ARIA Labels & Label in Name (WCAG 2.5.3)
**Learning:** When assigning `aria-label` to buttons containing dynamic visible text (like user names), failing to include that visible text in the `aria-label` creates WCAG 2.5.3 (Label in Name) violations, as Voice Control users can't activate the button by speaking its visible text.
**Action:** Always dynamically interpolate the visible text into the `aria-label` (e.g., `aria-label={"Menu do usuário " + name}`) and hide the visual child element with `aria-hidden="true"` to prevent redundant screen reader announcements.
