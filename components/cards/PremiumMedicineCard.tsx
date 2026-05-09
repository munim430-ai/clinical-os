import { triggerSelectionHaptic } from "@/lib/clinical-haptics";
import {
  AlertTriangle,
  ChevronRight,
  Pill,
  ShieldCheck,
} from "lucide-react-native";
import { Pressable, Text, View } from "react-native";

type PremiumMedicineCardProps = {
  brandName: string;
  genericName: string;
  strength: string;
  manufacturer: string;
  dosageForm: string;
  safetyNote?: string;
  isFavorite?: boolean;
  onPress?: () => void;
};

export function PremiumMedicineCard({
  brandName,
  genericName,
  strength,
  manufacturer,
  dosageForm,
  safetyNote,
  isFavorite,
  onPress,
}: PremiumMedicineCardProps) {
  const handlePress = () => {
    triggerSelectionHaptic();
    onPress?.();
  };

  return (
    <Pressable onPress={handlePress}>
      {({ pressed }) => (
        <View
          className="overflow-hidden rounded-[22px] border border-border bg-surface p-4"
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
            <View className="flex-1 pr-3">
              <View className="mb-3 flex-row items-center gap-2">
                <View className="h-9 w-9 items-center justify-center rounded-2xl bg-mint-soft">
                  <Pill size={18} color="#2BC97A" strokeWidth={1.6} />
                </View>

                <View className="rounded-pill bg-surface-muted px-3 py-1">
                  <Text className="font-bodySemi text-[11px] uppercase tracking-[1.4px] text-text-muted">
                    {dosageForm}
                  </Text>
                </View>

                {isFavorite ? (
                  <View className="rounded-pill bg-mint-soft px-3 py-1">
                    <Text className="font-bodySemi text-[11px] uppercase tracking-[1.4px] text-mint">
                      Saved
                    </Text>
                  </View>
                ) : null}
              </View>

              <Text className="font-heading text-[22px] leading-7 text-text-primary">
                {brandName}
              </Text>

              <Text className="mt-1 font-bodySemi text-[14px] leading-5 text-text-secondary">
                {genericName}
              </Text>

              <View className="mt-4 flex-row items-center gap-2">
                <View className="rounded-xl bg-accent-primarySoft px-3 py-2">
                  <Text className="font-bodySemi text-[13px] text-accent-primary">
                    {strength}
                  </Text>
                </View>

                <Text className="flex-1 font-body text-[13px] text-text-muted">
                  {manufacturer}
                </Text>
              </View>
            </View>

            <ChevronRight size={20} color="#B8C5E6" strokeWidth={1.5} />
          </View>

          {safetyNote ? (
            <View className="mt-4 flex-row items-start gap-2 rounded-2xl bg-clinical-amberSoft p-3">
              <AlertTriangle size={16} color="#FFA01D" strokeWidth={1.6} />
              <Text className="flex-1 font-body text-[13px] leading-5 text-text-secondary">
                {safetyNote}
              </Text>
            </View>
          ) : (
            <View className="mt-4 flex-row items-center gap-2">
              <ShieldCheck size={15} color="#2BC97A" strokeWidth={1.6} />
              <Text className="font-bodySemi text-[12px] text-clinical-teal">
                Tap for indications, dose, contraindications, pregnancy safety
              </Text>
            </View>
          )}
        </View>
      )}
    </Pressable>
  );
}
