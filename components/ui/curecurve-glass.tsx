import type { ReactNode } from "react";
import { Text, TouchableOpacity, View, type ViewProps } from "react-native";

type Children = {
  children: ReactNode;
};

export function GlassCard({
  children,
  className = "",
  ...props
}: Children & ViewProps) {
  return (
    <View
      {...props}
      className={`rounded-[28px] border border-surface-glassBorder bg-surface-glass p-4 ${className}`}
      style={[
        {
          shadowColor: "#182456",
          shadowOffset: { width: 0, height: 14 },
          shadowOpacity: 0.08,
          shadowRadius: 34,
          elevation: 4,
        },
        props.style,
      ]}
    >
      {children}
    </View>
  );
}

export function GlassPill({
  children,
  active = false,
  className = "",
  onPress,
}: Children & {
  active?: boolean;
  className?: string;
  onPress?: () => void;
}) {
  const body = (
    <View
      className={[
        "min-h-[38px] items-center justify-center rounded-full border px-4",
        active
          ? "border-accent-primary bg-accent-primary"
          : "border-surface-glassBorder bg-surface-muted",
        className,
      ].join(" ")}
    >
      {children}
    </View>
  );

  if (!onPress) return body;
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.78}>
      {body}
    </TouchableOpacity>
  );
}

export function GlassSectionHeader({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <View className="mb-3">
      <Text className="font-headingSemi text-[18px] text-text-primary">
        {title}
      </Text>
      {subtitle ? (
        <Text className="mt-1 font-body text-[12px] text-text-tertiary">
          {subtitle}
        </Text>
      ) : null}
    </View>
  );
}

export function GlassListRow({
  children,
  className = "",
}: Children & { className?: string }) {
  return (
    <View
      className={`rounded-2xl border border-border-soft bg-surface-muted px-3 py-3 ${className}`}
    >
      {children}
    </View>
  );
}
