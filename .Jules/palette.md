## 2026-05-28 - [Adding Accessibility to Icon-only Buttons]
**Learning:** Icon-only buttons (like Theme toggles) in React Native using `Pressable` or `TouchableOpacity` components need explicit `accessibilityRole="button"` and a descriptive `accessibilityLabel` to ensure screen readers can announce them properly.
**Action:** Always add `accessibilityRole` and `accessibilityLabel` (and `accessibilityState` if applicable) when using custom interactive components without text labels.
