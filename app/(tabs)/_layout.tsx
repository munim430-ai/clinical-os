import { View } from "react-native";
import { Tabs } from "expo-router";
import Icons from "@/components/IconLibraryFixed";
import { Wallet, House } from "lucide-react";

export const unstable_settings = {
  initialRouteName: "home/index",
};

const LIME = "#C8F53C";
const INACTIVE = "#505058";
const TAB_BG = "#0C0C0E";

function TabIcon({
  icon,
  focused,
}: { icon: React.ReactNode; focused: boolean }) {
  return (
    <View className="items-center gap-1">
      {icon}
      {focused && (
        <View
          style={{
            width: 4,
            height: 4,
            borderRadius: 2,
            backgroundColor: LIME,
          }}
        />
      )}
    </View>
  );
}

export default function TabLayout() {
  const iconSize = 22;

  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          backgroundColor: TAB_BG,
          borderTopColor: "rgba(255,255,255,0.06)",
          borderTopWidth: 1,
          height: 64,
          paddingBottom: 10,
          paddingTop: 6,
        },
        tabBarActiveTintColor: LIME,
        tabBarInactiveTintColor: INACTIVE,
        tabBarLabelStyle: {
          fontSize: 11,
          fontFamily: "Inter_400Regular",
          marginTop: -2,
        },
        headerStyle: { backgroundColor: TAB_BG },
        headerTintColor: "#F2F2F2",
        headerTitleStyle: { fontFamily: "Inter_600SemiBold", fontSize: 17 },
        headerShadowVisible: false,
      }}
    >
      <Tabs.Screen
        name="home/index"
        options={{
          title: "Home",
          tabBarIcon: ({ focused }) => (
            <TabIcon
              focused={focused}
              icon={
                <House
                  size={iconSize}
                  color={focused ? LIME : INACTIVE}
                  strokeWidth={focused ? 2 : 1.6}
                />
              }
            />
          ),
        }}
      />
      <Tabs.Screen
        name="gp/index"
        options={{
          title: "GP",
          tabBarIcon: ({ focused }) => (
            <TabIcon
              focused={focused}
              icon={
                <Icons.Protocol
                  size={iconSize}
                  color={focused ? LIME : INACTIVE}
                />
              }
            />
          ),
        }}
      />
      <Tabs.Screen
        name="dims/index"
        options={{
          title: "DIMS",
          tabBarIcon: ({ focused }) => (
            <TabIcon
              focused={focused}
              icon={
                <Icons.Drug size={iconSize} color={focused ? LIME : INACTIVE} />
              }
            />
          ),
        }}
      />
      <Tabs.Screen
        name="er/index"
        options={{
          title: "ER",
          tabBarIcon: ({ focused }) => (
            <TabIcon
              focused={focused}
              icon={
                <Icons.ER size={iconSize} color={focused ? LIME : INACTIVE} />
              }
            />
          ),
        }}
      />
      <Tabs.Screen
        name="wallet/index"
        options={{
          title: "Wallet",
          tabBarIcon: ({ focused }) => (
            <TabIcon
              focused={focused}
              icon={
                <Wallet
                  size={iconSize}
                  color={focused ? LIME : INACTIVE}
                  strokeWidth={focused ? 2 : 1.6}
                />
              }
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile/index"
        options={{
          title: "Profile",
          tabBarIcon: ({ focused }) => (
            <TabIcon
              focused={focused}
              icon={
                <Icons.Settings
                  size={iconSize}
                  color={focused ? LIME : INACTIVE}
                />
              }
            />
          ),
        }}
      />
    </Tabs>
  );
}
