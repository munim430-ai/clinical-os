import { useDatabase } from "@/db/provider";
import { patients } from "@/db/schema";
import {
  triggerSelectionHaptic,
  triggerSuccessHaptic,
} from "@/lib/clinical-haptics";
import { cn } from "@/lib/utils";
import { eq } from "drizzle-orm";
import { router, useLocalSearchParams } from "expo-router";
import { ArrowLeft, X } from "lucide-react-native";
import { useEffect, useState } from "react";
import {
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const GENDERS = ["male", "female", "other"];
const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

function Field({
  label,
  children,
}: { label: string; children: React.ReactNode }) {
  return (
    <View className="mb-4">
      <Text className="mb-1.5 font-bodySemi text-[11px] uppercase tracking-widest text-text-tertiary">
        {label}
      </Text>
      {children}
    </View>
  );
}

const inputCls =
  "rounded-xl border border-border bg-surface px-3.5 py-3 font-body text-[14px] text-text-primary";

export default function NewPatientScreen() {
  const { db } = useDatabase();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const isEdit = Boolean(id);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [ageYears, setAgeYears] = useState("");
  const [ageMonths, setAgeMonths] = useState("");
  const [gender, setGender] = useState("");
  const [bloodGroup, setBloodGroup] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [allergyInput, setAllergyInput] = useState("");
  const [allergies, setAllergies] = useState<string[]>([]);
  const [chronicConditions, setChronicConditions] = useState("");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!db || !id) return;
    db.select()
      .from(patients)
      .where(eq(patients.id, Number(id)))
      .limit(1)

      .then((rows) => {
        const p = rows[0];
        if (!p) return;
        setName(p.name);
        setPhone(p.phone ?? "");
        setAgeYears(p.ageYears ? String(p.ageYears) : "");
        setAgeMonths(p.ageMonths ? String(p.ageMonths) : "");
        setGender(p.gender ?? "");
        setBloodGroup(p.bloodGroup ?? "");
        setHeight(p.heightCm ? String(p.heightCm) : "");
        setWeight(p.weightKg ? String(p.weightKg) : "");
        setAllergies(
          p.drugAllergies
            ? p.drugAllergies
                .split(",")
                .map((a) => a.trim())
                .filter(Boolean)
            : [],
        );
        setChronicConditions(p.chronicConditions ?? "");
        setNotes(p.notes ?? "");
      });
  }, [db, id]);

  function addAllergy() {
    const value = allergyInput.trim();
    if (!value) return;
    setAllergies((prev) => (prev.includes(value) ? prev : [...prev, value]));
    setAllergyInput("");
  }

  async function handleSave() {
    if (!db || !name.trim() || saving) return;
    setSaving(true);
    try {
      const values = {
        name: name.trim(),
        phone: phone.trim() || null,
        ageYears: ageYears ? Number.parseInt(ageYears, 10) : null,
        ageMonths: ageMonths ? Number.parseInt(ageMonths, 10) : null,
        gender: gender || null,
        bloodGroup: bloodGroup || null,
        heightCm: height ? Number.parseFloat(height) : null,
        weightKg: weight ? Number.parseFloat(weight) : null,
        drugAllergies: allergies.length ? allergies.join(", ") : null,
        chronicConditions: chronicConditions.trim() || null,
        notes: notes.trim() || null,
      };
      if (isEdit && id) {
        await db
          .update(patients)
          .set({ ...values, updatedAt: new Date().toISOString() })
          .where(eq(patients.id, Number(id)));
      } else {
        await db.insert(patients).values(values);
      }
      triggerSuccessHaptic();
      router.back();
    } finally {
      setSaving(false);
    }
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
          {isEdit ? "Edit Patient" : "New Patient"}
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={{ padding: 16, paddingBottom: 60 }}
        keyboardShouldPersistTaps="handled"
      >
        <Field label="Name *">
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="Patient full name"
            placeholderTextColor="#4A4A4F"
            className={inputCls}
          />
        </Field>
        <Field label="Phone">
          <TextInput
            value={phone}
            onChangeText={setPhone}
            placeholder="01xxxxxxxxx"
            placeholderTextColor="#4A4A4F"
            keyboardType="phone-pad"
            className={inputCls}
          />
        </Field>

        <View className="flex-row gap-3">
          <View className="flex-1">
            <Field label="Age (years)">
              <TextInput
                value={ageYears}
                onChangeText={setAgeYears}
                placeholder="35"
                placeholderTextColor="#4A4A4F"
                keyboardType="numeric"
                className={inputCls}
              />
            </Field>
          </View>
          <View className="flex-1">
            <Field label="Age (months)">
              <TextInput
                value={ageMonths}
                onChangeText={setAgeMonths}
                placeholder="0"
                placeholderTextColor="#4A4A4F"
                keyboardType="numeric"
                className={inputCls}
              />
            </Field>
          </View>
        </View>

        <Field label="Gender">
          <View className="flex-row gap-2">
            {GENDERS.map((g) => (
              <Pressable
                key={g}
                onPress={() => {
                  triggerSelectionHaptic();
                  setGender(g);
                }}
                className={cn(
                  "flex-1 items-center rounded-xl border py-2.5 capitalize",
                  gender === g
                    ? "border-accent-primary bg-accent-primarySoft"
                    : "border-border bg-surface",
                )}
              >
                <Text
                  className={cn(
                    "font-bodySemi text-[12.5px] capitalize",
                    gender === g
                      ? "text-accent-primary"
                      : "text-text-secondary",
                  )}
                >
                  {g}
                </Text>
              </Pressable>
            ))}
          </View>
        </Field>

        <Field label="Blood Group">
          <View className="flex-row flex-wrap gap-2">
            {BLOOD_GROUPS.map((bg) => (
              <Pressable
                key={bg}
                onPress={() => {
                  triggerSelectionHaptic();
                  setBloodGroup(bg);
                }}
                className={cn(
                  "rounded-pill border px-3.5 py-2",
                  bloodGroup === bg
                    ? "border-accent-primary bg-accent-primary"
                    : "border-border bg-surface",
                )}
              >
                <Text
                  className={cn(
                    "font-bodySemi text-[12px]",
                    bloodGroup === bg
                      ? "text-text-inverse"
                      : "text-text-secondary",
                  )}
                >
                  {bg}
                </Text>
              </Pressable>
            ))}
          </View>
        </Field>

        <View className="flex-row gap-3">
          <View className="flex-1">
            <Field label="Height (cm)">
              <TextInput
                value={height}
                onChangeText={setHeight}
                placeholder="170"
                placeholderTextColor="#4A4A4F"
                keyboardType="numeric"
                className={inputCls}
              />
            </Field>
          </View>
          <View className="flex-1">
            <Field label="Weight (kg)">
              <TextInput
                value={weight}
                onChangeText={setWeight}
                placeholder="65"
                placeholderTextColor="#4A4A4F"
                keyboardType="numeric"
                className={inputCls}
              />
            </Field>
          </View>
        </View>

        <Field label="Drug Allergies">
          <View className="flex-row items-center gap-2">
            <TextInput
              value={allergyInput}
              onChangeText={setAllergyInput}
              onSubmitEditing={addAllergy}
              placeholder="Type and press enter"
              placeholderTextColor="#4A4A4F"
              className={`${inputCls} flex-1`}
              returnKeyType="done"
            />
          </View>
          {allergies.length ? (
            <View className="mt-2 flex-row flex-wrap gap-2">
              {allergies.map((a) => (
                <View
                  key={a}
                  className="flex-row items-center gap-1.5 rounded-pill border border-clinical-red/40 bg-clinical-redSoft px-3 py-1.5"
                >
                  <Text className="font-bodySemi text-[11.5px] text-clinical-red">
                    {a}
                  </Text>
                  <TouchableOpacity
                    onPress={() =>
                      setAllergies((prev) => prev.filter((x) => x !== a))
                    }
                  >
                    <X size={12} color="#FF453A" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          ) : null}
        </Field>

        <Field label="Chronic Conditions">
          <TextInput
            value={chronicConditions}
            onChangeText={setChronicConditions}
            placeholder="e.g. Hypertension, Diabetes"
            placeholderTextColor="#4A4A4F"
            className={inputCls}
          />
        </Field>

        <Field label="Notes">
          <TextInput
            value={notes}
            onChangeText={setNotes}
            placeholder="Additional notes"
            placeholderTextColor="#4A4A4F"
            multiline
            className={inputCls}
          />
        </Field>

        <TouchableOpacity
          disabled={!name.trim() || saving}
          onPress={handleSave}
          className={cn(
            "mt-2 items-center rounded-2xl py-4",
            name.trim() ? "bg-accent-primary" : "bg-surface-elevated",
          )}
        >
          <Text
            className={cn(
              "font-bodySemi text-[15px]",
              name.trim() ? "text-text-inverse" : "text-text-disabled",
            )}
          >
            {saving ? "Saving…" : isEdit ? "Save Changes" : "Save Patient"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
