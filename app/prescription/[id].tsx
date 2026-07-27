import { QRCode } from "@/components/QRCode";
import { GlassCard } from "@/components/premium/GlassCard";
import { useDatabase } from "@/db/provider";
import { doctorProfile, prescriptions } from "@/db/schema";
import {
  triggerSelectionHaptic,
  triggerSuccessHaptic,
} from "@/lib/clinical-haptics";
import { formatSig } from "@/lib/dosing";
import { buildRxHtml } from "@/lib/pdf";
import { buildVerifyUrl } from "@/lib/qr";
import type { RxMedicine } from "@/lib/rx-store";
import { eq } from "drizzle-orm";
import * as Print from "expo-print";
import { router, useLocalSearchParams } from "expo-router";
import * as Sharing from "expo-sharing";
import { Archive, ArrowLeft, Printer, Share2 } from "lucide-react-native";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type Prescription = typeof prescriptions.$inferSelect;
type DoctorProfile = typeof doctorProfile.$inferSelect;

export default function PrescriptionDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { db } = useDatabase();
  const [rx, setRx] = useState<Prescription | null>(null);
  const [doctor, setDoctor] = useState<DoctorProfile | null>(null);

  useEffect(() => {
    if (!db || !id) return;
    db.select()
      .from(prescriptions)
      .where(eq(prescriptions.id, Number(id)))
      .limit(1)

      .then((rows) => setRx(rows[0] ?? null));
    db.select()
      .from(doctorProfile)
      .limit(1)

      .then((rows) => setDoctor(rows[0] ?? null));
  }, [db, id]);

  async function handleReshare() {
    if (!rx) return;
    triggerSelectionHaptic();
    if (rx.pdfPath) {
      const canShare = await Sharing.isAvailableAsync();
      if (canShare) {
        await Sharing.shareAsync(rx.pdfPath, { mimeType: "application/pdf" });
        return;
      }
    }
    Alert.alert(
      "No PDF found",
      "This prescription doesn't have a saved PDF file.",
    );
  }

  async function handlePrint() {
    if (!rx) return;
    triggerSelectionHaptic();
    const medicines: RxMedicine[] = rx.medicinesJson
      ? JSON.parse(rx.medicinesJson)
      : [];
    const html = buildRxHtml({
      rxNumber: rx.rxNumber,
      qrToken: rx.qrToken ?? "",
      createdAt: rx.createdAt ? new Date(rx.createdAt) : new Date(),
      doctor,
      patient: {
        id: rx.patientId,
        name: rx.patientName,
        age: rx.patientAge ?? "",
        gender: rx.patientGender ?? "",
        phone: rx.patientPhone ?? "",
        bp: rx.bp ?? "",
        pulse: rx.pulse ? String(rx.pulse) : "",
        temperature: rx.temperature ? String(rx.temperature) : "",
        weight: rx.weightKg ? String(rx.weightKg) : "",
        allergies: "",
      },
      complaints: rx.chiefComplaints
        ? rx.chiefComplaints.split(", ").filter(Boolean)
        : [],
      examinations: rx.onExamination ?? "",
      investigations: rx.investigations ?? "",
      diagnoses: rx.diagnoses
        ? rx.diagnoses
            .split(", ")
            .filter(Boolean)
            .map((label) => ({ label, icd10: "" }))
        : [],
      medicines,
      advice: rx.advice ? rx.advice.split(", ").filter(Boolean) : [],
      followUpDate: rx.followUpDate ?? "",
    });
    await Print.printAsync({ html });
  }

  async function handleArchive() {
    if (!rx || !db) return;
    triggerSuccessHaptic();
    await db
      .update(prescriptions)
      .set({ status: "archived" })
      .where(eq(prescriptions.id, rx.id));
    setRx({ ...rx, status: "archived" });
  }

  if (!rx) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator color="#C8F53C" />
      </View>
    );
  }

  const medicines: RxMedicine[] = rx.medicinesJson
    ? JSON.parse(rx.medicinesJson)
    : [];

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
        <View className="flex-1">
          <Text className="font-heading text-[18px] text-text-primary">
            {rx.rxNumber}
          </Text>
          {rx.status === "archived" ? (
            <Text className="font-body text-[11px] text-text-tertiary">
              Archived
            </Text>
          ) : null}
        </View>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 32 }}>
        <GlassCard className="p-5">
          <Text className="font-bodySemi text-[15px] text-text-primary">
            {rx.patientName}
            {rx.patientAge ? `, ${rx.patientAge}` : ""} {rx.patientGender}
          </Text>
          <Text className="mt-1 font-body text-[11.5px] text-text-tertiary">
            {rx.createdAt
              ? new Date(rx.createdAt).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })
              : ""}
          </Text>

          {rx.diagnoses ? (
            <Text className="mt-3 font-body text-[12.5px] text-text-secondary">
              Dx: {rx.diagnoses}
            </Text>
          ) : null}

          <View className="my-4 h-px bg-border-medium" />

          {medicines.map((m, i) => (
            <View key={m.tempId ?? i} className="mb-3">
              <Text className="font-bodySemi text-[13.5px] text-text-primary">
                {i + 1}. {m.brandName}
                {m.strength ? ` ${m.strength}` : ""}
              </Text>
              <Text className="ml-3.5 mt-0.5 font-body text-[12px] text-text-tertiary">
                {formatSig(m.doseMorning, m.doseAfternoon, m.doseNight)} ·{" "}
                {m.timing} · {m.duration}
              </Text>
            </View>
          ))}

          {rx.advice ? (
            <Text className="mt-2 font-body text-[12px] text-text-secondary">
              Advice: {rx.advice}
            </Text>
          ) : null}

          {rx.qrToken ? (
            <View className="mt-5 flex-row items-center gap-3">
              <QRCode value={buildVerifyUrl(rx.qrToken)} size={64} />
              <Text className="flex-1 font-body text-[10.5px] leading-4 text-text-tertiary">
                Scan to verify authenticity
              </Text>
            </View>
          ) : null}
        </GlassCard>

        <View className="mt-4 flex-row gap-2.5">
          <TouchableOpacity
            onPress={handleReshare}
            className="flex-1 flex-row items-center justify-center gap-2 rounded-2xl border border-accent-primary bg-accent-primarySoft py-3.5"
          >
            <Share2 size={15} color="#C8F53C" strokeWidth={1.8} />
            <Text className="font-bodySemi text-[13px] text-accent-primary">
              Re-share
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handlePrint}
            className="flex-1 flex-row items-center justify-center gap-2 rounded-2xl border border-border bg-surface py-3.5"
          >
            <Printer size={15} color="#B8B8BE" strokeWidth={1.8} />
            <Text className="font-bodySemi text-[13px] text-text-secondary">
              Print
            </Text>
          </TouchableOpacity>
          {rx.status !== "archived" ? (
            <TouchableOpacity
              onPress={handleArchive}
              className="flex-1 flex-row items-center justify-center gap-2 rounded-2xl border border-border bg-surface py-3.5"
            >
              <Archive size={15} color="#B8B8BE" strokeWidth={1.8} />
              <Text className="font-bodySemi text-[13px] text-text-secondary">
                Archive
              </Text>
            </TouchableOpacity>
          ) : null}
        </View>
      </ScrollView>
    </View>
  );
}
