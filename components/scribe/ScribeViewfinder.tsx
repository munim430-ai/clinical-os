import { View, Text } from "react-native";
import { ScanLine } from "lucide-react";

type ScribeViewfinderProps = {
  status?: string;
};

export function ScribeViewfinder({ status = "Align prescription or notes inside frame" }: ScribeViewfinderProps) {
  return (
    <View className="flex-1 bg-ink-950">
      <View className="absolute inset-0 bg-ink-950" />

      <View className="flex-1 items-center justify-center px-7">
        <View className="h-[420px] w-full overflow-hidden rounded-[34px] border border-border-mint bg-ink-800/20">
          <View className="absolute left-0 top-0 h-10 w-10 border-l-2 border-t-2 border-mint" />
          <View className="absolute right-0 top-0 h-10 w-10 border-r-2 border-t-2 border-mint" />
          <View className="absolute bottom-0 left-0 h-10 w-10 border-b-2 border-l-2 border-mint" />
          <View className="absolute bottom-0 right-0 h-10 w-10 border-b-2 border-r-2 border-mint" />

          <View
            className="absolute left-6 right-6 h-[2px] rounded-pill bg-mint"
            style={{
              shadowColor: "#B8FFD2",
              shadowOffset: { width: 0, height: 0 },
              shadowOpacity: 0.58,
              shadowRadius: 18,
              elevation: 8,
            }}
          />
        </View>

        <View className="mt-6 flex-row items-center gap-2 rounded-pill border border-border bg-ink-800 px-4 py-3">
          <ScanLine size={16} color="#B8FFD2" strokeWidth={1.6} />
          <Text className="font-bodySemi text-[13px] text-text-secondary">{status}</Text>
        </View>
      </View>
    </View>
  );
}
