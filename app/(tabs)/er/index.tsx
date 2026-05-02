import { View, Text, TextInput, TouchableOpacity, FlatList, ActivityIndicator } from "react-native";
import { Zap, AlertTriangle, ChevronDown, ChevronUp } from "lucide-react";
import { ClinicalShell } from "@/components/layout/ClinicalShell";
import { triggerSelectionHaptic, triggerEmergencyHaptic } from "@/lib/clinical-haptics";
import { useState, useEffect, useCallback } from "react";
import { useDatabase } from "@/db/provider";
import { erDrugs } from "@/db/schema";

type Drug = typeof erDrugs.$inferSelect;

function calcDose(drug: Drug, kg: number) {
  if (!drug.dosePerKg || kg <= 0) return null;
  const dose = Math.min(kg * drug.dosePerKg, drug.maxDoseMg ?? Infinity);
  const vol = drug.concentrationMgPerMl ? dose / drug.concentrationMgPerMl : null;
  return { dose: dose.toFixed(2), vol: vol ? vol.toFixed(2) : null };
}

function DrugCard({ drug, kg }: { drug: Drug; kg: number }) {
  const [open, setOpen] = useState(false);
  const result = calcDose(drug, kg);
  const isCritical = drug.warningNote != null;

  return (
    <TouchableOpacity
      onPress={() => { triggerSelectionHaptic(); setOpen(o => !o); }}
      activeOpacity={0.82}
      className={[
        "mb-3 overflow-hidden rounded-clinical border",
        isCritical ? "border-border-red bg-clinical-redSoft" : "border-border bg-ink-800",
      ].join(" ")}
    >
      <View className="flex-row items-center p-4">
        <View className={[
          "mr-3 h-10 w-10 items-center justify-center rounded-2xl",
          isCritical ? "bg-clinical-red" : "bg-mint-soft",
        ].join(" ")}>
          <Zap size={18} color={isCritical ? "#fff" : "#B8FFD2"} strokeWidth={1.8} />
        </View>

        <View className="flex-1">
          <Text className="font-headingBold text-[15px] text-text-primary">{drug.name}</Text>
          {drug.indication ? (
            <Text className="mt-0.5 font-body text-[12px] text-text-muted" numberOfLines={1}>
              {drug.indication}
            </Text>
          ) : null}
        </View>

        {result ? (
          <View className="items-end ml-3">
            <Text className="font-headingBold text-[18px] text-mint">{result.dose} mg</Text>
            {result.vol ? (
              <Text className="font-bodySemi text-[12px] text-text-secondary">{result.vol} mL</Text>
            ) : null}
          </View>
        ) : (
          <Text className="font-body text-[12px] text-text-muted ml-3">Enter weight</Text>
        )}

        <View className="ml-3">
          {open
            ? <ChevronUp size={16} color="#7A7A80" strokeWidth={1.6} />
            : <ChevronDown size={16} color="#7A7A80" strokeWidth={1.6} />}
        </View>
      </View>

      {open ? (
        <View className="border-t border-border-soft px-4 pb-4 pt-3 gap-2">
          <InfoRow label="Route" value={drug.route} />
          {drug.concentrationMgPerMl ? (
            <InfoRow label="Concentration" value={`${drug.concentrationMgPerMl} mg/mL`} />
          ) : null}
          {drug.maxDoseMg ? (
            <InfoRow label="Max dose" value={`${drug.maxDoseMg} mg`} />
          ) : null}
          {drug.dilutionNotes ? (
            <InfoRow label="Dilution" value={drug.dilutionNotes} />
          ) : null}
          {drug.warningNote ? (
            <View className="mt-1 flex-row items-start gap-2 rounded-xl border border-border-red bg-clinical-redSoft px-3 py-2">
              <AlertTriangle size={13} color="#FF453A" strokeWidth={1.7} style={{ marginTop: 1 }} />
              <Text className="flex-1 font-body text-[12px] leading-5 text-clinical-red">{drug.warningNote}</Text>
            </View>
          ) : null}
        </View>
      ) : null}
    </TouchableOpacity>
  );
}

function InfoRow({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null;
  return (
    <View className="flex-row items-start justify-between gap-3">
      <Text className="font-bodySemi text-[11px] uppercase tracking-[1.3px] text-text-muted">{label}</Text>
      <Text className="flex-1 text-right font-body text-[13px] leading-5 text-text-secondary">{value}</Text>
    </View>
  );
}

export default function ERScreen() {
  const { db } = useDatabase();
  const [weight, setWeight] = useState("");
  const [drugs, setDrugs] = useState<Drug[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!db) return;
    db.select().from(erDrugs).then((rows) => {
      setDrugs(rows);
      setLoading(false);
    });
  }, [db]);

  const kg = parseFloat(weight) || 0;

  const handleWeightChange = useCallback((text: string) => {
    setWeight(text.replace(/[^0-9.]/g, ""));
  }, []);

  return (
    <ClinicalShell>
      {/* Header */}
      <View className="pb-3 pt-2">
        <View className="flex-row items-center gap-3">
          <View className="h-10 w-10 items-center justify-center rounded-2xl bg-clinical-redSoft border border-border-red">
            <Zap size={20} color="#FF453A" strokeWidth={1.8} />
          </View>
          <View>
            <Text className="font-heading text-[28px] leading-9 text-text-primary">ER Mode</Text>
            <Text className="font-body text-[12px] text-text-muted">Weight-based emergency dosing</Text>
          </View>
        </View>
      </View>

      {/* Weight input */}
      <View className="mb-5 overflow-hidden rounded-[28px] border border-border-red bg-clinical-redSoft px-5 py-4">
        <Text className="mb-2 font-bodySemi text-[11px] uppercase tracking-[1.5px] text-clinical-red">
          Patient weight
        </Text>
        <View className="flex-row items-center gap-3">
          <TextInput
            className="flex-1 font-heading text-[40px] leading-none text-text-primary"
            placeholder="0"
            placeholderTextColor="#4A4A4F"
            value={weight}
            onChangeText={handleWeightChange}
            keyboardType="decimal-pad"
            returnKeyType="done"
            selectionColor="#FF453A"
            onFocus={triggerEmergencyHaptic}
          />
          <Text className="font-headingBold text-[22px] text-clinical-red">kg</Text>
        </View>
        {kg > 0 ? (
          <Text className="mt-2 font-body text-[12px] text-text-muted">
            Calculating doses for {kg} kg patient
          </Text>
        ) : null}
      </View>

      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator color="#FF453A" />
        </View>
      ) : (
        <FlatList
          data={drugs}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={{ paddingBottom: 104 }}
          renderItem={({ item }) => <DrugCard drug={item} kg={kg} />}
        />
      )}
    </ClinicalShell>
  );
}
