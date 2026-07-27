import { MotiView } from "moti";
import { type ReactNode, useState } from "react";
import { Pressable, type PressableProps } from "react-native";

interface PressableScaleProps extends PressableProps {
  children: ReactNode;
  scaleTo?: number;
}

export function PressableScale({
  children,
  scaleTo = 0.96,
  onPressIn,
  onPressOut,
  ...rest
}: PressableScaleProps) {
  const [pressed, setPressed] = useState(false);

  return (
    <Pressable
      {...rest}
      onPressIn={(e) => {
        setPressed(true);
        onPressIn?.(e);
      }}
      onPressOut={(e) => {
        setPressed(false);
        onPressOut?.(e);
      }}
    >
      <MotiView
        animate={{ scale: pressed ? scaleTo : 1 }}
        transition={{ type: "timing", duration: 100 }}
      >
        {children}
      </MotiView>
    </Pressable>
  );
}
