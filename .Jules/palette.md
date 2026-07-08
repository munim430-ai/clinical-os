## 2024-07-08 - Icon-Only Button Accessibility in React Native
**Learning:** Icon-only buttons (like `TouchableOpacity` containing an icon) in React Native require explicit accessibility and touch target properties to be usable. Without these, screen readers won't know the button's purpose and users might find it hard to press.
**Action:** Consistently add `accessibilityRole="button"`, a descriptive `accessibilityLabel`, and `hitSlop` (e.g., `{{ top: 10, bottom: 10, left: 10, right: 10 }}`) to all custom interactive components and icon-only buttons in the application.
