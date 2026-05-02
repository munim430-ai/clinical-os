import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

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

// Base icon component using Text for simple icons
const BaseIcon: React.FC<IconProps & { children: string }> = ({ 
  size = 24, 
  color = Colors.text, 
  style, 
  children 
}) => (
  <Text style={[{ fontSize: size, color }, style]}>
    {children}
  </Text>
);

// Search Icon (using emoji)
export const SearchIcon: React.FC<IconProps> = ({ size = 24, color = Colors.text, style }) => (
  <BaseIcon size={size} color={color} style={style}>🔍</BaseIcon>
);

// Drug/Pill Icon
export const DrugIcon: React.FC<IconProps> = ({ size = 24, color = Colors.text, style }) => (
  <BaseIcon size={size} color={color} style={style}>💊</BaseIcon>
);

// Protocol/Document Icon
export const ProtocolIcon: React.FC<IconProps> = ({ size = 24, color = Colors.text, style }) => (
  <BaseIcon size={size} color={color} style={style}>📋</BaseIcon>
);

// Calculator Icon
export const CalculatorIcon: React.FC<IconProps> = ({ size = 24, color = Colors.text, style }) => (
  <BaseIcon size={size} color={color} style={style}>🧮</BaseIcon>
);

// Camera/Scan Icon
export const CameraIcon: React.FC<IconProps> = ({ size = 24, color = Colors.text, style }) => (
  <BaseIcon size={size} color={color} style={style}>📷</BaseIcon>
);

// ER/Emergency Icon
export const ERIcon: React.FC<IconProps> = ({ size = 24, color = Colors.accentCritical, style }) => (
  <BaseIcon size={size} color={color} style={style}>🚨</BaseIcon>
);

// Heartbeat/Medical Icon
export const HeartbeatIcon: React.FC<IconProps> = ({ size = 24, color = Colors.text, style }) => (
  <BaseIcon size={size} color={color} style={style}>❤️</BaseIcon>
);

// Settings/Gear Icon
export const SettingsIcon: React.FC<IconProps> = ({ size = 24, color = Colors.text, style }) => (
  <BaseIcon size={size} color={color} style={style}>⚙️</BaseIcon>
);

// Checkmark Icon
export const CheckmarkIcon: React.FC<IconProps> = ({ size = 24, color = Colors.accent, style }) => (
  <BaseIcon size={size} color={color} style={style}>✅</BaseIcon>
);

// Chevron Right Icon
export const ChevronRightIcon: React.FC<IconProps> = ({ size = 24, color = Colors.textSecondary, style }) => (
  <BaseIcon size={size} color={color} style={style}>›</BaseIcon>
);

// Chevron Down Icon
export const ChevronDownIcon: React.FC<IconProps> = ({ size = 24, color = Colors.textSecondary, style }) => (
  <BaseIcon size={size} color={color} style={style}>⌄</BaseIcon>
);

// Menu Icon
export const MenuIcon: React.FC<IconProps> = ({ size = 24, color = Colors.text, style }) => (
  <BaseIcon size={size} color={color} style={style}>☰</BaseIcon>
);

// Close Icon
export const CloseIcon: React.FC<IconProps> = ({ size = 24, color = Colors.text, style }) => (
  <BaseIcon size={size} color={color} style={style}>✕</BaseIcon>
);

// Plus Icon
export const PlusIcon: React.FC<IconProps> = ({ size = 24, color = Colors.text, style }) => (
  <BaseIcon size={size} color={color} style={style}>+</BaseIcon>
);

// Minus Icon
export const MinusIcon: React.FC<IconProps> = ({ size = 24, color = Colors.text, style }) => (
  <BaseIcon size={size} color={color} style={style}>−</BaseIcon>
);

// Info Icon
export const InfoIcon: React.FC<IconProps> = ({ size = 24, color = Colors.accent, style }) => (
  <BaseIcon size={size} color={color} style={style}>ℹ️</BaseIcon>
);

// Warning Icon
export const WarningIcon: React.FC<IconProps> = ({ size = 24, color = Colors.accentCritical, style }) => (
  <BaseIcon size={size} color={color} style={style}>⚠️</BaseIcon>
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
