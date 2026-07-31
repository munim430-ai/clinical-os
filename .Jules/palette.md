## 2024-07-14 - [Custom Components Require Explicit Accessibility Features]
**Learning:** In this React Native application, custom interactive components (like `Pressable` or `TouchableOpacity` used for AI orbs or icon-only buttons) do not automatically inherit screen reader or hit box behaviors. They need explicit `accessibilityRole="button"`, a descriptive `accessibilityLabel`, and an adequate `hitSlop` to be accessible and usable.
**Action:** Add these attributes to all custom interactive components moving forward, especially icon-only elements.
