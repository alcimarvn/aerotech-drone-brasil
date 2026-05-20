## 2024-05-20 - Accessible User Menus
**Learning:** When adding `aria-label` to user profile or avatar buttons that also contain dynamically rendered visible text (like the user's name), ensure the accessible name includes that same text dynamically (e.g., `aria-label={"Menu de usuário: " + session?.user?.name}`). This prevents WCAG 2.5.3 (Label in Name) violations, ensuring speech recognition tools and screen readers align perfectly.
**Action:** Always interpolate visible dynamic text into the `aria-label` of its parent button if the button requires an accessible name override.
