## 2024-05-15 - Missing ARIA Labels on Form Buttons
**Learning:** Icon-only form submit buttons (like the Send icon in the newsletter form) are common in this application but lack screen reader context.
**Action:** Always add `aria-label` to form buttons that only contain icons, and explicitly set `type="submit"` for clarity and proper keyboard form submission.
