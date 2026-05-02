import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { useEffect, useState } from "react";
import { eq, sql } from "drizzle-orm";
import { ArrowLeft } from "lucide-react";
import { useDatabase } from "@/db/provider";
import { generics, medicines, dosageForms, manufacturers, drugClasses } from "@/db/schema";

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
      <View className="flex-1 bg-background items-center justify-center">
        <ActivityIndicator color="#00C896" />
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-background">
      <View className="px-4 pt-4 pb-2 flex-row items-center">
        <TouchableOpacity onPress={() => router.back()} className="mr-3">
          <ArrowLeft size={22} color="#F2F2F2" />
        </TouchableOpacity>
        <View className="flex-1">
          <Text className="text-foreground text-lg font-bold">{generic.name}</Text>
          {generic.indicationText && (
            <Text className="text-primary text-xs mt-0.5" numberOfLines={1}>{generic.indicationText}</Text>
          )}
        </View>
      </View>

      <View className="px-4 pb-6">
        {/* Clinical Sections */}
        {SECTIONS.map(({ key, label }) => {
          const content = generic[key];
          if (!content) return null;
          const open = expanded === key;
          return (
            <TouchableOpacity
              key={key}
              onPress={() => setExpanded(open ? null : key)}
              className="bg-card rounded-2xl border border-border mb-2 overflow-hidden"
            >
              <View className="flex-row items-center justify-between p-4">
                <Text className="text-foreground font-medium">{label}</Text>
                <Text className="text-muted-foreground text-lg">{open ? "−" : "+"}</Text>
              </View>
              {open && (
                <View className="px-4 pb-4 border-t border-border">
                  <Text className="text-muted-foreground text-sm leading-relaxed mt-3">{content}</Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}

        {/* Brands */}
        {brands.length > 0 && (
          <View className="mt-4">
            <Text className="text-foreground font-semibold mb-3">
              Available Brands ({brands.length})
            </Text>
            {brands.map((b) => (
              <TouchableOpacity
                key={b.id}
                onPress={() => router.push(`/dims/brand/${b.id}` as any)}
                className="bg-card rounded-xl border border-border p-3 mb-2 flex-row items-center justify-between"
              >
                <View className="flex-1">
                  <Text className="text-foreground text-sm font-medium">{b.brandName}</Text>
                  <Text className="text-muted-foreground text-xs mt-0.5">
                    {[b.strength, b.dosageForm].filter(Boolean).join(" · ")}
                  </Text>
                </View>
                {b.manufacturerName && (
                  <Text className="text-muted-foreground text-xs ml-2" numberOfLines={1} style={{ maxWidth: 100 }}>
                    {b.manufacturerName}
                  </Text>
                )}
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  );
}
