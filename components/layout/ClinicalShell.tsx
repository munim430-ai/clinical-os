import type { ReactNode } from "react";
import { View } from "react-native";
import { Canvas, Circle, Group, BlurMask } from "@shopify/react-native-skia";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";

type ClinicalShellProps = {
  children: ReactNode;
  padded?: boolean;
};

export function ClinicalShell({ children, padded = true }: ClinicalShellProps) {
  return (
    <View className="flex-1 bg-ink-950">
      <StatusBar style="light" backgroundColor="#000000" />

      <Canvas
        pointerEvents="none"
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
        }}
      >
        <Group opacity={0.42}>
          <Circle cx={80} cy={110} r={190} color="#053D32">
            <BlurMask blur={80} style="normal" />
          </Circle>
          <Circle cx={360} cy={260} r={240} color="#111827">
            <BlurMask blur={110} style="normal" />
          </Circle>
          <Circle cx={180} cy={820} r={260} color="#041F1A">
            <BlurMask blur={120} style="normal" />
          </Circle>
        </Group>
      </Canvas>

      <SafeAreaView className="flex-1">
        <View className={padded ? "flex-1 px-4 pt-2" : "flex-1"}>{children}</View>
      </SafeAreaView>
    </View>
  );
}
