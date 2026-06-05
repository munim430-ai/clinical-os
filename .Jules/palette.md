## 2024-06-05 - AI Orb Accessibility
**Learning:** Custom interactive components like floating action buttons and AI orbs in React Native often lack default screen reader support when built with `Pressable`.
**Action:** Always add `accessibilityRole="button"`, `accessibilityLabel`, and relevant `accessibilityState` (e.g., `expanded` or `selected`) to `Pressable` elements acting as standalone actions.
