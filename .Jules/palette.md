
## 2026-05-11 - Icon-only Touchable Accessibility
**Learning:** Many interactive components (e.g., Pressable, TouchableOpacity) in this application that rely exclusively on icon visuals frequently lack fundamental accessibility props.
**Action:** Proactively inspect and apply `accessibilityRole="button"` and an appropriate `accessibilityLabel` to all icon-only touchables encountered in the codebase to ensure screen reader compatibility.
