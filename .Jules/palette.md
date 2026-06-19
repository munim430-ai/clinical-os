## 2026-06-19 - Missing Accessibility on Icon-only Pressables
**Learning:** In this React Native app, custom interactive components using `Pressable` for icon-only buttons (like in ERModeDashboard) frequently omit essential accessibility properties (roles, labels) and hitSlops by default, leading to poor screen reader support and usability.
**Action:** When adding or reviewing icon-only buttons built with `Pressable`, always ensure `accessibilityRole="button"`, a descriptive `accessibilityLabel`, and an adequate `hitSlop` are included.
