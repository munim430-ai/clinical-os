## 2024-05-18 - TouchableOpacity missing accessibilityRole
**Learning:** Found multiple instances of `TouchableOpacity` in `BentoGridHome` that missed the `accessibilityRole` and `accessibilityLabel` properties, making them hard to use for screen reader users. It is an accessibility issue pattern specific to this apps components.
**Action:** When implementing custom interactive components using `TouchableOpacity` or `Pressable`, ensure that `accessibilityRole` and `accessibilityLabel` (and potentially `accessibilityHint` or `accessibilityState`) are provided.
