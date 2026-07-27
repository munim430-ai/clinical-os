import { BrandedFooter } from "@/components/premium/BrandedFooter";
import { triggerSelectionHaptic } from "@/lib/clinical-haptics";
import { router } from "expo-router";
import {
  ArrowLeft,
  FileText,
  Github,
  Globe,
  ShieldCheck,
} from "lucide-react-native";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

const TECH_STACK = [
  "Expo 54 · React Native 0.81",
  "Expo Router · Drizzle ORM · SQLite",
  "NativeWind v4 · Moti · Skia",
];

export default function AboutScreen() {
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
          About
        </Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
        <View className="items-center py-6">
          <Text className="font-heading text-[26px] text-text-primary">
            Clinical OS
          </Text>
          <Text className="mt-1 font-body text-[12.5px] text-text-tertiary">
            Version 1.1.1
          </Text>
        </View>

        <View className="items-center rounded-clinical border border-border bg-surface p-6">
          <View className="mb-2 h-1 w-1 rounded-full bg-accent-primary" />
          <Text className="font-headingSemi text-[16px] text-text-primary">
            Made by Munim @ Keystone
          </Text>
          <Text className="mt-2 text-center font-body text-[12.5px] leading-5 text-text-tertiary">
            A premium, all-in-one prescription writing and practice management
            platform for Bangladeshi doctors — offline-first, and bundled with
            clinical reference tools.
          </Text>
        </View>

        <Text className="mb-2 mt-5 font-bodySemi text-[11px] uppercase tracking-widest text-text-tertiary">
          Tech Stack
        </Text>
        <View className="rounded-clinical border border-border bg-surface p-4">
          {TECH_STACK.map((t) => (
            <Text
              key={t}
              className="mb-1 font-body text-[12.5px] text-text-secondary"
            >
              • {t}
            </Text>
          ))}
        </View>

        <Text className="mb-2 mt-5 font-bodySemi text-[11px] uppercase tracking-widest text-text-tertiary">
          Content Disclaimer
        </Text>
        <View className="flex-row items-start gap-2 rounded-clinical border border-clinical-red/30 bg-clinical-redSoft p-4">
          <ShieldCheck size={15} color="#FF453A" style={{ marginTop: 1 }} />
          <Text className="flex-1 font-body text-[12px] leading-5 text-clinical-red">
            For clinical reference only. All content must be reviewed by
            qualified medical professionals before clinical use. Clinical OS
            ships only original, public-domain, government-licensed, or
            medically-reviewed content.
          </Text>
        </View>

        <Text className="mb-2 mt-5 font-bodySemi text-[11px] uppercase tracking-widest text-text-tertiary">
          License
        </Text>
        <View className="flex-row items-center gap-2 rounded-clinical border border-border bg-surface p-4">
          <FileText size={15} color="#B8B8BE" />
          <Text className="font-body text-[12.5px] text-text-secondary">
            MIT License
          </Text>
        </View>

        <TouchableOpacity
          onPress={() => router.push("/legal/privacy" as any)}
          className="mt-3 flex-row items-center gap-2 rounded-clinical border border-border bg-surface p-4"
        >
          <Globe size={15} color="#B8B8BE" />
          <Text className="font-body text-[12.5px] text-text-secondary">
            Privacy Policy
          </Text>
        </TouchableOpacity>

        <View className="mt-3 flex-row items-center gap-2 rounded-clinical border border-border bg-surface p-4">
          <Github size={15} color="#B8B8BE" />
          <Text className="font-body text-[12.5px] text-text-secondary">
            munim430-ai/clinical-os
          </Text>
        </View>

        <BrandedFooter />
      </ScrollView>
    </View>
  );
}
