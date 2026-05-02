import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { GraduationCap, Stethoscope, UserCheck, Activity, AlertTriangle, Database, RefreshCcw, Sun, Moon } from "lucide-react-native";
import { getPersona, setPersona, type Persona } from "@/lib/persona";
import { getCaseCounts, type CaseCounts } from "@/lib/surveillance";
import { getContentSummary } from "@/lib/content-sync";
import { useColorScheme } from "@/lib/useColorScheme";
import { useEffect, useState } from "react";

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
  const [caseCounts, setCaseCounts] = useState<CaseCounts>({} as CaseCounts);
  const [contentSummary, setContentSummary] = useState<{ versions: number; syncFeeds: number; mediaAssets: number }>({
    versions: 0,
    syncFeeds: 0,
    mediaAssets: 0,
  });
  const totalCases = Object.values(caseCounts).reduce((a, b) => a + b, 0);
  const { isDarkColorScheme, toggleColorScheme } = useColorScheme();

  useEffect(() => {
    getCaseCounts().then(setCaseCounts);
    getContentSummary().then(setContentSummary);
  }, []);

  function handleSelect(p: Persona) {
    setPersona(p);
    setCurrent(p);
  }

  return (
    <ScrollView className="flex-1 bg-background" contentContainerStyle={{ padding: 16 }}>
      <Text className="text-foreground text-2xl font-bold mb-1">Profile</Text>
      <Text className="text-muted-foreground text-sm mb-6">Manage your role, content, and local activity</Text>

      {/* ── Day / Dark Mode Toggle ── */}
      <Text className="text-muted-foreground text-xs uppercase tracking-wider mb-3">Appearance</Text>
      <TouchableOpacity
        onPress={toggleColorScheme}
        className="flex-row items-center bg-card rounded-2xl p-4 mb-6 border border-border"
        activeOpacity={0.7}
      >
        <View
          className="w-12 h-12 rounded-full items-center justify-center mr-4"
          style={{ backgroundColor: isDarkColorScheme ? "rgba(0,200,150,0.12)" : "rgba(245,158,11,0.12)" }}
        >
          {isDarkColorScheme
            ? <Moon size={22} color="#B8FFD2" />
            : <Sun  size={22} color="#F59E0B" />
          }
        </View>
        <View className="flex-1">
          <Text className="text-foreground font-semibold">
            {isDarkColorScheme ? "Dark Mode" : "Day Mode"}
          </Text>
          <Text className="text-muted-foreground text-xs mt-0.5">
            {isDarkColorScheme ? "Tap to switch to day mode" : "Tap to switch to dark mode"}
          </Text>
        </View>
        {/* Toggle pill */}
        <View
          style={{
            width: 48,
            height: 28,
            borderRadius: 14,
            backgroundColor: isDarkColorScheme ? "#B8FFD2" : "#F59E0B",
            padding: 3,
            justifyContent: "center",
          }}
        >
          <View
            style={{
              width: 22,
              height: 22,
              borderRadius: 11,
              backgroundColor: isDarkColorScheme ? "#000" : "#fff",
              transform: [{ translateX: isDarkColorScheme ? 20 : 0 }],
            }}
          />
        </View>
      </TouchableOpacity>

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

      <View className="mt-4">
        <Text className="text-muted-foreground text-xs uppercase tracking-wider mb-3">Free Content System</Text>
        <View className="bg-card rounded-2xl border border-border p-4">
          <View className="flex-row items-center mb-3">
            <Database size={16} color="#00C896" />
            <Text className="text-foreground font-semibold ml-2">Offline Content Registry</Text>
          </View>
          <InfoRow label="Content versions" value={contentSummary.versions} />
          <InfoRow label="Configured sync feeds" value={contentSummary.syncFeeds} />
          <InfoRow label="Offline media assets" value={contentSummary.mediaAssets} />
          <View className="flex-row items-start gap-2 bg-primary/10 border border-primary/20 rounded-xl p-3 mt-3">
            <RefreshCcw size={13} color="#00C896" style={{ marginTop: 1 }} />
            <Text className="text-primary text-xs flex-1 leading-relaxed">
              This app is built to import owned, public, or licensed GP/DIMS-style data and keep it free for doctors.
            </Text>
          </View>
        </View>
      </View>

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
              These counts are stored locally in SQLite and contain no patient-identifying data.
            </Text>
          </View>
        </View>
      )}

      <View className="mt-6 bg-card rounded-2xl border border-border p-4">
        <Text className="text-foreground font-semibold mb-2">Clinical OS</Text>
        <Text className="text-muted-foreground text-xs leading-relaxed mb-3">
          Offline-first clinical reference for Bangladeshi doctors. Built for GP protocols, drug search, emergency tools, and legally sourced free content.
        </Text>
        <View className="flex-row items-start gap-2 bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-3">
          <AlertTriangle size={13} color="#EAB308" style={{ marginTop: 1 }} />
          <Text className="text-yellow-500/80 text-xs flex-1 leading-relaxed">
            For clinical reference only. All content must be reviewed by qualified medical professionals before clinical use.
          </Text>
        </View>
      </View>

      <Text className="text-muted-foreground text-xs text-center mt-6">Version 1.0.0 · Free Clinical OS</Text>
    </ScrollView>
  );
}

function InfoRow({ label, value }: { label: string; value: number }) {
  return (
    <View className="flex-row items-center justify-between py-1.5 border-b border-border/30">
      <Text className="text-muted-foreground text-sm">{label}</Text>
      <Text className="text-primary text-sm font-semibold">{value}</Text>
    </View>
  );
}
