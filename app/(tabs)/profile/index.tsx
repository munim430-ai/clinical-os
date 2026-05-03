import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator } from "react-native";
import {
  GraduationCap, Stethoscope, UserCheck, Activity,
  AlertTriangle, Database, RefreshCcw, Upload, CheckCircle2, XCircle,
} from "lucide-react";
import { getPersona, setPersona, type Persona } from "@/lib/persona";
import { getCaseCounts, type CaseCounts } from "@/lib/surveillance";
import { getContentSummary } from "@/lib/content-sync";
import { syncSurveillanceData, getLastSyncMs, canSyncNow } from "@/lib/surveillance-sync";
import { triggerSelectionHaptic, triggerSuccessHaptic } from "@/lib/clinical-haptics";
import { useEffect, useState } from "react";

const PERSONAS = [
  { id: "student" as Persona, label: "Medical Student",       sub: "OSCE prep & quiz mode",  icon: GraduationCap, color: "#4499FF" },
  { id: "intern"  as Persona, label: "Intern / House Officer", sub: "Clinical rotations",      icon: Stethoscope,   color: "#FFD60A" },
  { id: "gp"      as Persona, label: "General Practitioner",  sub: "Full clinical access",    icon: UserCheck,     color: "#00C896" },
];

const DISEASE_LABELS: Record<string, string> = {
  dengue: "Dengue", typhoid: "Typhoid", malaria: "Malaria", cholera: "Cholera",
};

