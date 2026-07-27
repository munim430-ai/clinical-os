import { EmptyState } from "@/components/premium/EmptyState";
import { useDatabase } from "@/db/provider";
import { patients } from "@/db/schema";
import {
  triggerSelectionHaptic,
  triggerSuccessHaptic,
} from "@/lib/clinical-haptics";
import { useRxStore } from "@/lib/rx-store";
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { desc, like, or } from "drizzle-orm";
import { router } from "expo-router";
import {
  ArrowLeft,
  Plus,
  Search,
  ShieldAlert,
  UserRound,
} from "lucide-react-native";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  FlatList,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

type Patient = typeof patients.$inferSelect;

function genderColor(gender: string | null): string {
  if (gender === "male") return "#64D2FF";
  if (gender === "female") return "#E91E8C";
  return "#7A7A80";
}

function initials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");
}

function PatientCard({
  patient,
  onPress,
}: { patient: Patient; onPress: () => void }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.75}
      className="mb-2.5 flex-row items-center gap-3 rounded-clinical border border-border bg-surface p-3.5"
    >
      <View
        className="h-11 w-11 items-center justify-center rounded-full"
        style={{ backgroundColor: `${genderColor(patient.gender)}22` }}
      >
        <Text
          className="font-bodySemi text-[13px]"
          style={{ color: genderColor(patient.gender) }}
        >
          {initials(patient.name)}
        </Text>
      </View>
      <View className="flex-1">
        <Text className="font-bodySemi text-[14px] text-text-primary">
          {patient.name}
        </Text>
        <Text className="mt-0.5 font-body text-[11.5px] text-text-tertiary">
          {[
            patient.ageYears ? `${patient.ageYears}y` : null,
            patient.gender,
            patient.phone,
          ]
            .filter(Boolean)
            .join(" · ")}
        </Text>
      </View>
      {patient.drugAllergies ? (
        <ShieldAlert size={16} color="#FF453A" strokeWidth={1.8} />
      ) : null}
    </TouchableOpacity>
  );
}

export default function PatientSelectScreen() {
  const { db } = useDatabase();
  const selectPatient = useRxStore((s) => s.selectPatient);
  const [recent, setRecent] = useState<Patient[]>([]);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Patient[]>([]);
  const sheetRef = useRef<BottomSheetModal>(null);

  const [newName, setNewName] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newAge, setNewAge] = useState("");
  const [newGender, setNewGender] = useState("");
  const [newAllergies, setNewAllergies] = useState("");

  const loadRecent = useCallback(() => {
    if (!db) return;
    db.select().from(patients).orderBy(desc(patients.updatedAt)).limit(10)

    .then(setRecent);
  }, [db]);

  useEffect(() => {
    loadRecent();
  }, [loadRecent]);

  useEffect(() => {
    if (!db || query.trim().length === 0) {
      setResults([]);
      return;
    }
    const term = `%${query.trim()}%`;
    db.select()
      .from(patients)
      .where(or(like(patients.name, term), like(patients.phone, term)))
      .limit(30)

      .then(setResults);
  }, [db, query]);

  const listData = useMemo(
    () => (query.trim() ? results : recent),
    [query, results, recent],
  );

  function handleSelect(p: Patient) {
    triggerSelectionHaptic();
    selectPatient({
      id: p.id,
      name: p.name,
      age: p.ageYears ? `${p.ageYears}y` : "",
      gender: p.gender ?? "",
      phone: p.phone ?? "",
      allergies: p.drugAllergies ?? "",
    });
    router.back();
  }

  async function handleQuickAdd() {
    if (!db || !newName.trim()) return;
    const rows = await db
      .insert(patients)
      .values({
        name: newName.trim(),
        phone: newPhone.trim() || null,
        ageYears: newAge ? Number.parseInt(newAge, 10) : null,
        gender: newGender || null,
        drugAllergies: newAllergies.trim() || null,
      })
      .returning();
    triggerSuccessHaptic();
    sheetRef.current?.dismiss();
    const created = rows[0];
    if (created) handleSelect(created as Patient);
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
          Select Patient
        </Text>
      </View>

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
        data={listData}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24 }}
        ListHeaderComponent={
          !query.trim() ? (
            <Text className="mb-2 font-bodySemi text-[11px] uppercase tracking-widest text-text-tertiary">
              Recent Patients
            </Text>
          ) : null
        }
        ListEmptyComponent={
          <EmptyState
            icon={UserRound}
            title={query.trim() ? "No patients found" : "No patients yet"}
            subtitle={
              query.trim()
                ? "Try a different name or phone number"
                : "Add your first patient to get started"
            }
          />
        }
        renderItem={({ item }) => (
          <PatientCard patient={item} onPress={() => handleSelect(item)} />
        )}
      />

      <View className="absolute inset-x-0 bottom-0 border-t border-border-soft bg-surface/95 px-4 pb-8 pt-3">
        <TouchableOpacity
          onPress={() => {
            triggerSelectionHaptic();
            sheetRef.current?.present();
          }}
          className="flex-row items-center justify-center gap-2 rounded-2xl bg-accent-primary py-4"
          accessibilityRole="button"
        >
          <Plus size={17} color="#0C0C0E" strokeWidth={2} />
          <Text className="font-bodySemi text-[15px] text-text-inverse">
            Quick Add Patient
          </Text>
        </TouchableOpacity>
      </View>

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
        <BottomSheetView style={{ paddingHorizontal: 20, paddingBottom: 36 }}>
          <Text className="mb-4 font-headingSemi text-[18px] text-text-primary">
            Quick Add Patient
          </Text>
          <QuickField
            label="Name *"
            value={newName}
            onChangeText={setNewName}
            placeholder="Patient name"
          />
          <QuickField
            label="Phone"
            value={newPhone}
            onChangeText={setNewPhone}
            placeholder="01xxxxxxxxx"
            keyboardType="phone-pad"
          />
          <View className="flex-row gap-3">
            <View className="flex-1">
              <QuickField
                label="Age"
                value={newAge}
                onChangeText={setNewAge}
                placeholder="35"
                keyboardType="numeric"
              />
            </View>
            <View className="flex-1">
              <QuickField
                label="Gender"
                value={newGender}
                onChangeText={setNewGender}
                placeholder="male / female"
              />
            </View>
          </View>
          <QuickField
            label="Drug Allergies"
            value={newAllergies}
            onChangeText={setNewAllergies}
            placeholder="e.g. Penicillin, Aspirin"
          />
          <TouchableOpacity
            disabled={!newName.trim()}
            onPress={handleQuickAdd}
            className={`mt-2 items-center rounded-2xl py-4 ${
              newName.trim() ? "bg-accent-primary" : "bg-surface-elevated"
            }`}
          >
            <Text
              className={`font-bodySemi text-[15px] ${
                newName.trim() ? "text-text-inverse" : "text-text-disabled"
              }`}
            >
              Save & Select
            </Text>
          </TouchableOpacity>
        </BottomSheetView>
      </BottomSheetModal>
    </View>
  );
}

function QuickField({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType,
}: {
  label: string;
  value: string;
  onChangeText: (v: string) => void;
  placeholder: string;
  keyboardType?: "numeric" | "phone-pad";
}) {
  return (
    <View className="mb-3">
      <Text className="mb-1 font-body text-[11px] text-text-tertiary">
        {label}
      </Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#4A4A4F"
        keyboardType={keyboardType}
        className="rounded-xl border border-border bg-surface px-3.5 py-3 font-body text-[14px] text-text-primary"
      />
    </View>
  );
}
