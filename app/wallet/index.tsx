import { ClinicalShell } from "@/components/layout/ClinicalShell";
import { EmergencyPill } from "@/components/navigation/EmergencyPill";
import {
  triggerSelectionHaptic,
  triggerSuccessHaptic,
} from "@/lib/clinical-haptics";
import {
  type DoctorLocation,
  type WalletDashboard,
  createWalletEntry,
  createWalletLocation,
  formatBdt,
  formatLocalDate,
  getWalletAuthState,
  getWalletDashboard,
  sendWalletPhoneOtp,
  verifyWalletPhoneOtp,
} from "@/lib/doctor-wallet";
import { router } from "expo-router";
import {
  ArrowLeft,
  Building2,
  ChevronRight,
  Landmark,
  Lock,
  Plus,
  RefreshCcw,
  WalletCards,
} from "lucide-react-native";
import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";

type ScreenState =
  | { status: "loading" }
  | { status: "not-configured" }
  | { status: "signed-out" }
  | { status: "ready"; dashboard: WalletDashboard }
  | { status: "error"; message: string };

export default function DoctorWalletScreen() {
  const { width } = useWindowDimensions();
  const cardWidth = Math.min(width - 48, 360);
  const [screen, setScreen] = useState<ScreenState>({ status: "loading" });
  const [activeIndex, setActiveIndex] = useState(0);
  const [authStep, setAuthStep] = useState<"phone" | "otp">("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [busy, setBusy] = useState(false);
  const [locationName, setLocationName] = useState("");
  const [locationAddress, setLocationAddress] = useState("");
  const [defaultNewFee, setDefaultNewFee] = useState("500");
  const [defaultOldFee, setDefaultOldFee] = useState("300");
  const [entryDate, setEntryDate] = useState(formatLocalDate());
  const [newCount, setNewCount] = useState("");
  const [oldCount, setOldCount] = useState("");
  const [newFee, setNewFee] = useState("500");
  const [oldFee, setOldFee] = useState("300");
  const [notes, setNotes] = useState("");

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
      const location = dashboard.locations[Math.min(activeIndex, dashboard.locations.length - 1)];
      if (location) {
        setNewFee(String(location.default_new_fee_bdt));
        setOldFee(String(location.default_old_fee_bdt));
      }
    } catch (error) {
      setScreen({
        status: "error",
        message: error instanceof Error ? error.message : "Wallet failed to load.",
      });
    }
  }

  useEffect(() => {
    load();
  }, []);

  const activeLocation = useMemo(() => {
    if (screen.status !== "ready") return null;
    return screen.dashboard.locations[activeIndex] ?? null;
  }, [screen, activeIndex]);

  useEffect(() => {
    if (!activeLocation) return;
    setNewFee(String(activeLocation.default_new_fee_bdt));
    setOldFee(String(activeLocation.default_old_fee_bdt));
  }, [activeLocation?.id]);

  async function handleSendOtp() {
    if (!phone.trim() || busy) return;
    setBusy(true);
    try {
      await sendWalletPhoneOtp(phone.trim());
      triggerSuccessHaptic();
      setAuthStep("otp");
    } catch (error) {
      setScreen({
        status: "error",
        message: error instanceof Error ? error.message : "Could not send OTP.",
      });
    } finally {
      setBusy(false);
    }
  }

  async function handleVerifyOtp() {
    if (!phone.trim() || !otp.trim() || busy) return;
    setBusy(true);
    try {
      await verifyWalletPhoneOtp(phone.trim(), otp.trim());
      triggerSuccessHaptic();
      setAuthStep("phone");
      setOtp("");
      await load();
    } catch (error) {
      setScreen({
        status: "error",
        message: error instanceof Error ? error.message : "Could not verify OTP.",
      });
    } finally {
      setBusy(false);
    }
  }

  async function handleCreateLocation() {
    if (screen.status !== "ready" || !locationName.trim() || busy) return;
    setBusy(true);
    try {
      await createWalletLocation({
        doctorId: screen.dashboard.profile.id,
        name: locationName,
        address: locationAddress,
        defaultNewFeeBdt: numberFromText(defaultNewFee),
        defaultOldFeeBdt: numberFromText(defaultOldFee),
      });
      triggerSuccessHaptic();
      setLocationName("");
      setLocationAddress("");
      setDefaultNewFee("500");
      setDefaultOldFee("300");
      await load();
    } catch (error) {
      setScreen({
        status: "error",
        message:
          error instanceof Error ? error.message : "Could not save location.",
      });
    } finally {
      setBusy(false);
    }
  }

  async function handleCreateEntry() {
    if (screen.status !== "ready" || !activeLocation || busy) return;
    setBusy(true);
    try {
      await createWalletEntry({
        doctorId: screen.dashboard.profile.id,
        locationId: activeLocation.id,
        entryDate,
        newPatientCount: numberFromText(newCount),
        oldPatientCount: numberFromText(oldCount),
        newFeeBdt: numberFromText(newFee),
        oldFeeBdt: numberFromText(oldFee),
        notes,
      });
      triggerSuccessHaptic();
      setNewCount("");
      setOldCount("");
      setNotes("");
      await load();
    } catch (error) {
      setScreen({
        status: "error",
        message: error instanceof Error ? error.message : "Could not save entry.",
      });
    } finally {
      setBusy(false);
    }
  }

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
              Doctor Wallet
            </Text>
            <Text className="font-body text-[13px] text-text-tertiary">
              Location-wise patient count and income
            </Text>
          </View>
          <EmergencyPill compact />
        </View>

        {screen.status === "loading" ? <LoadingState /> : null}
        {screen.status === "not-configured" ? <SetupState /> : null}
        {screen.status === "signed-out" ? (
          <SignInState
            authStep={authStep}
            phone={phone}
            otp={otp}
            busy={busy}
            onPhoneChange={setPhone}
            onOtpChange={setOtp}
            onSendOtp={handleSendOtp}
            onVerifyOtp={handleVerifyOtp}
          />
        ) : null}
        {screen.status === "error" ? (
          <MessageCard
            icon={<RefreshCcw color="#FF3B30" size={22} />}
            title="Wallet needs attention"
            body={screen.message}
            actionLabel="Retry"
            onPress={load}
          />
        ) : null}
        {screen.status === "ready" ? (
          <>
            <View className="rounded-[28px] border border-surface-glassBorder bg-surface p-4">
              <View className="flex-row items-center gap-3">
                <View className="h-11 w-11 items-center justify-center rounded-2xl bg-accent-primarySoft">
                  <WalletCards color="#2470FF" size={22} strokeWidth={1.8} />
                </View>
                <View className="flex-1">
                  <Text className="font-body text-[12px] text-text-tertiary">
                    Today across all locations
                  </Text>
                  <Text className="font-headingSemi text-[24px] text-text-primary">
                    {formatBdt(screen.dashboard.todayTotal)}
                  </Text>
                </View>
                <View className="rounded-2xl bg-surface-muted px-3 py-2">
                  <Text className="text-center font-bodySemi text-[14px] text-accent-primary">
                    {screen.dashboard.todayPatients}
                  </Text>
                  <Text className="font-body text-[10px] text-text-tertiary">
                    patients
                  </Text>
                </View>
              </View>
            </View>

            <Text className="mb-3 mt-6 font-headingSemi text-[18px] text-text-primary">
              Location wallets
            </Text>
            {screen.dashboard.locations.length === 0 ? (
              <MessageCard
                icon={<Building2 color="#2470FF" size={22} />}
                title="No locations yet"
                body="Add your chamber, clinic, or hospital location first. Each location gets its own wallet balance."
              />
            ) : (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                snapToInterval={cardWidth + 12}
                decelerationRate="fast"
                contentContainerStyle={{ gap: 12, paddingRight: 12 }}
                onMomentumScrollEnd={(event) => {
                  const next = Math.round(
                    event.nativeEvent.contentOffset.x / (cardWidth + 12),
                  );
                  setActiveIndex(
                    Math.max(
                      0,
                      Math.min(next, screen.dashboard.locations.length - 1),
                    ),
                  );
                }}
              >
                {screen.dashboard.summaries.map((summary) => (
                  <LocationWalletCard
                    key={summary.location.id}
                    width={cardWidth}
                    summary={summary}
                  />
                ))}
              </ScrollView>
            )}

            <AddLocationCard
              busy={busy}
              name={locationName}
              address={locationAddress}
              defaultNewFee={defaultNewFee}
              defaultOldFee={defaultOldFee}
              onNameChange={setLocationName}
              onAddressChange={setLocationAddress}
              onDefaultNewFeeChange={setDefaultNewFee}
              onDefaultOldFeeChange={setDefaultOldFee}
              onSubmit={handleCreateLocation}
            />

            {activeLocation ? (
              <AddEntryCard
                busy={busy}
                location={activeLocation}
                date={entryDate}
                newCount={newCount}
                oldCount={oldCount}
                newFee={newFee}
                oldFee={oldFee}
                notes={notes}
                onDateChange={setEntryDate}
                onNewCountChange={setNewCount}
                onOldCountChange={setOldCount}
                onNewFeeChange={setNewFee}
                onOldFeeChange={setOldFee}
                onNotesChange={setNotes}
                onSubmit={handleCreateEntry}
              />
            ) : null}
          </>
        ) : null}
      </ScrollView>
    </ClinicalShell>
  );
}

