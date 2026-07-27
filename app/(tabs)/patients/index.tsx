import { EmptyState } from "@/components/premium/EmptyState";
import { useDatabase } from "@/db/provider";
import { appointments, clinics, patients } from "@/db/schema";
import {
  triggerSelectionHaptic,
  triggerSuccessHaptic,
} from "@/lib/clinical-haptics";
import { cn } from "@/lib/utils";
import { and, desc, eq, like, or } from "drizzle-orm";
import { router } from "expo-router";
import {
  CalendarClock,
  Phone,
  Plus,
  Search,
  ShieldAlert,
  UserRound,
  Users,
} from "lucide-react-native";
import { MotiView } from "moti";
import { useCallback, useEffect, useState } from "react";
import {
  FlatList,
  Pressable,
  RefreshControl,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

type Patient = typeof patients.$inferSelect;
type Clinic = typeof clinics.$inferSelect;
type Appointment = typeof appointments.$inferSelect;

function initials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");
}

function genderColor(gender: string | null): string {
  if (gender === "male") return "#64D2FF";
  if (gender === "female") return "#E91E8C";
  return "#7A7A80";
}

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

function statusColor(status: string | null): string {
  if (status === "in_progress") return "#C8F53C";
  if (status === "done") return "#00D7B5";
  if (status === "no_show") return "#7A7A80";
  return "#FFD60A";
}

function statusLabel(status: string | null): string {
  if (status === "in_progress") return "In Progress";
  if (status === "done") return "Done";
  if (status === "no_show") return "No Show";
  return "Waiting";
}

function RegistryTab() {
  const { db } = useDatabase();
  const [query, setQuery] = useState("");
  const [rows, setRows] = useState<Patient[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    if (!db) return;
    const term = query.trim() ? `%${query.trim()}%` : null;
    const list = term
      ? await db
          .select()
          .from(patients)
          .where(or(like(patients.name, term), like(patients.phone, term)))
          .orderBy(desc(patients.updatedAt))
          .limit(100)
      : await db
          .select()
          .from(patients)
          .orderBy(desc(patients.updatedAt))
          .limit(100);
    setRows(list);
  }, [db, query]);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <>
      <View className="px-4 pb-3">
        <View className="flex-row items-center gap-2 rounded-2xl border border-border bg-surface px-3.5 py-2.5">
          <Search size={16} color="#7A7A80" />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search by name or phone"
            placeholderTextColor="#4A4A4F"
            className="flex-1 font-body text-[13.5px] text-text-primary"
          />
        </View>
      </View>

      <FlatList
        data={rows}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 100 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={async () => {
              setRefreshing(true);
              await load();
              setRefreshing(false);
            }}
            tintColor="#C8F53C"
          />
        }
        ListEmptyComponent={
          <EmptyState
            icon={UserRound}
            title="No patients yet"
            subtitle="Add your first patient to start building your registry"
            ctaText="Add Patient"
            ctaOnPress={() => router.push("/patients/new" as never)}
          />
        }
        renderItem={({ item, index }) => (
          <MotiView
            from={{ opacity: 0, translateY: 8 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{
              type: "timing",
              duration: 200,
              delay: Math.min(index, 8) * 40,
            }}
          >
            <TouchableOpacity
              onPress={() => {
                triggerSelectionHaptic();
                router.push(`/patients/${item.id}` as never);
              }}
              activeOpacity={0.75}
              className="mb-2.5 flex-row items-center gap-3 rounded-clinical border border-border bg-surface p-3.5"
            >
              <View
                className="h-11 w-11 items-center justify-center rounded-full"
                style={{ backgroundColor: `${genderColor(item.gender)}22` }}
              >
                <Text
                  className="font-bodySemi text-[13px]"
                  style={{ color: genderColor(item.gender) }}
                >
                  {initials(item.name)}
                </Text>
              </View>
              <View className="flex-1">
                <Text className="font-bodySemi text-[14px] text-text-primary">
                  {item.name}
                </Text>
                <Text className="mt-0.5 font-body text-[11.5px] text-text-tertiary">
                  {[
                    item.ageYears ? `${item.ageYears}y` : null,
                    item.gender,
                    item.phone,
                  ]
                    .filter(Boolean)
                    .join(" · ")}
                </Text>
              </View>
              {item.drugAllergies ? (
                <ShieldAlert size={16} color="#FF453A" strokeWidth={1.8} />
              ) : null}
            </TouchableOpacity>
          </MotiView>
        )}
      />

      <TouchableOpacity
        onPress={() => {
          triggerSelectionHaptic();
          router.push("/patients/new" as never);
        }}
        className="absolute bottom-6 right-5 h-14 w-14 items-center justify-center rounded-full bg-accent-primary shadow-fabShadow"
        accessibilityRole="button"
        accessibilityLabel="New patient"
      >
        <Plus size={24} color="#0C0C0E" strokeWidth={2.2} />
      </TouchableOpacity>
    </>
  );
}

