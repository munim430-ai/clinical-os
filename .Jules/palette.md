## 2024-05-24 - ThemeToggle Accessibility
**Learning:** Custom interactive components like `ThemeToggle` using `Pressable` for icon-only buttons often lack proper touch targets (`hitSlop`) and screen reader attributes (`accessibilityRole`, `accessibilityLabel`), leading to poor UX and accessibility.
**Action:** Always verify `hitSlop`, `accessibilityRole`, and `accessibilityLabel` when using icon-only `Pressable` components.
