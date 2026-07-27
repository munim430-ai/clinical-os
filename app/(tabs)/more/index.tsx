import { BrandedFooter } from "@/components/premium/BrandedFooter";
import { triggerSelectionHaptic } from "@/lib/clinical-haptics";
import { router } from "expo-router";
import {
  Archive,
  ChevronRight,
  FileSignature,
  Info,
  Settings as SettingsIcon,
  Siren,
  Stethoscope,
  User,
  Wallet,
} from "lucide-react-native";
import { MotiView } from "moti";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

interface MenuItem {
  icon: React.ComponentType<{
    size?: number;
    color?: string;
    strokeWidth?: number;
  }>;
  color: string;
  title: string;
  subtitle: string;
  route: string;
}

const ITEMS: MenuItem[] = [
  {
    icon: Stethoscope,
    color: "#C8F53C",
    title: "GP Master",
    subtitle: "Protocols, conditions, OSCE",
    route: "/(tabs)/gp",
  },
  {
    icon: Siren,
    color: "#FF453A",
    title: "ER Mode",
    subtitle: "Emergency weight-based dosing",
    route: "/(tabs)/er",
  },
  {
    icon: Wallet,
    color: "#FFD60A",
    title: "Wallet & Earnings",
    subtitle: "Multi-clinic settlement",
    route: "/(tabs)/wallet",
  },
  {
    icon: User,
    color: "#64D2FF",
    title: "Doctor Profile & BM&DC",
    subtitle: "Credentials and verification",
    route: "/profile/edit",
  },
  {
    icon: FileSignature,
    color: "#00D7B5",
    title: "Letterhead Studio",
    subtitle: "Customize your Rx letterhead",
    route: "/profile/letterhead",
  },
  {
    icon: Archive,
    color: "#7B2FBE",
    title: "Backup & Restore",
    subtitle: "Versioned data snapshots",
    route: "/settings/backup",
  },
  {
    icon: SettingsIcon,
    color: "#B8B8BE",
    title: "App Settings",
    subtitle: "Preferences and haptics",
    route: "/settings",
  },
  {
    icon: Info,
    color: "#7A7A80",
    title: "About",
    subtitle: "Version, credits, license",
    route: "/settings/about",
  },
];

function MenuCard({ item, index }: { item: MenuItem; index: number }) {
  const Icon = item.icon;
  return (
    <MotiView
      from={{ opacity: 0, translateY: 8 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ type: "timing", duration: 250, delay: index * 50 }}
      className="mb-3 w-[48%]"
    >
      <TouchableOpacity
        onPress={() => {
          triggerSelectionHaptic();
          router.push(item.route as never);
        }}
        activeOpacity={0.75}
        className="rounded-clinical border border-border bg-surface p-4"
        accessibilityRole="button"
      >
        <View
          className="mb-3 h-11 w-11 items-center justify-center rounded-2xl"
          style={{ backgroundColor: `${item.color}22` }}
        >
          <Icon size={20} color={item.color} strokeWidth={1.8} />
        </View>
        <Text
          className="font-bodySemi text-[13.5px] text-text-primary"
          numberOfLines={2}
        >
          {item.title}
        </Text>
        <Text
          className="mt-1 font-body text-[11px] leading-4 text-text-tertiary"
          numberOfLines={2}
        >
          {item.subtitle}
        </Text>
        <View className="mt-2 flex-row justify-end">
          <ChevronRight size={14} color="#4A4A4F" />
        </View>
      </TouchableOpacity>
    </MotiView>
  );
}

export default function MoreScreen() {
  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
      showsVerticalScrollIndicator={false}
    >
      <Text className="mb-1 font-heading text-[24px] text-text-primary">
        More
      </Text>
      <Text className="mb-5 font-body text-[12px] text-text-tertiary">
        Clinical tools, practice management, and settings
      </Text>

      <View className="flex-row flex-wrap justify-between">
        {ITEMS.map((item, index) => (
          <MenuCard key={item.route} item={item} index={index} />
        ))}
      </View>

      <BrandedFooter />
    </ScrollView>
  );
}
