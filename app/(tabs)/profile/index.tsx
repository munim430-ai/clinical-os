import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { GraduationCap, Stethoscope, UserCheck, Activity, Pill, BookOpen, AlertTriangle } from "lucide-react-native";
import { getPersona, setPersona, type Persona } from "@/lib/persona";
import { getCaseCounts } from "@/lib/surveillance";
import { useState } from "react";

const PERSONAS = [
  { id: "student" as Persona, label: "Medical Student", sub: "OSCE prep & quiz mode", icon: GraduationCap, color: "#4499FF" },
  { id: "intern"  as Persona, label: "Intern / House Officer", sub: "Clinical rotations", icon: Stethoscope, color: "#FFCC44" },
  { id: "gp"      as Persona, label: "General Practitioner", sub: "Full clinical access", icon: UserCheck, color: "#00C896" },
];

const DISEASE_LABELS: Record<string, string> = {
  dengue: "Dengue", typhoid: "Typhoid", malaria: "Malaria", cholera: "Cholera",
};

export default function ProfileScreen() {
  const [current, setCurrent] = useState<Persona>(getPersona());
  const caseCounts = getCaseCounts();
  const totalCases = Object.values(caseCounts).reduce((a, b) => a + b, 0);

  function handleSelect(p: Persona) {
    setPersona(p);
    setCurrent(p);
  }

  return (
    <ScrollView className="flex-1 bg-background" contentContainerStyle={{ padding: 16 }}>
      <Text className="text-foreground text-2xl font-bold mb-1">Profile</Text>
      <Text className="text-muted-foreground text-sm mb-6">Manage your role and view activity</Text>

      {/* Persona selector */}
      <Text className="text-muted-foreground text-xs uppercase tracking-wider mb-3">Your Role</Text>
      {PERSONAS.map((p) => {
        const Icon = p.icon;
        const active = current === p.id;
        return (
          <TouchableOpacity key={p.id} onPress={() => handleSelect(p.id)}
            className="flex-row items-center bg-card rounded-2xl p-4 mb-3 border"
            style={{ borderColor: active ? "#00C896" : "#2A2A2A" }}
            activeOpacity={0.7}
          >
            <View className="w-12 h-12 rounded-full items-center justify-center mr-4"
              style={{ backgroundColor: active ? p.color + "22" : "#1A1A1A" }}>
              <Icon size={22} color={active ? p.color : "#777"} />
            </View>
            <View className="flex-1">
              <Text className="text-foreground font-semibold">{p.label}</Text>
              <Text className="text-muted-foreground text-xs mt-0.5">{p.sub}</Text>
            </View>
            {active && <View className="w-3 h-3 rounded-full bg-primary" />}
          </TouchableOpacity>
        );
      })}

      {/* Surveillance stats */}
      {totalCases > 0 && (
        <View className="mt-4">
          <Text className="text-muted-foreground text-xs uppercase tracking-wider mb-3">Cases Logged (Anonymous)</Text>
          <View className="bg-card rounded-2xl border border-border p-4">
            <View className="flex-row items-center mb-3">
              <Activity size={16} color="#00C896" />
              <Text className="text-foreground font-semibold ml-2">{totalCases} Total Cases</Text>
            </View>
            {Object.entries(caseCounts).map(([disease, count]) => (
              <View key={disease} className="flex-row items-center justify-between py-1.5 border-b border-border/30">
                <Text className="text-muted-foreground text-sm">{DISEASE_LABELS[disease] ?? disease}</Text>
                <View className="bg-primary/10 rounded-lg px-3 py-0.5">
                  <Text className="text-primary text-sm font-semibold">{count}</Text>
                </View>
              </View>
            ))}
            <Text className="text-muted-foreground text-xs mt-3">
              These counts are stored locally and contain no patient data. They power the national disease surveillance pitch to DGHS.
            </Text>
          </View>
        </View>
      )}

      {/* App info */}
      <View className="mt-6 bg-card rounded-2xl border border-border p-4">
        <Text className="text-foreground font-semibold mb-2">Clinical OS</Text>
        <Text className="text-muted-foreground text-xs leading-relaxed mb-3">
          Offline-first clinical reference for Bangladeshi doctors. Drug data: 21,700+ brands. Protocols: DGHS + WHO guidelines.
        </Text>
        <View className="flex-row items-start gap-2 bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-3">
          <AlertTriangle size={13} color="#EAB308" style={{ marginTop: 1 }} />
          <Text className="text-yellow-500/80 text-xs flex-1 leading-relaxed">
            For clinical reference only. All content must be verified by a qualified medical professional before clinical application.
          </Text>
        </View>
      </View>

      <Text className="text-muted-foreground text-xs text-center mt-6">Version 1.0.0 · Phase 1</Text>
    </ScrollView>
  );
}
