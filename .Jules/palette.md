## 2025-05-18 - Missing Accessibility on Icon-Only Buttons
**Learning:** Icon-only buttons (like ThemeToggle) in React Native using `Pressable` silently fail to provide meaningful feedback to screen readers without explicit attributes, and can be hard to tap on mobile devices.
**Action:** Always add `accessibilityRole="button"`, a dynamic `accessibilityLabel` explaining the action, and a generous `hitSlop` (e.g., `{{ top: 10, bottom: 10, left: 10, right: 10 }}`) to icon-only buttons to ensure they are both understandable and usable.
