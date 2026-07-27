import { BrandedFooter } from "@/components/premium/BrandedFooter";
import { getStoredUser, signOut } from "@/lib/auth";
import {
  triggerSelectionHaptic,
  triggerSuccessHaptic,
} from "@/lib/clinical-haptics";
import { getItem, setItem } from "@/lib/storage";
import { router } from "expo-router";
import {
  Archive,
  ArrowLeft,
  ChevronRight,
  Info,
  LogOut,
  Sparkles,
  Trash2,
} from "lucide-react-native";
import { useState } from "react";
import {
  Alert,
  ScrollView,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const HAPTICS_KEY = "settings_haptics_enabled";
const AUTO_BACKUP_KEY = "settings_auto_backup_enabled";

function Row({
  icon: Icon,
  label,
  sub,
  right,
  onPress,
}: {
  icon: React.ComponentType<{
    size?: number;
    color?: string;
    strokeWidth?: number;
  }>;
  label: string;
  sub?: string;
  right?: React.ReactNode;
  onPress?: () => void;
}) {
  const Content = (
    <View className="flex-row items-center gap-3 rounded-clinical border border-border bg-surface p-4">
      <View className="h-9 w-9 items-center justify-center rounded-xl bg-surface-elevated">
        <Icon size={16} color="#B8B8BE" strokeWidth={1.8} />
      </View>
      <View className="flex-1">
        <Text className="font-bodySemi text-[14px] text-text-primary">
          {label}
        </Text>
        {sub ? (
          <Text className="mt-0.5 font-body text-[11.5px] text-text-tertiary">
            {sub}
          </Text>
        ) : null}
      </View>
      {right ?? (onPress ? <ChevronRight size={16} color="#7A7A80" /> : null)}
    </View>
  );

  if (!onPress) return <View className="mb-2.5">{Content}</View>;

  return (
    <TouchableOpacity
      onPress={() => {
        triggerSelectionHaptic();
        onPress();
      }}
      activeOpacity={0.75}
      className="mb-2.5"
    >
      {Content}
    </TouchableOpacity>
  );
}

export default function SettingsScreen() {
  const [haptics, setHaptics] = useState(
    () => getItem<boolean>(HAPTICS_KEY) ?? true,
  );
  const [autoBackup, setAutoBackup] = useState(
    () => getItem<boolean>(AUTO_BACKUP_KEY) ?? false,
  );
  const storedUser = getStoredUser();

  function handleClearCache() {
    Alert.alert(
      "Clear cache",
      "This clears temporary app data. Your patients and prescriptions are not affected.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear",
          style: "destructive",
          onPress: () => {
            triggerSuccessHaptic();
            Alert.alert("Cache cleared");
          },
        },
      ],
    );
  }

  return (
    <View className="flex-1 bg-background">
      <View className="flex-row items-center gap-3 px-4 pb-3 pt-2">
        <TouchableOpacity
          onPress={() => {
            triggerSelectionHaptic();
            router.back();
          }}
          className="h-10 w-10 items-center justify-center rounded-2xl border border-border bg-surface"
        >
          <ArrowLeft size={19} color="#F5F5F7" strokeWidth={1.7} />
        </TouchableOpacity>
        <Text className="font-heading text-[19px] text-text-primary">
          Settings
        </Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
        <Text className="mb-2 font-bodySemi text-[11px] uppercase tracking-widest text-text-tertiary">
          Preferences
        </Text>
        <Row
          icon={Sparkles}
          label="Haptic Feedback"
          sub="Vibration on taps and actions"
          right={
            <Switch
              value={haptics}
              onValueChange={(v) => {
                setHaptics(v);
                setItem(HAPTICS_KEY, v);
              }}
              trackColor={{ false: "#3A3A3F", true: "#C8F53C" }}
              thumbColor="#FFFFFF"
            />
          }
        />
        <Row
          icon={Archive}
          label="Auto-Backup"
          sub="Weekly automatic snapshots"
          right={
            <Switch
              value={autoBackup}
              onValueChange={(v) => {
                setAutoBackup(v);
                setItem(AUTO_BACKUP_KEY, v);
              }}
              trackColor={{ false: "#3A3A3F", true: "#C8F53C" }}
              thumbColor="#FFFFFF"
            />
          }
        />

        <Text className="mb-2 mt-5 font-bodySemi text-[11px] uppercase tracking-widest text-text-tertiary">
          Data
        </Text>
        <Row
          icon={Archive}
          label="Backup & Restore"
          sub="Versioned snapshots"
          onPress={() => router.push("/settings/backup" as never)}
        />
        <Row
          icon={Trash2}
          label="Clear Cache"
          sub="Free up storage"
          onPress={handleClearCache}
        />

        <Text className="mb-2 mt-5 font-bodySemi text-[11px] uppercase tracking-widest text-text-tertiary">
          About
        </Text>
        <Row
          icon={Info}
          label="About Clinical OS"
          sub="Version, credits, license"
          onPress={() => router.push("/settings/about" as never)}
        />
        <Text className="mt-1 font-body text-[11.5px] leading-4 text-text-tertiary">
          Clinical OS uses an optimized dark theme.
        </Text>

        {storedUser ? (
          <TouchableOpacity
            onPress={async () => {
              triggerSelectionHaptic();
              await signOut();
              router.replace("/auth" as any);
            }}
            className="mt-6 flex-row items-center justify-center gap-2 rounded-clinical border border-border bg-surface py-4"
          >
            <LogOut size={15} color="#FF453A" strokeWidth={1.7} />
            <Text className="font-bodySemi text-[14px] text-clinical-red">
              Sign out
            </Text>
          </TouchableOpacity>
        ) : null}

        <BrandedFooter />
      </ScrollView>
    </View>
  );
}