function LocationWalletCard({
  width,
  summary,
}: {
  width: number;
  summary: WalletDashboard["summaries"][number];
}) {
  return (
    <View
      className="rounded-[30px] border border-surface-glassBorder bg-accent-primary p-5"
      style={{
        width,
        shadowColor: "#2470FF",
        shadowOffset: { width: 0, height: 14 },
        shadowOpacity: 0.18,
        shadowRadius: 30,
        elevation: 8,
      }}
    >
      <View className="flex-row items-start justify-between gap-3">
        <View className="flex-1">
          <Text className="font-body text-[12px] uppercase tracking-[0px] text-white/75">
            Location balance
          </Text>
          <Text className="mt-2 font-heading text-[24px] leading-8 text-white">
            {summary.location.name}
          </Text>
          {summary.location.address ? (
            <Text className="mt-1 font-body text-[12px] text-white/75">
              {summary.location.address}
            </Text>
          ) : null}
        </View>
        <View className="h-11 w-11 items-center justify-center rounded-2xl bg-white/20">
          <Landmark color="#FFFFFF" size={22} strokeWidth={1.8} />
        </View>
      </View>

      <View className="mt-6">
        <Text className="font-body text-[12px] text-white/75">
          Total earnings
        </Text>
        <Text className="font-heading text-[30px] leading-10 text-white">
          {formatBdt(summary.lifetimeTotal)}
        </Text>
      </View>

      <View className="mt-5 flex-row gap-3">
        <MetricPill label="Today" value={formatBdt(summary.todayTotal)} />
        <MetricPill label="Month" value={formatBdt(summary.monthTotal)} />
      </View>

      <TouchableOpacity
        onPress={() => {
          triggerSelectionHaptic();
          router.push(`/wallet/location/${summary.location.id}` as never);
        }}
        className="mt-5 min-h-[48px] flex-row items-center justify-center gap-2 rounded-2xl bg-white"
        activeOpacity={0.82}
        accessibilityRole="button"
        accessibilityLabel={`View balance for ${summary.location.name}`}
      >
        <Text className="font-bodySemi text-[14px] text-accent-primary">
          View Balance
        </Text>
        <ChevronRight color="#2470FF" size={18} strokeWidth={1.8} />
      </TouchableOpacity>
    </View>
  );
}

