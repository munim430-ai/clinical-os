import { CureCurveTabBar } from "@/components/navigation/CureCurveTabBar";
import { Tabs } from "expo-router";

export const unstable_settings = {
  initialRouteName: "home/index",
};

export default function TabLayout() {
  return (
    <Tabs
      tabBar={(props) => <CureCurveTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen name="home" options={{ title: "Home" }} />
      <Tabs.Screen name="dims" options={{ title: "DIMS" }} />
      <Tabs.Screen name="gp" options={{ title: "GP Master" }} />
      <Tabs.Screen name="lab" options={{ title: "Lab Report" }} />
      <Tabs.Screen name="profile" options={{ title: "Profile" }} />
    </Tabs>
  );
}
