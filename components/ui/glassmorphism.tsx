import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { BlurView } from 'expo-blur';
import { cn } from '@/lib/utils';

interface GlassmorphismProps {
  children: React.ReactNode;
  className?: string;
  intensity?: number;
  tint?: 'light' | 'dark' | 'default';
  style?: ViewStyle;
}

export function Glassmorphism({
  children,
  className,
  intensity = 100,
  tint = 'dark',
  style,
}: GlassmorphismProps) {
  return (
    <BlurView
      intensity={intensity}
      tint={tint}
      style={[
        styles.glass,
        style,
      ]}
      className={cn(
        "border border-surface-glassBorder bg-surface-glass",
        className
      )}
    >
      {children}
    </BlurView>
  );
}

interface FrostedGlassProps {
  children: React.ReactNode;
  className?: string;
  intensity?: number;
  style?: ViewStyle;
}

export function FrostedGlass({
  children,
  className,
  intensity = 80,
  style,
}: FrostedGlassProps) {
  return (
    <BlurView
      intensity={intensity}
      tint="dark"
      style={[
        styles.frosted,
        style,
      ]}
      className={cn(
        "border border-surface-glassBorder bg-surface-glass/90",
        className
      )}
    >
      {children}
    </BlurView>
  );
}

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  elevated?: boolean;
  style?: ViewStyle;
}

export function GlassCard({
  children,
  className,
  elevated = false,
  style,
}: GlassCardProps) {
  return (
    <BlurView
      intensity={elevated ? 120 : 100}
      tint="dark"
      style={[
        styles.card,
        elevated && styles.cardElevated,
        style,
      ]}
      className={cn(
        "border border-surface-glassBorder bg-surface-glass/95",
        elevated && "bg-surface-elevated/95",
        className
      )}
    >
      {children}
    </BlurView>
  );
}

const styles = StyleSheet.create({
  glass: {
    backgroundColor: 'rgba(18, 18, 18, 0.7)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  frosted: {
    backgroundColor: 'rgba(18, 18, 18, 0.9)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  card: {
    backgroundColor: 'rgba(18, 18, 18, 0.95)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 24,
  },
  cardElevated: {
    backgroundColor: 'rgba(26, 26, 26, 0.95)',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});
