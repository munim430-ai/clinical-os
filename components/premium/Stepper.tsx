import { triggerSelectionHaptic } from "@/lib/clinical-haptics";
import { cn } from "@/lib/utils";
import { Check, ChevronDown } from "lucide-react-native";
import { AnimatePresence, MotiView } from "moti";
import type { ReactNode } from "react";
import { Pressable, Text, View } from "react-native";

export interface StepperStep {
  key: string;
  title: string;
  subtitle?: string;
  complete: boolean;
  content: ReactNode;
}

interface StepperProps {
  steps: StepperStep[];
  expandedKey: string | null;
  onToggle: (key: string) => void;
}

export function Stepper({ steps, expandedKey, onToggle }: StepperProps) {
  return (
    <View>
      {steps.map((step, index) => {
        const isExpanded = expandedKey === step.key;
        const isLast = index === steps.length - 1;

        return (
          <View key={step.key} className="flex-row">
            {/* connector column */}
            <View className="items-center" style={{ width: 36 }}>
              <View
                className={cn(
                  "h-8 w-8 items-center justify-center rounded-full border-2",
                  step.complete
                    ? "border-accent-primary bg-accent-primary"
                    : "border-border-medium bg-surface",
                )}
              >
                {step.complete ? (
                  <Check size={15} color="#0C0C0E" strokeWidth={2.5} />
                ) : (
                  <Text className="font-bodySemi text-[12px] text-text-tertiary">
                    {index + 1}
                  </Text>
                )}
              </View>
              {!isLast ? (
                <View
                  className={cn(
                    "w-[2px] flex-1",
                    step.complete ? "bg-accent-primary" : "bg-border-medium",
                  )}
                  style={{ minHeight: 24 }}
                />
              ) : null}
            </View>

            {/* content column */}
            <View className="mb-4 flex-1 pl-2">
              <Pressable
                onPress={() => {
                  triggerSelectionHaptic();
                  onToggle(step.key);
                }}
                className="flex-row items-center justify-between rounded-clinical border border-border bg-surface px-4 py-3.5"
                accessibilityRole="button"
                accessibilityState={{ expanded: isExpanded }}
              >
                <View className="flex-1 pr-2">
                  <Text className="font-bodySemi text-[14px] text-text-primary">
                    {step.title}
                  </Text>
                  {step.subtitle ? (
                    <Text
                      className="mt-0.5 font-body text-[12px] text-text-tertiary"
                      numberOfLines={1}
                    >
                      {step.subtitle}
                    </Text>
                  ) : null}
                </View>
                <MotiView
                  animate={{ rotate: isExpanded ? "180deg" : "0deg" }}
                  transition={{ type: "timing", duration: 180 }}
                >
                  <ChevronDown size={18} color="#7A7A80" />
                </MotiView>
              </Pressable>

              <AnimatePresence>
                {isExpanded ? (
                  <MotiView
                    from={{ opacity: 0, translateY: -6 }}
                    animate={{ opacity: 1, translateY: 0 }}
                    exit={{ opacity: 0, translateY: -6 }}
                    transition={{ type: "timing", duration: 200 }}
                    className="mt-2 rounded-clinical border border-border-soft bg-background/40 p-4"
                  >
                    {step.content}
                  </MotiView>
                ) : null}
              </AnimatePresence>
            </View>
          </View>
        );
      })}
    </View>
  );
}
