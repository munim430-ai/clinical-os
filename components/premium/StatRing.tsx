import { Canvas, Path, Skia } from "@shopify/react-native-skia";
import { useEffect } from "react";
import { Text, View } from "react-native";
import {
  Easing,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

interface StatRingProps {
  percent: number; // 0-100
  size?: number;
  strokeWidth?: number;
  color?: string;
  trackColor?: string;
  label?: string;
}

export function StatRing({
  percent,
  size = 80,
  strokeWidth = 8,
  color = "#C8F53C",
  trackColor = "rgba(255,255,255,0.08)",
  label,
}: StatRingProps) {
  const clamped = Math.max(0, Math.min(100, percent));
  const progress = useSharedValue(0);
  const radius = (size - strokeWidth) / 2;
  const center = size / 2;

  useEffect(() => {
    progress.value = withTiming(clamped / 100, {
      duration: 900,
      easing: Easing.out(Easing.cubic),
    });
  }, [clamped, progress]);

  const trackPath = Skia.Path.Make();
  trackPath.addCircle(center, center, radius);

  const animatedPath = useDerivedValue(() => {
    const path = Skia.Path.Make();
    path.addArc(
      Skia.XYWHRect(
        strokeWidth / 2,
        strokeWidth / 2,
        size - strokeWidth,
        size - strokeWidth,
      ),
      -90,
      360 * progress.value,
    );
    return path;
  });

  return (
    <View
      style={{ width: size, height: size }}
      className="items-center justify-center"
    >
      <Canvas style={{ width: size, height: size, position: "absolute" }}>
        <Path
          path={trackPath}
          style="stroke"
          strokeWidth={strokeWidth}
          color={trackColor}
          strokeCap="round"
        />
        <Path
          path={animatedPath}
          style="stroke"
          strokeWidth={strokeWidth}
          color={color}
          strokeCap="round"
        />
      </Canvas>
      <Text className="font-heading text-[18px] text-text-primary">
        {Math.round(clamped)}%
      </Text>
      {label ? (
        <Text className="font-body text-[9px] text-text-tertiary">{label}</Text>
      ) : null}
    </View>
  );
}
