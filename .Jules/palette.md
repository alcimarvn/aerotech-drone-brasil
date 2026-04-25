## 2025-02-20 - Add Accessible Names to Icon Buttons
**Learning:** Icon-only buttons (like Trash icons for delete actions) must have explicit `aria-label` or `title` attributes for screen reader accessibility, and destructive action "Cancel" buttons in dialogs should be disabled while the action is processing (`isDeleting`) to prevent UI errors.
**Action:** When adding icon buttons, always add `aria-label` and `title`. Ensure dialog cancel buttons are disabled while actions are loading.
