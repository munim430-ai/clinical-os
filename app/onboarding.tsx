import { ClinicalShell } from "@/components/layout/ClinicalShell";
import { triggerSelectionHaptic } from "@/lib/clinical-haptics";
import { type Persona, markOnboarded, setPersona } from "@/lib/persona";
import { router } from "expo-router";
import {
  Activity,
  GraduationCap,
  Stethoscope,
  UserCheck,
} from "lucide-react-native";
import { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

const PERSONAS = [
  {
    id: "student" as Persona,
    label: "Medical Student",
    sub: "OSCE prep, flashcards, and quiz mode",
    icon: GraduationCap,
  },
  {
    id: "intern" as Persona,
    label: "Intern / House Officer",
    sub: "Clinical protocols, drug doses, and ward reference",
    icon: Stethoscope,
  },
  {
    id: "gp" as Persona,
    label: "General Practitioner",
    sub: "Full clinical access, prescribing tools, and ER mode",
    icon: UserCheck,
  },
];

export default function OnboardingScreen() {
  const [selected, setSelected] = useState<Persona | null>(null);

  function handleContinue() {
    if (!selected) return;
    triggerSelectionHaptic();
    setPersona(selected);
    markOnboarded();
    router.replace("/(tabs)/home");
  }

  return (
    <ClinicalShell padded={false}>
      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          paddingHorizontal: 24,
          paddingBottom: 36,
          paddingTop: 68,
        }}
        showsVerticalScrollIndicator={false}
      >
        <View className="items-center">
          <View className="h-24 w-24 items-center justify-center rounded-full border border-surface-glassBorder bg-accent-primarySoft">
            <View className="h-16 w-16 items-center justify-center rounded-full border-[10px] border-accent-primary">
              <Activity color="#2470FF" size={26} strokeWidth={2} />
            </View>
          </View>
          <Text className="mt-6 text-center font-heading text-[32px] leading-[38px] text-text-primary">
            Clinical OS
          </Text>
          <Text className="mt-3 text-center font-body text-[15px] leading-6 text-text-secondary">
            Every BD drug, clinical workflows, and emergency reference in one
            offline-first app.
          </Text>
        </View>

        <View className="my-10 flex-row justify-between">
          <OnboardingSymbol label="Discover" variant="ring" />
          <OnboardingSymbol label="Build" variant="grid" />
          <OnboardingSymbol label="Grow" variant="steps" />
        </View>

        <Text className="mb-3 font-headingSemi text-[18px] text-text-primary">
          Choose clinical mode
        </Text>

        {PERSONAS.map((persona) => {
          const Icon = persona.icon;
          const active = selected === persona.id;
          return (
            <TouchableOpacity
              key={persona.id}
              onPress={() => {
                triggerSelectionHaptic();
                setSelected(persona.id);
              }}
              className={[
                "mb-3 flex-row items-center rounded-[28px] border bg-surface p-4",
                active ? "border-accent-primary" : "border-border",
              ].join(" ")}
              activeOpacity={0.78}
              accessibilityRole="radio"
              accessibilityState={{ checked: active }}
              accessibilityLabel={persona.label}
            >
              <View
                className={[
                  "mr-4 h-14 w-14 items-center justify-center rounded-2xl",
                  active ? "bg-accent-primarySoft" : "bg-surface-muted",
                ].join(" ")}
              >
                <Icon
                  size={27}
                  color={active ? "#2470FF" : "#8A91A8"}
                  strokeWidth={1.8}
                />
              </View>
              <View className="flex-1">
                <Text className="font-headingSemi text-[16px] text-text-primary">
                  {persona.label}
                </Text>
                <Text className="mt-1 font-body text-[12px] leading-5 text-text-tertiary">
                  {persona.sub}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}

        <TouchableOpacity
          onPress={handleContinue}
          disabled={!selected}
          className={[
            "mt-5 min-h-[54px] items-center justify-center rounded-2xl",
            selected ? "bg-accent-primary" : "bg-surface-muted",
          ].join(" ")}
          activeOpacity={0.82}
          accessibilityRole="button"
          accessibilityState={{ disabled: !selected }}
          accessibilityLabel="Continue"
        >
          <Text
            className={
              selected
                ? "font-bodySemi text-[15px] text-text-inverse"
                : "font-bodySemi text-[15px] text-text-tertiary"
            }
          >
            Continue
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </ClinicalShell>
  );
}

function OnboardingSymbol({
  label,
  variant,
}: { label: string; variant: "ring" | "grid" | "steps" }) {
  return (
    <View className="items-center">
      <View className="h-16 w-16 items-center justify-center">
        {variant === "ring" ? (
          <>
            {[56, 44, 32, 20].map((size) => (
              <View
                key={size}
                className="absolute rounded-full border border-text-primary"
                style={{ height: size, width: size }}
              />
            ))}
            <View className="h-5 w-5 rounded-full bg-text-primary" />
          </>
        ) : null}
        {variant === "grid" ? (
          <View className="w-14 flex-row flex-wrap gap-1.5">
            {[
              "build-1",
              "build-2",
              "build-3",
              "build-4",
              "build-5",
              "build-6",
            ].map((key) => (
              <View
                key={key}
                className="h-4 w-4 rounded-full bg-text-primary"
              />
            ))}
          </View>
        ) : null}
        {variant === "steps" ? (
          <View className="h-14 w-14 justify-end">
            <View className="ml-auto flex-row gap-1.5">
              <View className="h-4 w-4 rounded-full bg-text-primary" />
            </View>
            <View className="ml-auto mt-1.5 flex-row gap-1.5">
              <View className="h-4 w-4 rounded-full bg-text-primary" />
              <View className="h-4 w-4 rounded-full bg-text-primary" />
            </View>
            <View className="mt-1.5 flex-row gap-1.5">
              <View className="h-4 w-4 rounded-full bg-text-primary" />
              <View className="h-4 w-4 rounded-full bg-text-primary" />
              <View className="h-4 w-4 rounded-full bg-text-primary" />
            </View>
          </View>
        ) : null}
      </View>
      <Text className="mt-3 font-bodySemi text-[13px] text-text-secondary">
        {label}
      </Text>
    </View>
  );
}
