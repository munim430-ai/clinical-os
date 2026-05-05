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
      <StatusBar style="light" backgroundColor="#0C0C0E" />

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
        <Group opacity={0.5}>
          {/* Purple ambient — top right */}
          <Circle cx={340} cy={80} r={200} color="#7B2FBE">
            <BlurMask blur={100} style="normal" />
          </Circle>
          {/* Lime ambient — bottom left */}
          <Circle cx={60} cy={820} r={220} color="#C8F53C">
            <BlurMask blur={130} style="normal" />
          </Circle>
          {/* Magenta mid — center */}
          <Circle cx={200} cy={420} r={160} color="#E91E8C">
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
