import React from 'react';
import { View, StyleSheet } from 'react-native';

// Define colors inline to avoid import issues
const Colors = {
  text: '#FFFFFF',
  textSecondary: '#888888',
  accent: '#007AFF',
  accentCritical: '#FF3B30',
  accentSecondary: '#00B7B5',
  surface: '#080808',
  border: '#1A1A1A',
};

interface IconProps {
  size?: number;
  color?: string;
  style?: any;
}

// Base icon component
const BaseIcon: React.FC<IconProps & { children: React.ReactNode }> = ({ 
  size = 24, 
  color = Colors.text, 
  style, 
  children 
}) => (
  <View style={[{ width: size, height: size }, style]}>
    {children}
  </View>
);

// Search Icon
export const SearchIcon: React.FC<IconProps> = ({ size = 24, color = Colors.text, style }) => (
  <BaseIcon size={size} color={color} style={style}>
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path
        d="M21 21L15 15M17 10C17 13.3137 14.3137 16 11 16C7.68629 16 5 13.3137 5 10C5 6.68629 7.68629 4 11 4C14.3137 4 17 6.68629 17 10C17 13.3137 14.3137 16 11 16C7.68629 16 5 13.3137 5 10C5 6.68629 7.68629 4 11 4C14.3137 4 17 6.68629 17 10Z"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </BaseIcon>
);

// Drug/Pill Icon
export const DrugIcon: React.FC<IconProps> = ({ size = 24, color = Colors.text, style }) => (
  <BaseIcon size={size} color={color} style={style}>
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <ellipse
        cx="12"
        cy="12"
        rx="8"
        ry="6"
        stroke={color}
        strokeWidth="2"
      />
      <path
        d="M8 12C8 9.79086 9.79086 8 12 8C14.2091 8 16 9.79086 16 12C16 14.2091 14.2091 16 12 16C9.79086 16 8 14.2091 8 12Z"
        fill={color}
        opacity="0.3"
      />
    </svg>
  </BaseIcon>
);

// Protocol/Document Icon
export const ProtocolIcon: React.FC<IconProps> = ({ size = 24, color = Colors.text, style }) => (
  <BaseIcon size={size} color={color} style={style}>
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path
        d="M14 2H6C4.89543 2 4 2.89543 4 4V20C4 21.1046 4.89543 22 6 22H18C19.1046 22 20 21.1046 20 20V8L14 2Z"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14 2V8H20"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8 12H16M8 16H16"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  </BaseIcon>
);

// Calculator Icon
export const CalculatorIcon: React.FC<IconProps> = ({ size = 24, color = Colors.text, style }) => (
  <BaseIcon size={size} color={color} style={style}>
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <rect
        x="4"
        y="2"
        width="16"
        height="20"
        rx="2"
        stroke={color}
        strokeWidth="2"
      />
      <path
        d="M8 6H16"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M8 10H16"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
      />
      <rect x="8" y="14" width="3" height="3" rx="1" fill={color} />
      <rect x="10.5" y="14" width="3" height="3" rx="1" fill={color} />
      <rect x="13" y="14" width="3" height="3" rx="1" fill={color} />
      <rect x="8" y="17" width="3" height="3" rx="1" fill={color} />
      <rect x="10.5" y="17" width="3" height="3" rx="1" fill={color} />
      <rect x="13" y="17" width="3" height="3" rx="1" fill={color} />
    </svg>
  </BaseIcon>
);

// Camera/Scan Icon
export const CameraIcon: React.FC<IconProps> = ({ size = 24, color = Colors.text, style }) => (
  <BaseIcon size={size} color={color} style={style}>
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path
        d="M23 19C23 20.1046 22.1046 21 21 21H3C1.89543 21 1 20.1046 1 19V5C1 3.89543 1.89543 3 3 3H21C22.1046 3 23 3.89543 23 5V19Z"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 15C14.2091 15 16 13.2091 16 11C16 8.79086 14.2091 7 12 7C9.79086 7 8 8.79086 8 11C8 13.2091 9.79086 15 12 15Z"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M17 5L17 7"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </BaseIcon>
);

// ER/Emergency Icon
export const ERIcon: React.FC<IconProps> = ({ size = 24, color = Colors.accentCritical, style }) => (
  <BaseIcon size={size} color={color} style={style}>
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path
        d="M12 2L2 7V12C2 16.5 6 20 12 22C18 20 22 16.5 22 12V7L12 2Z"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 8V12M12 16H12.01"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </BaseIcon>
);

// Heartbeat/Medical Icon
export const HeartbeatIcon: React.FC<IconProps> = ({ size = 24, color = Colors.text, style }) => (
  <BaseIcon size={size} color={color} style={style}>
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path
        d="M3 12H7M7 12C7 12 10 6 12 6C14 6 17 12 17 12M17 12H21"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M19.07 4.93C20.9446 3.05536 23.5654 3.05536 21.69 4.93C19.8146 6.80464 19.8146 9.42536 21.69 11.3L12 21L2.31 11.3C0.435366 9.42536 0.435366 6.80464 2.31 4.93C4.18464 3.05536 6.80536 3.05536 8.68 4.93L12 8.25L15.32 4.93C17.1946 3.05536 19.8154 3.05536 21.69 4.93C23.5646 6.80464 23.5646 9.42536 21.69 11.3L12 21Z"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.3"
      />
    </svg>
  </BaseIcon>
);

