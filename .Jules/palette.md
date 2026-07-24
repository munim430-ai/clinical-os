## 2025-05-18 - Essential Accessibility for Critical Interfaces
**Learning:** Icon-only buttons (like back/search) in critical views such as the ER dashboard represent a severe accessibility barrier for screen readers if unlabeled. Including adequate `hitSlop` padding is also crucial for reliable activation of these small targets during high-stress usage.
**Action:** Always assign `accessibilityRole="button"` and a clear `accessibilityLabel` to custom icon-only `Pressable` components, particularly in high-stakes environments. Supplement with `hitSlop` to ensure easy tapability.
