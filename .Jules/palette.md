## 2026-05-26 - Explicit Accessibility Roles for Custom Buttons in React Native
**Learning:** In React Native, custom interactive components like `Pressable` and `TouchableOpacity` (especially when used for icon-only buttons like calculators or theme toggles) do not implicitly communicate their interactable nature or purpose to screen readers.
**Action:** Always explicitly provide `accessibilityRole="button"`, a descriptive `accessibilityLabel`, and `accessibilityState` (where applicable) on all custom touchable elements to ensure proper screen reader navigation and experience.
