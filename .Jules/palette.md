## 2026-09-23 - ARIA labels for Icon-Only Social Links
**Learning:** Icon-only interactive elements lacking ARIA labels are a frequent accessibility issue. Screen readers will not have enough context on what these buttons do, affecting navigation and overall UX.
**Action:** Always include a 'name' or 'label' within arrays that map icon-only elements so an aria-label can be dynamically set, additionally using a title attribute to show tooltips on hover.