function QueueTab() {
  const { db } = useDatabase();
  const [clinicList, setClinicList] = useState<Clinic[]>([]);
  const [selectedClinic, setSelectedClinic] = useState<number | null>(null);
  const [queue, setQueue] = useState<Appointment[]>([]);
  const [addName, setAddName] = useState("");
  const [addPhone, setAddPhone] = useState("");
  const [showAdd, setShowAdd] = useState(false);

  useEffect(() => {
    if (!db) return;
    db.select()
      .from(clinics)
      .where(eq(clinics.active, true))

      .then((rows) => {
        setClinicList(rows);
        if (rows.length && selectedClinic == null)
          setSelectedClinic(rows[0].id);
      });
  }, [db, selectedClinic]);

  const loadQueue = useCallback(async () => {
    if (!db || selectedClinic == null) return;
    const rows = await db
      .select()
      .from(appointments)
      .where(
        and(
          eq(appointments.clinicId, selectedClinic),
          eq(appointments.date, todayISO()),
        ),
      )
      .orderBy(appointments.serialNumber)
      .all();
    setQueue(rows);
  }, [db, selectedClinic]);

  useEffect(() => {
    loadQueue();
  }, [loadQueue]);

  async function handleAddToQueue() {
    if (!db || selectedClinic == null || !addName.trim()) return;
    const clinic = clinicList.find((c) => c.id === selectedClinic);
    const nextSerial = clinic?.nextSerial ?? 1;

    const matched = addPhone.trim()
      ? await db
          .select()
          .from(patients)
          .where(eq(patients.phone, addPhone.trim()))
          .limit(1)
          .all()
      : [];

    await db.insert(appointments).values({
      clinicId: selectedClinic,
      patientId: matched[0]?.id ?? null,
      patientName: addName.trim(),
      patientPhone: addPhone.trim() || null,
      serialNumber: nextSerial,
      date: todayISO(),
      status: "waiting",
    });
    await db
      .update(clinics)
      .set({ nextSerial: nextSerial + 1 })
      .where(eq(clinics.id, selectedClinic));

    triggerSuccessHaptic();
    setAddName("");
    setAddPhone("");
    setShowAdd(false);
    loadQueue();
  }

  async function updateStatus(appt: Appointment, status: string) {
    if (!db) return;
    triggerSelectionHaptic();
    await db
      .update(appointments)
      .set({ status })
      .where(eq(appointments.id, appt.id));
    loadQueue();
    if (status === "done") {
      router.push("/(tabs)/prescribe" as never);
    }
  }

  const waitingCount = queue.filter((q) => q.status === "waiting").length;
  const doneCount = queue.filter((q) => q.status === "done").length;

  return (
    <View className="flex-1">
      {clinicList.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No clinics yet"
          subtitle="Add a clinic from the Wallet tab to start a queue"
        />
      ) : (
        <>
          <View className="flex-row gap-2 px-4 pb-3">
            {clinicList.map((c) => (
              <Pressable
                key={c.id}
                onPress={() => {
                  triggerSelectionHaptic();
                  setSelectedClinic(c.id);
                }}
                className={cn(
                  "rounded-pill border px-3.5 py-2",
                  selectedClinic === c.id
                    ? "border-accent-primary bg-accent-primarySoft"
                    : "border-border bg-surface",
                )}
              >
                <Text
                  className={cn(
                    "font-bodySemi text-[12px]",
                    selectedClinic === c.id
                      ? "text-accent-primary"
                      : "text-text-secondary",
                  )}
                >
                  {c.name}
                </Text>
              </Pressable>
            ))}
          </View>

          <View className="mb-3 flex-row gap-2 px-4">
            <View className="flex-1 rounded-xl border border-border bg-surface px-3 py-2">
              <Text className="font-body text-[10px] text-text-tertiary">
                Waiting
              </Text>
              <Text className="font-heading text-[18px] text-warning">
                {waitingCount}
              </Text>
            </View>
            <View className="flex-1 rounded-xl border border-border bg-surface px-3 py-2">
              <Text className="font-body text-[10px] text-text-tertiary">
                Done Today
              </Text>
              <Text className="font-heading text-[18px] text-clinical-teal">
                {doneCount}
              </Text>
            </View>
          </View>

          <FlatList
            data={queue}
            keyExtractor={(item) => String(item.id)}
            contentContainerStyle={{
              paddingHorizontal: 16,
              paddingBottom: 100,
            }}
            ListEmptyComponent={
              <EmptyState
                icon={CalendarClock}
                title="No one in queue"
                subtitle="Add a patient to the queue to get started"
              />
            }
            renderItem={({ item }) => (
              <View className="mb-2.5 flex-row items-center gap-3 rounded-clinical border border-border bg-surface p-3.5">
                <View className="h-10 w-10 items-center justify-center rounded-full bg-surface-elevated">
                  <Text className="font-heading text-[15px] text-text-primary">
                    {item.serialNumber}
                  </Text>
                </View>
                <View className="flex-1">
                  <Text className="font-bodySemi text-[13.5px] text-text-primary">
                    {item.patientName}
                  </Text>
                  {item.patientPhone ? (
                    <View className="mt-0.5 flex-row items-center gap-1">
                      <Phone size={10} color="#7A7A80" />
                      <Text className="font-body text-[11px] text-text-tertiary">
                        {item.patientPhone}
                      </Text>
                    </View>
                  ) : null}
                </View>
                <View className="items-end gap-1.5">
                  <View
                    className="rounded-pill px-2.5 py-1"
                    style={{ backgroundColor: `${statusColor(item.status)}22` }}
                  >
                    <Text
                      className="font-bodySemi text-[10px]"
                      style={{ color: statusColor(item.status) }}
                    >
                      {statusLabel(item.status)}
                    </Text>
                  </View>
                  {item.status === "waiting" ? (
                    <TouchableOpacity
                      onPress={() => updateStatus(item, "in_progress")}
                    >
                      <Text className="font-bodySemi text-[11px] text-accent-primary">
                        Start
                      </Text>
                    </TouchableOpacity>
                  ) : item.status === "in_progress" ? (
                    <TouchableOpacity
                      onPress={() => updateStatus(item, "done")}
                    >
                      <Text className="font-bodySemi text-[11px] text-clinical-teal">
                        Mark Done
                      </Text>
                    </TouchableOpacity>
                  ) : null}
                </View>
              </View>
            )}
          />

          {showAdd ? (
            <View className="absolute inset-x-0 bottom-0 gap-2 border-t border-border-soft bg-surface px-4 pb-8 pt-3">
              <TextInput
                value={addName}
                onChangeText={setAddName}
                placeholder="Patient name"
                placeholderTextColor="#4A4A4F"
                className="rounded-xl border border-border bg-background px-3.5 py-3 font-body text-[14px] text-text-primary"
              />
              <TextInput
                value={addPhone}
                onChangeText={setAddPhone}
                placeholder="Phone (optional)"
                placeholderTextColor="#4A4A4F"
                keyboardType="phone-pad"
                className="rounded-xl border border-border bg-background px-3.5 py-3 font-body text-[14px] text-text-primary"
              />
              <View className="flex-row gap-2">
                <TouchableOpacity
                  onPress={() => setShowAdd(false)}
                  className="flex-1 items-center rounded-2xl border border-border py-3.5"
                >
                  <Text className="font-bodySemi text-[13.5px] text-text-secondary">
                    Cancel
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  disabled={!addName.trim()}
                  onPress={handleAddToQueue}
                  className={cn(
                    "flex-1 items-center rounded-2xl py-3.5",
                    addName.trim()
                      ? "bg-accent-primary"
                      : "bg-surface-elevated",
                  )}
                >
                  <Text
                    className={cn(
                      "font-bodySemi text-[13.5px]",
                      addName.trim()
                        ? "text-text-inverse"
                        : "text-text-disabled",
                    )}
                  >
                    Add
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <TouchableOpacity
              onPress={() => {
                triggerSelectionHaptic();
                setShowAdd(true);
              }}
              className="absolute bottom-6 right-5 h-14 w-14 items-center justify-center rounded-full bg-accent-primary shadow-fabShadow"
              accessibilityRole="button"
              accessibilityLabel="Add to queue"
            >
              <Plus size={24} color="#0C0C0E" strokeWidth={2.2} />
            </TouchableOpacity>
          )}
        </>
      )}
    </View>
  );
}

