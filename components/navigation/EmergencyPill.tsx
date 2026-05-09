import { triggerEmergencyHaptic } from "@/lib/clinical-haptics";
import { getPersona } from "@/lib/persona";
import { router } from "expo-router";
import { Siren } from "lucide-react-native";
import { useEffect, useRef } from "react";
import {
  Animated,
  Easing,
  Text,
  TouchableOpacity,
  View,
  type ViewStyle,
} from "react-native";

export function EmergencyPill({ compact = false }: { compact?: boolean }) {
  const pulse = useRef(new Animated.Value(0)).current;
  const persona = getPersona();
  const shouldPulse = persona === "gp" || persona === "intern";

  useEffect(() => {
    if (!shouldPulse) {
      pulse.stopAnimation();
      pulse.setValue(0);
      return;
    }

    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1,
          duration: 950,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 0,
          duration: 950,
          easing: Easing.in(Easing.quad),
          useNativeDriver: true,
        }),
      ]),
    );
    animation.start();
    return () => animation.stop();
  }, [pulse, shouldPulse]);

  const pulseStyle: Animated.WithAnimatedObject<ViewStyle> = {
    opacity: pulse.interpolate({
      inputRange: [0, 1],
      outputRange: [0.18, 0.55],
    }),
    transform: [
      {
        scale: pulse.interpolate({
          inputRange: [0, 1],
          outputRange: [1, 1.22],
        }),
      },
    ],
  };

  return (
    <View className="relative">
      {shouldPulse ? (
        <Animated.View
          pointerEvents="none"
          className="absolute inset-0 rounded-full bg-clinical-red"
          style={pulseStyle}
        />
      ) : null}
      <TouchableOpacity
        accessibilityLabel="Open emergency calculator"
        accessibilityRole="button"
        activeOpacity={0.78}
        className={[
          "flex-row items-center justify-center rounded-full bg-clinical-red",
          compact ? "h-11 w-14" : "h-11 gap-2 px-4",
        ].join(" ")}
        onPress={() => {
          triggerEmergencyHaptic();
          router.push("/er");
        }}
        style={{
          shadowColor: "#FF3B30",
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.24,
          shadowRadius: 18,
          elevation: 12,
        }}
      >
        <Siren color="#FFFFFF" size={18} strokeWidth={2.1} />
        {compact ? null : (
          <Text className="font-bodySemi text-[13px] text-text-inverse">
            ER
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );
}
