## 2024-05-24 - Theme Toggle Button Accessibility
**Learning:** In a React Native application with custom interactive components, icon-only buttons like ThemeToggle without explicit ARIA labels/roles are inaccessible to screen readers.
**Action:** Always add `accessibilityRole="button"`, a descriptive `accessibilityLabel`, and an adequate `hitSlop` to icon-only interactive elements like `Pressable` to ensure proper accessibility and usability.