export default function PatientsScreen() {
  const [mode, setMode] = useState<"registry" | "queue">("registry");

  return (
    <View className="flex-1 bg-background pt-2">
      <View className="px-4 pb-3">
        <Text className="mb-1 font-heading text-[24px] text-text-primary">
          Patients
        </Text>
        <View className="mt-2 flex-row rounded-2xl border border-border bg-surface p-1">
          <Pressable
            onPress={() => {
              triggerSelectionHaptic();
              setMode("registry");
            }}
            className={cn(
              "flex-1 items-center rounded-xl py-2.5",
              mode === "registry" ? "bg-accent-primary" : undefined,
            )}
          >
            <Text
              className={cn(
                "font-bodySemi text-[12.5px]",
                mode === "registry"
                  ? "text-text-inverse"
                  : "text-text-secondary",
              )}
            >
              Registry
            </Text>
          </Pressable>
          <Pressable
            onPress={() => {
              triggerSelectionHaptic();
              setMode("queue");
            }}
            className={cn(
              "flex-1 items-center rounded-xl py-2.5",
              mode === "queue" ? "bg-accent-primary" : undefined,
            )}
          >
            <Text
              className={cn(
                "font-bodySemi text-[12.5px]",
                mode === "queue" ? "text-text-inverse" : "text-text-secondary",
              )}
            >
              Queue
            </Text>
          </Pressable>
        </View>
      </View>

      {mode === "registry" ? <RegistryTab /> : <QueueTab />}
    </View>
  );
}
