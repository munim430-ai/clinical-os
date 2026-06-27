## 2024-06-27 - Icon-only Buttons Accessibility
**Learning:** Found an accessibility issue pattern specific to this app's components: icon-only `Pressable` buttons (like `ThemeToggle`) often lack screen-reader labels and have small touch targets by default, reducing usability across both web and native targets.
**Action:** Always add `accessibilityRole="button"`, a descriptive `accessibilityLabel`, and an adequate `hitSlop` (e.g. `{{ top: 10, right: 10, bottom: 10, left: 10 }}`) to all icon-only `Pressable` and custom interactive components in React Native/Expo.
