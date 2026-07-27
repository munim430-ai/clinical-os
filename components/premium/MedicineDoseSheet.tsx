import { DoseGrid } from "@/components/premium/DoseGrid";
import {
  triggerSelectionHaptic,
  triggerSuccessHaptic,
} from "@/lib/clinical-haptics";
import {
  DURATION_OPTIONS,
  TIMING_OPTIONS,
  calculateQuantity,
  getDefaultDosing,
} from "@/lib/dosing";
import type { RxMedicine } from "@/lib/rx-store";
import { cn } from "@/lib/utils";
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { ShieldAlert } from "lucide-react-native";
import {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import { Pressable, Text, View } from "react-native";

export type MedicineDoseSheetDrug = {
  medicineId: number | null;
  brandName: string;
  genericName: string | null;
  strength: string | null;
  dosageForm: string | null;
};

export interface MedicineDoseSheetRef {
  present: (drug: MedicineDoseSheetDrug) => void;
  dismiss: () => void;
}

interface MedicineDoseSheetProps {
  patientAllergies?: string;
  onConfirm: (med: Omit<RxMedicine, "tempId">) => void;
}

function isAllergic(
  allergies: string | undefined,
  genericName: string | null,
): boolean {
  if (!allergies || !genericName) return false;
  return allergies
    .split(",")
    .map((a) => a.trim().toLowerCase())
    .filter(Boolean)
    .some((a) => genericName.toLowerCase().includes(a));
}

export const MedicineDoseSheet = forwardRef<
  MedicineDoseSheetRef,
  MedicineDoseSheetProps
>(({ patientAllergies, onConfirm }, ref) => {
  const sheetRef = useRef<BottomSheetModal>(null);
  const [drug, setDrug] = useState<MedicineDoseSheetDrug | null>(null);
  const [dose, setDose] = useState({ morning: 1, afternoon: 0, night: 1 });
  const [timing, setTiming] = useState<string>("After meal");
  const [duration, setDuration] = useState<string>("5 days");

  useImperativeHandle(ref, () => ({
    present: (d) => {
      const defaults = getDefaultDosing(d.genericName ?? d.brandName);
      setDrug(d);
      setDose({
        morning: defaults.morning,
        afternoon: defaults.afternoon,
        night: defaults.night,
      });
      setTiming(
        defaults.timing === "before meal"
          ? "Before meal"
          : defaults.timing === "empty stomach"
            ? "Empty stomach"
            : "After meal",
      );
      setDuration(
        defaults.duration === "continue"
          ? "Continue"
          : DURATION_OPTIONS.find(
              (o) => o.toLowerCase() === defaults.duration,
            ) ?? defaults.duration,
      );
      sheetRef.current?.present();
    },
    dismiss: () => sheetRef.current?.dismiss(),
  }));

  const quantity = useMemo(
    () => calculateQuantity(dose.morning, dose.afternoon, dose.night, duration),
    [dose, duration],
  );

  const allergic = isAllergic(patientAllergies, drug?.genericName ?? null);

  const handleConfirm = useCallback(() => {
    if (!drug) return;
    triggerSuccessHaptic();
    onConfirm({
      brandName: drug.brandName,
      genericName: drug.genericName,
      strength: drug.strength,
      dosageForm: drug.dosageForm,
      medicineId: drug.medicineId,
      doseMorning: dose.morning,
      doseAfternoon: dose.afternoon,
      doseNight: dose.night,
      timing,
      duration,
      quantity,
      instructions: "",
    });
    sheetRef.current?.dismiss();
  }, [drug, dose, timing, duration, quantity, onConfirm]);

  return (
    <BottomSheetModal
      ref={sheetRef}
      enableDynamicSizing
      enablePanDownToClose
      backdropComponent={(props) => (
        <BottomSheetBackdrop
          {...props}
          disappearsOnIndex={-1}
          appearsOnIndex={0}
          opacity={0.6}
        />
      )}
      backgroundStyle={{ backgroundColor: "#161618" }}
      handleIndicatorStyle={{ backgroundColor: "#3A3A3F" }}
    >
      <BottomSheetView
        style={{ paddingHorizontal: 20, paddingBottom: 36, paddingTop: 4 }}
      >
        {drug ? (
          <>
            <Text className="font-headingSemi text-[18px] text-text-primary">
              {drug.brandName}
              {drug.strength ? ` ${drug.strength}` : ""}
            </Text>
            {drug.genericName ? (
              <Text className="mt-0.5 font-body text-[13px] text-text-tertiary">
                {drug.genericName}
                {drug.dosageForm ? ` · ${drug.dosageForm}` : ""}
              </Text>
            ) : null}

            {allergic ? (
              <View className="mt-3 flex-row items-center gap-2 rounded-xl border border-clinical-red/40 bg-clinical-redSoft px-3 py-2.5">
                <ShieldAlert size={16} color="#FF453A" strokeWidth={1.8} />
                <Text className="flex-1 font-bodySemi text-[12px] text-clinical-red">
                  Patient has a recorded allergy to this generic
                </Text>
              </View>
            ) : null}

            <View className="mt-5">
              <DoseGrid
                morning={dose.morning}
                afternoon={dose.afternoon}
                night={dose.night}
                onChange={setDose}
              />
            </View>

            <Text className="mb-2 mt-5 font-bodySemi text-[11px] uppercase tracking-widest text-text-tertiary">
              Timing
            </Text>
            <View className="flex-row gap-2">
              {TIMING_OPTIONS.map((t) => (
                <Pressable
                  key={t}
                  onPress={() => {
                    triggerSelectionHaptic();
                    setTiming(t);
                  }}
                  className={cn(
                    "flex-1 items-center rounded-xl border py-2.5",
                    timing === t
                      ? "border-accent-primary bg-accent-primarySoft"
                      : "border-border bg-surface",
                  )}
                >
                  <Text
                    className={cn(
                      "font-bodySemi text-[11.5px]",
                      timing === t
                        ? "text-accent-primary"
                        : "text-text-secondary",
                    )}
                  >
                    {t}
                  </Text>
                </Pressable>
              ))}
            </View>

            <Text className="mb-2 mt-5 font-bodySemi text-[11px] uppercase tracking-widest text-text-tertiary">
              Duration
            </Text>
            <View className="flex-row flex-wrap gap-2">
              {DURATION_OPTIONS.map((d) => (
                <Pressable
                  key={d}
                  onPress={() => {
                    triggerSelectionHaptic();
                    setDuration(d);
                  }}
                  className={cn(
                    "rounded-pill border px-3.5 py-2",
                    duration === d
                      ? "border-accent-primary bg-accent-primary"
                      : "border-border bg-surface",
                  )}
                >
                  <Text
                    className={cn(
                      "font-bodySemi text-[12px]",
                      duration === d
                        ? "text-text-inverse"
                        : "text-text-secondary",
                    )}
                  >
                    {d}
                  </Text>
                </Pressable>
              ))}
            </View>

            {quantity != null ? (
              <Text className="mt-4 font-body text-[12px] text-text-tertiary">
                Qty: {quantity}{" "}
                {drug.dosageForm?.toLowerCase().includes("syrup")
                  ? "ml"
                  : "units"}
              </Text>
            ) : null}

            <Pressable
              onPress={handleConfirm}
              className="mt-6 items-center rounded-2xl bg-accent-primary py-4"
              accessibilityRole="button"
            >
              <Text className="font-bodySemi text-[15px] text-text-inverse">
                Add to Prescription
              </Text>
            </Pressable>
          </>
        ) : null}
      </BottomSheetView>
    </BottomSheetModal>
  );
});

MedicineDoseSheet.displayName = "MedicineDoseSheet";
