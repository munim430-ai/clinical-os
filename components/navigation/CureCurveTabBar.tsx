import { triggerSelectionHaptic } from "@/lib/clinical-haptics";
import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { router, usePathname } from "expo-router";
import {
  FlaskConical,
  Home,
  Pill,
  Stethoscope,
  User,
} from "lucide-react-native";
import { Platform, Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const PRIMARY = "#2470FF";
const INACTIVE = "#B8C5E6";
const INK = "#182456";

// Fixed order — independent of Expo Router's filesystem discovery order.
const TABS = [
  { key: "home",    label: "Home",    Icon: Home,         href: "/home",    isFab: false },
  { key: "dims",    label: "DIMS",    Icon: Pill,         href: "/dims",    isFab: false },
  { key: "gp",      label: "GP",      Icon: Stethoscope,  href: "/gp",      isFab: true  },
  { key: "lab",     label: "Lab",     Icon: FlaskConical, href: "/lab",     isFab: false },
  { key: "profile", label: "Profile", Icon: User,         href: "/profile", isFab: false },
] as const;

export function CureCurveTabBar(_props: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const pathname = usePathname();

  return (
    <View
      className="absolute bottom-0 left-0 right-0 px-4"
      style={{
        paddingBottom: Math.max(insets.bottom, 10),
        paddingTop: 8,
        alignSelf: "center",
        ...(Platform.OS === "web"
          ? { maxWidth: 430, marginHorizontal: "auto" }
          : null),
      }}
    >
      <View
        className="overflow-hidden rounded-t-[28px] border border-surface-glassBorder bg-surface-glass px-2"
        style={{
          shadowColor: "#182456",
          shadowOffset: { width: 0, height: -8 },
          shadowOpacity: 0.1,
          shadowRadius: 24,
          elevation: 18,
        }}
      >
        <View className="h-[64px] flex-row items-center justify-between">
          {TABS.map(({ key, label, Icon, href, isFab }) => {
            const focused = pathname === href || pathname.startsWith(href + "/") || pathname.includes(`/(tabs)${href}`);

            const onPress = () => {
              triggerSelectionHaptic();
              router.navigate(href as any);
            };

            if (isFab) {
              return (
                <Pressable
                  key={key}
                  accessibilityLabel="Open GP Master"
                  accessibilityRole="button"
                  accessibilityState={focused ? { selected: true } : {}}
                  onPress={onPress}
                  className="-mt-8 h-[68px] w-[68px] items-center justify-center rounded-full border-[5px] border-background bg-accent-primary"
                  style={{
                    shadowColor: PRIMARY,
                    shadowOffset: { width: 0, height: 12 },
                    shadowOpacity: 0.35,
                    shadowRadius: 28,
                    elevation: 18,
                  }}
                >
                  <Icon color="#FFFFFF" size={29} strokeWidth={1.8} />
                </Pressable>
              );
            }

            return (
              <Pressable
                key={key}
                accessibilityLabel={label}
                accessibilityRole="button"
                accessibilityState={focused ? { selected: true } : {}}
                onPress={onPress}
                className="min-h-[52px] flex-1 items-center justify-center gap-1"
              >
                <Icon
                  color={focused ? PRIMARY : INACTIVE}
                  size={22}
                  strokeWidth={1.8}
                />
                <Text
                  className="font-bodySemi text-[11px]"
                  style={{ color: focused ? INK : INACTIVE }}
                >
                  {label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>
    </View>
  );
}
