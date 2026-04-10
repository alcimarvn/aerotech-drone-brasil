## 2026-04-10 - Focus Rings on Dark Themes
**Learning:** Default browser focus outlines often fail WCAG contrast requirements against dark background components (like the footer). Relying on the default outline for keyboard navigation makes interactive elements invisible to keyboard users in dark themes.
**Action:** Always add explicit focus styles (e.g., `focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:outline-none`) to interactive elements within dark-themed sections.
