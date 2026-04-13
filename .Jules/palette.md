## 2024-04-13 - Dashboard Accessibility Update
**Learning:** Adding complex interactive UI elements containing multiple icon children using purely `aria-label` is not always ideal, because an `aria-label` completely overrides the element content for screen readers, hiding any nested `sr-only` descriptive spans inside (e.g., dynamic "unread notifications" span).
**Action:** When an interactive element's state changes (like unread notifications), the `aria-label` itself should be dynamic (e.g. `aria-label="Notificações, não lidas"`) rather than appending static `sr-only` spans.
