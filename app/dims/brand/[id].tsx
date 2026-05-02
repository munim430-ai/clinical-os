import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { useEffect, useState } from "react";
import { eq, sql } from "drizzle-orm";
import { ArrowLeft, ChevronRight } from "lucide-react-native";
import { useDatabase } from "@/db/provider";
import { medicines, generics, manufacturers, dosageForms } from "@/db/schema";

export default function BrandDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { db } = useDatabase();
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    if (!db || !id) return;
    db.select({
      id: medicines.id,
      brandName: medicines.brandName,
      strength: medicines.strength,
      type: medicines.type,
      packageContainer: medicines.packageContainer,
      packageSize: medicines.packageSize,
      dosageForm: dosageForms.name,
      genericId: medicines.genericId,
      genericName: generics.name,
      manufacturerName: manufacturers.name,
    })
      .from(medicines)
      .leftJoin(generics, sql`${medicines.genericId} = ${generics.id}`)
      .leftJoin(manufacturers, sql`${medicines.manufacturerId} = ${manufacturers.id}`)
      .leftJoin(dosageForms, sql`${medicines.dosageFormId} = ${dosageForms.id}`)
      .where(eq(medicines.id, Number(id)))
      .then((rows) => setData(rows[0] ?? null));
  }, [db, id]);

  if (!data) {
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
        <Text className="text-foreground text-lg font-bold flex-1" numberOfLines={1}>
          {data.brandName}
        </Text>
      </View>

      <View className="px-4 pb-6">
        <View className="bg-card rounded-2xl p-4 border border-border mb-4">
          <Row label="Generic" value={data.genericName} />
          <Row label="Strength" value={data.strength} />
          <Row label="Form" value={data.dosageForm} />
          <Row label="Type" value={data.type} />
          <Row label="Manufacturer" value={data.manufacturerName} />
          <Row label="Pack" value={[data.packageContainer, data.packageSize].filter(Boolean).join(" · ")} last />
        </View>

        {data.genericId && (
          <TouchableOpacity
            onPress={() => router.push(`/dims/generic/${data.genericId}` as any)}
            className="bg-primary/10 border border-primary/30 rounded-2xl p-4 flex-row items-center justify-between"
          >
            <View>
              <Text className="text-primary font-semibold">View Generic Details</Text>
              <Text className="text-muted-foreground text-xs mt-0.5">
                Pharmacology, dosage, interactions, more brands
              </Text>
            </View>
            <ChevronRight size={18} color="#00C896" />
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
}

function Row({ label, value, last = false }: { label: string; value?: string | null; last?: boolean }) {
  if (!value) return null;
  return (
    <View className={`flex-row justify-between py-2.5 ${last ? "" : "border-b border-border"}`}>
      <Text className="text-muted-foreground text-sm">{label}</Text>
      <Text className="text-foreground text-sm font-medium flex-1 text-right ml-4">{value}</Text>
    </View>
  );
}
