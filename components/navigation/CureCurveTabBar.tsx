import { triggerSelectionHaptic } from "@/lib/clinical-haptics";
import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
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

const TAB_META: Record<
  string,
  {
    label: string;
    Icon: typeof Home;
  }
> = {
  "home/index": { label: "Home", Icon: Home },
  "dims/index": { label: "DIMS", Icon: Pill },
  "gp/index": { label: "GP", Icon: Stethoscope },
  "lab/index": { label: "Lab", Icon: FlaskConical },
  "profile/index": { label: "Profile", Icon: User },
};

export function CureCurveTabBar({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) {
  const insets = useSafeAreaInsets();

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
          {state.routes.map((route, index) => {
            const meta = TAB_META[route.name];
            const options = descriptors[route.key]?.options ?? {};
            if (!meta) return null;

            const focused = state.index === index;
            const isFab = route.name === "gp/index";
            const Icon = meta.Icon;

            const onPress = () => {
              const event = navigation.emit({
                type: "tabPress",
                target: route.key,
                canPreventDefault: true,
              });
              if (!focused && !event.defaultPrevented) {
                triggerSelectionHaptic();
                navigation.navigate(route.name, route.params);
              }
            };

            if (isFab) {
              return (
                <Pressable
                  key={route.key}
                  accessibilityLabel={
                    options.tabBarAccessibilityLabel ?? "Open GP Master"
                  }
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
                key={route.key}
                accessibilityLabel={
                  options.tabBarAccessibilityLabel ?? meta.label
                }
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
                  {meta.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>
    </View>
  );
}
