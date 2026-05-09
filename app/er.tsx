import { ClinicalShell } from "@/components/layout/ClinicalShell";
import { useDatabase } from "@/db/provider";
import { erDrugs } from "@/db/schema";
import {
  triggerEmergencyHaptic,
  triggerSelectionHaptic,
} from "@/lib/clinical-haptics";
import { router } from "expo-router";
import { AlertTriangle, Minus, Plus, X, Zap } from "lucide-react-native";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

type Drug = typeof erDrugs.$inferSelect;

function calcDose(drug: Drug, kg: number) {
  if (!drug.dosePerKg || kg <= 0) return null;
  const rawDose = kg * drug.dosePerKg;
  const capped = drug.maxDoseMg != null && rawDose > drug.maxDoseMg;
  const dose = capped ? drug.maxDoseMg ?? rawDose : rawDose;
  const vol = drug.concentrationMgPerMl
    ? dose / drug.concentrationMgPerMl
    : null;
  return {
    capped,
    dose: dose.toFixed(2),
    formula: `${drug.dosePerKg} mg/kg x ${kg} kg = ${rawDose.toFixed(2)} mg`,
    vol: vol ? vol.toFixed(2) : null,
  };
}

function DrugCard({ drug, kg }: { drug: Drug; kg: number }) {
  const [open, setOpen] = useState(false);
  const result = calcDose(drug, kg);
  const isCritical = drug.warningNote != null || result?.capped;

  return (
    <TouchableOpacity
      onPress={() => {
        triggerSelectionHaptic();
        setOpen((value) => !value);
      }}
      activeOpacity={0.82}
      className={[
        "mb-3 overflow-hidden rounded-[24px] border bg-surface",
        isCritical ? "border-clinical-red" : "border-border",
      ].join(" ")}
      accessibilityRole="button"
      accessibilityLabel={`${drug.name} emergency dose`}
    >
      <View className="p-4">
        <View className="flex-row items-start gap-3">
          <View
            className={[
              "h-11 w-11 items-center justify-center rounded-2xl",
              isCritical ? "bg-clinical-redSoft" : "bg-accent-primarySoft",
            ].join(" ")}
          >
            <Zap
              color={isCritical ? "#FF3B30" : "#2470FF"}
              size={21}
              strokeWidth={1.8}
            />
          </View>

          <View className="flex-1">
            <View className="flex-row items-start justify-between gap-3">
              <View className="flex-1">
                <Text className="font-headingSemi text-[16px] text-text-primary">
                  {drug.name}
                </Text>
                {drug.indication ? (
                  <Text
                    className="mt-1 font-body text-[12px] text-text-tertiary"
                    numberOfLines={1}
                  >
                    {drug.indication}
                  </Text>
                ) : null}
              </View>

              {result ? (
                <View className="items-end">
                  <Text className="font-heading text-[26px] leading-8 text-text-primary">
                    {result.dose}
                  </Text>
                  <Text className="font-bodySemi text-[12px] text-accent-primary">
                    mg
                  </Text>
                </View>
              ) : (
                <Text className="font-body text-[12px] text-text-tertiary">
                  Enter weight
                </Text>
              )}
            </View>

            {result ? (
              <Text className="mt-2 font-body text-[11px] text-text-tertiary">
                {result.formula}
              </Text>
            ) : null}
            {result?.capped ? (
              <Text className="mt-1 font-bodySemi text-[12px] text-clinical-red">
                Capped at adult max.
              </Text>
            ) : null}
          </View>
        </View>
      </View>

      {open ? (
        <View className="border-t border-border px-4 pb-4 pt-3">
          <InfoRow label="Route" value={drug.route} />
          {result?.vol ? (
            <InfoRow label="Volume" value={`${result.vol} mL`} />
          ) : null}
          {drug.concentrationMgPerMl ? (
            <InfoRow
              label="Concentration"
              value={`${drug.concentrationMgPerMl} mg/mL`}
            />
          ) : null}
          {drug.maxDoseMg ? (
            <InfoRow label="Max dose" value={`${drug.maxDoseMg} mg`} />
          ) : null}
          {drug.dilutionNotes ? (
            <InfoRow label="Dilution" value={drug.dilutionNotes} />
          ) : null}
          {drug.warningNote ? (
            <View className="mt-2 flex-row items-start gap-2 rounded-xl bg-clinical-redSoft px-3 py-2">
              <AlertTriangle
                color="#FF3B30"
                size={14}
                strokeWidth={1.8}
                style={{ marginTop: 1 }}
              />
              <Text className="flex-1 font-body text-[12px] leading-5 text-clinical-red">
                {drug.warningNote}
              </Text>
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
    <View className="flex-row items-start justify-between gap-3 py-1">
      <Text className="font-bodySemi text-[11px] uppercase text-text-tertiary">
        {label}
      </Text>
      <Text className="flex-1 text-right font-body text-[13px] leading-5 text-text-secondary">
        {value}
      </Text>
    </View>
  );
}

export default function ERScreen() {
  const { db } = useDatabase();
  const [weight, setWeight] = useState("12");
  const [drugs, setDrugs] = useState<Drug[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!db) return;
    db.select()
      .from(erDrugs)
      .then((rows) => {
        setDrugs(rows);
        setLoading(false);
      });
  }, [db]);

  const kg = Number.parseFloat(weight) || 0;

  const updateWeight = useCallback((next: number) => {
    const bounded = Math.min(200, Math.max(0, next));
    setWeight(
      String(Number.isInteger(bounded) ? bounded : Number(bounded.toFixed(1))),
    );
  }, []);

  return (
    <ClinicalShell>
      <View className="pb-4 pt-2">
        <View className="flex-row items-center justify-between gap-3">
          <View className="flex-row items-center gap-3">
            <View className="h-11 w-11 items-center justify-center rounded-2xl bg-clinical-redSoft">
              <Zap color="#FF3B30" size={22} strokeWidth={1.8} />
            </View>
            <View>
              <Text className="font-heading text-[30px] leading-10 text-text-primary">
                ER
              </Text>
              <Text className="font-body text-[13px] text-text-tertiary">
                Weight-based emergency dosing
              </Text>
            </View>
          </View>
          <TouchableOpacity
            accessibilityLabel="Close ER"
            accessibilityRole="button"
            activeOpacity={0.78}
            className="h-11 w-11 items-center justify-center rounded-2xl border border-surface-glassBorder bg-surface"
            onPress={() => router.back()}
          >
            <X color="#182456" size={22} strokeWidth={1.8} />
          </TouchableOpacity>
        </View>
      </View>

      <View className="mb-5 rounded-[24px] border border-clinical-red bg-clinical-redSoft p-5">
        <Text className="mb-4 font-bodySemi text-[11px] uppercase text-clinical-red">
          Patient weight
        </Text>
        <View className="flex-row items-center justify-center gap-4">
          <StepperButton
            icon={<Minus color="#2470FF" size={22} strokeWidth={2} />}
            label="Decrease weight"
            onPress={() => updateWeight(kg - 1)}
          />
          <View className="min-w-[128px] items-center">
            <TextInput
              className="min-w-[112px] text-center font-heading text-[44px] leading-[52px] text-text-primary"
              value={weight}
              onChangeText={(text) => setWeight(text.replace(/[^0-9.]/g, ""))}
              keyboardType="decimal-pad"
              selectionColor="#FF3B30"
              onFocus={triggerEmergencyHaptic}
              accessibilityLabel="Patient weight in kilograms"
            />
            <Text className="font-bodySemi text-[13px] text-clinical-red">
              kg
            </Text>
          </View>
          <StepperButton
            icon={<Plus color="#2470FF" size={22} strokeWidth={2} />}
            label="Increase weight"
            onPress={() => updateWeight(kg + 1)}
          />
        </View>
      </View>

      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator color="#FF3B30" />
        </View>
      ) : (
        <FlatList
          data={drugs}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={{ paddingBottom: 156 }}
          keyboardDismissMode="on-drag"
          keyboardShouldPersistTaps="handled"
          ListHeaderComponent={
            <Text className="mb-3 font-bodySemi text-[11px] uppercase text-text-tertiary">
              {drugs.length} drugs · calculated for {kg || 0} kg
            </Text>
          }
          renderItem={({ item }) => <DrugCard drug={item} kg={kg} />}
        />
      )}
    </ClinicalShell>
  );
}

function StepperButton({
  icon,
  label,
  onPress,
}: {
  icon: React.ReactNode;
  label: string;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      className="h-12 w-12 items-center justify-center rounded-full border border-surface-glassBorder bg-surface"
      onPress={() => {
        triggerSelectionHaptic();
        onPress();
      }}
      activeOpacity={0.78}
      accessibilityLabel={label}
      accessibilityRole="button"
    >
      {icon}
    </TouchableOpacity>
  );
}
