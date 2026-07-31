## 2024-05-24 - [Accessible Icon Buttons]
**Learning:** In React Native, `TouchableOpacity` used for icon-only toggles (like password visibility) requires explicit `accessibilityRole="button"` and a descriptive `accessibilityLabel` to be effectively used by screen readers, unlike standard web buttons which often have better implicit accessibility defaults.
**Action:** Always add explicit accessibility roles and labels to all icon-only `TouchableOpacity` or `Pressable` components.
