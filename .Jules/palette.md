## 2026-08-01 - [Add missing accessibility features to theme toggle]
**Learning:** Icon-only interactive elements in React Native (like ThemeToggle) can be inaccessible if they lack ARIA labels and adequate touch targets, particularly confusing screen readers.
**Action:** Always verify that `Pressable` or `TouchableOpacity` elements without text include `accessibilityRole="button"`, descriptive `accessibilityLabel`, and `hitSlop` for better mobile tap areas.
