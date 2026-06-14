## 2024-06-14 - React Native Icon Button Accessibility
**Learning:** Custom interactive elements (especially icon-only `Pressable` buttons) in React Native require explicit accessibility props to prevent screen readers from reading raw code or file names. They also need adequate hit slops for usability.
**Action:** When implementing icon-only buttons, always include `accessibilityRole="button"`, a descriptive `accessibilityLabel`, and an expanded touch target via `hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}`.