function MetricPill({ label, value }: { label: string; value: string }) {
  return (
    <View className="flex-1 rounded-2xl bg-white/14 px-3 py-3">
      <Text className="font-body text-[11px] text-white/70">{label}</Text>
      <Text className="mt-1 font-bodySemi text-[13px] text-white">
        {value}
      </Text>
    </View>
  );
}

function AddLocationCard(props: {
  busy: boolean;
  name: string;
  address: string;
  defaultNewFee: string;
  defaultOldFee: string;
  onNameChange: (value: string) => void;
  onAddressChange: (value: string) => void;
  onDefaultNewFeeChange: (value: string) => void;
  onDefaultOldFeeChange: (value: string) => void;
  onSubmit: () => void;
}) {
  return (
    <View className="mt-6 rounded-[28px] border border-surface-glassBorder bg-surface p-4">
      <Text className="font-headingSemi text-[18px] text-text-primary">
        Add location
      </Text>
      <Text className="mt-1 font-body text-[12px] text-text-tertiary">
        Save each chamber or clinic with default visit fees.
      </Text>
      <WalletInput
        label="Location name"
        value={props.name}
        onChangeText={props.onNameChange}
        placeholder="Dhanmondi Chamber"
      />
      <WalletInput
        label="Address or note"
        value={props.address}
        onChangeText={props.onAddressChange}
        placeholder="Optional"
      />
      <View className="flex-row gap-3">
        <WalletInput
          label="New fee"
          value={props.defaultNewFee}
          onChangeText={props.onDefaultNewFeeChange}
          keyboardType="numeric"
          containerClassName="flex-1"
        />
        <WalletInput
          label="Old fee"
          value={props.defaultOldFee}
          onChangeText={props.onDefaultOldFeeChange}
          keyboardType="numeric"
          containerClassName="flex-1"
        />
      </View>
      <PrimaryButton
        label="Save location"
        icon={<Plus color="#FFFFFF" size={18} />}
        disabled={props.busy || !props.name.trim()}
        onPress={props.onSubmit}
      />
    </View>
  );
}

