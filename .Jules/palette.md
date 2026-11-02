## 2024-06-25 - Dark-themed icon-only buttons accessibility
**Learning:** Dark-themed UI components often rely on low-contrast or hidden default browser outlines, and icon-only interactive elements fail for screen reader and keyboard-only users without explicit labels.
**Action:** Always add `name` to data mappings to dynamically generate `title` and `aria-label` for icon-only links/buttons. Always pair this with explicit `focus-visible:outline-none focus-visible:ring-2` styling, and set `aria-hidden="true"` on the internal decorative icons.
