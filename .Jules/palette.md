## 2024-07-04 - [Missing ARIA label on icon-only search button in BentoGridHome]
**Learning:** Icon-only `TouchableOpacity` search buttons in grid components need explicit accessibility roles and labels (`accessibilityRole="button"`, `accessibilityLabel="Search"`) to be correctly identified by screen readers, along with an adequate `hitSlop` to ensure usability as a touch target.
**Action:** Always ensure any interactive icon-only component wrapper like `TouchableOpacity` receives an `accessibilityRole`, a descriptive `accessibilityLabel`, and `hitSlop`.