function AddEntryCard(props: {
  busy: boolean;
  location: DoctorLocation;
  date: string;
  newCount: string;
  oldCount: string;
  newFee: string;
  oldFee: string;
  notes: string;
  onDateChange: (value: string) => void;
  onNewCountChange: (value: string) => void;
  onOldCountChange: (value: string) => void;
  onNewFeeChange: (value: string) => void;
  onOldFeeChange: (value: string) => void;
  onNotesChange: (value: string) => void;
  onSubmit: () => void;
}) {
  const estimated =
    numberFromText(props.newCount) * numberFromText(props.newFee) +
    numberFromText(props.oldCount) * numberFromText(props.oldFee);

  return (
    <View className="mt-6 rounded-[28px] border border-surface-glassBorder bg-surface p-4">
      <Text className="font-headingSemi text-[18px] text-text-primary">
        Add daily entry
      </Text>
      <Text className="mt-1 font-body text-[12px] text-text-tertiary">
        Current location: {props.location.name}
      </Text>
      <WalletInput
        label="Date"
        value={props.date}
        onChangeText={props.onDateChange}
        placeholder="YYYY-MM-DD"
      />
      <View className="flex-row gap-3">
        <WalletInput
          label="New patients"
          value={props.newCount}
          onChangeText={props.onNewCountChange}
          keyboardType="numeric"
          containerClassName="flex-1"
        />
        <WalletInput
          label="Old patients"
          value={props.oldCount}
          onChangeText={props.onOldCountChange}
          keyboardType="numeric"
          containerClassName="flex-1"
        />
      </View>
      <View className="flex-row gap-3">
        <WalletInput
          label="New fee"
          value={props.newFee}
          onChangeText={props.onNewFeeChange}
          keyboardType="numeric"
          containerClassName="flex-1"
        />
        <WalletInput
          label="Old fee"
          value={props.oldFee}
          onChangeText={props.onOldFeeChange}
          keyboardType="numeric"
          containerClassName="flex-1"
        />
      </View>
      <WalletInput
        label="Notes"
        value={props.notes}
        onChangeText={props.onNotesChange}
        placeholder="Optional"
      />
      <View className="mt-4 flex-row items-center justify-between rounded-2xl bg-surface-muted px-4 py-3">
        <Text className="font-body text-[13px] text-text-tertiary">
          Calculated total
        </Text>
        <Text className="font-headingSemi text-[18px] text-text-primary">
          {formatBdt(estimated)}
        </Text>
      </View>
      <PrimaryButton
        label="Save daily income"
        icon={<Plus color="#FFFFFF" size={18} />}
        disabled={props.busy}
        onPress={props.onSubmit}
      />
    </View>
  );
}

