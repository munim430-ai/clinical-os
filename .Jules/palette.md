
## 2024-06-25 - AI Assistant Button Accessibility
**Learning:** Floating action buttons and expanded quick actions in React Native often lack proper semantic roles and touch target padding, making them difficult for screen readers and physically impaired users to interact with.
**Action:** Always add `accessibilityRole="button"`, explicit `accessibilityLabel` bindings, `accessibilityState` for expandable elements, and a generous `hitSlop` (e.g., `{{ top: 10, bottom: 10, left: 10, right: 10 }}`) to all interactive `TouchableOpacity` and `Pressable` components, especially for floating/custom UI patterns.
