## 2024-05-24 - Accessibility labels for custom buttons
**Learning:** React Native interactive components (TouchableOpacity, Pressable) used as icons or buttons lack native accessibility properties out-of-the-box and require explicit ARIA roles/labels for screen readers.
**Action:** Always add accessibilityRole="button" and a descriptive accessibilityLabel to icon-only buttons or custom interactive components.