function SignInState(props: {
  authStep: "phone" | "otp";
  phone: string;
  otp: string;
  busy: boolean;
  onPhoneChange: (value: string) => void;
  onOtpChange: (value: string) => void;
  onSendOtp: () => void;
  onVerifyOtp: () => void;
}) {
  return (
    <View className="rounded-[28px] border border-surface-glassBorder bg-surface p-5">
      <View className="h-12 w-12 items-center justify-center rounded-2xl bg-accent-primarySoft">
        <Lock color="#2470FF" size={24} strokeWidth={1.8} />
      </View>
      <Text className="mt-4 font-headingSemi text-[22px] text-text-primary">
        Sign in to Doctor Wallet
      </Text>
      <Text className="mt-2 font-body text-[13px] text-text-tertiary">
        Wallet records are cloud-backed and private to the signed-in doctor.
      </Text>
      <WalletInput
        label="Phone number"
        value={props.phone}
        onChangeText={props.onPhoneChange}
        placeholder="+8801XXXXXXXXX"
        keyboardType="phone-pad"
      />
      {props.authStep === "otp" ? (
        <WalletInput
          label="OTP code"
          value={props.otp}
          onChangeText={props.onOtpChange}
          placeholder="6 digit code"
          keyboardType="numeric"
        />
      ) : null}
      <PrimaryButton
        label={
          props.busy
            ? "Please wait..."
            : props.authStep === "otp"
              ? "Verify OTP"
              : "Send OTP"
        }
        disabled={props.busy}
        onPress={props.authStep === "otp" ? props.onVerifyOtp : props.onSendOtp}
      />
    </View>
  );
}

function SetupState() {
  return (
    <MessageCard
      icon={<Lock color="#2470FF" size={22} />}
      title="Connect Supabase"
      body="Set EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY, then run the doctor wallet Supabase migration."
    />
  );
}

function LoadingState() {
  return (
    <View className="mt-20 items-center justify-center">
      <ActivityIndicator color="#2470FF" />
      <Text className="mt-3 font-body text-[13px] text-text-tertiary">
        Loading wallet...
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
        <PrimaryButton label={actionLabel} onPress={onPress} />
      ) : null}
    </View>
  );
}

function WalletInput({
  label,
  containerClassName = "",
  ...props
}: React.ComponentProps<typeof TextInput> & {
  label: string;
  containerClassName?: string;
}) {
  return (
    <View className={`mt-4 ${containerClassName}`}>
      <Text className="mb-2 font-bodySemi text-[12px] text-text-secondary">
        {label}
      </Text>
      <TextInput
        {...props}
        className="min-h-[48px] rounded-2xl border border-border bg-surface-muted px-4 font-body text-[14px] text-text-primary"
        placeholderTextColor="#8A91A8"
      />
    </View>
  );
}

function PrimaryButton({
  label,
  icon,
  disabled = false,
  onPress,
}: {
  label: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      onPress={() => {
        triggerSelectionHaptic();
        onPress();
      }}
      disabled={disabled}
      className={[
        "mt-4 min-h-[50px] flex-row items-center justify-center gap-2 rounded-2xl",
        disabled ? "bg-surface-muted" : "bg-accent-primary",
      ].join(" ")}
      activeOpacity={0.82}
      accessibilityRole="button"
      accessibilityState={{ disabled }}
    >
      {icon}
      <Text
        className={
          disabled
            ? "font-bodySemi text-[14px] text-text-tertiary"
            : "font-bodySemi text-[14px] text-text-inverse"
        }
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

function numberFromText(value: string) {
  const parsed = Number(value.replace(/,/g, ""));
  return Number.isFinite(parsed) ? parsed : 0;
}
