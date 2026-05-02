// Clinical OS Design System - Keystone Aesthetic
export const Colors = {
  // Primary Colors - Matte Black Theme
  primary: '#000000',           // Pure Matte Black - saves battery, infinite contrast
  background: '#000000',         // Main background
  surface: '#080808',           // Card backgrounds
  surfaceElevated: '#121212',    // Elevated surfaces
  
  // Accent Colors - Clinical Precision
  accent: '#007AFF',             // Electric Blue - primary actions
  accentSecondary: '#00B7B5',    // Surgical Teal - secondary accents
  accentCritical: '#FF3B30',     // Emergency Red - critical alerts
  
  // Text Colors
  text: '#FFFFFF',               // Primary text
  textSecondary: '#888888',      // Secondary/dimmed text
  textTertiary: '#555555',       // Tertiary text
  
  // Borders and Dividers
  border: '#1A1A1A',            // 1px borders - razor sharp
  borderActive: '#007AFF',       // Active borders
  borderCritical: '#FF3B30',     // Critical borders
  
  // ER Mode Colors
  erBackground: '#1A0000',       // Dark red tint for ER mode
  erBorder: '#FF3B30',          // Pulsing red borders
  erAccent: '#FF6B6B',          // Emergency accent
  
  // Glassmorphism
  glassBackground: 'rgba(255, 255, 255, 0.05)',
  glassBorder: 'rgba(255, 255, 255, 0.1)',
  glassBlur: 20,
};

export const Typography = {
  // Font Families
  heading: 'GeistMono-Regular',  // GEBUK/Geist Mono for technical feel
  body: 'Inter-Variable',        // Inter for readability
  
  // Font Sizes
  sizes: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36,
    '5xl': 48,
  },
  
  // Font Weights
  weights: {
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',      // Headers use 700-weight for hospital lighting
    extrabold: '800',
  },
  
  // Line Heights
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
  '2xl': 48,
  '3xl': 64,
};

export const BorderRadius = {
  none: 0,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
};

export const Shadows = {
  // No heavy shadows - just clean depth
  subtle: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 4,
  },
};

export const Animations = {
  // Micro-interaction durations
  fast: 150,
  normal: 300,
  slow: 500,
  
  // Spring animations
  spring: {
    tension: 1000,
    friction: 20,
  },
  
  // Haptic feedback patterns
  haptics: {
    light: 'impactLight',
    medium: 'impactMedium',
    heavy: 'impactHeavy',
    success: 'notificationSuccess',
    warning: 'notificationWarning',
    error: 'notificationError',
  },
};

export const Breakpoints = {
  // One-handed mode - critical elements in lower 2/3
  oneHandedThreshold: '66%',
  touchTarget: 44, // Minimum touch target size
};

export const Layout = {
  // Safe areas for one-handed use
  safeArea: {
    top: 44,
    bottom: 34,
    horizontal: 16,
  },
  
  // Card dimensions
  card: {
    height: 80,
    padding: 16,
    margin: 8,
  },
  
  // Search bar
  search: {
    height: 56,
    borderRadius: 28,
    padding: 16,
  },
};

// Component-specific tokens
export const Components = {
  // Omni-Search Command Bar
  commandBar: {
    background: Colors.glassBackground,
    border: Colors.glassBorder,
    blur: Colors.glassBlur,
    borderRadius: BorderRadius.lg,
    height: Layout.search.height,
  },
  
  // Drug Cards (DIMS)
  drugCard: {
    background: Colors.surface,
    border: Colors.border,
    borderRadius: BorderRadius.md,
    height: Layout.card.height,
    padding: Layout.card.padding,
  },
  
  // Price Badge
  priceBadge: {
    background: 'transparent',
    border: Colors.accent,
    color: Colors.accent,
    borderRadius: BorderRadius.sm,
    padding: 4,
    fontSize: Typography.sizes.sm,
  },
  
  // ER Mode
  erMode: {
    background: Colors.erBackground,
    border: Colors.erBorder,
    pulseColor: Colors.erBorder,
    borderRadius: BorderRadius.lg,
  },
  
  // Reader Mode (GP Master)
  readerMode: {
    background: Colors.background,
    text: Colors.text,
    heading: Typography.heading,
    body: Typography.body,
    lineHeight: Typography.lineHeight.relaxed,
    maxLineWidth: 65, // Characters per line for optimal readability
  },
  
  // Quick Action Bento Grid
  bentoGrid: {
    columns: 2,
    gap: Spacing.md,
    itemHeight: 100,
    borderRadius: BorderRadius.md,
  },
};

// Dark mode configuration (always enabled)
export const Theme = {
  dark: true,
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
