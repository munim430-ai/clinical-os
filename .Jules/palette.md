## 2024-05-24 - Accessibility of Icon-Only Pressables
**Learning:** Icon-only `Pressable` components used as buttons in React Native require explicit accessibility props to be usable by screen readers, particularly `accessibilityRole="button"` and `accessibilityLabel`. Furthermore, their touch target areas are often too small on mobile.
**Action:** Always add `accessibilityRole="button"`, a descriptive `accessibilityLabel`, and an appropriate `hitSlop` (e.g., `hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}`) to all icon-only `Pressable` instances.
