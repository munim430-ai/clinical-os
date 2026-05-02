import { View, Text, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { GraduationCap, Stethoscope, UserCheck } from "lucide-react-native";
import { setPersona, markOnboarded, type Persona } from "@/lib/persona";

const OPTIONS = [
  {
    id: "student" as Persona,
    label: "Medical Student",
    sub: "OSCE prep, flashcards, quiz mode",
    icon: GraduationCap,
    color: "#4499FF",
  },
  {
    id: "intern" as Persona,
    label: "Intern / House Officer",
    sub: "Clinical protocols, drug doses, ward reference",
    icon: Stethoscope,
    color: "#FFCC44",
  },
  {
    id: "gp" as Persona,
    label: "General Practitioner",
    sub: "Full clinical access, prescribing tools, ER mode",
    icon: UserCheck,
    color: "#00C896",
  },
];

export default function OnboardingScreen() {
  function handleSelect(p: Persona) {
    setPersona(p);
    markOnboarded();
    router.replace("/(tabs)/gp/index");
  }

  return (
    <View className="flex-1 bg-background px-6 pt-20">
      <Text className="text-primary text-sm font-semibold tracking-widest mb-2">CLINICAL OS</Text>
      <Text className="text-foreground text-3xl font-bold mb-2">Who are you?</Text>
      <Text className="text-muted-foreground text-base mb-10">
        We'll tailor your experience to your role.
      </Text>

      {OPTIONS.map((opt) => {
        const Icon = opt.icon;
        return (
          <TouchableOpacity
            key={opt.id}
            onPress={() => handleSelect(opt.id)}
            className="bg-card rounded-2xl p-5 mb-4 border border-border flex-row items-center"
            activeOpacity={0.7}
          >
            <View
              className="w-14 h-14 rounded-2xl items-center justify-center mr-4"
              style={{ backgroundColor: opt.color + "22" }}
            >
              <Icon size={26} color={opt.color} />
            </View>
            <View className="flex-1">
              <Text className="text-foreground text-base font-semibold">{opt.label}</Text>
              <Text className="text-muted-foreground text-xs mt-1">{opt.sub}</Text>
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
