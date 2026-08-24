
## 2024-11-20 - Dynamic ARIA labels for conditionally hidden text
**Learning:** When text content in a button (like a user menu) is conditionally hidden on smaller screens using CSS classes like `hidden lg:block`, the button loses its accessible name for screen reader users on those devices, effectively becoming an unlabelled icon button.
**Action:** Always provide a dynamically generated `aria-label` (e.g., ``aria-label={`Menu do usuário ${session?.user?.name}`}``) to ensure the accessible name is preserved regardless of viewport size or CSS visibility rules, preventing WCAG 2.5.3 violations.
