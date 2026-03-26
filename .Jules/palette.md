## 2024-03-26 - Added missing ARIA labels to dashboard header
**Learning:** Found several icon-only buttons in the main dashboard header and sidebar lacking ARIA labels (`aria-label`). Without these labels, screen reader users would not know what actions these buttons perform (e.g., "Notificações", "Menu", "Sair").
**Action:** Adding `aria-label` to these critical navigational and interactive icon-only buttons to improve baseline accessibility.
