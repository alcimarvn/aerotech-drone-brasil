
## 2024-05-18 - Handling Dynamically Rendered Visible Text and ARIA labels
**Learning:** When adding `aria-label` to interactive elements that also contain dynamically rendered visible text (like an avatar with the user's name), the accessible name MUST include the visible text to prevent WCAG 2.5.3 (Label in Name) violations.
**Action:** Ensure the `aria-label` dynamically includes the visible text (e.g., `aria-label={`Menu do usuário ${session?.user?.name || "Usuário"}`}`) and hide the inner visible DOM element from screen readers using `aria-hidden="true"` to avoid redundant announcements.
