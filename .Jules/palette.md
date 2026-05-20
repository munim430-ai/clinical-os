
## 2024-05-18 - Added Accessibility attributes to ThemeToggle
**Learning:** Found an icon-only interactive component (`Pressable`) without any accessibility labels. Native `Pressable` components need `accessibilityRole="button"`, `accessibilityLabel`, and often `accessibilityState` to be useful for screen reader users, especially when they only contain icons.
**Action:** When creating or reviewing icon-only buttons, always ensure proper ARIA/accessibility attributes are present, so the UI is usable by visually impaired users.
