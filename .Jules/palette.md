## YYYY-MM-DD - [Title]
**Learning:** [UX/a11y insight]
**Action:** [How to apply next time]

## 2025-02-14 - Theme Toggle Accessibility
**Learning:** Found that the `ThemeToggle.tsx` icon-only button had no semantic ARIA role or label, making it opaque to screen readers on native/web. Also, its touch target was very small on mobile.
**Action:** Added `accessibilityRole="button"`, a dynamic `accessibilityLabel` based on theme state, `accessibilityState`, and `hitSlop` to ensure it is both screen-reader friendly and easy to tap. Will look for other icon-only `Pressable` components in the app to apply this standard.
