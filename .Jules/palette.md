## 2026-06-05 - Dynamic Aria Labels on Mixed Content
**Learning:** When using visually hidden text combined with dynamic icons (e.g. `hidden lg:block`), `aria-label` must encompass the full context (e.g. `aria-label={\`Menu de ${user.name}\`}`) to prevent label-in-name WCAG violations. Also, purely decorative icons inside buttons should explicitly have `aria-hidden="true"`.
**Action:** Always check responsive hiding classes like `hidden` when deciding if an element is an icon-only button and how its accessible name should be formed.
