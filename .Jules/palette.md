## 2024-05-24 - Accessibility improvements to custom Pressables
**Learning:** Custom `Pressable` elements often lack `accessibilityRole`, `accessibilityLabel`, `accessibilityState`, and `hitSlop`, which degrades the screen reader experience and tap targets.
**Action:** When working on custom interactive elements, always ensure `accessibilityRole`, descriptive `accessibilityLabel`, and appropriate `hitSlop` are included, as well as `accessibilityState` if applicable.
