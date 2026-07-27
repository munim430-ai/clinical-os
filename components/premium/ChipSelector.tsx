import { triggerSelectionHaptic } from "@/lib/clinical-haptics";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react-native";
import { MotiView } from "moti";
import { Pressable, Text, View } from "react-native";

export interface ChipOption {
  label: string;
  value: string;
  badge?: string;
}

interface ChipSelectorProps {
  options: ChipOption[];
  selected: string[];
  onToggle: (value: string) => void;
  className?: string;
}

export function ChipSelector({
  options,
  selected,
  onToggle,
  className,
}: ChipSelectorProps) {
  return (
    <View className={cn("flex-row flex-wrap gap-2", className)}>
      {options.map((option) => {
        const isSelected = selected.includes(option.value);
        return (
          <Pressable
            key={option.value}
            onPress={() => {
              triggerSelectionHaptic();
              onToggle(option.value);
            }}
            accessibilityRole="button"
            accessibilityState={{ selected: isSelected }}
          >
            <MotiView
              animate={{ scale: isSelected ? 1.03 : 1 }}
              transition={{ type: "timing", duration: 150 }}
              className={cn(
                "flex-row items-center gap-1.5 rounded-pill border px-3.5 py-2",
                isSelected
                  ? "border-accent-primary bg-accent-primary"
                  : "border-border bg-surface",
              )}
            >
              {isSelected ? (
                <Check size={12} color="#0C0C0E" strokeWidth={2.5} />
              ) : null}
              <Text
                className={cn(
                  "font-bodySemi text-[13px]",
                  isSelected ? "text-text-inverse" : "text-text-secondary",
                )}
              >
                {option.label}
              </Text>
              {option.badge ? (
                <Text
                  className={cn(
                    "font-mono text-[10px]",
                    isSelected ? "text-text-inverse/70" : "text-text-tertiary",
                  )}
                >
                  {option.badge}
                </Text>
              ) : null}
            </MotiView>
          </Pressable>
        );
      })}
    </View>
  );
}
