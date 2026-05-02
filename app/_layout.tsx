import "./global.css";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { ThemeProvider } from "@react-navigation/native";
import { SplashScreen, Stack, router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as React from "react";
import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { PortalHost } from "@/components/primitives/portal";
import { DatabaseProvider } from "@/db/provider";
import { setAndroidNavigationBar } from "@/lib/android-navigation-bar";
import { DARK_THEME, LIGHT_THEME } from "@/lib/constants";
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  useFonts,
} from "@expo-google-fonts/inter";
import { useFrameworkReady } from "@/hooks/useFrameworkReady";
import { isOnboarded } from "@/lib/persona";
import { useColorScheme } from "@/lib/useColorScheme";

export { ErrorBoundary } from "expo-router";

export const unstable_settings = {
  initialRouteName: "(tabs)",
};

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });
  const { isDarkColorScheme } = useColorScheme();
  useFrameworkReady();

  useEffect(() => {
    setAndroidNavigationBar(isDarkColorScheme ? "dark" : "light");
  }, [isDarkColorScheme]);

  useEffect(() => {
    if (!loaded) return;
    SplashScreen.hideAsync();
    if (!isOnboarded()) {
      router.replace("/onboarding");
    }
  }, [loaded]);

  return (
    <DatabaseProvider>
      <ThemeProvider value={isDarkColorScheme ? DARK_THEME : LIGHT_THEME}>
        <StatusBar
          style={isDarkColorScheme ? "light" : "dark"}
          backgroundColor={isDarkColorScheme ? "#000000" : "#F5F7FA"}
        />
        <GestureHandlerRootView style={{ flex: 1 }}>
          <BottomSheetModalProvider>
            <Stack>
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="onboarding" options={{ headerShown: false, animation: "fade" }} />
              <Stack.Screen name="dims/brand/[id]" options={{ headerShown: false }} />
              <Stack.Screen name="dims/generic/[id]" options={{ headerShown: false }} />
              <Stack.Screen name="gp/[system]" options={{ headerShown: false }} />
              <Stack.Screen name="gp/condition/[id]" options={{ headerShown: false }} />
              <Stack.Screen name="gp/quiz" options={{ headerShown: false }} />
            </Stack>
          </BottomSheetModalProvider>
        </GestureHandlerRootView>
      </ThemeProvider>
      <PortalHost />
    </DatabaseProvider>
  );
}
