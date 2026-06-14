
## 2024-06-14 - Footer Input Accessibility Labeling
**Learning:** Adding `aria-label` directly to form inputs inside forms like a newsletter subscription can sometimes be sufficient, but using a visually hidden `<label>` associated via `id` / `htmlFor` combined with `sr-only` is more explicit and robust for certain screen reader contexts, ensuring strict adherence to form-level WCAG guidelines.
**Action:** When adding accessible names to textual inputs like newsletter emails, preferentially use explicit, visually hidden `<label>` elements linked via `id` rather than just relying on generic wrapper semantics or implicit attributes.
