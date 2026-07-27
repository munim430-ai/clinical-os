import { EmptyState } from "@/components/premium/EmptyState";
import {
  MedicineDoseSheet,
  type MedicineDoseSheetRef,
} from "@/components/premium/MedicineDoseSheet";
import { useDatabase } from "@/db/provider";
import { dosageForms, generics, manufacturers, medicines } from "@/db/schema";
import {
  triggerSelectionHaptic,
  triggerSuccessHaptic,
} from "@/lib/clinical-haptics";
import { useRxStore } from "@/lib/rx-store";
import { like, or, sql } from "drizzle-orm";
import { router } from "expo-router";
import { ArrowLeft, Pill, Search, ShieldAlert } from "lucide-react-native";
import { useCallback, useRef, useState } from "react";
import {
  FlatList,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

type DrugResult = {
  id: number;
  brandName: string;
  strength: string | null;
  dosageForm: string | null;
  genericName: string | null;
  manufacturerName: string | null;
};

export default function MedicinePickerScreen() {
  const { db } = useDatabase();
  const rx = useRxStore();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<DrugResult[]>([]);
  const sheetRef = useRef<MedicineDoseSheetRef>(null);

  const search = useCallback(
    async (q: string) => {
      if (!db || q.trim().length < 2) {
        setResults([]);
        return;
      }
      const term = `%${q.trim()}%`;
      const rows = await db
        .select({
          id: medicines.id,
          brandName: medicines.brandName,
          strength: medicines.strength,
          dosageForm: dosageForms.name,
          genericName: generics.name,
          manufacturerName: manufacturers.name,
        })
        .from(medicines)
        .leftJoin(generics, sql`${medicines.genericId} = ${generics.id}`)
        .leftJoin(
          dosageForms,
          sql`${medicines.dosageFormId} = ${dosageForms.id}`,
        )
        .leftJoin(
          manufacturers,
          sql`${medicines.manufacturerId} = ${manufacturers.id}`,
        )
        .where(or(like(medicines.brandName, term), like(generics.name, term)))
        .limit(40);
      setResults(rows as DrugResult[]);
    },
    [db],
  );

  function isAllergic(genericName: string | null): boolean {
    const allergies = rx.patient.allergies;
    if (!allergies || !genericName) return false;
    return allergies
      .split(",")
      .map((a) => a.trim().toLowerCase())
      .filter(Boolean)
      .some((a) => genericName.toLowerCase().includes(a));
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
          Add Medicine
        </Text>
      </View>

      <View className="px-4 pb-3">
        <View className="flex-row items-center gap-2 rounded-2xl border border-border bg-surface px-3.5 py-2.5">
          <Search size={16} color="#7A7A80" />
          <TextInput
            value={query}
            onChangeText={(v) => {
              setQuery(v);
              search(v);
            }}
            placeholder="Search brand or generic name"
            placeholderTextColor="#4A4A4F"
            autoFocus
            className="flex-1 font-body text-[13.5px] text-text-primary"
          />
        </View>
      </View>

      <FlatList
        data={results}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24 }}
        ListEmptyComponent={
          query.trim().length >= 2 ? (
            <EmptyState
              icon={Pill}
              title="No drugs found"
              subtitle="Try a different brand or generic name"
            />
          ) : (
            <EmptyState
              icon={Search}
              title="Search 21,700+ drugs"
              subtitle="Type a brand name or generic to get started"
            />
          )
        }
        renderItem={({ item }) => {
          const allergic = isAllergic(item.genericName);
          return (
            <TouchableOpacity
              onPress={() => {
                triggerSelectionHaptic();
                sheetRef.current?.present({
                  medicineId: item.id,
                  brandName: item.brandName,
                  genericName: item.genericName,
                  strength: item.strength,
                  dosageForm: item.dosageForm,
                });
              }}
              activeOpacity={0.75}
              className="mb-2.5 flex-row items-center gap-3 rounded-clinical border border-border bg-surface p-3.5"
            >
              <View className="h-10 w-10 items-center justify-center rounded-xl bg-accent-primarySoft">
                <Pill size={17} color="#C8F53C" strokeWidth={1.7} />
              </View>
              <View className="flex-1">
                <Text className="font-bodySemi text-[13.5px] text-text-primary">
                  {item.brandName}
                  {item.strength ? ` ${item.strength}` : ""}
                </Text>
                <Text className="mt-0.5 font-body text-[11.5px] text-text-tertiary">
                  {[item.genericName, item.dosageForm, item.manufacturerName]
                    .filter(Boolean)
                    .join(" · ")}
                </Text>
              </View>
              {allergic ? (
                <ShieldAlert size={16} color="#FF453A" strokeWidth={1.8} />
              ) : null}
            </TouchableOpacity>
          );
        }}
      />

      <MedicineDoseSheet
        ref={sheetRef}
        patientAllergies={rx.patient.allergies}
        onConfirm={(med) => {
          rx.addMedicine(med);
          triggerSuccessHaptic();
          router.back();
        }}
      />
    </View>
  );
}
