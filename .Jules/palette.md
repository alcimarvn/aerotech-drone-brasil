## 2024-11-03 - Missing aria-labels on navigation icons
**Learning:** Found an accessibility issue pattern in the `header.tsx` layout where the mobile navigation menu trigger (hamburger icon) lacks an `aria-label`. The element is purely icon-based (`<Menu className="h-7 w-7" />`) and acts as a `SheetTrigger`, but without an accessible name, screen reader users will not know its function.
**Action:** Adding an `aria-label="Abrir menu"` to the `Button` element used as the mobile menu trigger.
