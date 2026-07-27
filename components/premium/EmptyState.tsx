import { triggerSelectionHaptic } from "@/lib/clinical-haptics";
import type { LucideIcon } from "lucide-react-native";
import { Pressable, Text, View } from "react-native";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  subtitle?: string;
  ctaText?: string;
  ctaOnPress?: () => void;
}

export function EmptyState({
  icon: Icon,
  title,
  subtitle,
  ctaText,
  ctaOnPress,
}: EmptyStateProps) {
  return (
    <View className="items-center rounded-clinical border border-border bg-surface px-6 py-12">
      <View className="h-16 w-16 items-center justify-center rounded-full bg-accent-primarySoft">
        <Icon size={28} color="#C8F53C" strokeWidth={1.6} />
      </View>
      <Text className="mt-4 text-center font-headingSemi text-[16px] text-text-primary">
        {title}
      </Text>
      {subtitle ? (
        <Text className="mt-1.5 text-center font-body text-[12.5px] leading-5 text-text-tertiary">
          {subtitle}
        </Text>
      ) : null}
      {ctaText && ctaOnPress ? (
        <Pressable
          onPress={() => {
            triggerSelectionHaptic();
            ctaOnPress();
          }}
          className="mt-5 rounded-pill bg-accent-primary px-6 py-3"
          accessibilityRole="button"
        >
          <Text className="font-bodySemi text-[13px] text-text-inverse">
            {ctaText}
          </Text>
        </Pressable>
      ) : null}
    </View>
  );
}
