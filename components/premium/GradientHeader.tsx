import { Canvas, LinearGradient, Rect, vec } from "@shopify/react-native-skia";
import { type ReactNode, useState } from "react";
import { type LayoutChangeEvent, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface GradientHeaderProps {
  title: string;
  subtitle?: string;
  children?: ReactNode;
  height?: number;
}

export function GradientHeader({
  title,
  subtitle,
  children,
  height = 220,
}: GradientHeaderProps) {
  const insets = useSafeAreaInsets();
  const totalHeight = height + insets.top;
  const [width, setWidth] = useState(0);

  const onLayout = (e: LayoutChangeEvent) =>
    setWidth(e.nativeEvent.layout.width);

  return (
    <View
      onLayout={onLayout}
      style={[
        styles.container,
        { height: totalHeight, paddingTop: insets.top },
      ]}
    >
      <Canvas style={StyleSheet.absoluteFillObject}>
        <Rect x={0} y={0} width={width || 400} height={totalHeight}>
          <LinearGradient
            start={vec(0, 0)}
            end={vec(0, totalHeight)}
            colors={["#0A0A0F", "#0F1924", "#0C0C0E"]}
          />
        </Rect>
      </Canvas>

      {/* decorative circles */}
      <View pointerEvents="none" style={styles.circleOuter} />
      <View pointerEvents="none" style={styles.circleInner} />

      <View className="flex-1 px-5 pb-5">
        <Text className="font-heading text-[26px] leading-tight text-text-primary">
          {title}
        </Text>
        {subtitle ? (
          <Text className="mt-0.5 font-body text-[12px] text-text-secondary">
            {subtitle}
          </Text>
        ) : null}
        {children ? <View className="mt-5 flex-1">{children}</View> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "flex-end",
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    overflow: "hidden",
  },
  circleOuter: {
    position: "absolute",
    bottom: -60,
    right: -60,
    height: 180,
    width: 180,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
  },
  circleInner: {
    position: "absolute",
    bottom: -20,
    right: -20,
    height: 100,
    width: 100,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.07)",
  },
});
