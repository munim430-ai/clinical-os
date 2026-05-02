import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { router } from "expo-router";
import { GraduationCap, Stethoscope, UserCheck } from "lucide-react";
import { setPersona, markOnboarded, type Persona } from "@/lib/persona";
import { ClinicalShell } from "@/components/layout/ClinicalShell";
import { ClinicalHumorHero } from "@/components/hero/ClinicalHumorHero";
import { triggerSelectionHaptic } from "@/lib/clinical-haptics";

const OPTIONS = [
  {
    id: "student" as Persona,
    label: "Medical Student",
    sub: "OSCE prep, flashcards, quiz mode",
    icon: GraduationCap,
    color: "#64D2FF",
  },
  {
    id: "intern" as Persona,
    label: "Intern / House Officer",
    sub: "Clinical protocols, drug doses, ward reference",
    icon: Stethoscope,
    color: "#FFD60A",
  },
  {
    id: "gp" as Persona,
    label: "General Practitioner",
    sub: "Full clinical access, prescribing tools, ER mode",
    icon: UserCheck,
    color: "#B8FFD2",
  },
];

export default function OnboardingScreen() {
  function handleSelect(p: Persona) {
    triggerSelectionHaptic();
    setPersona(p);
    markOnboarded();
    router.replace("/(tabs)/gp/index");
  }

  return (
    <ClinicalShell padded={false}>
      <ScrollView className="flex-1" contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 36 }}>
        <ClinicalHumorHero
          title="Clinical OS"
          subtitle="DIMS, GP protocols, ER tools, and AI support — built for doctors on rounds."
        />

        <Text className="mb-3 font-bodySemi text-[11px] uppercase tracking-[1.7px] text-text-muted">
          Choose clinical mode
        </Text>

        {OPTIONS.map((opt) => {
          const Icon = opt.icon;
          return (
            <TouchableOpacity
              key={opt.id}
              onPress={() => handleSelect(opt.id)}
              className="mb-4 flex-row items-center rounded-clinical border border-border bg-ink-800 p-4"
              activeOpacity={0.78}
            >
              <View
                className="mr-4 h-14 w-14 items-center justify-center rounded-2xl border border-border-soft"
                style={{ backgroundColor: `${opt.color}22` }}
              >
                <Icon size={26} color={opt.color} strokeWidth={1.6} />
              </View>
              <View className="flex-1">
                <Text className="font-headingBold text-[16px] text-text-primary">{opt.label}</Text>
                <Text className="mt-1 font-body text-[12px] leading-5 text-text-muted">{opt.sub}</Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </ClinicalShell>
  );
}
