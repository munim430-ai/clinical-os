import { GlassCard } from "@/components/premium/GlassCard";
import { useDatabase } from "@/db/provider";
import { patients, prescriptions, vitalsLog } from "@/db/schema";
import { triggerSelectionHaptic } from "@/lib/clinical-haptics";
import { useRxStore } from "@/lib/rx-store";
import { Canvas, Circle, Path, Skia } from "@shopify/react-native-skia";
import { desc, eq } from "drizzle-orm";
import { router, useLocalSearchParams } from "expo-router";
import {
  ArrowLeft,
  CalendarPlus,
  FileText,
  Pencil,
  ShieldAlert,
} from "lucide-react-native";
import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type Patient = typeof patients.$inferSelect;
type Prescription = typeof prescriptions.$inferSelect;
type Vitals = typeof vitalsLog.$inferSelect;

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");
}

function WeightTrendChart({ points }: { points: number[] }) {
  const width = 300;
  const height = 80;
  const { path, dots } = useMemo(() => {
    if (points.length < 2)
      return { path: Skia.Path.Make(), dots: [] as { x: number; y: number }[] };
    const min = Math.min(...points);
    const max = Math.max(...points);
    const range = max - min || 1;
    const stepX = width / (points.length - 1);
    const coords = points.map((p, i) => ({
      x: i * stepX,
      y: height - ((p - min) / range) * (height - 12) - 6,
    }));
    const p = Skia.Path.Make();
    p.moveTo(coords[0].x, coords[0].y);
    for (const c of coords.slice(1)) p.lineTo(c.x, c.y);
    return { path: p, dots: coords };
  }, [points]);

  if (points.length < 2) {
    return (
      <Text className="font-body text-[12px] text-text-tertiary">
        Not enough data yet for a trend chart
      </Text>
    );
  }

  return (
    <Canvas style={{ width, height }}>
      <Path
        path={path}
        style="stroke"
        strokeWidth={2.5}
        color="#C8F53C"
        strokeCap="round"
        strokeJoin="round"
      />
      {dots.map((d, i) => (
        <Circle
          key={`${d.x}-${d.y}-${i}`}
          cx={d.x}
          cy={d.y}
          r={3.5}
          color="#C8F53C"
        />
      ))}
    </Canvas>
  );
}

