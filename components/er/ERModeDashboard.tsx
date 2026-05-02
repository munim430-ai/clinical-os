import { Pressable, Text, View } from "react-native";
import { Siren, ArrowLeft, Search } from "lucide-react-native";
import { triggerAlertHaptic, triggerSelectionHaptic } from "@/lib/clinical-haptics";

type ERModeDashboardProps = {
  title: string;
  criticalDose: string;
  route: string;
  contraindication?: string;
  onBack?: () => void;
  onSearch?: () => void;
};

export function ERModeDashboard({ title, criticalDose, route, contraindication, onBack, onSearch }: ERModeDashboardProps) {
  return (
    <View className="flex-1 bg-ink-950 px-4 pb-8 pt-3">
      <View className="flex-row items-center justify-between">
        <Pressable
          onPress={() => {
            triggerSelectionHaptic();
            onBack?.();
          }}
          className="h-12 w-12 items-center justify-center rounded-2xl border border-border bg-ink-800"
        >
          <ArrowLeft size={21} color="#F5F5F7" strokeWidth={1.7} />
        </Pressable>

        <View className="flex-row items-center gap-2 rounded-pill border border-border-red bg-clinical-redSoft px-4 py-2">
          <Siren size={17} color="#FF453A" strokeWidth={1.8} />
          <Text className="font-headingBold text-[13px] uppercase tracking-[1.8px] text-clinical-red">ER Mode</Text>
        </View>

        <Pressable
          onPress={() => {
            triggerSelectionHaptic();
            onSearch?.();
          }}
          className="h-12 w-12 items-center justify-center rounded-2xl border border-border bg-ink-800"
        >
          <Search size={20} color="#F5F5F7" strokeWidth={1.7} />
        </Pressable>
      </View>

      <View className="mt-8 rounded-[32px] border border-border-red bg-clinical-redSoft p-5">
        <Text className="font-bodySemi text-[12px] uppercase tracking-[1.8px] text-clinical-red">Critical dosage</Text>
        <Text className="mt-3 font-heading text-[42px] leading-[48px] text-text-primary">{criticalDose}</Text>
        <Text className="mt-3 font-headingBold text-[22px] leading-7 text-mint">{route}</Text>
      </View>

      <View className="mt-5 rounded-clinical border border-border bg-ink-800 p-5">
        <Text className="font-headingBold text-[24px] leading-8 text-text-primary">{title}</Text>
        {contraindication ? (
          <Text className="mt-4 font-bodySemi text-[18px] leading-7 text-clinical-red">{contraindication}</Text>
        ) : null}
      </View>

      <Pressable
        onPress={triggerAlertHaptic}
        className="mt-auto min-h-[64px] items-center justify-center rounded-clinical border border-border-red bg-clinical-red"
      >
        <Text className="font-headingBold text-[18px] uppercase tracking-[1.6px] text-text-primary">Confirm Critical Action</Text>
      </Pressable>
    </View>
  );
}
