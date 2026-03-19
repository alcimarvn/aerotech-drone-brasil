## 2024-03-19 - Redundant ARIA attributes on Icon Buttons
**Learning:** Adding `aria-label` to a button makes an inner `<span className="sr-only">\...` redundant, as screen readers prioritize the `aria-label`.
**Action:** Use only `aria-label` on the button itself for concise, accessible markup on icon-only buttons.
