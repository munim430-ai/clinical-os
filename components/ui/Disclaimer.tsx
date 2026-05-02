import { View, Text } from "react-native";
import { AlertTriangle } from "lucide-react-native";

export function Disclaimer() {
  return (
    <View className="mx-4 mb-4 flex-row items-start bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-3 gap-2">
      <AlertTriangle size={14} color="#EAB308" style={{ marginTop: 1 }} />
      <Text className="text-yellow-500/80 text-xs flex-1 leading-relaxed">
        For clinical reference only. Always apply independent clinical judgment. Not a substitute for professional medical advice.
      </Text>
    </View>
  );
}
