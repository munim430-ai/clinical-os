import { ClinicalShell } from "@/components/layout/ClinicalShell";
import { EmergencyPill } from "@/components/navigation/EmergencyPill";
import { useDatabase } from "@/db/provider";
import {
  triggerSelectionHaptic,
  triggerSuccessHaptic,
} from "@/lib/clinical-haptics";
import {
  type PullResult,
  getContentSummary,
  pullSyncFeeds,
} from "@/lib/content-sync";
import { type Persona, getPersona, setPersona } from "@/lib/persona";
import { router } from "expo-router";
import {
  BookMarked,
  Database,
  GraduationCap,
  RefreshCcw,
  ShieldCheck,
  Stethoscope,
  UserCheck,
  WalletCards,
} from "lucide-react-native";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const PERSONAS = [
  {
    id: "student" as Persona,
    label: "Medical Student",
    sub: "OSCE prep and quiz mode",
    icon: GraduationCap,
  },
  {
    id: "intern" as Persona,
    label: "Intern / House Officer",
    sub: "Clinical rotations and ward reference",
    icon: Stethoscope,
  },
  {
    id: "gp" as Persona,
    label: "General Practitioner",
    sub: "Full clinical access and ER tools",
    icon: UserCheck,
  },
];

export default function ProfileScreen() {
  const { db } = useDatabase();
  const [current, setCurrent] = useState<Persona>(getPersona());
  const [contentSummary, setContentSummary] = useState({
    versions: 0,
    syncFeeds: 0,
    mediaAssets: 0,
  });
  const [pulling, setPulling] = useState(false);
  const [pullMsg, setPullMsg] = useState("");

  useEffect(() => {
    if (!db) return;
    getContentSummary(db).then(setContentSummary);
  }, [db]);

  function handleSelect(p: Persona) {
    triggerSelectionHaptic();
    setPersona(p);
    setCurrent(p);
  }

  async function handlePullContent() {
    if (pulling || !db) return;
    triggerSelectionHaptic();
    setPulling(true);
    const result: PullResult = await pullSyncFeeds();
    setPulling(false);
    if (result.status === "ok") {
      triggerSuccessHaptic();
      setPullMsg(
        result.updated === 0
          ? "All feeds up to date"
          : `Updated ${result.updated} feed(s)`,
      );
      getContentSummary(db).then(setContentSummary);
    } else if (result.status === "skipped") {
      setPullMsg(result.reason);
    } else {
      setPullMsg(result.message);
    }
  }

  return (
    <ClinicalShell>
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 156 }}
        showsVerticalScrollIndicator={false}
        accessibilityLabel="Profile screen"
      >
        <View className="flex-row items-center justify-between gap-3 pb-5 pt-2">
          <View className="flex-1">
            <Text className="font-heading text-[30px] leading-10 text-text-primary">
              Profile
            </Text>
            <Text className="mt-1 font-body text-[13px] text-text-tertiary">
              Manage role, content, and privacy
            </Text>
          </View>
          <EmergencyPill />
        </View>

        <View className="rounded-[28px] border border-surface-glassBorder bg-surface p-5">
          <View className="flex-row items-center gap-4">
            <View className="h-16 w-16 items-center justify-center rounded-full bg-accent-primarySoft">
              <UserCheck color="#2470FF" size={32} strokeWidth={1.8} />
            </View>
            <View className="flex-1">
              <Text className="font-headingSemi text-[22px] text-text-primary">
                Clinical OS
              </Text>
              <Text className="mt-1 font-body text-[13px] text-text-tertiary">
                {current.toUpperCase()} mode · Local-first reference
              </Text>
            </View>
          </View>
        </View>

        <Text className="mb-3 mt-6 font-headingSemi text-[18px] text-text-primary">
          Your role
        </Text>
        {PERSONAS.map((p) => {
          const Icon = p.icon;
          const active = current === p.id;
          return (
            <TouchableOpacity
              key={p.id}
              onPress={() => handleSelect(p.id)}
              className={[
                "mb-3 flex-row items-center rounded-clinical border bg-surface p-4",
                active ? "border-accent-primary" : "border-border",
              ].join(" ")}
              activeOpacity={0.78}
              accessibilityRole="radio"
              accessibilityState={{ checked: active }}
              accessibilityLabel={p.label}
            >
              <View
                className={[
                  "mr-4 h-12 w-12 items-center justify-center rounded-2xl",
                  active ? "bg-accent-primarySoft" : "bg-surface-muted",
                ].join(" ")}
              >
                <Icon
                  size={24}
                  color={active ? "#2470FF" : "#8A91A8"}
                  strokeWidth={1.8}
                />
              </View>
              <View className="flex-1">
                <Text className="font-headingSemi text-[15px] text-text-primary">
                  {p.label}
                </Text>
                <Text className="mt-0.5 font-body text-[12px] text-text-tertiary">
                  {p.sub}
                </Text>
              </View>
              {active ? (
                <View className="h-3 w-3 rounded-full bg-accent-primary" />
              ) : null}
            </TouchableOpacity>
          );
        })}

        <StatsCard
          title="Doctor Wallet"
          icon={<WalletCards color="#2470FF" size={18} />}
        >
          <Text className="font-body text-[13px] leading-5 text-text-tertiary">
            Track location-wise patient counts and earnings for each chamber,
            clinic, or hospital.
          </Text>
          <TouchableOpacity
            onPress={() => {
              triggerSelectionHaptic();
              router.push("/wallet" as never);
            }}
            className="mt-4 flex-row items-center justify-between rounded-2xl bg-accent-primary px-4 py-3"
            activeOpacity={0.78}
            accessibilityRole="button"
            accessibilityLabel="Open Doctor Wallet"
          >
            <View className="flex-row items-center gap-2">
              <WalletCards color="#FFFFFF" size={18} strokeWidth={1.8} />
              <Text className="font-bodySemi text-[14px] text-text-inverse">
                Open Wallet
              </Text>
            </View>
            <Text className="font-body text-[12px] text-text-inverse">
              Location cards
            </Text>
          </TouchableOpacity>
        </StatsCard>

        <StatsCard
          title="Content registry"
          icon={<Database color="#2470FF" size={18} />}
        >
          <InfoRow label="Content versions" value={contentSummary.versions} />
          <InfoRow label="Configured feeds" value={contentSummary.syncFeeds} />
          <InfoRow label="Offline media" value={contentSummary.mediaAssets} />
          <ActionButton
            label={pulling ? "Pulling..." : "Pull latest content"}
            disabled={pulling || contentSummary.syncFeeds === 0}
            loading={pulling}
            onPress={handlePullContent}
          />
          {pullMsg ? (
            <Text className="mt-2 text-center font-body text-[12px] text-text-tertiary">
              {pullMsg}
            </Text>
          ) : null}
        </StatsCard>

        <StatsCard
          title="Settings"
          icon={<BookMarked color="#FFA01D" size={18} />}
        >
          <TouchableOpacity
            onPress={() => router.push("/legal/privacy")}
            className="flex-row items-center justify-between rounded-2xl bg-surface-muted px-3 py-3"
            activeOpacity={0.78}
          >
            <View className="flex-row items-center gap-2">
              <ShieldCheck color="#2470FF" size={18} strokeWidth={1.8} />
              <Text className="font-bodySemi text-[14px] text-text-primary">
                Data & Privacy
              </Text>
            </View>
            <Text className="font-body text-[12px] text-text-tertiary">
              Open
            </Text>
          </TouchableOpacity>
          <Text className="mt-4 text-center font-body text-[12px] text-text-tertiary">
            Version 1.1.1 · Free Clinical OS
          </Text>
        </StatsCard>
      </ScrollView>
    </ClinicalShell>
  );
}

