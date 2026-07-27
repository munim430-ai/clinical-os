import { triggerSelectionHaptic } from "@/lib/clinical-haptics";
import { cn } from "@/lib/utils";
import { Pressable, Text, View } from "react-native";

const NUMBERS = [0, 1, 2, 3];

const COLUMNS: {
  key: "morning" | "afternoon" | "night";
  label: string;
  emoji: string;
}[] = [
  { key: "morning", label: "Morning", emoji: "☀" },
  { key: "afternoon", label: "Afternoon", emoji: "☀" },
  { key: "night", label: "Night", emoji: "☾" },
];

interface DoseGridProps {
  morning: number;
  afternoon: number;
  night: number;
  onChange: (dose: {
    morning: number;
    afternoon: number;
    night: number;
  }) => void;
}

export function DoseGrid({
  morning,
  afternoon,
  night,
  onChange,
}: DoseGridProps) {
  const values = { morning, afternoon, night };

  return (
    <View className="flex-row justify-between gap-2">
      {COLUMNS.map((col) => (
        <View key={col.key} className="flex-1 items-center">
          <Text className="mb-2 font-bodySemi text-[11px] text-text-secondary">
            {col.emoji} {col.label}
          </Text>
          <View className="gap-2">
            {NUMBERS.map((n) => {
              const selected = values[col.key] === n;
              return (
                <Pressable
                  key={n}
                  onPress={() => {
                    triggerSelectionHaptic();
                    onChange({ ...values, [col.key]: n });
                  }}
                  className={cn(
                    "h-10 w-10 items-center justify-center rounded-full border",
                    selected
                      ? "border-accent-primary bg-accent-primary"
                      : "border-border bg-surface",
                  )}
                  accessibilityRole="button"
                  accessibilityLabel={`${col.label} dose ${n}`}
                >
                  <Text
                    className={cn(
                      "font-bodySemi text-[15px]",
                      selected ? "text-text-inverse" : "text-text-secondary",
                    )}
                  >
                    {n}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>
      ))}
    </View>
  );
}
