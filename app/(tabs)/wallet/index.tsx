import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { useState, useEffect, useCallback, useMemo } from "react";
import { useDatabase } from "@/db/provider";
import { clinics, visitLogs } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import {
  MapPin,
  Play,
  Square,
  Plus,
  Clock,
  Users,
  Calendar,
  Wallet,
} from "lucide-react";

// ── types ──────────────────────────────────────────────────────────────────

type Clinic = typeof clinics.$inferSelect;
type VisitLog = typeof visitLogs.$inferSelect;

interface ActiveVisit {
  clinicId: number;
  startTime: Date;
  patients: number;
}

// ── helpers ────────────────────────────────────────────────────────────────

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

function monthPrefix() {
  return new Date().toISOString().slice(0, 7);
}

function formatTime(d: Date) {
  return d.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

function formatDateLabel(iso: string) {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

function monthLabel() {
  return new Date().toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
}

// ── ElapsedTimer ───────────────────────────────────────────────────────────

function ElapsedTimer({ startTime }: { startTime: Date }) {
  const [elapsed, setElapsed] = useState("0:00");

  useEffect(() => {
    const tick = () => {
      const secs = Math.floor((Date.now() - startTime.getTime()) / 1000);
      const h = Math.floor(secs / 3600);
      const m = Math.floor((secs % 3600) / 60);
      const s = secs % 60;
      setElapsed(
        h > 0
          ? `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`
          : `${m}:${String(s).padStart(2, "0")}`,
      );
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [startTime]);

  return (
    <Text className="font-mono text-[13px] text-clinical-teal">{elapsed}</Text>
  );
}

// ── ClinicCard ─────────────────────────────────────────────────────────────

function ClinicCard({
  clinic,
  monthEarnings,
  active,
  onStart,
  onEnd,
  onAddPatient,
}: {
  clinic: Clinic;
  monthEarnings: number;
  active: ActiveVisit | null;
  onStart: () => void;
  onEnd: () => void;
  onAddPatient: () => void;
}) {
  const isActive = active?.clinicId === clinic.id;
  const accentColor = clinic.color ?? "#00D7B5";

  return (
    <View
      className="mb-3 overflow-hidden rounded-clinical border border-border bg-surface"
      style={
        isActive
          ? {
              borderColor: accentColor + "60",
              shadowColor: accentColor,
              shadowOpacity: 0.2,
              shadowRadius: 12,
              elevation: 6,
            }
          : undefined
      }
    >
      {/* color strip */}
      <View style={{ height: 3, backgroundColor: accentColor }} />

      <View className="p-4">
        {/* header row */}
        <View className="flex-row items-start gap-3">
          <View
            className="h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl"
            style={{ backgroundColor: accentColor + "22" }}
          >
            <MapPin size={16} color={accentColor} />
          </View>

          <View className="min-w-0 flex-1">
            <Text
              className="font-bodySemi text-[15px] text-text-primary"
              numberOfLines={1}
            >
              {clinic.name}
            </Text>
            {clinic.nameBn ? (
              <Text className="font-body text-[11px] text-text-tertiary">
                {clinic.nameBn}
              </Text>
            ) : null}
            {clinic.address ? (
              <View className="mt-1.5 flex-row items-center gap-1">
                <MapPin size={10} color="#7A7A80" />
                <Text
                  className="font-body text-[11px] text-text-tertiary"
                  numberOfLines={1}
                >
                  {clinic.address}
                </Text>
              </View>
            ) : null}
            {clinic.schedule ? (
              <View className="mt-0.5 flex-row items-center gap-1">
                <Clock size={10} color="#7A7A80" />
                <Text className="font-body text-[11px] text-text-tertiary">
                  {clinic.schedule}
                </Text>
              </View>
            ) : null}
          </View>

          {/* earnings column */}
          <View className="flex-shrink-0 items-end">
            <Text className="font-body text-[10px] text-text-tertiary">
              This month
            </Text>
            <Text
              className="font-heading text-[20px] leading-tight"
              style={{ color: accentColor }}
            >
              ৳{monthEarnings.toLocaleString()}
            </Text>
            <Text className="font-body text-[10px] text-text-tertiary">
              ৳{clinic.feeBdt} / visit
            </Text>
          </View>
        </View>

        {/* active visit live banner */}
        {isActive && active ? (
          <View
            className="mt-3 flex-row items-center gap-3 rounded-2xl p-3"
            style={{ backgroundColor: accentColor + "18" }}
          >
            <View className="flex-1">
              <View className="flex-row items-center gap-2">
                <View
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: accentColor }}
                />
                <Text
                  className="font-bodySemi text-[12px]"
                  style={{ color: accentColor }}
                >
                  Live ·{" "}
                </Text>
                <ElapsedTimer startTime={active.startTime} />
              </View>
              <Text className="mt-0.5 font-body text-[11px] text-text-tertiary">
                {active.patients} patient{active.patients !== 1 ? "s" : ""} · ৳
                {(active.patients * clinic.feeBdt).toLocaleString()} earned
              </Text>
            </View>
            <TouchableOpacity
              onPress={onAddPatient}
              className="h-9 w-9 items-center justify-center rounded-xl"
              style={{ backgroundColor: accentColor + "28" }}
              activeOpacity={0.7}
              accessibilityLabel="Add patient"
            >
              <Plus size={16} color={accentColor} />
            </TouchableOpacity>
          </View>
        ) : null}

        {/* action button */}
        <View className="mt-3">
          {isActive ? (
            <TouchableOpacity
              onPress={onEnd}
              className="flex-row items-center justify-center gap-2 rounded-2xl py-3"
              style={{
                backgroundColor: "#FF453A22",
                borderColor: "#FF453A40",
                borderWidth: 1,
              }}
              activeOpacity={0.75}
              accessibilityRole="button"
              accessibilityLabel="End visit"
            >
              <Square size={14} color="#FF453A" />
              <Text className="font-bodySemi text-[13px] text-clinical-red">
                End Visit
              </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={onStart}
              className="flex-row items-center justify-center gap-2 rounded-2xl py-3"
              style={{
                backgroundColor: accentColor + "22",
                borderColor: accentColor + "40",
                borderWidth: 1,
              }}
              activeOpacity={0.75}
              accessibilityRole="button"
              accessibilityLabel={`Start visit at ${clinic.name}`}
            >
              <Play size={14} color={accentColor} />
              <Text
                className="font-bodySemi text-[13px]"
                style={{ color: accentColor }}
              >
                Start Visit
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
}

// ── VisitRow ───────────────────────────────────────────────────────────────

function VisitRow({
  visit,
  clinic,
}: {
  visit: VisitLog;
  clinic: Clinic | undefined;
}) {
  if (!clinic) return null;
  const accentColor = clinic.color ?? "#00D7B5";
  return (
    <View className="mb-2 flex-row items-center gap-3 rounded-2xl border border-border bg-surface p-4">
      <View
        className="h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl"
        style={{ backgroundColor: accentColor + "18" }}
      >
        <MapPin size={16} color={accentColor} />
      </View>
      <View className="min-w-0 flex-1">
        <Text
          className="font-bodySemi text-[13px] text-text-primary"
          numberOfLines={1}
        >
          {clinic.name}
        </Text>
        <Text className="mt-0.5 font-body text-[11px] text-text-tertiary">
          {formatDateLabel(visit.date)}
          {visit.startTime ? ` · ${visit.startTime}` : ""}
          {visit.endTime ? `–${visit.endTime}` : ""}
        </Text>
        <View className="mt-1 flex-row items-center gap-1">
          <Users size={10} color="#7A7A80" />
          <Text className="font-body text-[11px] text-text-tertiary">
            {visit.patients} patients
          </Text>
        </View>
      </View>
      <View className="flex-shrink-0 items-end">
        <Text
          className="font-heading text-[15px]"
          style={{ color: accentColor }}
        >
          ৳{visit.earningsBdt.toLocaleString()}
        </Text>
        <Text className="font-body text-[10px] text-text-tertiary">earned</Text>
      </View>
    </View>
  );
}

// ── AddClinicModal ─────────────────────────────────────────────────────────

const CLINIC_COLORS = [
  "#00D7B5",
  "#C8F53C",
  "#7B2FBE",
  "#64D2FF",
  "#FFD60A",
  "#FF453A",
  "#E91E8C",
];

function AddClinicModal({
  visible,
  onClose,
  onSave,
}: {
  visible: boolean;
  onClose: () => void;
  onSave: (data: {
    name: string;
    nameBn: string;
    address: string;
    schedule: string;
    feeBdt: number;
    color: string;
  }) => void;
}) {
  const [name, setName] = useState("");
  const [nameBn, setNameBn] = useState("");
  const [address, setAddress] = useState("");
  const [schedule, setSchedule] = useState("");
  const [fee, setFee] = useState("500");
  const [color, setColor] = useState(CLINIC_COLORS[0]);

  const reset = () => {
    setName("");
    setNameBn("");
    setAddress("");
    setSchedule("");
    setFee("500");
    setColor(CLINIC_COLORS[0]);
  };

  const handleSave = () => {
    if (!name.trim()) return;
    onSave({
      name: name.trim(),
      nameBn: nameBn.trim(),
      address: address.trim(),
      schedule: schedule.trim(),
      feeBdt: Number(fee) || 500,
      color,
    });
    reset();
  };

  const inputCls =
    "rounded-xl border border-border bg-ink-800 px-3 py-3 font-body text-[14px] text-text-primary";

  return (
    <Modal visible={visible} transparent animationType="slide">
      <Pressable className="flex-1 justify-end bg-black/60" onPress={onClose}>
        <Pressable onPress={() => {}}>
          <View className="rounded-t-[28px] bg-surface-elevated p-6 pb-10">
            <View className="mb-5 h-1 w-10 self-center rounded-full bg-border-medium" />
            <Text className="mb-5 font-heading text-[20px] text-text-primary">
              Add Clinic
            </Text>

            <Text className="mb-1 font-bodySemi text-[11px] uppercase tracking-widest text-text-tertiary">
              Clinic Name
            </Text>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="e.g. Dhaka Medical Chamber"
              placeholderTextColor="#4A4A4F"
              className={`${inputCls} mb-3`}
            />

            <Text className="mb-1 font-bodySemi text-[11px] uppercase tracking-widest text-text-tertiary">
              Name in Bengali (optional)
            </Text>
            <TextInput
              value={nameBn}
              onChangeText={setNameBn}
              placeholder="বাংলা নাম"
              placeholderTextColor="#4A4A4F"
              className={`${inputCls} mb-3`}
            />

            <Text className="mb-1 font-bodySemi text-[11px] uppercase tracking-widest text-text-tertiary">
              Address
            </Text>
            <TextInput
              value={address}
              onChangeText={setAddress}
              placeholder="Mirpur Road, Dhaka"
              placeholderTextColor="#4A4A4F"
              className={`${inputCls} mb-3`}
            />

            <Text className="mb-1 font-bodySemi text-[11px] uppercase tracking-widest text-text-tertiary">
              Schedule
            </Text>
            <TextInput
              value={schedule}
              onChangeText={setSchedule}
              placeholder="Sat–Thu  6–9 PM"
              placeholderTextColor="#4A4A4F"
              className={`${inputCls} mb-3`}
            />

            <Text className="mb-1 font-bodySemi text-[11px] uppercase tracking-widest text-text-tertiary">
              Consultation Fee (৳)
            </Text>
            <TextInput
              value={fee}
              onChangeText={setFee}
              keyboardType="numeric"
              placeholder="500"
              placeholderTextColor="#4A4A4F"
              className={`${inputCls} mb-4`}
            />

            <Text className="mb-2 font-bodySemi text-[11px] uppercase tracking-widest text-text-tertiary">
              Color
            </Text>
            <View className="mb-5 flex-row gap-2">
              {CLINIC_COLORS.map((c) => (
                <TouchableOpacity
                  key={c}
                  onPress={() => setColor(c)}
                  className="h-8 w-8 rounded-full"
                  style={{
                    backgroundColor: c,
                    borderWidth: color === c ? 2.5 : 0,
                    borderColor: "#FFFFFF",
                  }}
                  activeOpacity={0.8}
                />
              ))}
            </View>

            <TouchableOpacity
              onPress={handleSave}
              className="items-center rounded-2xl py-4"
              style={{ backgroundColor: color }}
              activeOpacity={0.8}
              disabled={!name.trim()}
            >
              <Text className="font-bodySemi text-[15px] text-text-inverse">
                Save Clinic
              </Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

// ── WalletScreen ───────────────────────────────────────────────────────────

export default function WalletScreen() {
  const { db } = useDatabase();

  const [clinicList, setClinicList] = useState<Clinic[]>([]);
  const [recentVisits, setRecentVisits] = useState<VisitLog[]>([]);
  const [monthEarningsMap, setMonthEarningsMap] = useState<
    Record<number, number>
  >({});
  const [activeVisit, setActiveVisit] = useState<ActiveVisit | null>(null);
  const [showAddClinic, setShowAddClinic] = useState(false);
  const [loading, setLoading] = useState(true);

  // ── data loading ──────────────────────────────────────────────────────

  const loadData = useCallback(async () => {
    if (!db) return;
    const [cls, visits] = await Promise.all([
      db.select().from(clinics).where(eq(clinics.active, true)).all(),
      db
        .select()
        .from(visitLogs)
        .orderBy(desc(visitLogs.createdAt))
        .limit(20)
        .all(),
    ]);
    setClinicList(cls);
    setRecentVisits(visits);

    const prefix = monthPrefix();
    const map: Record<number, number> = {};
    for (const c of cls) map[c.id] = 0;
    for (const v of visits) {
      if (v.date.startsWith(prefix)) {
        map[v.clinicId] = (map[v.clinicId] ?? 0) + v.earningsBdt;
      }
    }
    setMonthEarningsMap(map);
    setLoading(false);
  }, [db]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // ── computed totals ───────────────────────────────────────────────────

  const prefix = monthPrefix();

  const totalMonthEarnings = useMemo(() => {
    const base = Object.values(monthEarningsMap).reduce((a, b) => a + b, 0);
    const live = activeVisit
      ? activeVisit.patients *
        (clinicList.find((c) => c.id === activeVisit.clinicId)?.feeBdt ?? 0)
      : 0;
    return base + live;
  }, [monthEarningsMap, activeVisit, clinicList]);

  const totalMonthPatients = useMemo(() => {
    const base = recentVisits
      .filter((v) => v.date.startsWith(prefix))
      .reduce((s, v) => s + v.patients, 0);
    return base + (activeVisit?.patients ?? 0);
  }, [recentVisits, activeVisit, prefix]);

  const totalMonthVisits = useMemo(() => {
    const base = recentVisits.filter((v) => v.date.startsWith(prefix)).length;
    return base + (activeVisit ? 1 : 0);
  }, [recentVisits, activeVisit, prefix]);

  // ── visit actions ─────────────────────────────────────────────────────

  const handleStart = useCallback((clinic: Clinic) => {
    setActiveVisit({ clinicId: clinic.id, startTime: new Date(), patients: 0 });
  }, []);

  const handleEnd = useCallback(async () => {
    if (!activeVisit || !db) return;
    const clinic = clinicList.find((c) => c.id === activeVisit.clinicId);
    if (!clinic) return;
    const now = new Date();
    await db.insert(visitLogs).values({
      clinicId: activeVisit.clinicId,
      date: todayISO(),
      startTime: formatTime(activeVisit.startTime),
      endTime: formatTime(now),
      patients: activeVisit.patients,
      earningsBdt: activeVisit.patients * clinic.feeBdt,
    });
    setActiveVisit(null);
    loadData();
  }, [activeVisit, db, clinicList, loadData]);

  const handleAddPatient = useCallback(() => {
    setActiveVisit((prev) =>
      prev ? { ...prev, patients: prev.patients + 1 } : prev,
    );
  }, []);

  const handleAddClinic = useCallback(
    async (data: {
      name: string;
      nameBn: string;
      address: string;
      schedule: string;
      feeBdt: number;
      color: string;
    }) => {
      if (!db) return;
      await db.insert(clinics).values({
        name: data.name,
        nameBn: data.nameBn || null,
        address: data.address || null,
        schedule: data.schedule || null,
        feeBdt: data.feeBdt,
        color: data.color,
      });
      setShowAddClinic(false);
      loadData();
    },
    [db, loadData],
  );

  // ── render ────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator color="#00D7B5" size="large" />
      </View>
    );
  }

  return (
    <>
      <ScrollView
        className="flex-1 bg-background"
        contentContainerStyle={{ paddingBottom: 104 }}
        showsVerticalScrollIndicator={false}
      >
        {/* ── earnings hero ─────────────────────────────────────── */}
        <View
          className="relative overflow-hidden px-5 pb-8 pt-5"
          style={{
            backgroundColor: "#0A1628",
            borderBottomLeftRadius: 28,
            borderBottomRightRadius: 28,
          }}
        >
          {/* decorative rings */}
          <View
            className="absolute -bottom-10 -right-10 h-48 w-48 rounded-full border border-white"
            style={{ opacity: 0.05 }}
          />
          <View
            className="absolute -bottom-4 -right-4 h-28 w-28 rounded-full border border-white"
            style={{ opacity: 0.07 }}
          />

          <View className="flex-row items-center justify-between">
            <View>
              <Text className="font-heading text-[26px] leading-tight text-text-primary">
                My Clinics
              </Text>
              <Text className="mt-0.5 font-body text-[12px] text-text-tertiary">
                {monthLabel()}
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => setShowAddClinic(true)}
              className="h-10 w-10 items-center justify-center rounded-2xl border border-border-medium"
              style={{ backgroundColor: "rgba(255,255,255,0.06)" }}
              activeOpacity={0.7}
              accessibilityLabel="Add clinic"
            >
              <Plus size={18} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          {/* total earnings */}
          <View className="mt-6 flex-row items-end justify-between">
            <View>
              <Text className="font-bodySemi text-[10px] uppercase tracking-widest text-text-tertiary">
                Total Earnings
              </Text>
              <View className="mt-1 flex-row items-baseline gap-1">
                <Text className="font-body text-[13px] text-text-tertiary">
                  ৳
                </Text>
                <Text className="font-heading text-[44px] leading-none text-text-primary">
                  {totalMonthEarnings.toLocaleString()}
                </Text>
              </View>
              <Text className="mt-0.5 font-body text-[11px] text-text-tertiary">
                This Month
              </Text>
            </View>

            {/* stat chips */}
            <View className="gap-2">
              <View
                className="rounded-xl px-3 py-2"
                style={{ backgroundColor: "rgba(255,255,255,0.08)" }}
              >
                <View className="flex-row items-center gap-1.5">
                  <Users size={11} color="#7A7A80" />
                  <Text className="font-body text-[10px] text-text-tertiary">
                    Patients
                  </Text>
                </View>
                <Text className="font-heading text-[20px] leading-tight text-text-primary">
                  {totalMonthPatients}
                </Text>
              </View>
              <View
                className="rounded-xl px-3 py-2"
                style={{ backgroundColor: "rgba(255,255,255,0.08)" }}
              >
                <View className="flex-row items-center gap-1.5">
                  <Calendar size={11} color="#7A7A80" />
                  <Text className="font-body text-[10px] text-text-tertiary">
                    Visits
                  </Text>
                </View>
                <Text className="font-heading text-[20px] leading-tight text-text-primary">
                  {totalMonthVisits}
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View className="px-4 pt-5">
          {/* ── clinic cards ─────────────────────────────────────── */}
          <Text className="mb-3 font-bodySemi text-[11px] uppercase tracking-widest text-text-tertiary">
            Clinic Locations
          </Text>

          {clinicList.length === 0 ? (
            <View className="mb-4 items-center rounded-clinical border border-border bg-surface py-12">
              <Wallet size={36} color="#2C2C30" />
              <Text className="mt-3 font-bodySemi text-[14px] text-text-primary">
                No clinics yet
              </Text>
              <Text className="mt-1 font-body text-[12px] text-text-tertiary">
                Tap + to add your first clinic location
              </Text>
              <TouchableOpacity
                onPress={() => setShowAddClinic(true)}
                className="mt-4 flex-row items-center gap-2 rounded-2xl px-5 py-2.5"
                style={{
                  backgroundColor: "#00D7B522",
                  borderColor: "#00D7B540",
                  borderWidth: 1,
                }}
                activeOpacity={0.7}
              >
                <Plus size={14} color="#00D7B5" />
                <Text className="font-bodySemi text-[13px] text-clinical-teal">
                  Add Clinic
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            clinicList.map((clinic) => (
              <ClinicCard
                key={clinic.id}
                clinic={clinic}
                monthEarnings={monthEarningsMap[clinic.id] ?? 0}
                active={activeVisit}
                onStart={() => handleStart(clinic)}
                onEnd={handleEnd}
                onAddPatient={handleAddPatient}
              />
            ))
          )}

          {/* ── visit history ─────────────────────────────────────── */}
          {recentVisits.length > 0 ? (
            <View className="mt-2">
              <Text className="mb-3 font-bodySemi text-[11px] uppercase tracking-widest text-text-tertiary">
                Visit History
              </Text>
              {recentVisits.map((visit) => (
                <VisitRow
                  key={visit.id}
                  visit={visit}
                  clinic={clinicList.find((c) => c.id === visit.clinicId)}
                />
              ))}
            </View>
          ) : null}
        </View>
      </ScrollView>

      <AddClinicModal
        visible={showAddClinic}
        onClose={() => setShowAddClinic(false)}
        onSave={handleAddClinic}
      />
    </>
  );
}
