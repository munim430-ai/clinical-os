import { PortalHost } from "@/components/primitives/portal";
import { DatabaseProvider } from "@/db/provider";
import { useFrameworkReady } from "@/hooks/useFrameworkReady";
import { setAndroidNavigationBar } from "@/lib/android-navigation-bar";
import { DARK_THEME } from "@/lib/constants";
import { isOnboarded } from "@/lib/persona";
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  useFonts,
} from "@expo-google-fonts/inter";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { ThemeProvider } from "@react-navigation/native";
import { SplashScreen, Stack, router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as React from "react";
import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "./global.css";

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
  useFrameworkReady();

  useEffect(() => {
    setAndroidNavigationBar("dark");
  }, []);

  useEffect(() => {
    if (!loaded) return;
    SplashScreen.hideAsync();
    if (!isOnboarded()) {
      router.replace("/onboarding");
    }
  }, [loaded]);

  return (
    <DatabaseProvider>
      <ThemeProvider value={DARK_THEME}>
        <StatusBar style="light" backgroundColor="#000000" />
        <GestureHandlerRootView style={{ flex: 1 }}>
          <BottomSheetModalProvider>
            <Stack>
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen
                name="onboarding"
                options={{ headerShown: false, animation: "fade" }}
              />
              <Stack.Screen
                name="dims/brand/[id]"
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="dims/generic"
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="dims/generic/[id]"
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="gp/[system]"
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="gp/condition/[id]"
                options={{ headerShown: false }}
              />
              <Stack.Screen name="gp/quiz" options={{ headerShown: false }} />
              <Stack.Screen name="gp/ecg" options={{ headerShown: false }} />
              <Stack.Screen
                name="gp/ecg/[id]"
                options={{ headerShown: false }}
              />
              <Stack.Screen name="gp/cxr" options={{ headerShown: false }} />
              <Stack.Screen
                name="gp/cxr/[id]"
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="dims/companies"
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="dims/companies/[id]"
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="dims/interactions"
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="legal/privacy"
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="prescription/index"
                options={{ headerShown: false }}
              />
            </Stack>
          </BottomSheetModalProvider>
        </GestureHandlerRootView>
      </ThemeProvider>
      <PortalHost />
    </DatabaseProvider>
  );
}
