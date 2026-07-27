import { ChipSelector } from "@/components/premium/ChipSelector";
import { Stepper, type StepperStep } from "@/components/premium/Stepper";
import { useDatabase } from "@/db/provider";
import {
  adviceQuickPicks,
  chiefComplaints,
  diagnosisQuickPicks,
} from "@/db/schema";
import { triggerSelectionHaptic } from "@/lib/clinical-haptics";
import { formatSig } from "@/lib/dosing";
import { useRxStore } from "@/lib/rx-store";
import { router } from "expo-router";
import { ChevronRight, Pill, Trash2, UserRound } from "lucide-react-native";
import { useEffect, useState } from "react";
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function PrescribeScreen() {
  const { db } = useDatabase();
  const rx = useRxStore();
  const [expandedKey, setExpandedKey] = useState<string | null>("patient");
  const [complaintOptions, setComplaintOptions] = useState<
    { label: string; value: string }[]
  >([]);
  const [diagnosisOptions, setDiagnosisOptions] = useState<
    { label: string; value: string; icd10: string }[]
  >([]);
  const [adviceOptions, setAdviceOptions] = useState<
    { label: string; value: string }[]
  >([]);

  useEffect(() => {
    if (!db) return;
    db.select()
      .from(chiefComplaints)

      .then((rows) => {
        setComplaintOptions(
          rows.map((r) => ({ label: r.text, value: r.text })),
        );
      });
    db.select()
      .from(diagnosisQuickPicks)

      .then((rows) => {
        setDiagnosisOptions(
          rows.map((r) => ({
            label: r.label,
            value: r.label,
            icd10: r.icd10Code ?? "",
          })),
        );
      });
    db.select()
      .from(adviceQuickPicks)

      .then((rows) => {
        setAdviceOptions(rows.map((r) => ({ label: r.text, value: r.text })));
      });
  }, [db]);

  const hasPatient = rx.patient.name.length > 0;
  const canPreview = hasPatient && rx.medicines.length > 0;

  function toggle(key: string) {
    setExpandedKey((prev) => (prev === key ? null : key));
  }

  const steps: StepperStep[] = [
    {
      key: "patient",
      title: "Patient",
      subtitle: hasPatient
        ? `${rx.patient.name}${rx.patient.age ? `, ${rx.patient.age}` : ""}`
        : "Select a patient",
      complete: hasPatient,
      content: (
        <TouchableOpacity
          onPress={() => {
            triggerSelectionHaptic();
            router.push("/prescription/patient-select" as never);
          }}
          className="flex-row items-center justify-between rounded-xl border border-border bg-surface px-4 py-3"
          accessibilityRole="button"
        >
          <View className="flex-row items-center gap-2.5">
            <UserRound size={17} color="#C8F53C" strokeWidth={1.7} />
            <Text className="font-bodySemi text-[13.5px] text-text-primary">
              {hasPatient ? "Change patient" : "Select patient"}
            </Text>
          </View>
          <ChevronRight size={16} color="#7A7A80" />
        </TouchableOpacity>
      ),
    },
    {
      key: "clinical",
      title: "Clinical Notes",
      subtitle: rx.complaints.length
        ? rx.complaints.join(", ")
        : "Complaints, exam, investigations",
      complete: rx.complaints.length > 0,
      content: (
        <View>
          <Text className="mb-2 font-bodySemi text-[11px] uppercase tracking-widest text-text-tertiary">
            Chief Complaints
          </Text>
          <ChipSelector
            options={complaintOptions}
            selected={rx.complaints}
            onToggle={rx.toggleComplaint}
          />
          <Text className="mb-1.5 mt-4 font-bodySemi text-[11px] uppercase tracking-widest text-text-tertiary">
            On Examination
          </Text>
          <TextInput
            value={rx.examinations}
            onChangeText={rx.setExaminations}
            placeholder="Examination findings"
            placeholderTextColor="#4A4A4F"
            multiline
            className="rounded-xl border border-border bg-surface px-3 py-2.5 font-body text-[13px] text-text-primary"
          />
          <Text className="mb-1.5 mt-4 font-bodySemi text-[11px] uppercase tracking-widest text-text-tertiary">
            Investigations
          </Text>
          <TextInput
            value={rx.investigations}
            onChangeText={rx.setInvestigations}
            placeholder="Requested / reviewed investigations"
            placeholderTextColor="#4A4A4F"
            multiline
            className="rounded-xl border border-border bg-surface px-3 py-2.5 font-body text-[13px] text-text-primary"
          />
        </View>
      ),
    },
    {
      key: "diagnosis",
      title: "Diagnosis",
      subtitle: rx.diagnoses.length
        ? rx.diagnoses.map((d) => d.label).join(", ")
        : "Add a diagnosis",
      complete: rx.diagnoses.length > 0,
      content: (
        <ChipSelector
          options={diagnosisOptions.map((d) => ({
            label: d.label,
            value: d.value,
            badge: d.icd10,
          }))}
          selected={rx.diagnoses.map((d) => d.label)}
          onToggle={(label) => {
            const found = diagnosisOptions.find((d) => d.value === label);
            rx.toggleDiagnosis(label, found?.icd10 ?? "");
          }}
        />
      ),
    },
    {
      key: "medicines",
      title: "Medicines",
      subtitle: rx.medicines.length
        ? `${rx.medicines.length} drug${rx.medicines.length !== 1 ? "s" : ""}`
        : "No drugs added",
      complete: rx.medicines.length > 0,
      content: (
        <View>
          {rx.medicines.map((m) => (
            <View
              key={m.tempId}
              className="mb-2 flex-row items-center justify-between rounded-xl border border-border bg-surface px-3.5 py-3"
            >
              <View className="flex-1 pr-2">
                <Text className="font-bodySemi text-[13.5px] text-text-primary">
                  {m.brandName}
                  {m.strength ? ` ${m.strength}` : ""}
                </Text>
                <Text className="mt-0.5 font-body text-[11.5px] text-text-tertiary">
                  {formatSig(m.doseMorning, m.doseAfternoon, m.doseNight)} ·{" "}
                  {m.timing} · {m.duration}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => rx.removeMedicine(m.tempId)}
                hitSlop={10}
                accessibilityLabel="Remove medicine"
              >
                <Trash2 size={16} color="#FF453A" strokeWidth={1.7} />
              </TouchableOpacity>
            </View>
          ))}
          <TouchableOpacity
            onPress={() => {
              triggerSelectionHaptic();
              router.push("/prescription/medicine-picker" as never);
            }}
            className="mt-1 flex-row items-center justify-center gap-2 rounded-xl border border-accent-primary bg-accent-primarySoft py-3"
            accessibilityRole="button"
          >
            <Pill size={16} color="#C8F53C" strokeWidth={1.8} />
            <Text className="font-bodySemi text-[13px] text-accent-primary">
              Add Medicine
            </Text>
          </TouchableOpacity>
        </View>
      ),
    },
    {
      key: "advice",
      title: "Advice",
      subtitle: rx.advice.length
        ? rx.advice.join(", ")
        : "Add lifestyle / follow-up advice",
      complete: rx.advice.length > 0,
      content: (
        <ChipSelector
          options={adviceOptions}
          selected={rx.advice}
          onToggle={rx.toggleAdvice}
        />
      ),
    },
    {
      key: "vitals",
      title: "Vitals & Follow-up",
      subtitle: rx.followUpDate
        ? `Follow-up: ${rx.followUpDate}`
        : "BP, pulse, temperature, follow-up",
      complete: Boolean(rx.patient.bp || rx.patient.pulse || rx.followUpDate),
      content: (
        <View className="gap-2.5">
          <View className="flex-row gap-2.5">
            <VitalField
              label="BP"
              value={rx.patient.bp}
              placeholder="120/80"
              onChangeText={(v) => rx.setPatient({ bp: v })}
            />
            <VitalField
              label="Pulse"
              value={rx.patient.pulse}
              placeholder="80"
              keyboardType="numeric"
              onChangeText={(v) => rx.setPatient({ pulse: v })}
            />
          </View>
          <View className="flex-row gap-2.5">
            <VitalField
              label="Temp (°F)"
              value={rx.patient.temperature}
              placeholder="98.4"
              keyboardType="numeric"
              onChangeText={(v) => rx.setPatient({ temperature: v })}
            />
            <VitalField
              label="Weight (kg)"
              value={rx.patient.weight}
              placeholder="60"
              keyboardType="numeric"
              onChangeText={(v) => rx.setPatient({ weight: v })}
            />
          </View>
          <Text className="mb-1 mt-1 font-bodySemi text-[11px] uppercase tracking-widest text-text-tertiary">
            Follow-up date
          </Text>
          <TextInput
            value={rx.followUpDate}
            onChangeText={rx.setFollowUp}
            placeholder="e.g. 18 Aug 2026"
            placeholderTextColor="#4A4A4F"
            className="rounded-xl border border-border bg-surface px-3 py-2.5 font-body text-[13px] text-text-primary"
          />
        </View>
      ),
    },
  ];

  return (
    <View className="flex-1 bg-background">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 16, paddingBottom: 120 }}
        keyboardShouldPersistTaps="handled"
      >
        <Text className="mb-1 font-heading text-[24px] text-text-primary">
          Prescribe
        </Text>
        <Text className="mb-5 font-body text-[12px] text-text-tertiary">
          Build a prescription in under a minute
        </Text>
        <Stepper steps={steps} expandedKey={expandedKey} onToggle={toggle} />
      </ScrollView>

      <View className="absolute inset-x-0 bottom-0 border-t border-border-soft bg-surface/95 px-4 pb-8 pt-3">
        <TouchableOpacity
          disabled={!canPreview}
          onPress={() => {
            triggerSelectionHaptic();
            router.push("/prescription/preview" as never);
          }}
          className={`items-center rounded-2xl py-4 ${
            canPreview
              ? "bg-accent-primary shadow-glowLime"
              : "bg-surface-elevated"
          }`}
          accessibilityRole="button"
        >
          <Text
            className={`font-bodySemi text-[15px] ${
              canPreview ? "text-text-inverse" : "text-text-disabled"
            }`}
          >
            Preview Rx
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function VitalField({
  label,
  value,
  placeholder,
  onChangeText,
  keyboardType,
}: {
  label: string;
  value: string;
  placeholder: string;
  onChangeText: (v: string) => void;
  keyboardType?: "numeric";
}) {
  return (
    <View className="flex-1 rounded-xl border border-border bg-surface px-3 py-2">
      <Text className="mb-0.5 font-body text-[10px] text-text-tertiary">
        {label}
      </Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#4A4A4F"
        keyboardType={keyboardType}
        className="font-body text-[13.5px] text-text-primary"
      />
    </View>
  );
}
