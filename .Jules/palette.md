## 2024-05-18 - Missing ARIA/Accessibility attributes on Modal Close icons
**Learning:** Across various custom modal components in the app (like tools in the home view), icon-only close buttons lacked screen-reader descriptions and adequate touch target sizing.
**Action:** Always verify custom modal/popup dismiss controls have `accessibilityRole="button"`, an `accessibilityLabel` (e.g. "Close modal"), and an increased `hitSlop` to ensure they are fully usable and accessible to all users.
