import { Pressable, Text, View } from "react-native";
import { Sparkles } from "lucide-react";
import { triggerSelectionHaptic } from "@/lib/clinical-haptics";

type AIOrbButtonProps = {
  label?: string;
  active?: boolean;
  onPress?: () => void;
};

export function AIOrbButton({ label = "Ask Clinical AI", active, onPress }: AIOrbButtonProps) {
  const handlePress = () => {
    triggerSelectionHaptic();
    onPress?.();
  };

  return (
    <View pointerEvents="box-none" className="absolute bottom-6 left-0 right-0 items-center">
      <Pressable onPress={handlePress} hitSlop={10}>
        {({ pressed }) => (
          <View
            className={[
              "h-[54px] min-w-[176px] flex-row items-center justify-center gap-2 rounded-pill border px-5",
              active ? "border-border-mint bg-mint" : "border-border-mint bg-mint-soft",
            ].join(" ")}
            style={{
              shadowColor: "#B8FFD2",
              shadowOffset: { width: 0, height: 0 },
              shadowOpacity: active ? 0.36 : 0.24,
              shadowRadius: active ? 26 : 20,
              elevation: 10,
            }}
          >
            <Sparkles size={17} color={active ? "#050505" : "#B8FFD2"} strokeWidth={1.7} />
            <Text className={active ? "font-bodySemi text-[14px] text-text-inverse" : "font-bodySemi text-[14px] text-mint"}>
              {label}
            </Text>
          </View>
        )}
      </Pressable>
    </View>
  );
}
