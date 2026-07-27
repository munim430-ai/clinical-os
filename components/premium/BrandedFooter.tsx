import { Text, View } from "react-native";

export function BrandedFooter() {
  return (
    <View className="mt-8 flex-row items-center justify-center gap-1.5 pb-2">
      <View className="h-1 w-1 rounded-full bg-accent-primary" />
      <Text className="font-body text-[10px] text-text-disabled">
        Made by Munim @ Keystone
      </Text>
    </View>
  );
}
