import { useDatabase } from "@/db/provider";
import { visitLogs } from "@/db/schema";
import { desc } from "drizzle-orm";
import { router } from "expo-router";
import {
  Baby,
  Calculator,
  Calendar,
  Lightbulb,
  Pill,
  Scale,
  Stethoscope,
  TrendingUp,
  Users,
  Wallet,
  X,
  Zap,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

// ── embedded content ────────────────────────────────────────────────────────

const PEARLS = [
  {
    text: "Fever >38.3°C with relative bradycardia (Faget sign) suggests typhoid, brucellosis, or dengue.",
    source: "Harrison's",
  },
  {
    text: "In dengue, a 1°C drop in temperature often coincides with platelet nadir — watch for warning signs during defervescence.",
    source: "WHO 2009",
  },
  {
    text: "Always check CBC + PBF before starting antimalarials — species ID changes drug choice.",
    source: "BNMT",
  },
  {
    text: "ORS saves more lives than any antibiotic — the most underused tool in diarrhoeal disease.",
    source: "WHO",
  },
  {
    text: "Pulse pressure <25 mmHg in dengue = compensated shock. Act before BP drops.",
    source: "WHO 2009",
  },
  {
    text: "Rifampicin turns urine orange — counsel patients beforehand to prevent unnecessary panic.",
    source: "BNF",
  },
  {
    text: "Azithromycin 1g single dose still works for typhoid if doxycycline resistance is suspected.",
    source: "WHO",
  },
  {
    text: "In P. falciparum: high parasitaemia (>2%) + fever = treat as severe malaria regardless of symptoms.",
    source: "CDC",
  },
  {
    text: "eGFR <30: avoid NSAIDs, metformin, contrast agents without nephrology input.",
    source: "KDIGO",
  },
  {
    text: "Paracetamol is safer than NSAIDs for dengue — NSAIDs worsen platelet function.",
    source: "WHO 2009",
  },
  {
    text: "Bilateral pitting oedema + low albumin + proteinuria = nephrotic syndrome until proven otherwise.",
    source: "Harrison's",
  },
  {
    text: "The 'silent chest' in asthma is NOT improvement — it signals impending arrest. Escalate immediately.",
    source: "BTS/SIGN",
  },
  {
    text: "In type 2 DM, HbA1c of 7–8% is safer in elderly patients than <7% to avoid hypoglycaemia.",
    source: "ADA 2023",
  },
  {
    text: "Stridor at rest = upper airway emergency. Never sedate without secured airway.",
    source: "ATLS",
  },
  {
    text: "Drug-induced lupus: most common culprits — hydralazine, procainamide, isoniazid.",
    source: "Harrison's",
  },
];

const SPONSORS = [
  { brand: "Opsonin", generic: "Azithromycin 250mg" },
  { brand: "Incepta", generic: "Ciprofloxacin 500mg" },
  { brand: "Square", generic: "Metformin 500mg" },
  { brand: "Beximco", generic: "Omeprazole 20mg" },
  { brand: "Renata", generic: "Amoxicillin 500mg" },
];

function getDayIndex(len: number): number {
  const epoch = Math.floor(Date.now() / 86_400_000);
  return epoch % len;
}

// ── helpers ─────────────────────────────────────────────────────────────────

function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

// ── BMI Modal ────────────────────────────────────────────────────────────────

function BMIModal({
  visible,
  onClose,
}: { visible: boolean; onClose: () => void }) {
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");

  const bmi = useMemo(() => {
    const h = parseFloat(height) / 100;
    const w = parseFloat(weight);
    if (!h || !w || h <= 0) return null;
    return w / (h * h);
  }, [height, weight]);

  const bmiCategory = useMemo(() => {
    if (bmi === null) return null;
    if (bmi < 18.5) return { label: "Underweight", color: "#64D2FF" };
    if (bmi < 23) return { label: "Normal (Asian)", color: "#00D7B5" };
    if (bmi < 27.5) return { label: "Overweight (Asian)", color: "#FFD60A" };
    return { label: "Obese", color: "#FF453A" };
  }, [bmi]);

  const inputCls =
    "rounded-xl border border-border bg-ink-800 px-3 py-3 font-body text-[14px] text-text-primary";

  return (
    <Modal visible={visible} transparent animationType="slide">
      <Pressable className="flex-1 justify-end bg-black/60" onPress={onClose}>
        <Pressable onPress={() => {}}>
          <View className="rounded-t-[28px] bg-surface-elevated p-6 pb-10">
            <View className="mb-5 flex-row items-center justify-between">
              <Text className="font-heading text-[22px] text-text-primary">
                BMI Calculator
              </Text>
              <TouchableOpacity onPress={onClose} activeOpacity={0.7}>
                <X size={20} color="#7A7A80" />
              </TouchableOpacity>
            </View>

            <Text className="mb-1 font-bodySemi text-[11px] uppercase tracking-widest text-text-tertiary">
              Height (cm)
            </Text>
            <TextInput
              value={height}
              onChangeText={setHeight}
              keyboardType="numeric"
              placeholder="e.g. 165"
              placeholderTextColor="#4A4A4F"
              className={`${inputCls} mb-3`}
            />

            <Text className="mb-1 font-bodySemi text-[11px] uppercase tracking-widest text-text-tertiary">
              Weight (kg)
            </Text>
            <TextInput
              value={weight}
              onChangeText={setWeight}
              keyboardType="numeric"
              placeholder="e.g. 65"
              placeholderTextColor="#4A4A4F"
              className={`${inputCls} mb-4`}
            />

            {bmi !== null && bmiCategory ? (
              <View
                className="items-center rounded-2xl p-5"
                style={{ backgroundColor: `${bmiCategory.color}18` }}
              >
                <Text
                  className="font-heading text-[48px] leading-none"
                  style={{ color: bmiCategory.color }}
                >
                  {bmi.toFixed(1)}
                </Text>
                <Text
                  className="mt-1 font-bodySemi text-[15px]"
                  style={{ color: bmiCategory.color }}
                >
                  {bmiCategory.label}
                </Text>
                <Text className="mt-1 font-body text-[11px] text-text-tertiary">
                  Asian cutoffs used (WHO 2000)
                </Text>
              </View>
            ) : (
              <View className="items-center rounded-2xl bg-surface py-6">
                <Scale size={28} color="#2C2C30" />
                <Text className="mt-2 font-body text-[12px] text-text-tertiary">
                  Enter height and weight
                </Text>
              </View>
            )}
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

// ── EGFRModal ────────────────────────────────────────────────────────────────

function EGFRModal({
  visible,
  onClose,
}: { visible: boolean; onClose: () => void }) {
  const [creatinine, setCreatinine] = useState("");
  const [age, setAge] = useState("");
  const [sex, setSex] = useState<"male" | "female">("male");

  const egfr = useMemo(() => {
    const scr = parseFloat(creatinine);
    const a = parseFloat(age);
    if (!scr || !a || scr <= 0 || a <= 0) return null;
    const k = sex === "female" ? 0.7 : 0.9;
    const alpha = sex === "female" ? -0.241 : -0.302;
    const sexFactor = sex === "female" ? 1.012 : 1.0;
    return (
      142 *
      Math.min(scr / k, 1) ** alpha *
      Math.max(scr / k, 1) ** -1.2 *
      0.9938 ** a *
      sexFactor
    );
  }, [creatinine, age, sex]);

  const ckdStage = useMemo(() => {
    if (egfr === null) return null;
    if (egfr >= 90)
      return { stage: "G1", label: "Normal or high", color: "#00D7B5" };
    if (egfr >= 60)
      return { stage: "G2", label: "Mildly decreased", color: "#C8F53C" };
    if (egfr >= 45)
      return {
        stage: "G3a",
        label: "Mild–moderate decrease",
        color: "#FFD60A",
      };
    if (egfr >= 30)
      return {
        stage: "G3b",
        label: "Moderate–severe decrease",
        color: "#FF9500",
      };
    if (egfr >= 15)
      return { stage: "G4", label: "Severely decreased", color: "#FF453A" };
    return { stage: "G5", label: "Kidney failure", color: "#FF453A" };
  }, [egfr]);

  const inputCls =
    "rounded-xl border border-border bg-ink-800 px-3 py-3 font-body text-[14px] text-text-primary";

  return (
    <Modal visible={visible} transparent animationType="slide">
      <Pressable className="flex-1 justify-end bg-black/60" onPress={onClose}>
        <Pressable onPress={() => {}}>
          <View className="rounded-t-[28px] bg-surface-elevated p-6 pb-10">
            <View className="mb-5 flex-row items-center justify-between">
              <Text className="font-heading text-[22px] text-text-primary">
                eGFR (CKD-EPI 2021)
              </Text>
              <TouchableOpacity onPress={onClose} activeOpacity={0.7}>
                <X size={20} color="#7A7A80" />
              </TouchableOpacity>
            </View>

            <View className="mb-4 flex-row gap-2">
              {(["male", "female"] as const).map((s) => (
                <TouchableOpacity
                  key={s}
                  onPress={() => setSex(s)}
                  className="flex-1 items-center rounded-xl py-2.5"
                  style={{
                    backgroundColor: sex === s ? "#C8F53C22" : "#161618",
                    borderWidth: 1,
                    borderColor: sex === s ? "#C8F53C" : "#1F1F23",
                  }}
                  activeOpacity={0.7}
                >
                  <Text
                    className="font-bodySemi text-[13px]"
                    style={{ color: sex === s ? "#C8F53C" : "#7A7A80" }}
                  >
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text className="mb-1 font-bodySemi text-[11px] uppercase tracking-widest text-text-tertiary">
              Serum Creatinine (mg/dL)
            </Text>
            <TextInput
              value={creatinine}
              onChangeText={setCreatinine}
              keyboardType="numeric"
              placeholder="e.g. 1.2"
              placeholderTextColor="#4A4A4F"
              className={`${inputCls} mb-3`}
            />

            <Text className="mb-1 font-bodySemi text-[11px] uppercase tracking-widest text-text-tertiary">
              Age (years)
            </Text>
            <TextInput
              value={age}
              onChangeText={setAge}
              keyboardType="numeric"
              placeholder="e.g. 45"
              placeholderTextColor="#4A4A4F"
              className={`${inputCls} mb-4`}
            />

            {egfr !== null && ckdStage ? (
              <View
                className="items-center rounded-2xl p-5"
                style={{ backgroundColor: `${ckdStage.color}18` }}
              >
                <Text
                  className="font-heading text-[48px] leading-none"
                  style={{ color: ckdStage.color }}
                >
                  {Math.round(egfr)}
                </Text>
                <Text className="mt-0.5 font-body text-[12px] text-text-tertiary">
                  mL/min/1.73 m²
                </Text>
                <View
                  className="mt-2 rounded-lg px-3 py-1"
                  style={{ backgroundColor: `${ckdStage.color}28` }}
                >
                  <Text
                    className="font-bodySemi text-[13px]"
                    style={{ color: ckdStage.color }}
                  >
                    Stage {ckdStage.stage} — {ckdStage.label}
                  </Text>
                </View>
                <Text className="mt-2 font-body text-[10px] text-text-tertiary">
                  CKD-EPI 2021 (race-free) · KDIGO 2022
                </Text>
              </View>
            ) : (
              <View className="items-center rounded-2xl bg-surface py-6">
                <Calculator size={28} color="#2C2C30" />
                <Text className="mt-2 font-body text-[12px] text-text-tertiary">
                  Enter creatinine and age
                </Text>
              </View>
            )}
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

// ── PediDoseModal ─────────────────────────────────────────────────────────────

const PEDI_PRESETS = [
  { name: "Paracetamol", mgPerKg: 15, note: "q6h, max 4 doses/day" },
  { name: "Ibuprofen", mgPerKg: 10, note: "q8h, with food" },
  { name: "Amoxicillin", mgPerKg: 25, note: "q8h" },
  { name: "Azithromycin", mgPerKg: 10, note: "Day 1 loading" },
  { name: "Cotrimoxazole", mgPerKg: 6, note: "TMP component, q12h" },
];

function PediDoseModal({
  visible,
  onClose,
}: { visible: boolean; onClose: () => void }) {
  const [weight, setWeight] = useState("");
  const [dosePerKg, setDosePerKg] = useState("");
  const [selectedPreset, setSelectedPreset] = useState<number | null>(null);

  const dose = useMemo(() => {
    const w = parseFloat(weight);
    const d = parseFloat(dosePerKg);
    if (!w || !d || w <= 0 || d <= 0) return null;
    return w * d;
  }, [weight, dosePerKg]);

  const inputCls =
    "rounded-xl border border-border bg-ink-800 px-3 py-3 font-body text-[14px] text-text-primary";

  function selectPreset(idx: number) {
    setSelectedPreset(idx);
    setDosePerKg(String(PEDI_PRESETS[idx].mgPerKg));
  }

  return (
    <Modal visible={visible} transparent animationType="slide">
      <Pressable className="flex-1 justify-end bg-black/60" onPress={onClose}>
        <Pressable onPress={() => {}}>
          <View className="rounded-t-[28px] bg-surface-elevated p-6 pb-10">
            <View className="mb-4 flex-row items-center justify-between">
              <Text className="font-heading text-[22px] text-text-primary">
                Paediatric Dose
              </Text>
              <TouchableOpacity onPress={onClose} activeOpacity={0.7}>
                <X size={20} color="#7A7A80" />
              </TouchableOpacity>
            </View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              className="mb-4 -mx-1"
            >
              <View className="flex-row gap-2 px-1">
                {PEDI_PRESETS.map((p, i) => (
                  <TouchableOpacity
                    key={p.name}
                    onPress={() => selectPreset(i)}
                    className="rounded-xl px-3 py-2"
                    style={{
                      backgroundColor:
                        selectedPreset === i ? "#64D2FF22" : "#161618",
                      borderWidth: 1,
                      borderColor: selectedPreset === i ? "#64D2FF" : "#1F1F23",
                    }}
                    activeOpacity={0.7}
                  >
                    <Text
                      className="font-bodySemi text-[12px]"
                      style={{
                        color: selectedPreset === i ? "#64D2FF" : "#7A7A80",
                      }}
                    >
                      {p.name}
                    </Text>
                    <Text className="font-body text-[10px] text-text-disabled">
                      {p.mgPerKg} mg/kg
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>

            <Text className="mb-1 font-bodySemi text-[11px] uppercase tracking-widest text-text-tertiary">
              Weight (kg)
            </Text>
            <TextInput
              value={weight}
              onChangeText={setWeight}
              keyboardType="numeric"
              placeholder="e.g. 20"
              placeholderTextColor="#4A4A4F"
              className={`${inputCls} mb-3`}
            />

            <Text className="mb-1 font-bodySemi text-[11px] uppercase tracking-widest text-text-tertiary">
              Dose per kg (mg/kg)
            </Text>
            <TextInput
              value={dosePerKg}
              onChangeText={(v) => {
                setDosePerKg(v);
                setSelectedPreset(null);
              }}
              keyboardType="numeric"
              placeholder="e.g. 15"
              placeholderTextColor="#4A4A4F"
              className={`${inputCls} mb-4`}
            />

            {dose !== null ? (
              <View
                className="items-center rounded-2xl p-5"
                style={{ backgroundColor: "#64D2FF18" }}
              >
                <Text
                  className="font-heading text-[48px] leading-none"
                  style={{ color: "#64D2FF" }}
                >
                  {dose % 1 === 0 ? dose : dose.toFixed(1)}
                </Text>
                <Text className="mt-0.5 font-body text-[12px] text-text-tertiary">
                  mg per dose
                </Text>
                {selectedPreset !== null ? (
                  <Text className="mt-1 font-body text-[11px] text-text-tertiary">
                    {PEDI_PRESETS[selectedPreset].note}
                  </Text>
                ) : null}
                <Text className="mt-2 font-body text-[10px] text-text-disabled">
                  Verify with BNF for Children before prescribing
                </Text>
              </View>
            ) : (
              <View className="items-center rounded-2xl bg-surface py-6">
                <Baby size={28} color="#2C2C30" />
                <Text className="mt-2 font-body text-[12px] text-text-tertiary">
                  Enter weight and dose/kg
                </Text>
              </View>
            )}
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

// ── PregWheelModal ────────────────────────────────────────────────────────────

function PregWheelModal({
  visible,
  onClose,
}: { visible: boolean; onClose: () => void }) {
  const [lmp, setLmp] = useState("");

  const result = useMemo(() => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(lmp)) return null;
    const lmpDate = new Date(`${lmp}T00:00:00`);
    if (Number.isNaN(lmpDate.getTime())) return null;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (lmpDate > today) return null;
    const daysFromLMP = Math.floor(
      (today.getTime() - lmpDate.getTime()) / 86_400_000,
    );
    const weeks = Math.floor(daysFromLMP / 7);
    const days = daysFromLMP % 7;
    if (weeks > 45) return null;
    const eddDate = new Date(lmpDate.getTime() + 280 * 86_400_000);
    const edd = eddDate.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    const daysToEDD = Math.ceil(
      (eddDate.getTime() - today.getTime()) / 86_400_000,
    );
    let trimester: string;
    let color: string;
    if (weeks < 13) {
      trimester = "1st Trimester";
      color = "#00D7B5";
    } else if (weeks < 28) {
      trimester = "2nd Trimester";
      color = "#C8F53C";
    } else {
      trimester = "3rd Trimester";
      color = "#FFD60A";
    }
    return { weeks, days, edd, daysToEDD, trimester, color };
  }, [lmp]);

  const inputCls =
    "rounded-xl border border-border bg-ink-800 px-3 py-3 font-body text-[14px] text-text-primary";

  return (
    <Modal visible={visible} transparent animationType="slide">
      <Pressable className="flex-1 justify-end bg-black/60" onPress={onClose}>
        <Pressable onPress={() => {}}>
          <View className="rounded-t-[28px] bg-surface-elevated p-6 pb-10">
            <View className="mb-5 flex-row items-center justify-between">
              <Text className="font-heading text-[22px] text-text-primary">
                Pregnancy Wheel
              </Text>
              <TouchableOpacity onPress={onClose} activeOpacity={0.7}>
                <X size={20} color="#7A7A80" />
              </TouchableOpacity>
            </View>

            <Text className="mb-1 font-bodySemi text-[11px] uppercase tracking-widest text-text-tertiary">
              Last Menstrual Period (YYYY-MM-DD)
            </Text>
            <TextInput
              value={lmp}
              onChangeText={setLmp}
              placeholder="e.g. 2025-01-15"
              placeholderTextColor="#4A4A4F"
              className={`${inputCls} mb-4`}
              maxLength={10}
            />

            {result ? (
              <View
                className="rounded-2xl p-5"
                style={{ backgroundColor: `${result.color}18` }}
              >
                <Text
                  className="mb-3 text-center font-bodySemi text-[11px] uppercase tracking-widest"
                  style={{ color: result.color }}
                >
                  {result.trimester}
                </Text>
                <View className="mb-3 items-center">
                  <Text
                    className="font-heading text-[48px] leading-none"
                    style={{ color: result.color }}
                  >
                    {result.weeks}
                  </Text>
                  <Text className="font-body text-[13px] text-text-tertiary">
                    {`weeks${
                      result.days > 0
                        ? ` + ${result.days} day${result.days > 1 ? "s" : ""}`
                        : ""
                    }`}
                  </Text>
                </View>
                <View className="border-t border-border pt-3">
                  <View className="mb-1 flex-row items-center justify-between">
                    <Text className="font-body text-[12px] text-text-tertiary">
                      EDD (Naegele)
                    </Text>
                    <Text className="font-bodySemi text-[12px] text-text-primary">
                      {result.edd}
                    </Text>
                  </View>
                  <View className="flex-row items-center justify-between">
                    <Text className="font-body text-[12px] text-text-tertiary">
                      Days to EDD
                    </Text>
                    <Text className="font-bodySemi text-[12px] text-text-primary">
                      {result.daysToEDD > 0
                        ? `${result.daysToEDD} days`
                        : "Overdue"}
                    </Text>
                  </View>
                </View>
                <Text className="mt-3 text-center font-body text-[10px] text-text-disabled">
                  Naegele's rule (LMP + 280 days)
                </Text>
              </View>
            ) : (
              <View className="items-center rounded-2xl bg-surface py-6">
                <Calendar size={28} color="#2C2C30" />
                <Text className="mt-2 font-body text-[12px] text-text-tertiary">
                  Enter LMP date above
                </Text>
              </View>
            )}
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

// ── DailyPulse ───────────────────────────────────────────────────────────────

function DailyPulse() {
  const pearl = PEARLS[getDayIndex(PEARLS.length)];
  const sponsor = SPONSORS[getDayIndex(SPONSORS.length)];
  const [showBMI, setShowBMI] = useState(false);
  const [showEGFR, setShowEGFR] = useState(false);
  const [showPedi, setShowPedi] = useState(false);
  const [showPreg, setShowPreg] = useState(false);

  const CALCS = [
    { icon: Scale, label: "BMI", action: () => setShowBMI(true) },
    { icon: Calculator, label: "eGFR", action: () => setShowEGFR(true) },
    { icon: Baby, label: "Pedi Dose", action: () => setShowPedi(true) },
    { icon: Calendar, label: "Preg. Wheel", action: () => setShowPreg(true) },
  ];

  return (
    <>
      <View
        className="mb-4 overflow-hidden rounded-clinical border border-border bg-surface"
        style={{
          borderLeftWidth: 3,
          borderLeftColor: "#C8F53C",
        }}
      >
        <View className="flex-row p-4">
          {/* left: pearl */}
          <View className="min-w-0 flex-1 pr-3">
            <View className="mb-2 flex-row items-center gap-1.5">
              <Lightbulb size={12} color="#C8F53C" />
              <Text className="font-bodySemi text-[10px] uppercase tracking-widest text-accent-primary">
                Clinical Pearl
              </Text>
            </View>
            <Text
              className="font-body text-[13px] leading-[19px] text-text-secondary"
              numberOfLines={3}
            >
              {pearl.text}
            </Text>
            <Text className="mt-1 font-body text-[10px] text-text-tertiary">
              — {pearl.source}
            </Text>
          </View>

          {/* right: 2×2 calc grid */}
          <View className="w-[88px] flex-shrink-0">
            <View className="flex-row flex-wrap gap-1.5">
              {CALCS.map((c) => {
                const Icon = c.icon;
                return (
                  <TouchableOpacity
                    key={c.label}
                    onPress={c.action}
                    className="h-[38px] w-[38px] items-center justify-center rounded-xl bg-surface-elevated"
                    activeOpacity={0.7}
                    accessibilityLabel={c.label}
                  >
                    <Icon size={14} color="#7A7A80" />
                    <Text className="mt-0.5 font-body text-[8px] text-text-tertiary">
                      {c.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </View>

        {/* sponsored badge */}
        <View className="flex-row items-center justify-end gap-1.5 px-4 pb-3">
          <Text className="font-body text-[9px] text-text-disabled">
            Featured:
          </Text>
          <Text className="font-bodySemi text-[9px] text-text-tertiary">
            {sponsor.brand}
          </Text>
          <Text className="font-body text-[9px] text-text-disabled">
            · {sponsor.generic}
          </Text>
        </View>
      </View>

      <BMIModal visible={showBMI} onClose={() => setShowBMI(false)} />
      <EGFRModal visible={showEGFR} onClose={() => setShowEGFR(false)} />
      <PediDoseModal visible={showPedi} onClose={() => setShowPedi(false)} />
      <PregWheelModal visible={showPreg} onClose={() => setShowPreg(false)} />
    </>
  );
}

// ── StatChip ─────────────────────────────────────────────────────────────────

function StatChip({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: React.ComponentType<{ size: number; color: string }>;
  label: string;
  value: string | number;
  color: string;
}) {
  return (
    <View
      className="min-w-0 flex-1 items-center rounded-2xl py-3"
      style={{ backgroundColor: `${color}14` }}
    >
      <Icon size={16} color={color} />
      <Text
        className="mt-1 font-heading text-[20px] leading-tight"
        style={{ color }}
      >
        {value}
      </Text>
      <Text className="font-body text-[10px] text-text-tertiary">{label}</Text>
    </View>
  );
}

// ── QuickAction ───────────────────────────────────────────────────────────────

function QuickAction({
  icon: Icon,
  label,
  sub,
  color,
  onPress,
}: {
  icon: React.ComponentType<{
    size: number;
    color: string;
    strokeWidth?: number;
  }>;
  label: string;
  sub: string;
  color: string;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="min-w-0 flex-1 rounded-2xl border border-border bg-surface p-4"
      activeOpacity={0.75}
      accessibilityRole="button"
      accessibilityLabel={label}
    >
      <View
        className="mb-3 h-10 w-10 items-center justify-center rounded-xl"
        style={{ backgroundColor: `${color}20` }}
      >
        <Icon size={18} color={color} />
      </View>
      <Text className="font-bodySemi text-[13px] text-text-primary">
        {label}
      </Text>
      <Text className="mt-0.5 font-body text-[11px] text-text-tertiary">
        {sub}
      </Text>
    </TouchableOpacity>
  );
}

// ── HomeScreen ────────────────────────────────────────────────────────────────

export default function HomeScreen() {
  const { db } = useDatabase();
  const [todayPatients, setTodayPatients] = useState(0);
  const [todayEarnings, setTodayEarnings] = useState(0);
  const [recentVisits, setRecentVisits] = useState<
    { id: number; date: string; patients: number; earningsBdt: number }[]
  >([]);
  const [loading, setLoading] = useState(true);

  const loadStats = useCallback(async () => {
    if (!db) return;
    const today = todayISO();
    const visits = await db
      .select()
      .from(visitLogs)
      .orderBy(desc(visitLogs.createdAt))
      .limit(10)
      .all();
    const todayVisits = visits.filter((v) => v.date === today);
    setTodayPatients(todayVisits.reduce((s, v) => s + v.patients, 0));
    setTodayEarnings(todayVisits.reduce((s, v) => s + v.earningsBdt, 0));
    setRecentVisits(visits.slice(0, 3));
    setLoading(false);
  }, [db]);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  const greeting = getGreeting();

  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerStyle={{ paddingBottom: 104 }}
      showsVerticalScrollIndicator={false}
    >
      {/* ── header ────────────────────────────────────────────────── */}
      <View
        className="px-5 pb-6 pt-5"
        style={{
          backgroundColor: "#070A12",
          borderBottomLeftRadius: 28,
          borderBottomRightRadius: 28,
        }}
      >
        <Text className="font-body text-[13px] text-text-tertiary">
          {greeting}
        </Text>
        <Text className="font-heading text-[28px] leading-tight text-text-primary">
          Dr. Physician
        </Text>
        <Text className="mt-0.5 font-body text-[12px] text-text-tertiary">
          {new Date().toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
          })}
        </Text>

        {/* stats row */}
        <View className="mt-5 flex-row gap-2">
          {loading ? (
            <ActivityIndicator color="#C8F53C" />
          ) : (
            <>
              <StatChip
                icon={Users}
                label="Today's Pts"
                value={todayPatients}
                color="#C8F53C"
              />
              <View className="w-2" />
              <StatChip
                icon={TrendingUp}
                label="Earnings"
                value={`৳${todayEarnings}`}
                color="#00D7B5"
              />
              <View className="w-2" />
              <StatChip
                icon={Stethoscope}
                label="Visits"
                value={recentVisits.filter((v) => v.date === todayISO()).length}
                color="#64D2FF"
              />
            </>
          )}
        </View>
      </View>

      <View className="px-4 pt-5">
        {/* ── daily pulse ──────────────────────────────────────────── */}
        <Text className="mb-3 font-bodySemi text-[11px] uppercase tracking-widest text-text-tertiary">
          Daily Pulse
        </Text>
        <DailyPulse />

        {/* ── quick actions ─────────────────────────────────────────── */}
        <Text className="mb-3 font-bodySemi text-[11px] uppercase tracking-widest text-text-tertiary">
          Quick Access
        </Text>
        <View className="mb-2 flex-row gap-3">
          <QuickAction
            icon={Stethoscope}
            label="GP Master"
            sub="Conditions & protocols"
            color="#C8F53C"
            onPress={() => router.navigate("/(tabs)/gp")}
          />
          <QuickAction
            icon={Pill}
            label="DIMS"
            sub="Drug lookup"
            color="#00D7B5"
            onPress={() => router.navigate("/(tabs)/dims")}
          />
        </View>
        <View className="mb-4 flex-row gap-3">
          <QuickAction
            icon={Zap}
            label="ER Doses"
            sub="Emergency calc"
            color="#FF453A"
            onPress={() => router.navigate("/(tabs)/er")}
          />
          <QuickAction
            icon={Wallet}
            label="Wallet"
            sub="Track earnings"
            color="#FFD60A"
            onPress={() => router.navigate("/(tabs)/wallet")}
          />
        </View>

        {/* ── recent activity ───────────────────────────────────────── */}
        {recentVisits.length > 0 ? (
          <View>
            <Text className="mb-3 font-bodySemi text-[11px] uppercase tracking-widest text-text-tertiary">
              Recent Visits
            </Text>
            {recentVisits.map((v) => (
              <View
                key={v.id}
                className="mb-2 flex-row items-center justify-between rounded-2xl border border-border bg-surface px-4 py-3"
              >
                <View>
                  <Text className="font-bodySemi text-[13px] text-text-primary">
                    {v.date}
                  </Text>
                  <View className="mt-0.5 flex-row items-center gap-1">
                    <Users size={10} color="#7A7A80" />
                    <Text className="font-body text-[11px] text-text-tertiary">
                      {v.patients} patient{v.patients !== 1 ? "s" : ""}
                    </Text>
                  </View>
                </View>
                <Text className="font-heading text-[16px] text-clinical-teal">
                  ৳{v.earningsBdt.toLocaleString()}
                </Text>
              </View>
            ))}
          </View>
        ) : null}

        {!loading && recentVisits.length === 0 ? (
          <View className="mt-2 items-center rounded-2xl border border-border bg-surface py-8">
            <Stethoscope size={32} color="#2C2C30" />
            <Text className="mt-3 font-bodySemi text-[14px] text-text-primary">
              No visits logged yet
            </Text>
            <Text className="mt-1 font-body text-[12px] text-text-tertiary">
              Start a visit from the Wallet tab
            </Text>
            <TouchableOpacity
              onPress={() => router.navigate("/(tabs)/wallet")}
              className="mt-4 rounded-2xl px-5 py-2.5"
              style={{
                backgroundColor: "#C8F53C22",
                borderColor: "#C8F53C40",
                borderWidth: 1,
              }}
              activeOpacity={0.7}
            >
              <Text className="font-bodySemi text-[13px] text-accent-primary">
                Go to Wallet
              </Text>
            </TouchableOpacity>
          </View>
        ) : null}
      </View>
    </ScrollView>
  );
}
