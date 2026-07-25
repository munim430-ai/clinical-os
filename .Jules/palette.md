## 2024-07-25 - Icon-only Buttons Need Accessibility and Touch Targets
**Learning:** In React Native applications, icon-only buttons (like `Pressable` components) lack inherent meaning for screen readers and can be difficult to tap if their interactive area is exactly the size of the icon.
**Action:** Always add `accessibilityRole="button"`, a descriptive `accessibilityLabel` (dynamic if the state changes, like theme toggling), and `hitSlop` to extend the touch target without affecting the visual layout for icon-only buttons.
