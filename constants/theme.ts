export const Colors = {
  primary: "#2470FF",
  primaryHover: "#1B5FE0",
  primarySoft: "#E5EDFF",
  background: "#EEF1F8",
  surface: "rgba(255,255,255,0.92)",
  surfaceElevated: "#FFFFFF",
  surfaceMuted: "rgba(245,247,251,0.88)",
  accent: "#2470FF",
  accentSecondary: "#2BC97A",
  accentCritical: "#FF3B30",
  success: "#2BC97A",
  warning: "#FFA01D",
  danger: "#FF3B30",
  text: "#182456",
  textSecondary: "#4B5680",
  textTertiary: "#8A91A8",
  border: "rgba(229,233,242,0.92)",
  borderActive: "#2470FF",
  borderCritical: "#FF3B30",
  borderStrong: "#C9D1E2",
  erBackground: "#FFE3E1",
  erBorder: "#FF3B30",
  erAccent: "#FF3B30",
  glassBackground: "rgba(255,255,255,0.72)",
  glassBorder: "rgba(255,255,255,0.78)",
  glassBlur: 24,
};

export const Typography = {
  heading: "Inter_700Bold",
  body: "Inter_400Regular",
  sizes: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    "2xl": 24,
    "3xl": 30,
    "4xl": 36,
    "5xl": 48,
  },
  weights: {
    light: "300",
    normal: "400",
    medium: "500",
    semibold: "600",
    bold: "700",
    extrabold: "800",
  },
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
  },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  "2xl": 48,
  "3xl": 64,
};

export const BorderRadius = {
  none: 0,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  full: 9999,
};

export const Shadows = {
  subtle: {
    shadowColor: "#182456",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 28,
    elevation: 2,
  },
  medium: {
    shadowColor: "#182456",
    shadowOffset: { width: 0, height: 18 },
    shadowOpacity: 0.12,
    shadowRadius: 42,
    elevation: 4,
  },
};

export const Animations = {
  fast: 120,
  normal: 240,
  slow: 360,
  spring: {
    tension: 1000,
    friction: 20,
  },
  haptics: {
    light: "impactLight",
    medium: "impactMedium",
    heavy: "impactHeavy",
    success: "notificationSuccess",
    warning: "notificationWarning",
    error: "notificationError",
  },
};

export const Breakpoints = {
  oneHandedThreshold: "66%",
  touchTarget: 44,
};

export const Layout = {
  safeArea: {
    top: 44,
    bottom: 34,
    horizontal: 20,
  },
  card: {
    height: 80,
    padding: 16,
    margin: 8,
  },
  search: {
    height: 56,
    borderRadius: 12,
    padding: 16,
  },
};

export const Components = {
  commandBar: {
    background: Colors.glassBackground,
    border: Colors.glassBorder,
    blur: Colors.glassBlur,
    borderRadius: BorderRadius.lg,
    height: Layout.search.height,
  },
  drugCard: {
    background: Colors.surface,
    border: Colors.border,
    borderRadius: BorderRadius.md,
    height: Layout.card.height,
    padding: Layout.card.padding,
  },
  priceBadge: {
    background: Colors.primarySoft,
    border: Colors.primary,
    color: Colors.primary,
    borderRadius: BorderRadius.sm,
    padding: 4,
    fontSize: Typography.sizes.sm,
  },
  erMode: {
    background: Colors.erBackground,
    border: Colors.erBorder,
    pulseColor: Colors.erBorder,
    borderRadius: BorderRadius.lg,
  },
  readerMode: {
    background: Colors.background,
    text: Colors.text,
    heading: Typography.heading,
    body: Typography.body,
    lineHeight: Typography.lineHeight.relaxed,
    maxLineWidth: 65,
  },
  bentoGrid: {
    columns: 2,
    gap: Spacing.md,
    itemHeight: 100,
    borderRadius: BorderRadius.md,
  },
};

export const Theme = {
  dark: false,
  colors: Colors,
  typography: Typography,
  spacing: Spacing,
  borderRadius: BorderRadius,
  shadows: Shadows,
  animations: Animations,
  breakpoints: Breakpoints,
  layout: Layout,
  components: Components,
};

export default Theme;
