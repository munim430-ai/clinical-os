import { ClinicalShell } from "@/components/layout/ClinicalShell";
import { EmergencyPill } from "@/components/navigation/EmergencyPill";
import {
  GlassCard,
  GlassListRow,
  GlassSectionHeader,
} from "@/components/ui/curecurve-glass";
import { useDatabase } from "@/db/provider";
import { triggerSelectionHaptic } from "@/lib/clinical-haptics";
import { getContentSummary } from "@/lib/content-sync";
import { formatBdt, getWalletHomeSummary } from "@/lib/doctor-wallet";
import { type Persona, getPersona } from "@/lib/persona";
import { router } from "expo-router";
import {
  Activity,
  BookOpen,
  ChevronRight,
  Menu,
  Pill,
  RefreshCcw,
  Stethoscope,
  User,
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

type ContentSummary = Awaited<ReturnType<typeof getContentSummary>>;
type WalletHomeSummary =
  | Awaited<ReturnType<typeof getWalletHomeSummary>>
  | {
      status: "error";
      todayTotal: number;
      todayPatients: number;
      locationCount: number;
    };

const PERSONA_LABEL: Record<Persona, string> = {
  student: "Student",
  intern: "Intern",
  gp: "GP",
};

export default function HomeScreen() {
  const { db } = useDatabase();
  const [persona, setPersona] = useState<Persona>("intern");
  const [contentSummary, setContentSummary] = useState<ContentSummary | null>(
    null,
  );
  const [walletSummary, setWalletSummary] =
    useState<WalletHomeSummary | null>(null);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    setPersona(getPersona());
    if (!db) return;
    const summary = await getContentSummary(db);
    setContentSummary(summary);
    try {
      setWalletSummary(await getWalletHomeSummary());
    } catch {
      setWalletSummary({
        status: "error",
        todayTotal: 0,
        todayPatients: 0,
        locationCount: 0,
      });
    }
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, [db]);

  const focus =
    persona === "student"
      ? "Continue OSCE practice"
      : persona === "gp"
        ? "Review saved drug references"
        : "Open GP Master for ward rounds";

  return (
    <ClinicalShell>
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 156 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-row items-center justify-between pb-5 pt-2">
          <TouchableOpacity
            onPress={() => {
              triggerSelectionHaptic();
              router.push("/drawer");
            }}
            accessibilityLabel="Open navigation drawer"
            className="h-11 w-11 items-center justify-center rounded-2xl border border-surface-glassBorder bg-surface"
            activeOpacity={0.78}
          >
            <Menu color="#182456" size={25} strokeWidth={1.9} />
          </TouchableOpacity>

          <View className="h-12 w-12 items-center justify-center rounded-full border border-surface-glassBorder bg-surface">
            <View className="h-10 w-10 items-center justify-center rounded-full bg-accent-primarySoft">
              <User color="#2470FF" size={20} strokeWidth={1.8} />
            </View>
          </View>

          <View className="flex-1 px-3">
            <Text className="font-heading text-[24px] leading-8 text-text-primary">
              Hello, Doctor!
            </Text>
            <Text className="font-body text-[13px] text-text-tertiary">
              Your shift, organised. {PERSONA_LABEL[persona]} mode
            </Text>
          </View>

          <EmergencyPill compact />
        </View>

        {loading ? (
          <View className="mt-20 items-center justify-center">
            <ActivityIndicator color="#2470FF" />
            <Text className="mt-3 font-body text-[13px] text-text-tertiary">
              Loading dashboard...
            </Text>
          </View>
        ) : (
          <>
            <TouchableOpacity
              onPress={() => {
                triggerSelectionHaptic();
                router.push("/(tabs)/gp");
              }}
              className="rounded-[28px] border border-surface-glassBorder bg-surface p-4"
              activeOpacity={0.82}
              style={{
                shadowColor: "#182456",
                shadowOffset: { width: 0, height: 14 },
                shadowOpacity: 0.08,
                shadowRadius: 34,
                elevation: 2,
              }}
            >
              <View className="flex-row items-center">
                <View className="h-12 w-12 items-center justify-center rounded-2xl bg-accent-primarySoft">
                  <Stethoscope color="#2470FF" size={23} strokeWidth={1.8} />
                </View>
                <View className="flex-1 px-3">
                  <Text className="font-bodySemi text-[13px] text-text-tertiary">
                    Today's focus
                  </Text>
                  <Text className="mt-1 font-headingSemi text-[17px] text-text-primary">
                    {focus}
                  </Text>
                  <View className="mt-3 h-2 overflow-hidden rounded-full bg-surface-muted">
                    <View className="h-full w-[62%] rounded-full bg-mint" />
                  </View>
                </View>
                <ChevronRight color="#B8C5E6" size={22} />
              </View>
            </TouchableOpacity>

            <View className="mt-6">
              <GlassSectionHeader title="Quick actions" />
            </View>
            <View className="flex-row gap-3">
              <QuickAction
                icon={<Pill color="#2470FF" size={22} />}
                label="Search drug"
                tint="bg-accent-primarySoft"
                onPress={() => router.push("/(tabs)/dims")}
              />
              <QuickAction
                icon={<WalletCards color="#2470FF" size={22} />}
                label="Wallet"
                tint="bg-accent-primarySoft"
                onPress={() => router.push("/wallet" as never)}
              />
              <QuickAction
                icon={<Activity color="#FF3B30" size={22} />}
                label="ER Panic"
                tint="bg-clinical-redSoft"
                onPress={() => router.push("/er")}
              />
            </View>

            <WalletSummaryCard summary={walletSummary} />

            <SectionCard
              title="Continue learning"
              subtitle="Fast routes into the existing clinical modules"
              icon={<BookOpen color="#2470FF" size={18} />}
            >
              <View className="mt-3 flex-row gap-3">
                <MiniCard label="Dengue protocol" route="/(tabs)/gp" />
                <MiniCard label="ECG reader" route="/gp/ecg" />
              </View>
            </SectionCard>

            <SectionCard
              title="Updates"
              subtitle="Content registry status"
              icon={<RefreshCcw color="#FFA01D" size={18} />}
            >
              <View className="mt-3 gap-2">
                <InfoLine
                  label="Content versions"
                  value={contentSummary?.versions ?? 0}
                />
                <InfoLine
                  label="Sync feeds"
                  value={contentSummary?.syncFeeds ?? 0}
                />
                <InfoLine
                  label="Offline media assets"
                  value={contentSummary?.mediaAssets ?? 0}
                />
              </View>
            </SectionCard>
          </>
        )}
      </ScrollView>
    </ClinicalShell>
  );
}

