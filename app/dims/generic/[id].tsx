import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { useEffect, useState } from "react";
import { eq, sql } from "drizzle-orm";
import { ArrowLeft, ChevronRight } from "lucide-react";
import { useDatabase } from "@/db/provider";
import { generics, medicines, dosageForms, manufacturers } from "@/db/schema";
import { ClinicalShell } from "@/components/layout/ClinicalShell";
import { triggerSelectionHaptic } from "@/lib/clinical-haptics";

const SECTIONS = [
  { key: "pharmacology", label: "Pharmacology" },
  { key: "dosageDescription", label: "Dosage" },
  { key: "administrationDescription", label: "Administration" },
  { key: "sideEffects", label: "Side Effects" },
  { key: "contraindications", label: "Contraindications" },
  { key: "interactions", label: "Interactions" },
  { key: "pregnancyNotes", label: "Pregnancy & Lactation" },
  { key: "pediatricUsage", label: "Paediatric Use" },
  { key: "overdoseEffects", label: "Overdose" },
  { key: "precautions", label: "Precautions" },
  { key: "storageConditions", label: "Storage" },
] as const;

export default function GenericDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { db } = useDatabase();
  const [generic, setGeneric] = useState<any>(null);
  const [brands, setBrands] = useState<any[]>([]);
  const [expanded, setExpanded] = useState<string | null>("dosageDescription");

  useEffect(() => {
    if (!db || !id) return;
    db.select().from(generics).where(eq(generics.id, Number(id)))
      .then((rows) => setGeneric(rows[0] ?? null));

    db.select({
      id: medicines.id,
      brandName: medicines.brandName,
      strength: medicines.strength,
      dosageForm: dosageForms.name,
      manufacturerName: manufacturers.name,
    })
      .from(medicines)
      .leftJoin(dosageForms, sql`${medicines.dosageFormId} = ${dosageForms.id}`)
      .leftJoin(manufacturers, sql`${medicines.manufacturerId} = ${manufacturers.id}`)
      .where(eq(medicines.genericId, Number(id)))
      .limit(30)
      .then(setBrands);
  }, [db, id]);

  if (!generic) {
    return (
      <ClinicalShell>
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator color="#B8FFD2" />
        </View>
      </ClinicalShell>
    );
  }

  return (
    <ClinicalShell padded={false}>
      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 36 }}>
        <View className="px-4 pt-2">
          {/* Header */}
          <View className="mb-4 flex-row items-center">
            <TouchableOpacity
              onPress={() => { triggerSelectionHaptic(); router.back(); }}
              className="mr-3 h-11 w-11 items-center justify-center rounded-2xl border border-border bg-ink-800"
            >
              <ArrowLeft size={21} color="#F5F5F7" strokeWidth={1.7} />
            </TouchableOpacity>
            <Text className="flex-1 font-bodySemi text-[13px] uppercase tracking-[1.6px] text-text-muted">
              Generic Monograph
            </Text>
          </View>

          <View className="mb-4 rounded-[28px] border border-border bg-ink-800 p-5">
            <Text className="font-heading text-[28px] leading-9 text-text-primary">{generic.name}</Text>
            {generic.indicationText ? (
              <Text className="mt-2 font-body text-[14px] leading-5 text-text-muted" numberOfLines={2}>
                {generic.indicationText}
              </Text>
            ) : null}
          </View>

          {/* Clinical sections */}
          {SECTIONS.map(({ key, label }) => {
            const content = generic[key];
            if (!content) return null;
            const open = expanded === key;
            return (
              <TouchableOpacity
                key={key}
                onPress={() => { triggerSelectionHaptic(); setExpanded(open ? null : key); }}
                className="mb-2 overflow-hidden rounded-clinical border border-border bg-ink-800"
                activeOpacity={0.82}
              >
                <View className="flex-row items-center justify-between p-4">
                  <Text className="flex-1 font-bodySemi text-[15px] text-text-primary">{label}</Text>
                  <Text className="font-heading text-[22px] text-text-muted">{open ? "−" : "+"}</Text>
                </View>
                {open ? (
                  <View className="border-t border-border-soft px-4 pb-4 pt-3">
                    <Text className="font-body text-[14px] leading-6 text-text-secondary">{content}</Text>
                  </View>
                ) : null}
              </TouchableOpacity>
            );
          })}

          {/* Available brands */}
          {brands.length > 0 ? (
            <View className="mt-4">
              <Text className="mb-3 font-bodySemi text-[11px] uppercase tracking-[1.7px] text-text-muted">
                Available Brands ({brands.length})
              </Text>
              {brands.map((b) => (
                <TouchableOpacity
                  key={b.id}
                  onPress={() => { triggerSelectionHaptic(); router.push(`/dims/brand/${b.id}` as any); }}
                  className="mb-2 flex-row items-center justify-between rounded-clinical border border-border bg-ink-800 p-4"
                  activeOpacity={0.78}
                >
                  <View className="flex-1 pr-3">
                    <Text className="font-bodySemi text-[14px] text-text-primary">{b.brandName}</Text>
                    <Text className="mt-0.5 font-body text-[12px] text-text-muted">
                      {[b.strength, b.dosageForm, b.manufacturerName].filter(Boolean).join(" · ")}
                    </Text>
                  </View>
                  <ChevronRight size={17} color="#7A7A80" strokeWidth={1.6} />
                </TouchableOpacity>
              ))}
            </View>
          ) : null}
        </View>
      </ScrollView>
    </ClinicalShell>
  );
}
