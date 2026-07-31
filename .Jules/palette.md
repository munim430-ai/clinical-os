## 2024-06-17 - Missing Accessibility Attributes on Modals
**Learning:** Modal close buttons (X icons) often lack ARIA roles (`accessibilityRole="button"`), descriptions (`accessibilityLabel`), and sufficient touch targets (`hitSlop`), making them inaccessible to screen readers and difficult to interact with.
**Action:** Always verify that custom icon-only close buttons include `accessibilityRole="button"`, a descriptive `accessibilityLabel`, and `hitSlop` (e.g., top, bottom, left, right: 10) to ensure accessibility and usability.
