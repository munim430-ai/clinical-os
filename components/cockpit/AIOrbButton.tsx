import { Pressable, Text, View } from "react-native";
import { Sparkles } from "lucide-react-native";
import { MotiView } from "moti";
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
          <MotiView
            from={{ scale: 1, opacity: 0.92 }}
            animate={{ scale: active ? [1, 1.035, 1] : pressed ? 0.98 : [1, 1.025, 1], opacity: 1 }}
            transition={{
              type: "timing",
              duration: active ? 1800 : 2200,
              loop: !pressed,
            }}
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
          </MotiView>
        )}
      </Pressable>
    </View>
  );
}