function StatsCard({
  title,
  icon,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <View className="mt-6 rounded-[28px] border border-surface-glassBorder bg-surface p-4">
      <View className="mb-3 flex-row items-center gap-2">
        <View className="h-8 w-8 items-center justify-center rounded-xl bg-surface-muted">
          {icon}
        </View>
        <Text className="font-headingSemi text-[17px] text-text-primary">
          {title}
        </Text>
      </View>
      {children}
    </View>
  );
}

function InfoRow({ label, value }: { label: string; value: number }) {
  return (
    <View className="flex-row items-center justify-between border-b border-border py-2">
      <Text className="font-body text-[14px] text-text-secondary">{label}</Text>
      <Text className="font-bodySemi text-[14px] text-accent-primary">
        {value}
      </Text>
    </View>
  );
}

function ActionButton({
  label,
  disabled,
  loading,
  onPress,
}: {
  label: string;
  disabled: boolean;
  loading: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      className={[
        "mt-4 min-h-[48px] flex-row items-center justify-center gap-2 rounded-2xl",
        disabled ? "bg-surface-muted" : "bg-accent-primary",
      ].join(" ")}
      activeOpacity={0.78}
      accessibilityRole="button"
      accessibilityState={{ disabled }}
    >
      {loading ? (
        <ActivityIndicator color="#FFFFFF" size="small" />
      ) : (
        <RefreshCcw
          color={disabled ? "#8A91A8" : "#FFFFFF"}
          size={16}
        />
      )}
      <Text
        className={
          disabled
            ? "font-bodySemi text-[13px] text-text-tertiary"
            : "font-bodySemi text-[13px] text-text-inverse"
        }
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}
