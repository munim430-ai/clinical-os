## 2024-05-19 - Adding accessibility to custom Pressable cards
**Learning:** When using `Pressable` to create complex interactive custom cards, the default behavior will just read out all the nested text sequentially without a cohesive context.
**Action:** Always add an explicit `accessibilityRole="button"` and a single computed `accessibilityLabel` that combines key information (e.g., brand name, generic name, strength) on the outermost `Pressable` wrapper.
