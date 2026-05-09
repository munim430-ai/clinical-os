import { triggerSelectionHaptic } from "@/lib/clinical-haptics";
import { getPersona } from "@/lib/persona";
import { router } from "expo-router";
import {
  BookOpen,
  Clock,
  Database,
  HelpCircle,
  History,
  LogOut,
  Search,
  Settings,
  ShieldCheck,
  User,
  WalletCards,
} from "lucide-react-native";
import { Pressable, Text, TouchableOpacity, View } from "react-native";

const ITEMS = [
  { label: "Doctor Wallet", route: "/wallet", Icon: WalletCards },
  { label: "Saved", route: "/(tabs)/profile", Icon: BookOpen },
  { label: "History", route: "/(tabs)/profile", Icon: History },
  { label: "Anonymous Case Log", route: "/(tabs)/profile", Icon: Database },
  { label: "Protocols Library", route: "/(tabs)/gp", Icon: Search },
  { label: "Settings", route: "/(tabs)/profile", Icon: Settings },
  { label: "Data & Privacy", route: "/legal/privacy", Icon: ShieldCheck },
  { label: "FAQ", route: "/(tabs)/profile", Icon: HelpCircle },
  { label: "About", route: "/(tabs)/profile", Icon: Clock },
];

export default function DrawerScreen() {
  const persona = getPersona();

  function navigate(route: string) {
    triggerSelectionHaptic();
    router.replace(route as never);
  }

  return (
    <View className="flex-1 flex-row bg-black/40">
      <View className="h-full w-[84%] border-r border-surface-glassBorder bg-background px-5 pb-6 pt-16">
        <View className="mb-7 flex-row items-center gap-3">
          <View className="h-14 w-14 items-center justify-center rounded-full border border-surface-glassBorder bg-accent-primarySoft">
            <User color="#2470FF" size={28} strokeWidth={1.8} />
          </View>
          <View>
            <Text className="font-headingSemi text-[20px] text-text-primary">
              Clinical OS
            </Text>
            <Text className="mt-1 self-start rounded-full bg-mint-soft px-3 py-1 font-bodySemi text-[11px] uppercase text-mint">
              {persona}
            </Text>
          </View>
        </View>

        <View className="gap-2">
          {ITEMS.map(({ label, route, Icon }) => (
            <TouchableOpacity
              key={label}
              onPress={() => navigate(route)}
              className="min-h-[50px] flex-row items-center gap-3 rounded-2xl px-3"
              activeOpacity={0.78}
              accessibilityRole="button"
              accessibilityLabel={label}
            >
              <View className="h-9 w-9 items-center justify-center rounded-xl border border-border-soft bg-surface-muted">
                <Icon color="#2470FF" size={18} strokeWidth={1.8} />
              </View>
              <Text className="font-bodySemi text-[14px] text-text-primary">
                {label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          className="mt-auto min-h-[50px] flex-row items-center gap-3 rounded-2xl px-3"
          activeOpacity={0.78}
          accessibilityRole="button"
          accessibilityLabel="Log out"
        >
          <View className="h-9 w-9 items-center justify-center rounded-xl bg-clinical-redSoft">
            <LogOut color="#FF3B30" size={18} strokeWidth={1.8} />
          </View>
          <Text className="font-bodySemi text-[14px] text-clinical-red">
            Log Out
          </Text>
        </TouchableOpacity>
      </View>
      <Pressable
        className="flex-1"
        onPress={() => router.back()}
        accessibilityLabel="Close drawer"
      />
    </View>
  );
}
