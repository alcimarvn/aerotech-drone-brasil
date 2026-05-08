## 2024-05-08 - Accessible Sidebar Icons
**Learning:** Collapsible sidebars that switch to icon-only navigation require dynamic application of `aria-label` and `title` attributes bound to the collapsed state. Leaving `aria-label` undefined when expanded prevents redundant announcements if the visible text is sufficient, while activating it when collapsed preserves context.
**Action:** Always bind `aria-label` and `title` to the collapsed boolean state on responsive navigation items, and ensure decorative Lucide icons have `aria-hidden="true"` to prevent screen reader clutter.
