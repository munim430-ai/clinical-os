## 2024-05-18 - [ThemeToggle Accessibility]
 **Learning:** React Native icon-only `Pressable` components in this codebase require explicit accessibility bindings (e.g. `accessibilityRole="button"`, `accessibilityLabel`) to properly function for screen readers since icon content lacks intrinsic semantic text. They also benefit significantly from standard `hitSlop` configurations to establish a minimum functional touch target space without needing layout adjustments.
 **Action:** Always append these accessibility and touch-target definitions to pure icon buttons.
