import { triggerSelectionHaptic } from "@/lib/clinical-haptics";
import {
  AlertOctagon,
  CheckCircle2,
  ClipboardCheck,
  Clock3,
  Stethoscope,
} from "lucide-react-native";
import { Pressable, Text, View } from "react-native";

type ProtocolChecklistCardProps = {
  title: string;
  category: string;
  estimatedTime: string;
  completedSteps: number;
  totalSteps: number;
  critical?: boolean;
  lastUpdated?: string;
  onPress?: () => void;
};

export function ProtocolChecklistCard({
  title,
  category,
  estimatedTime,
  completedSteps,
  totalSteps,
  critical,
  lastUpdated,
  onPress,
}: ProtocolChecklistCardProps) {
  const progress =
    totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0;

  const handlePress = () => {
    triggerSelectionHaptic();
    onPress?.();
  };

  return (
    <Pressable onPress={handlePress}>
      {({ pressed }) => (
        <View
          className={[
            "rounded-[22px] border bg-surface p-4",
            critical ? "border-border-red" : "border-border",
          ].join(" ")}
          style={{
            opacity: 1,
            transform: [{ scale: pressed ? 0.985 : 1 }],
            shadowColor: "#182456",
            shadowOffset: { width: 0, height: 14 },
            shadowOpacity: 0.08,
            shadowRadius: 34,
            elevation: 2,
          }}
        >
          <View className="flex-row items-start justify-between">
            <View className="flex-1 pr-4">
              <View className="mb-3 flex-row items-center gap-2">
                <View
                  className={[
                    "h-9 w-9 items-center justify-center rounded-2xl border",
                    critical
                      ? "border-border-red bg-clinical-redSoft"
                      : "border-transparent bg-accent-primarySoft",
                  ].join(" ")}
                >
                  {critical ? (
                    <AlertOctagon size={18} color="#FF3B30" strokeWidth={1.6} />
                  ) : (
                    <ClipboardCheck
                      size={18}
                      color="#2470FF"
                      strokeWidth={1.6}
                    />
                  )}
                </View>

                <Text className="font-bodySemi text-[11px] uppercase tracking-[1.6px] text-text-muted">
                  {category}
                </Text>
              </View>

              <Text className="font-headingBold text-[19px] leading-6 text-text-primary">
                {title}
              </Text>

              <View className="mt-4 flex-row items-center gap-4">
                <View className="flex-row items-center gap-1.5">
                  <Clock3 size={14} color="#8A91A8" strokeWidth={1.6} />
                  <Text className="font-body text-[12px] text-text-muted">
                    {estimatedTime}
                  </Text>
                </View>

                <View className="flex-row items-center gap-1.5">
                  <Stethoscope size={14} color="#8A91A8" strokeWidth={1.6} />
                  <Text className="font-body text-[12px] text-text-muted">
                    GP Master
                  </Text>
                </View>
              </View>
            </View>

            <View className="items-end">
              <Text
                className={
                  critical
                    ? "font-heading text-[24px] text-clinical-red"
                    : "font-heading text-[24px] text-accent-primary"
                }
              >
                {progress}%
              </Text>
              <Text className="font-body text-[11px] text-text-muted">
                complete
              </Text>
            </View>
          </View>

          <View className="mt-5 h-2 overflow-hidden rounded-pill bg-surface-muted">
            <View
              className={critical ? "h-full bg-clinical-red" : "h-full bg-mint"}
              style={{ width: `${progress}%` }}
            />
          </View>

          <View className="mt-4 flex-row items-center justify-between">
            <View className="flex-row items-center gap-2">
              <CheckCircle2 size={15} color="#2BC97A" strokeWidth={1.6} />
              <Text className="font-bodySemi text-[12px] text-text-secondary">
                {completedSteps}/{totalSteps} clinical steps
              </Text>
            </View>

            {lastUpdated ? (
              <Text className="font-body text-[11px] text-text-muted">
                Updated {lastUpdated}
              </Text>
            ) : null}
          </View>
        </View>
      )}
    </Pressable>
  );
}
