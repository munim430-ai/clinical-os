## 2024-07-03 - Accessible Pressable Components
**Learning:** Custom interactive components (e.g. Pressable used for theme toggles, floating action buttons, etc.) in React Native need explicit `accessibilityRole="button"`, a descriptive `accessibilityLabel`, and adequate `hitSlop` (e.g. `hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}`) to ensure proper screen reader support and usable touch targets.
**Action:** Always add accessibility attributes and hitSlop to icon-only Pressable components.
