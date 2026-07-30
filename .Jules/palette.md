## 2026-07-30 - [Added Accessibility to Theme Toggle]
**Learning:** Icon-only buttons using `Pressable` or `TouchableOpacity` must be explicitly marked with `accessibilityRole="button"` and an `accessibilityLabel` to ensure screen readers announce them properly. A generous `hitSlop` is also essential to make the touch targets usable on mobile interfaces. Using `accessibilityState={{ checked: boolean }}` helps communicate state for toggle-style controls.
**Action:** Always provide explicit accessibility roles, labels, states, and hitSlops on custom interactive touchables.
