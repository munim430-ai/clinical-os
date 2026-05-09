import { ClinicalShell } from "@/components/layout/ClinicalShell";
import { EmergencyPill } from "@/components/navigation/EmergencyPill";
import { triggerSelectionHaptic } from "@/lib/clinical-haptics";
import {
  type DoctorWalletEntry,
  type WalletDashboard,
  formatBdt,
  getWalletAuthState,
  getWalletDashboard,
} from "@/lib/doctor-wallet";
import { router, useLocalSearchParams } from "expo-router";
import {
  ArrowLeft,
  CalendarDays,
  Landmark,
  Lock,
  RefreshCcw,
  Users,
} from "lucide-react-native";
import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type ScreenState =
  | { status: "loading" }
  | { status: "not-configured" }
  | { status: "signed-out" }
  | { status: "ready"; dashboard: WalletDashboard }
  | { status: "error"; message: string };

export default function LocationBalanceScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [screen, setScreen] = useState<ScreenState>({ status: "loading" });

  async function load() {
    setScreen({ status: "loading" });
    try {
      const auth = await getWalletAuthState();
      if (auth.status !== "signed-in") {
        setScreen({ status: auth.status });
        return;
      }
      const dashboard = await getWalletDashboard();
      setScreen({ status: "ready", dashboard });
    } catch (error) {
      setScreen({
        status: "error",
        message:
          error instanceof Error ? error.message : "Could not load balance.",
      });
    }
  }

  useEffect(() => {
    load();
  }, [id]);

  const detail = useMemo(() => {
    if (screen.status !== "ready") return null;
    const summary = screen.dashboard.summaries.find(
      (item) => item.location.id === id,
    );
    if (!summary) return null;
    const entries = screen.dashboard.entries.filter(
      (entry) => entry.location_id === summary.location.id,
    );
    return { summary, entries };
  }, [screen, id]);

  return (
    <ClinicalShell>
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 156 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-row items-center gap-3 pb-5 pt-2">
          <TouchableOpacity
            onPress={() => router.back()}
            className="h-11 w-11 items-center justify-center rounded-2xl border border-surface-glassBorder bg-surface"
            activeOpacity={0.78}
            accessibilityLabel="Go back"
          >
            <ArrowLeft color="#182456" size={22} strokeWidth={1.8} />
          </TouchableOpacity>
          <View className="flex-1">
            <Text className="font-heading text-[28px] leading-9 text-text-primary">
              Balance
            </Text>
            <Text className="font-body text-[13px] text-text-tertiary">
              Location earnings and visit history
            </Text>
          </View>
          <EmergencyPill compact />
        </View>

        {screen.status === "loading" ? <LoadingState /> : null}
        {screen.status === "not-configured" ? (
          <MessageCard
            icon={<Lock color="#2470FF" size={22} />}
            title="Connect Supabase"
            body="Wallet balance needs Supabase env vars and the wallet migration."
          />
        ) : null}
        {screen.status === "signed-out" ? (
          <MessageCard
            icon={<Lock color="#2470FF" size={22} />}
            title="Sign in required"
            body="Open Doctor Wallet from Profile and sign in with phone OTP first."
            actionLabel="Open Wallet"
            onPress={() => router.replace("/wallet" as never)}
          />
        ) : null}
        {screen.status === "error" ? (
          <MessageCard
            icon={<RefreshCcw color="#FF3B30" size={22} />}
            title="Balance needs attention"
            body={screen.message}
            actionLabel="Retry"
            onPress={load}
          />
        ) : null}
        {screen.status === "ready" && !detail ? (
          <MessageCard
            icon={<Landmark color="#2470FF" size={22} />}
            title="Location not found"
            body="This wallet location is unavailable or no longer active."
            actionLabel="Open Wallet"
            onPress={() => router.replace("/wallet" as never)}
          />
        ) : null}
        {screen.status === "ready" && detail ? (
          <>
            <View className="rounded-[30px] border border-surface-glassBorder bg-accent-primary p-5">
              <View className="flex-row items-start gap-3">
                <View className="h-12 w-12 items-center justify-center rounded-2xl bg-white/20">
                  <Landmark color="#FFFFFF" size={24} strokeWidth={1.8} />
                </View>
                <View className="flex-1">
                  <Text className="font-body text-[12px] uppercase text-white/70">
                    Location balance
                  </Text>
                  <Text className="mt-1 font-heading text-[26px] leading-9 text-white">
                    {detail.summary.location.name}
                  </Text>
                  {detail.summary.location.address ? (
                    <Text className="font-body text-[12px] text-white/70">
                      {detail.summary.location.address}
                    </Text>
                  ) : null}
                </View>
              </View>
              <Text className="mt-6 font-heading text-[34px] leading-10 text-white">
                {formatBdt(detail.summary.lifetimeTotal)}
              </Text>
              <Text className="mt-1 font-body text-[12px] text-white/70">
                Total earnings from this location
              </Text>
            </View>

            <View className="mt-4 flex-row gap-3">
              <SummaryTile
                icon={<CalendarDays color="#2470FF" size={18} />}
                label="This month"
                value={formatBdt(detail.summary.monthTotal)}
              />
              <SummaryTile
                icon={<Users color="#2BC97A" size={18} />}
                label="Total patients"
                value={String(detail.summary.lifetimePatients)}
              />
            </View>

            <View className="mt-6 flex-row items-center justify-between">
              <Text className="font-headingSemi text-[18px] text-text-primary">
                Entries
              </Text>
              <TouchableOpacity
                onPress={() => {
                  triggerSelectionHaptic();
                  router.replace("/wallet" as never);
                }}
                activeOpacity={0.78}
              >
                <Text className="font-bodySemi text-[13px] text-accent-primary">
                  Add entry
                </Text>
              </TouchableOpacity>
            </View>
            {detail.entries.length === 0 ? (
              <View className="mt-3 rounded-[24px] border border-surface-glassBorder bg-surface p-4">
                <Text className="font-body text-[13px] text-text-tertiary">
                  No earnings entered for this location yet.
                </Text>
              </View>
            ) : (
              <View className="mt-3 gap-3">
                {detail.entries.map((entry) => (
                  <EntryRow key={entry.id} entry={entry} />
                ))}
              </View>
            )}
          </>
        ) : null}
      </ScrollView>
    </ClinicalShell>
  );
}

