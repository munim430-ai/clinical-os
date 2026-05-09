import { PremiumMedicineCard } from "@/components/cards/PremiumMedicineCard";
import { ClinicalShell } from "@/components/layout/ClinicalShell";
import { useDatabase } from "@/db/provider";
import { dosageForms, generics, manufacturers, medicines } from "@/db/schema";
import { triggerSelectionHaptic } from "@/lib/clinical-haptics";
import { eq, sql } from "drizzle-orm";
import { router, useLocalSearchParams } from "expo-router";
import { ArrowLeft, Building2 } from "lucide-react-native";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type BrandRow = {
  id: number;
  brandName: string;
  strength: string | null;
  dosageForm: string | null;
  genericName: string | null;
  manufacturerName: string | null;
};

export default function CompanyDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { db } = useDatabase();
  const [companyName, setCompanyName] = useState<string>("");
  const [brands, setBrands] = useState<BrandRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!db || !id) return;
    Promise.all([
      db
        .select()
        .from(manufacturers)
        .where(eq(manufacturers.id, Number(id))),
      db
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
          manufacturers,
          sql`${medicines.manufacturerId} = ${manufacturers.id}`,
        )
        .leftJoin(
          dosageForms,
          sql`${medicines.dosageFormId} = ${dosageForms.id}`,
        )
        .where(eq(medicines.manufacturerId, Number(id)))
        .orderBy(medicines.brandName),
    ]).then(([mfr, brandRows]) => {
      setCompanyName(mfr[0]?.name ?? "Company");
      setBrands(brandRows as BrandRow[]);
      setLoading(false);
    });
  }, [db, id]);

  return (
    <ClinicalShell>
      <View className="mb-4 flex-row items-center pt-2">
        <TouchableOpacity
          onPress={() => {
            triggerSelectionHaptic();
            router.back();
          }}
          className="mr-3 h-11 w-11 items-center justify-center rounded-2xl border border-border bg-surface"
        >
          <ArrowLeft size={21} color="#2470FF" strokeWidth={1.7} />
        </TouchableOpacity>
        <View className="flex-1 flex-row items-center gap-2">
          <Building2 size={20} color="#2470FF" strokeWidth={1.6} />
          <View className="flex-1">
            <Text
              className="font-heading text-[22px] leading-7 text-text-primary"
              numberOfLines={1}
            >
              {companyName}
            </Text>
            {!loading ? (
              <Text className="font-body text-[12px] text-text-tertiary">
                {brands.length} brands
              </Text>
            ) : null}
          </View>
        </View>
      </View>

      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator color="#2470FF" />
        </View>
      ) : brands.length === 0 ? (
        <View className="flex-1 items-center justify-center pb-24">
          <Text className="font-bodySemi text-[14px] text-text-tertiary">
            No brands found for this company.
          </Text>
        </View>
      ) : (
        <FlatList
          data={brands}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={{ paddingBottom: 104 }}
          ItemSeparatorComponent={() => <View className="h-3" />}
          renderItem={({ item }) => (
            <PremiumMedicineCard
              brandName={item.brandName}
              genericName={item.genericName ?? "Generic not listed"}
              strength={item.strength ?? "Strength not listed"}
              manufacturer={companyName}
              dosageForm={item.dosageForm ?? "Medicine"}
              onPress={() => router.push(`/dims/brand/${item.id}` as any)}
            />
          )}
        />
      )}
    </ClinicalShell>
  );
}
