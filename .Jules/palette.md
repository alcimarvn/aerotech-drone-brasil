## 2024-10-18 - Collapsible Navigation Accessibility
**Learning:** Conditionally unmounting text in collapsible elements (like sidebars) breaks screen reader announcements when they are collapsed.
**Action:** Use conditionally applied `sr-only` CSS classes (e.g., `cn("font-medium", isCollapsed && "sr-only")`) instead of React conditional rendering to visually hide the text while keeping it available for screen readers, and combine this with dynamic `title` attributes for sighted users.