function QuickAction({
  icon,
  label,
  tint,
  onPress,
}: {
  icon: React.ReactNode;
  label: string;
  tint: string;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      onPress={() => {
        triggerSelectionHaptic();
        onPress();
      }}
      className="min-h-[98px] flex-1 justify-between rounded-[24px] border border-surface-glassBorder bg-surface p-3"
      activeOpacity={0.82}
    >
      <View
        className={`h-10 w-10 items-center justify-center rounded-2xl ${tint}`}
      >
        {icon}
      </View>
      <Text className="font-bodySemi text-[13px] leading-4 text-text-primary">
        {label}
      </Text>
    </TouchableOpacity>
  );
}

function WalletSummaryCard({ summary }: { summary: WalletHomeSummary | null }) {
  const statusText =
    summary?.status === "ready"
      ? `${summary.todayPatients} patients today`
      : summary?.status === "signed-out"
        ? "Sign in to start tracking"
        : summary?.status === "not-configured"
          ? "Supabase setup pending"
          : summary?.status === "error"
            ? "Check wallet setup"
            : "Loading wallet";
  const total =
    summary?.status === "ready" ? formatBdt(summary.todayTotal) : "Doctor Wallet";

  return (
    <TouchableOpacity
      onPress={() => {
        triggerSelectionHaptic();
        router.push("/wallet" as never);
      }}
      className="mt-6 rounded-[28px] border border-surface-glassBorder bg-surface p-4"
      activeOpacity={0.82}
      accessibilityRole="button"
      accessibilityLabel="Open Doctor Wallet"
    >
      <View className="flex-row items-center gap-3">
        <View className="h-11 w-11 items-center justify-center rounded-2xl bg-accent-primarySoft">
          <WalletCards color="#2470FF" size={22} strokeWidth={1.8} />
        </View>
        <View className="flex-1">
          <Text className="font-body text-[12px] text-text-tertiary">
            Location wallet
          </Text>
          <Text className="mt-1 font-headingSemi text-[18px] text-text-primary">
            {total}
          </Text>
          <Text className="mt-0.5 font-body text-[12px] text-text-tertiary">
            {statusText}
          </Text>
        </View>
        <ChevronRight color="#B8C5E6" size={21} />
      </View>
    </TouchableOpacity>
  );
}

function SectionCard({
  title,
  subtitle,
  icon,
  children,
}: {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <GlassCard className="mt-6">
      <View className="flex-row items-center gap-2">
        <View className="h-8 w-8 items-center justify-center rounded-xl bg-surface-muted">
          {icon}
        </View>
        <View className="flex-1">
          <Text className="font-headingSemi text-[17px] text-text-primary">
            {title}
          </Text>
          <Text className="font-body text-[12px] text-text-tertiary">
            {subtitle}
          </Text>
        </View>
      </View>
      {children}
    </GlassCard>
  );
}

function MiniCard({ label, route }: { label: string; route: string }) {
  return (
    <TouchableOpacity
      onPress={() => {
        triggerSelectionHaptic();
        router.push(route as never);
      }}
      className="min-h-[72px] flex-1 justify-center rounded-2xl border border-border-soft bg-surface-muted px-3"
      activeOpacity={0.82}
    >
      <Text className="font-bodySemi text-[13px] text-text-primary">
        {label}
      </Text>
      <Text className="mt-1 font-body text-[11px] text-text-tertiary">
        Open module
      </Text>
    </TouchableOpacity>
  );
}

function InfoLine({ label, value }: { label: string; value: number }) {
  return (
    <GlassListRow className="flex-row items-center justify-between rounded-xl py-2">
      <Text className="font-body text-[13px] text-text-secondary">{label}</Text>
      <Text className="font-bodySemi text-[13px] text-text-primary">
        {value}
      </Text>
    </GlassListRow>
  );
}
