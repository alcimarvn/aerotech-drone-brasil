## 2024-05-18 - Focus Rings in Dark Mode
**Learning:** Default browser focus outlines are often invisible or have poor contrast against dark backgrounds (like the footer). Relying on default focus states makes the application inaccessible to keyboard users.
**Action:** Explicitly define `focus-visible:ring-2` (and potentially `ring-offset` classes) with an appropriate, high-contrast color (e.g., `focus-visible:ring-emerald-500` or `focus-visible:ring-white`) for all interactive elements in dark-mode sections.
