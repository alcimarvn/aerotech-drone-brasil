## 2026-07-15 - Dynamic ARIA labels for icon maps
**Learning:** When mapping over arrays to render icon-only interactive elements (like social media links), WCAG 2.5.3 (Label in Name) violations can occur if the visible name isn't present in the map array.
**Action:** Always include a `name` property in the data array and dynamically bind it to the `aria-label` attribute inside the `map` function, rather than trying to statically assign labels or forgetting them entirely.
