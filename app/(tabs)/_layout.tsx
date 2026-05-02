import { Tabs } from "expo-router";
import { BookOpen, Pill, Zap, User } from "lucide-react-native";

export const unstable_settings = {
  initialRouteName: "gp/index",
};

export default function TabLayout() {
  const iconSize = 22;
  const activeColor = "#00C896";
  const inactiveColor = "#555555";

  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          backgroundColor: "#0A0A0A",
          borderTopColor: "#1A1A1A",
          borderTopWidth: 1,
          height: 60,
          paddingBottom: 8,
        },
        tabBarActiveTintColor: activeColor,
        tabBarInactiveTintColor: inactiveColor,
        tabBarLabelStyle: { fontSize: 11, fontFamily: "Inter_400Regular" },
        headerStyle: { backgroundColor: "#000000" },
        headerTintColor: "#F2F2F2",
        headerTitleStyle: { fontFamily: "Inter_600SemiBold", fontSize: 17 },
        headerShadowVisible: false,
      }}
    >
      <Tabs.Screen
        name="gp/index"
        options={{
          title: "GP Master",
          tabBarIcon: ({ focused }) => (
            <BookOpen size={iconSize} color={focused ? activeColor : inactiveColor} />
          ),
        }}
      />
      <Tabs.Screen
        name="dims/index"
        options={{
          title: "DIMS",
          tabBarIcon: ({ focused }) => (
            <Pill size={iconSize} color={focused ? activeColor : inactiveColor} />
          ),
        }}
      />
      <Tabs.Screen
        name="er/index"
        options={{
          title: "ER",
          tabBarIcon: ({ focused }) => (
            <Zap size={iconSize} color={focused ? activeColor : inactiveColor} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile/index"
        options={{
          title: "Profile",
          tabBarIcon: ({ focused }) => (
            <User size={iconSize} color={focused ? activeColor : inactiveColor} />
          ),
        }}
      />
    </Tabs>
  );
}
