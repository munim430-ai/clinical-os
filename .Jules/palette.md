## 2024-05-15 - [Icon-Only Button Accessibility]
**Learning:** Icon-only buttons using Pressable (like ThemeToggle) are missing accessibility roles and labels by default, making them invisible or confusing to screen readers.
**Action:** Always add accessibilityRole="button", a descriptive accessibilityLabel, and adequate hitSlop to icon-only Pressable components.