export default function PatientDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { db } = useDatabase();
  const selectPatient = useRxStore((s) => s.selectPatient);
  const [patient, setPatient] = useState<Patient | null>(null);
  const [rxHistory, setRxHistory] = useState<Prescription[]>([]);
  const [vitals, setVitals] = useState<Vitals[]>([]);

  useEffect(() => {
    if (!db || !id) return;
    db.select()
      .from(patients)
      .where(eq(patients.id, Number(id)))
      .limit(1)

      .then((rows) => setPatient(rows[0] ?? null));
    db.select()
      .from(prescriptions)
      .where(eq(prescriptions.patientId, Number(id)))
      .orderBy(desc(prescriptions.createdAt))

      .then(setRxHistory);
    db.select()
      .from(vitalsLog)
      .where(eq(vitalsLog.patientId, Number(id)))
      .orderBy(vitalsLog.recordedAt)

      .then(setVitals);
  }, [db, id]);

  if (!patient) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator color="#C8F53C" />
      </View>
    );
  }

  const weightPoints = vitals
    .map((v) => v.weightKg)
    .filter((w): w is number => w != null);
  const latestVitals = vitals[vitals.length - 1];

  function handleNewRx() {
    triggerSelectionHaptic();
    if (!patient) return;
    selectPatient({
      id: patient.id,
      name: patient.name,
      age: patient.ageYears ? `${patient.ageYears}y` : "",
      gender: patient.gender ?? "",
      phone: patient.phone ?? "",
      allergies: patient.drugAllergies ?? "",
    });
    router.push("/(tabs)/prescribe" as never);
  }

  return (
    <View className="flex-1 bg-background">
      <View className="flex-row items-center gap-3 px-4 pb-3 pt-2">
        <TouchableOpacity
          onPress={() => {
            triggerSelectionHaptic();
            router.back();
          }}
          className="h-10 w-10 items-center justify-center rounded-2xl border border-border bg-surface"
        >
          <ArrowLeft size={19} color="#F5F5F7" strokeWidth={1.7} />
        </TouchableOpacity>
        <Text className="font-heading text-[19px] text-text-primary">
          Patient
        </Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
        <GlassCard className="items-center p-6">
          <View className="h-16 w-16 items-center justify-center rounded-full bg-accent-primarySoft">
            <Text className="font-heading text-[20px] text-accent-primary">
              {initials(patient.name)}
            </Text>
          </View>
          <Text className="mt-3 font-heading text-[20px] text-text-primary">
            {patient.name}
          </Text>
          <Text className="mt-0.5 font-body text-[12.5px] text-text-tertiary">
            {[
              patient.ageYears ? `${patient.ageYears}y` : null,
              patient.gender,
              patient.bloodGroup,
            ]
              .filter(Boolean)
              .join(" · ")}
          </Text>
        </GlassCard>

        {patient.drugAllergies ? (
          <View className="mt-3 flex-row items-center gap-2 rounded-clinical border border-clinical-red/40 bg-clinical-redSoft px-4 py-3">
            <ShieldAlert size={17} color="#FF453A" strokeWidth={1.8} />
            <Text className="flex-1 font-bodySemi text-[12.5px] text-clinical-red">
              Allergic to: {patient.drugAllergies}
            </Text>
          </View>
        ) : null}

        <View className="mt-4 flex-row gap-2.5">
          <TouchableOpacity
            onPress={handleNewRx}
            className="flex-1 flex-row items-center justify-center gap-1.5 rounded-2xl bg-accent-primary py-3.5"
          >
            <FileText size={15} color="#0C0C0E" strokeWidth={1.9} />
            <Text className="font-bodySemi text-[12.5px] text-text-inverse">
              New Rx
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => router.push("/(tabs)/patients" as never)}
            className="flex-1 flex-row items-center justify-center gap-1.5 rounded-2xl border border-border bg-surface py-3.5"
          >
            <CalendarPlus size={15} color="#B8B8BE" strokeWidth={1.9} />
            <Text className="font-bodySemi text-[12.5px] text-text-secondary">
              Add to Queue
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              router.push(`/patients/new?id=${patient.id}` as never)
            }
            className="w-12 items-center justify-center rounded-2xl border border-border bg-surface py-3.5"
          >
            <Pencil size={15} color="#B8B8BE" strokeWidth={1.9} />
          </TouchableOpacity>
        </View>

        {latestVitals ? (
          <View className="mt-5">
            <Text className="mb-2 font-bodySemi text-[11px] uppercase tracking-widest text-text-tertiary">
              Latest Vitals
            </Text>
            <View className="rounded-clinical border border-border bg-surface p-4">
              <Text className="font-body text-[12.5px] text-text-secondary">
                {[
                  latestVitals.bp ? `BP ${latestVitals.bp}` : null,
                  latestVitals.pulse ? `Pulse ${latestVitals.pulse}` : null,
                  latestVitals.weightKg ? `${latestVitals.weightKg} kg` : null,
                ]
                  .filter(Boolean)
                  .join(" · ")}
              </Text>
              {weightPoints.length >= 2 ? (
                <View className="mt-3">
                  <Text className="mb-1 font-body text-[10px] text-text-tertiary">
                    Weight trend
                  </Text>
                  <WeightTrendChart points={weightPoints} />
                </View>
              ) : null}
            </View>
          </View>
        ) : null}

        <View className="mt-5">
          <Text className="mb-2 font-bodySemi text-[11px] uppercase tracking-widest text-text-tertiary">
            Prescriptions ({rxHistory.length})
          </Text>
          {rxHistory.length === 0 ? (
            <Text className="font-body text-[12.5px] text-text-tertiary">
              No prescriptions yet
            </Text>
          ) : (
            rxHistory.map((rx) => (
              <TouchableOpacity
                key={rx.id}
                onPress={() => {
                  triggerSelectionHaptic();
                  router.push(`/prescription/${rx.id}` as never);
                }}
                className="mb-2 flex-row items-center justify-between rounded-xl border border-border bg-surface px-3.5 py-3"
              >
                <Text className="font-bodySemi text-[13px] text-text-primary">
                  {rx.rxNumber}
                </Text>
                <Text className="font-body text-[11.5px] text-text-tertiary">
                  {rx.createdAt
                    ? new Date(rx.createdAt).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                      })
                    : ""}
                </Text>
              </TouchableOpacity>
            ))
          )}
        </View>

        {patient.chronicConditions ? (
          <View className="mt-5">
            <Text className="mb-2 font-bodySemi text-[11px] uppercase tracking-widest text-text-tertiary">
              Chronic Conditions
            </Text>
            <Text className="font-body text-[12.5px] text-text-secondary">
              {patient.chronicConditions}
            </Text>
          </View>
        ) : null}

        {patient.notes ? (
          <View className="mt-5">
            <Text className="mb-2 font-bodySemi text-[11px] uppercase tracking-widest text-text-tertiary">
              Notes
            </Text>
            <Text className="font-body text-[12.5px] text-text-secondary">
              {patient.notes}
            </Text>
          </View>
        ) : null}
      </ScrollView>
    </View>
  );
}