function SummaryTile({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <View className="min-h-[98px] flex-1 justify-between rounded-[24px] border border-surface-glassBorder bg-surface p-4">
      <View className="h-9 w-9 items-center justify-center rounded-xl bg-surface-muted">
        {icon}
      </View>
      <View>
        <Text className="font-body text-[12px] text-text-tertiary">
          {label}
        </Text>
        <Text className="mt-1 font-headingSemi text-[16px] text-text-primary">
          {value}
        </Text>
      </View>
    </View>
  );
}

function EntryRow({ entry }: { entry: DoctorWalletEntry }) {
  const patients = entry.new_patient_count + entry.old_patient_count;
  return (
    <View className="rounded-[24px] border border-surface-glassBorder bg-surface p-4">
      <View className="flex-row items-center justify-between gap-3">
        <View className="flex-1">
          <Text className="font-bodySemi text-[15px] text-text-primary">
            {entry.entry_date}
          </Text>
          <Text className="mt-1 font-body text-[12px] text-text-tertiary">
            {entry.new_patient_count} new x {entry.new_fee_bdt} +{" "}
            {entry.old_patient_count} old x {entry.old_fee_bdt}
          </Text>
        </View>
        <View className="items-end">
          <Text className="font-headingSemi text-[16px] text-accent-primary">
            {formatBdt(entry.total_bdt)}
          </Text>
          <Text className="font-body text-[11px] text-text-tertiary">
            {patients} patients
          </Text>
        </View>
      </View>
      {entry.notes ? (
        <Text className="mt-3 rounded-2xl bg-surface-muted px-3 py-2 font-body text-[12px] text-text-secondary">
          {entry.notes}
        </Text>
      ) : null}
    </View>
  );
}

function LoadingState() {
  return (
    <View className="mt-20 items-center justify-center">
      <ActivityIndicator color="#2470FF" />
      <Text className="mt-3 font-body text-[13px] text-text-tertiary">
        Loading balance...
      </Text>
    </View>
  );
}

function MessageCard({
  icon,
  title,
  body,
  actionLabel,
  onPress,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
  actionLabel?: string;
  onPress?: () => void;
}) {
  return (
    <View className="rounded-[28px] border border-surface-glassBorder bg-surface p-5">
      <View className="h-12 w-12 items-center justify-center rounded-2xl bg-surface-muted">
        {icon}
      </View>
      <Text className="mt-4 font-headingSemi text-[20px] text-text-primary">
        {title}
      </Text>
      <Text className="mt-2 font-body text-[13px] leading-5 text-text-tertiary">
        {body}
      </Text>
      {actionLabel && onPress ? (
        <TouchableOpacity
          onPress={onPress}
          className="mt-4 min-h-[48px] items-center justify-center rounded-2xl bg-accent-primary"
          activeOpacity={0.82}
        >
          <Text className="font-bodySemi text-[14px] text-text-inverse">
            {actionLabel}
          </Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}
