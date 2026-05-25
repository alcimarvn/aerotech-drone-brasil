## 2024-05-25 - Floating CTA Accessibility

**Learning:** When using pulse animations or absolute positioned hover effects on icon-only buttons (like in \`FloatingCTA\`), ensure \`focus-visible\` explicit styles are applied so keyboard focus isn't lost inside the animations. \`aria-expanded\` needs to accurately reflect the min/max state.

**Action:** Add \`focus-visible\` utility rings, \`aria-hidden\` on decorative SVG/spans, and dynamic \`aria-expanded\` to floating widgets.
