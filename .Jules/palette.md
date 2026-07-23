## 2024-07-23 - Preserve Accessible Names in Collapsible Elements
**Learning:** Conditionally unmounting text inside collapsible UI elements (like a sidebar) removes the accessible name for screen readers when collapsed.
**Action:** Instead of `{!isCollapsed && <span>Text</span>}`, use a dynamically applied sr-only class (`<span className={cn(isCollapsed && "sr-only")}>Text</span>`) to preserve the text for screen readers while hiding it visually.
