import { StatusBar } from "expo-status-bar";
import type { ReactNode } from "react";
import { Platform, View, type ViewStyle } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type ClinicalShellProps = {
  children: ReactNode;
  padded?: boolean;
};

export function ClinicalShell({ children, padded = true }: ClinicalShellProps) {
  const webFrame =
    Platform.OS === "web"
      ? ({
          width: "100%" as const,
          maxWidth: 430,
          alignSelf: "center" as const,
          minHeight: "100%" as const,
          shadowColor: "#182456",
          shadowOffset: { width: 0, height: 18 },
          shadowOpacity: 0.08,
          shadowRadius: 42,
        } satisfies ViewStyle)
      : undefined;

  return (
    <View className="flex-1 overflow-hidden bg-background">
      <StatusBar style="dark" backgroundColor="#EEF1F8" />
      <View style={webFrame} className="flex-1 bg-background">
        <SafeAreaView className="flex-1">
          <View className={padded ? "flex-1 px-5 pt-2" : "flex-1"}>
            {children}
          </View>
        </SafeAreaView>
      </View>
    </View>
  );
}