// Settings/Gear Icon
export const SettingsIcon: React.FC<IconProps> = ({ size = 24, color = Colors.text, style }) => (
  <BaseIcon size={size} color={color} style={style}>
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path
        d="M12.22 2H11.78L11.11 4.44C10.73 4.62 10.38 4.84 10.06 5.11L7.89 4.17L7.5 4.56C6.96 5.1 6.52 5.73 6.17 6.42L4.17 7.11L4.17 7.89C4.17 8.3 4.17 8.7 4.17 9.11L6.17 9.78C6.52 10.47 6.96 11.1 7.5 11.64L7.89 12.03L8.28 12.42C8.73 12.87 9.36 13.31 10.05 13.66L10.72 15.67C11.13 15.67 11.53 15.67 11.94 15.67L12.61 13.23C12.99 13.05 13.34 12.83 13.66 12.56L15.83 13.5L16.22 13.11C16.76 12.57 17.2 11.94 17.55 11.25L19.55 10.56L19.55 9.78C19.55 9.37 19.55 8.97 19.55 8.56L17.55 7.89C17.2 7.2 16.76 6.57 16.22 6.03L15.83 5.64L15.44 5.25C14.99 4.8 14.36 4.36 13.67 4.01L13 2H12.56H12.22Z"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="9" r="3" stroke={color} strokeWidth="2" />
    </svg>
  </BaseIcon>
);

// Checkmark Icon
export const CheckmarkIcon: React.FC<IconProps> = ({ size = 24, color = Colors.accent, style }) => (
  <BaseIcon size={size} color={color} style={style}>
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path
        d="M20 6L9 17L4 12"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </BaseIcon>
);

// Chevron Right Icon
export const ChevronRightIcon: React.FC<IconProps> = ({ size = 24, color = Colors.textSecondary, style }) => (
  <BaseIcon size={size} color={color} style={style}>
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path
        d="M9 18L15 12L9 6"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </BaseIcon>
);

// Chevron Down Icon
export const ChevronDownIcon: React.FC<IconProps> = ({ size = 24, color = Colors.textSecondary, style }) => (
  <BaseIcon size={size} color={color} style={style}>
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path
        d="M6 9L12 15L18 9"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </BaseIcon>
);

// Menu Icon
export const MenuIcon: React.FC<IconProps> = ({ size = 24, color = Colors.text, style }) => (
  <BaseIcon size={size} color={color} style={style}>
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path
        d="M3 12H21M3 6H21M3 18H21"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </BaseIcon>
);

// Close Icon
export const CloseIcon: React.FC<IconProps> = ({ size = 24, color = Colors.text, style }) => (
  <BaseIcon size={size} color={color} style={style}>
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path
        d="M18 6L6 18M6 6L18 18"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </BaseIcon>
);

// Plus Icon
export const PlusIcon: React.FC<IconProps> = ({ size = 24, color = Colors.text, style }) => (
  <BaseIcon size={size} color={color} style={style}>
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path
        d="M12 5V19M5 12H19"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </BaseIcon>
);

// Minus Icon
export const MinusIcon: React.FC<IconProps> = ({ size = 24, color = Colors.text, style }) => (
  <BaseIcon size={size} color={color} style={style}>
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path
        d="M5 12H19"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </BaseIcon>
);

// Info Icon
export const InfoIcon: React.FC<IconProps> = ({ size = 24, color = Colors.accent, style }) => (
  <BaseIcon size={size} color={color} style={style}>
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2" />
      <path d="M12 16V12" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <path d="M12 8H12.01" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </svg>
  </BaseIcon>
);

// Warning Icon
export const WarningIcon: React.FC<IconProps> = ({ size = 24, color = Colors.accentCritical, style }) => (
  <BaseIcon size={size} color={color} style={style}>
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path
        d="M10.29 3.86L1.82 18C1.43 18.67 1.67 19.5 2.29 20H21.71C22.33 19.5 22.57 18.67 22.18 18L13.71 3.86C13.36 3.11 12.64 3.11 12.29 3.86Z"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M12 9V13" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <path d="M12 17H12.01" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </svg>
  </BaseIcon>
);

// Export all icons as a library
export const Icons = {
  Search: SearchIcon,
  Drug: DrugIcon,
  Protocol: ProtocolIcon,
  Calculator: CalculatorIcon,
  Camera: CameraIcon,
  ER: ERIcon,
  Heartbeat: HeartbeatIcon,
  Settings: SettingsIcon,
  Checkmark: CheckmarkIcon,
  ChevronRight: ChevronRightIcon,
  ChevronDown: ChevronDownIcon,
  Menu: MenuIcon,
  Close: CloseIcon,
  Plus: PlusIcon,
  Minus: MinusIcon,
  Info: InfoIcon,
  Warning: WarningIcon,
};

export default Icons;
