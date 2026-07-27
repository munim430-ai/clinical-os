import { QRCode } from "@/components/QRCode";
import { GlassCard } from "@/components/premium/GlassCard";
import { useDatabase } from "@/db/provider";
import {
  doctorProfile,
  prescriptions,
  visitLogs,
  vitalsLog,
} from "@/db/schema";
import {
  triggerSelectionHaptic,
  triggerSuccessHaptic,
} from "@/lib/clinical-haptics";
import { formatSig } from "@/lib/dosing";
import { buildRxHtml } from "@/lib/pdf";
import { buildVerifyUrl, generateQrToken } from "@/lib/qr";
import { generateRxNumber } from "@/lib/rx-number";
import { useRxStore } from "@/lib/rx-store";
import { savePdf } from "@/lib/storage-native";
import { desc } from "drizzle-orm";
import * as FileSystem from "expo-file-system/legacy";
import * as Print from "expo-print";
import { router } from "expo-router";
import * as Sharing from "expo-sharing";
import { ArrowLeft, Check, FileDown, Share2 } from "lucide-react-native";
import { useEffect, useState } from "react";
import {
  Alert,
  Platform,
  ScrollView,
  Share,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type DoctorProfile = typeof doctorProfile.$inferSelect;

function todayLabel() {
  return new Date().toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function PrescriptionPreviewScreen() {
  const { db } = useDatabase();
  const rx = useRxStore();
  const [doctor, setDoctor] = useState<DoctorProfile | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [rxNumber, setRxNumber] = useState<string>("");
  const [qrToken] = useState(() => generateQrToken());

  useEffect(() => {
    if (!db) return;
    db.select()
      .from(doctorProfile)
      .limit(1)

      .then((rows) => setDoctor(rows[0] ?? null));
    db.select({ rxNumber: prescriptions.rxNumber })
      .from(prescriptions)
      .orderBy(desc(prescriptions.id))
      .limit(1)

      .then((rows) => setRxNumber(generateRxNumber(rows[0]?.rxNumber)));
  }, [db]);

  async function handleSaveAsPdf() {
    if (!db || saving) return;
    setSaving(true);
    try {
      const createdAt = new Date();
      const html = buildRxHtml({
        rxNumber,
        qrToken,
        createdAt,
        doctor,
        patient: rx.patient,
        complaints: rx.complaints,
        examinations: rx.examinations,
        investigations: rx.investigations,
        diagnoses: rx.diagnoses,
        medicines: rx.medicines,
        advice: rx.advice,
        followUpDate: rx.followUpDate,
      });

      let pdfPath: string | null = null;
      if (Platform.OS !== "web") {
        const { uri } = await Print.printToFileAsync({ html, base64: false });
        const base64 = await FileSystem.readAsStringAsync(uri, {
          encoding: FileSystem.EncodingType.Base64,
        });
        pdfPath = await savePdf(`${rxNumber}.pdf`, base64);
      }

      const created = await db
        .insert(prescriptions)
        .values({
          rxNumber,
          patientId: rx.patient.id,
          patientName: rx.patient.name,
          patientAge: rx.patient.age,
          patientGender: rx.patient.gender,
          patientPhone: rx.patient.phone,
          clinicId: rx.clinicId,
          chiefComplaints: rx.complaints.join(", "),
          onExamination: rx.examinations,
          investigations: rx.investigations,
          diagnoses: rx.diagnoses.map((d) => d.label).join(", "),
          medicinesJson: JSON.stringify(rx.medicines),
          advice: rx.advice.join(", "),
          followUpDate: rx.followUpDate,
          visitFee: rx.visitFee,
          bp: rx.patient.bp || null,
          pulse: rx.patient.pulse
            ? Number.parseInt(rx.patient.pulse, 10)
            : null,
          temperature: rx.patient.temperature
            ? Number.parseFloat(rx.patient.temperature)
            : null,
          weightKg: rx.patient.weight
            ? Number.parseFloat(rx.patient.weight)
            : null,
          qrToken,
          pdfPath,
        })
        .returning();

      const prescriptionId = created[0]?.id ?? null;

      if (rx.clinicId && prescriptionId) {
        await db.insert(visitLogs).values({
          clinicId: rx.clinicId,
          date: createdAt.toISOString().slice(0, 10),
          patients: 1,
          earningsBdt: rx.visitFee,
          prescriptionId,
        });
      }

      if (
        rx.patient.id &&
        prescriptionId &&
        (rx.patient.bp ||
          rx.patient.pulse ||
          rx.patient.temperature ||
          rx.patient.weight)
      ) {
        await db.insert(vitalsLog).values({
          patientId: rx.patient.id,
          prescriptionId,
          bp: rx.patient.bp || null,
          pulse: rx.patient.pulse
            ? Number.parseInt(rx.patient.pulse, 10)
            : null,
          temperature: rx.patient.temperature
            ? Number.parseFloat(rx.patient.temperature)
            : null,
          weightKg: rx.patient.weight
            ? Number.parseFloat(rx.patient.weight)
            : null,
        });
      }

      triggerSuccessHaptic();
      setSaved(true);

      if (pdfPath) {
        const canShare = await Sharing.isAvailableAsync();
        if (canShare)
          await Sharing.shareAsync(pdfPath, { mimeType: "application/pdf" });
      }

      if (prescriptionId) {
        rx.reset();
        router.replace(`/prescription/${prescriptionId}` as never);
      }
    } catch (err) {
      Alert.alert(
        "Could not save prescription",
        err instanceof Error ? err.message : String(err),
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleShareText() {
    triggerSelectionHaptic();
    const lines: string[] = [];
    lines.push("══════════════════════════════");
    lines.push("        PRESCRIPTION");
    lines.push("══════════════════════════════");
    if (rx.patient.name) lines.push(`Patient : ${rx.patient.name}`);
    if (rx.patient.age) lines.push(`Age     : ${rx.patient.age}`);
    if (rx.patient.gender) lines.push(`Gender  : ${rx.patient.gender}`);
    if (rx.diagnoses.length)
      lines.push(`Dx      : ${rx.diagnoses.map((d) => d.label).join(", ")}`);
    lines.push("──────────────────────────────");
    rx.medicines.forEach((m, i) => {
      lines.push(
        `${i + 1}. ${m.brandName}${m.strength ? ` ${m.strength}` : ""}`,
      );
      if (m.genericName) lines.push(`   (${m.genericName})`);
      lines.push(
        `   ${formatSig(m.doseMorning, m.doseAfternoon, m.doseNight)} · ${
          m.timing
        } · ${m.duration}`,
      );
    });
    lines.push("══════════════════════════════");
    lines.push("Made by Munim @ Keystone");
    try {
      await Share.share({ message: lines.join("\n") });
    } catch {
      // user dismissed
    }
  }

  const doctorName = doctor?.name?.trim()
    ? `Dr. ${doctor.name}`
    : "Dr. ______________";

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
          Preview Rx
        </Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 140 }}>
        <GlassCard className="p-5" borderGlow>
          <Text className="font-headingSemi text-[18px] text-text-primary">
            {doctorName}
          </Text>
          {doctor?.qualifications ? (
            <Text className="mt-0.5 font-body text-[11.5px] text-text-tertiary">
              {doctor.qualifications}
            </Text>
          ) : null}
          {doctor?.bmdcReg ? (
            <Text className="mt-0.5 font-body text-[11.5px] text-text-tertiary">
              BM&DC: {doctor.bmdcReg}
            </Text>
          ) : null}

          <View className="my-4 h-px bg-border-medium" />

          <View className="flex-row justify-between">
            <Text className="font-mono text-[12px] text-text-secondary">
              Rx#: {rxNumber}
            </Text>
            <Text className="font-mono text-[12px] text-text-secondary">
              {todayLabel()}
            </Text>
          </View>

          <View className="my-3 h-px bg-border-soft" />

          <Text className="font-bodySemi text-[14px] text-text-primary">
            {rx.patient.name || "-"}
            {rx.patient.age ? `, ${rx.patient.age}` : ""} {rx.patient.gender}
          </Text>
          <Text className="mt-1 font-body text-[11.5px] text-text-tertiary">
            {[
              rx.patient.bp ? `BP ${rx.patient.bp}` : null,
              rx.patient.pulse ? `Pulse ${rx.patient.pulse}` : null,
              rx.patient.temperature
                ? `Temp ${rx.patient.temperature}°F`
                : null,
            ]
              .filter(Boolean)
              .join(" · ")}
          </Text>
          <Text
            className={`mt-1 font-body text-[11.5px] ${
              rx.patient.allergies ? "text-clinical-red" : "text-text-tertiary"
            }`}
          >
            Allergy: {rx.patient.allergies || "None reported"}
          </Text>

          {rx.complaints.length ? (
            <Section title="Chief Complaints" items={rx.complaints} />
          ) : null}
          {rx.diagnoses.length ? (
            <Section
              title="Diagnosis"
              items={rx.diagnoses.map(
                (d) => `${d.label}${d.icd10 ? ` (${d.icd10})` : ""}`,
              )}
            />
          ) : null}

          <View className="my-4 h-px bg-border-medium" />
          <Text className="mb-2 font-heading text-[20px] italic text-text-primary">
            ℞
          </Text>
          {rx.medicines.map((m, i) => (
            <View key={m.tempId} className="mb-3">
              <Text className="font-bodySemi text-[13.5px] text-text-primary">
                {i + 1}. {m.brandName}
                {m.strength ? ` ${m.strength}` : ""}
                {m.genericName ? (
                  <Text className="font-body text-[12px] text-text-tertiary">
                    {" "}
                    ({m.genericName})
                  </Text>
                ) : null}
              </Text>
              <Text className="ml-3.5 mt-0.5 font-body text-[12px] text-text-tertiary">
                {formatSig(m.doseMorning, m.doseAfternoon, m.doseNight)} ·{" "}
                {m.timing} · {m.duration}
                {m.quantity ? ` · Qty: ${m.quantity}` : ""}
              </Text>
            </View>
          ))}

          {rx.advice.length ? (
            <Section title="Advice" items={rx.advice} />
          ) : null}

          {rx.followUpDate ? (
            <Text className="mt-3 font-body text-[12px] text-text-tertiary">
              Follow-up: {rx.followUpDate}
            </Text>
          ) : null}

          <View className="mt-5 flex-row items-center gap-3">
            <QRCode value={buildVerifyUrl(qrToken)} size={64} />
            <Text className="flex-1 font-body text-[10.5px] leading-4 text-text-tertiary">
              Scan to verify authenticity at clinical-os-eta.vercel.app/verify
            </Text>
          </View>
        </GlassCard>
      </ScrollView>

      <View className="absolute inset-x-0 bottom-0 gap-2 border-t border-border-soft bg-surface/95 px-4 pb-8 pt-3">
        <TouchableOpacity
          disabled={saving}
          onPress={handleSaveAsPdf}
          className="flex-row items-center justify-center gap-2 rounded-2xl bg-accent-primary py-4"
          accessibilityRole="button"
        >
          {saved ? (
            <Check size={17} color="#0C0C0E" strokeWidth={2.2} />
          ) : (
            <FileDown size={17} color="#0C0C0E" strokeWidth={1.8} />
          )}
          <Text className="font-bodySemi text-[15px] text-text-inverse">
            {saving ? "Saving…" : "Save as PDF & Share"}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleShareText}
          className="flex-row items-center justify-center gap-2 rounded-2xl border border-border bg-surface py-3.5"
          accessibilityRole="button"
        >
          <Share2 size={16} color="#B8B8BE" strokeWidth={1.8} />
          <Text className="font-bodySemi text-[13.5px] text-text-secondary">
            Share Text
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function Section({ title, items }: { title: string; items: string[] }) {
  return (
    <View className="mt-3">
      <Text className="mb-1 font-bodySemi text-[10.5px] uppercase tracking-widest text-text-tertiary">
        {title}
      </Text>
      {items.map((item) => (
        <Text
          key={item}
          className="font-body text-[12.5px] leading-5 text-text-secondary"
        >
          • {item}
        </Text>
      ))}
    </View>
  );
}
