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
  tint = 'light',
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
      tint="light"
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
      tint="light"
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
    backgroundColor: 'rgba(255, 255, 255, 0.72)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.78)',
  },
  frosted: {
    backgroundColor: 'rgba(255, 255, 255, 0.82)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.78)',
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.88)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.78)',
    borderRadius: 24,
  },
  cardElevated: {
    backgroundColor: 'rgba(255, 255, 255, 0.94)',
    shadowColor: '#182456',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.08,
    shadowRadius: 18,
    elevation: 4,
  },
});
