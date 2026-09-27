## 2025-02-12 - Missing ARIA label on Mobile Menu Button
**Learning:** Found a pattern where mobile menu buttons represented by an icon (e.g., `<Menu />`) are lacking a descriptive `aria-label` which breaks accessibility for screen reader users and affects keyboard navigation context. Since it is hidden on desktop, it needs clear labeling when visible on mobile.
**Action:** When adding or checking mobile menu triggers (`<SheetTrigger>` wrapping a `<Button size="icon">`), ensure `aria-label="Abrir menu de navegação"` or similar is added, and ensure the icon itself is `aria-hidden="true"`.
