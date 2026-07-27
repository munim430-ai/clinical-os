import { cn } from "@/lib/utils";
import { BlurView } from "expo-blur";
import type { ReactNode } from "react";
import { Platform, StyleSheet, View, type ViewStyle } from "react-native";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  intensity?: number;
  borderGlow?: boolean;
  style?: ViewStyle;
}

export function GlassCard({
  children,
  className,
  intensity = 24,
  borderGlow = false,
  style,
}: GlassCardProps) {
  if (Platform.OS === "web") {
    return (
      <View
        className={cn(
          "overflow-hidden rounded-clinical border border-glass-border bg-glass-bg",
          borderGlow && "shadow-glowLime",
          className,
        )}
        style={[
          { backdropFilter: "blur(20px)" } as unknown as ViewStyle,
          borderGlow ? styles.glow : undefined,
          style,
        ]}
      >
        {children}
      </View>
    );
  }

  return (
    <BlurView
      intensity={intensity}
      tint="dark"
      className={cn(
        "overflow-hidden rounded-clinical border border-glass-border bg-glass-bg",
        className,
      )}
      style={[borderGlow ? styles.glow : undefined, style]}
    >
      {children}
    </BlurView>
  );
}

const styles = StyleSheet.create({
  glow: {
    shadowColor: "#C8F53C",
    shadowOpacity: 0.22,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 0 },
    elevation: 4,
  },
});
