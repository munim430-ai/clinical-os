## 2026-06-02 - [React Native Custom Pressable Accessibility]

**Learning:** Custom interactive components (like icon-only `Pressable` components in `ThemeToggle.tsx` and `AIOrbButton.tsx`) lack automatic screen reader context in React Native compared to semantic HTML buttons.
**Action:** Always manually add `accessibilityRole="button"` and `accessibilityLabel` to custom `Pressable` or `TouchableOpacity` buttons, especially when they only contain icons. For components representing a state (like the AI orb), use `accessibilityState` to correctly announce state changes (e.g. `expanded`).
