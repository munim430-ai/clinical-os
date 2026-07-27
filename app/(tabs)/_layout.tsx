import Icons from "@/components/IconLibraryFixed";
import { triggerImpactHaptic } from "@/lib/clinical-haptics";
import { useRxStore } from "@/lib/rx-store";
import type { BottomTabBarButtonProps } from "@react-navigation/bottom-tabs";
import { BlurView } from "expo-blur";
import { Tabs } from "expo-router";
import { Grid2x2, LayoutGrid, PenLine, Users } from "lucide-react-native";
import { MotiView } from "moti";
import { Pressable, StyleSheet, View } from "react-native";

export const unstable_settings = {
  initialRouteName: "home/index",
};

const LIME = "#C8F53C";
const INACTIVE = "#505058";

function TabIcon({
  icon,
  focused,
}: {
  icon: React.ReactNode;
  focused: boolean;
}) {
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

function PrescribeFabButton(props: BottomTabBarButtonProps) {
  const hasDraft = useRxStore(
    (s) => s.patient.name.length > 0 || s.medicines.length > 0,
  );

  return (
    <Pressable
      {...props}
      onPress={(e) => {
        triggerImpactHaptic("medium");
        props.onPress?.(e);
      }}
      className="flex-1 items-center"
    >
      <View style={{ marginTop: -28 }}>
        <MotiView
          animate={{ scale: hasDraft ? [1, 1.06, 1] : 1 }}
          transition={{
            type: "timing",
            duration: 1400,
            loop: hasDraft,
          }}
          className="h-16 w-16 items-center justify-center rounded-full bg-accent-primary shadow-fabShadow"
          accessibilityRole="button"
          accessibilityLabel="Prescribe"
        >
          <PenLine size={26} color="#0C0C0E" strokeWidth={2} />
        </MotiView>
      </View>
    </Pressable>
  );
}

export default function TabLayout() {
  const iconSize = 22;

  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          backgroundColor: "rgba(12,12,14,0.92)",
          borderTopColor: "rgba(255,255,255,0.06)",
          borderTopWidth: 1,
          height: 72,
          paddingBottom: 14,
          paddingTop: 8,
        },
        tabBarBackground: () => (
          <BlurView
            intensity={40}
            tint="dark"
            style={StyleSheet.absoluteFillObject}
          />
        ),
        tabBarActiveTintColor: LIME,
        tabBarInactiveTintColor: INACTIVE,
        tabBarLabelStyle: {
          fontSize: 10,
          fontFamily: "Inter_400Regular",
          marginTop: -2,
        },
        headerStyle: { backgroundColor: "#0C0C0E" },
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
                <LayoutGrid
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
        name="prescribe/index"
        options={{
          title: "",
          tabBarLabelStyle: { height: 0 },
          tabBarButton: (props) => <PrescribeFabButton {...props} />,
        }}
      />
      <Tabs.Screen
        name="patients/index"
        options={{
          title: "Patients",
          tabBarIcon: ({ focused }) => (
            <TabIcon
              focused={focused}
              icon={
                <Users
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
        name="more/index"
        options={{
          title: "More",
          tabBarIcon: ({ focused }) => (
            <TabIcon
              focused={focused}
              icon={
                <Grid2x2
                  size={iconSize}
                  color={focused ? LIME : INACTIVE}
                  strokeWidth={focused ? 2 : 1.6}
                />
              }
            />
          ),
        }}
      />

      {/* Hidden from the tab bar, still reachable from the "More" bento grid */}
      <Tabs.Screen
        name="gp/index"
        options={{ href: null, title: "GP Master" }}
      />
      <Tabs.Screen name="er/index" options={{ href: null, title: "ER" }} />
      <Tabs.Screen
        name="wallet/index"
        options={{ href: null, title: "Wallet" }}
      />
      <Tabs.Screen
        name="profile/index"
        options={{ href: null, title: "Profile" }}
      />
    </Tabs>
  );
}
