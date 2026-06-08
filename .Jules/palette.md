## 2024-06-08 - Added accessibility labels to TextInput and missing roles to TouchableOpacity
**Learning:** Found an accessibility issue pattern in the app where inputs with external text labels lack explicit `accessibilityLabel` bindings on the `TextInput` itself, and custom buttons using `TouchableOpacity` frequently omit `accessibilityRole="button"`.
**Action:** Always add `accessibilityLabel={label}` on `TextInput` wrappers, and consistently apply `accessibilityRole="button"` and `accessibilityState` to all custom touchable elements.