function formatLastSync(ms: number | undefined): string {
  if (!ms) return "Never";
  const diff = Date.now() - ms;
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default function ProfileScreen() {
  const [current, setCurrent] = useState<Persona>(getPersona());
  const [caseCounts, setCaseCounts] = useState<CaseCounts>({} as CaseCounts);
  const [contentSummary, setContentSummary] = useState({ versions: 0, syncFeeds: 0, mediaAssets: 0 });
  const [syncing, setSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState<"idle" | "ok" | "error" | "skipped">("idle");
  const [syncMsg, setSyncMsg] = useState("");
  const [lastSyncMs, setLastSyncMs] = useState<number | undefined>(getLastSyncMs());
  const totalCases = Object.values(caseCounts).reduce((a, b) => a + b, 0);
  const syncEnabled = canSyncNow();

  useEffect(() => {
    getCaseCounts().then(setCaseCounts);
    getContentSummary().then(setContentSummary);
  }, []);

  function handleSelect(p: Persona) {
    triggerSelectionHaptic();
    setPersona(p);
    setCurrent(p);
  }

  async function handleSync() {
    if (syncing) return;
    triggerSelectionHaptic();
    setSyncing(true);
    setSyncStatus("idle");
    const result = await syncSurveillanceData();
    setSyncing(false);
    setSyncStatus(result.status);
    setLastSyncMs(getLastSyncMs());
    if (result.status === "ok") {
      triggerSuccessHaptic();
      setSyncMsg(`Synced ${result.synced} case${result.synced !== 1 ? "s" : ""}`);
      getCaseCounts().then(setCaseCounts);
    } else if (result.status === "skipped") {
      setSyncMsg(result.reason);
    } else {
      setSyncMsg(result.message);
    }
    setTimeout(() => setSyncStatus("idle"), 4000);
  }

  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerStyle={{ padding: 16, paddingBottom: 104 }}
      accessibilityLabel="Profile screen"
    >
      <Text className="font-heading text-[32px] leading-10 text-text-primary">Profile</Text>
      <Text className="mb-6 mt-1 font-body text-[13px] text-text-muted">
        Manage your role, content, and local activity
      </Text>

      {/* Persona selector */}
      <Text className="mb-3 font-bodySemi text-[11px] uppercase tracking-[1.5px] text-text-muted">Your Role</Text>
      {PERSONAS.map((p) => {
        const Icon = p.icon;
        const active = current === p.id;
        return (
          <TouchableOpacity
            key={p.id}
            onPress={() => handleSelect(p.id)}
            className="mb-3 flex-row items-center rounded-clinical border bg-ink-800 p-4"
            style={{ borderColor: active ? p.color : "#1F1F23" }}
            activeOpacity={0.7}
            accessibilityRole="radio"
            accessibilityState={{ checked: active }}
            accessibilityLabel={p.label}
          >
            <View
              className="mr-4 h-12 w-12 items-center justify-center rounded-full"
              style={{ backgroundColor: active ? `${p.color}22` : "#1E1E21" }}
            >
              <Icon size={22} color={active ? p.color : "#505058"} />
            </View>
            <View className="flex-1">
              <Text className="font-bodySemi text-[15px] text-text-primary">{p.label}</Text>
              <Text className="mt-0.5 font-body text-[12px] text-text-muted">{p.sub}</Text>
            </View>
            {active ? (
              <View className="h-3 w-3 rounded-full" style={{ backgroundColor: p.color }} />
            ) : null}
          </TouchableOpacity>
        );
      })}

      {/* Case log + Sync */}
      {totalCases > 0 ? (
        <View className="mt-6">
          <Text className="mb-3 font-bodySemi text-[11px] uppercase tracking-[1.5px] text-text-muted">
            Cases Logged (Anonymous)
          </Text>
          <View className="rounded-clinical border border-border bg-ink-800 p-4">
            <View className="mb-3 flex-row items-center justify-between">
              <View className="flex-row items-center gap-2">
                <Activity size={16} color="#00C896" />
                <Text className="font-bodySemi text-[15px] text-text-primary">{totalCases} Total Cases</Text>
              </View>
            </View>

            {Object.entries(caseCounts).map(([disease, count]) => (
              <View key={disease} className="flex-row items-center justify-between border-b border-border-soft py-2 last:border-b-0">
                <Text className="font-body text-[14px] text-text-secondary">
                  {DISEASE_LABELS[disease] ?? disease}
                </Text>
                <View className="rounded-lg bg-mint-soft px-3 py-0.5">
                  <Text className="font-bodySemi text-[13px] text-mint">{count}</Text>
                </View>
              </View>
            ))}

            <Text className="mb-4 mt-3 font-body text-[12px] text-text-muted">
              Stored locally. No patient-identifying data. Last sync: {formatLastSync(lastSyncMs)}
            </Text>

            {/* Sync button */}
            <TouchableOpacity
              onPress={handleSync}
              disabled={syncing || !syncEnabled}
              className={[
                "flex-row items-center justify-center gap-2 rounded-2xl px-4 py-3",
                syncEnabled ? "bg-mint" : "bg-ink-700 border border-border",
              ].join(" ")}
              activeOpacity={0.78}
              accessibilityRole="button"
              accessibilityLabel="Sync surveillance data"
              accessibilityState={{ disabled: syncing || !syncEnabled }}
            >
              {syncing ? (
                <ActivityIndicator size="small" color="#0C0C0E" />
              ) : syncStatus === "ok" ? (
                <CheckCircle2 size={15} color="#0C0C0E" strokeWidth={2} />
              ) : syncStatus === "error" ? (
                <XCircle size={15} color="#FF453A" strokeWidth={2} />
              ) : (
                <Upload size={15} color={syncEnabled ? "#0C0C0E" : "#505058"} strokeWidth={1.8} />
              )}
              <Text className={[
                "font-bodySemi text-[13px]",
                syncEnabled ? "text-text-inverse" : "text-text-muted",
              ].join(" ")}>
                {syncing ? "Syncing…" : syncStatus === "ok" ? "Synced!" : "Sync to National Registry"}
              </Text>
            </TouchableOpacity>

            {syncMsg && syncStatus !== "idle" ? (
              <Text className={`mt-2 text-center font-body text-[11px] ${syncStatus === "error" ? "text-clinical-red" : "text-text-muted"}`}>
                {syncMsg}
              </Text>
            ) : null}

            {!syncEnabled && !syncing ? (
              <Text className="mt-2 text-center font-body text-[11px] text-text-muted">
                Set EXPO_PUBLIC_SURVEILLANCE_ENDPOINT to enable
              </Text>
            ) : null}
          </View>
        </View>
      ) : null}

      {/* Content registry */}
      <View className="mt-6">
        <Text className="mb-3 font-bodySemi text-[11px] uppercase tracking-[1.5px] text-text-muted">
          Free Content System
        </Text>
        <View className="rounded-clinical border border-border bg-ink-800 p-4">
          <View className="mb-3 flex-row items-center gap-2">
            <Database size={16} color="#00D7B5" />
            <Text className="font-bodySemi text-[15px] text-text-primary">Offline Content Registry</Text>
          </View>
          <InfoRow label="Content versions" value={contentSummary.versions} />
          <InfoRow label="Configured sync feeds" value={contentSummary.syncFeeds} />
          <InfoRow label="Offline media assets" value={contentSummary.mediaAssets} last />
          <View className="mt-3 flex-row items-start gap-2 rounded-xl border border-border-accent bg-mint-soft px-3 py-2">
            <RefreshCcw size={13} color="#C8F53C" style={{ marginTop: 1 }} />
            <Text className="flex-1 font-body text-[12px] leading-5 text-text-secondary">
              Built to import owned, public, or licensed GP/DIMS data and keep it free for doctors.
            </Text>
          </View>
        </View>
      </View>

      {/* About */}
      <View className="mt-6 rounded-clinical border border-border bg-ink-800 p-4">
        <Text className="mb-2 font-bodySemi text-[15px] text-text-primary">Clinical OS</Text>
        <Text className="mb-3 font-body text-[13px] leading-5 text-text-muted">
          Offline-first clinical reference for Bangladeshi doctors. GP protocols, drug search, emergency dosing, and legally sourced free content.
        </Text>
        <View className="flex-row items-start gap-2 rounded-xl border border-border-red bg-clinical-redSoft px-3 py-2">
          <AlertTriangle size={13} color="#FF453A" style={{ marginTop: 1 }} />
          <Text className="flex-1 font-body text-[12px] leading-5 text-clinical-red">
            For clinical reference only. All content must be reviewed by qualified medical professionals before clinical use.
          </Text>
        </View>
      </View>

      <Text className="mt-6 text-center font-body text-[12px] text-text-muted">
        Version 1.1.1 · Free Clinical OS
      </Text>
    </ScrollView>
  );
}

function InfoRow({ label, value, last = false }: { label: string; value: number; last?: boolean }) {
  return (
    <View className={`flex-row items-center justify-between py-2 ${last ? "" : "border-b border-border-soft"}`}>
      <Text className="font-body text-[14px] text-text-secondary">{label}</Text>
      <Text className="font-bodySemi text-[14px] text-mint">{value}</Text>
    </View>
  );
}
