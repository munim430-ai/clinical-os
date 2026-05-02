import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { useEffect, useState } from "react";
import { eq, sql } from "drizzle-orm";
import { ArrowLeft, ChevronRight, Pill } from "lucide-react-native";
import { useDatabase } from "@/db/provider";
import { medicines, generics, manufacturers, dosageForms } from "@/db/schema";
import { ClinicalShell } from "@/components/layout/ClinicalShell";
import { triggerSelectionHaptic } from "@/lib/clinical-haptics";

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
          <View className="mb-4 flex-row items-center">
            <TouchableOpacity
              onPress={() => {
                triggerSelectionHaptic();
                router.back();
              }}
              className="mr-3 h-11 w-11 items-center justify-center rounded-2xl border border-border bg-ink-800"
            >
              <ArrowLeft size={21} color="#F5F5F7" strokeWidth={1.7} />
            </TouchableOpacity>
            <Text className="flex-1 font-bodySemi text-[13px] uppercase tracking-[1.6px] text-text-muted">
              Medicine Detail
            </Text>
          </View>

          <View className="rounded-[32px] border border-border bg-ink-800 p-5">
            <View className="mb-4 h-14 w-14 items-center justify-center rounded-[22px] border border-border-soft bg-ink-700">
              <Pill size={28} color="#B8FFD2" strokeWidth={1.5} />
            </View>
            <Text className="font-heading text-[34px] leading-[40px] text-text-primary">{data.brandName}</Text>
            {data.genericName ? (
              <Text className="mt-2 font-bodySemi text-[16px] leading-6 text-text-secondary">{data.genericName}</Text>
            ) : null}
            {data.strength ? (
              <View className="mt-5 self-start rounded-2xl border border-border-mint bg-mint-soft px-4 py-2">
                <Text className="font-headingBold text-[16px] text-mint">{data.strength}</Text>
              </View>
            ) : null}
          </View>

          <View className="mt-4 rounded-clinical border border-border bg-ink-800 p-4">
            <Row label="Form" value={data.dosageForm} />
            <Row label="Type" value={data.type} />
            <Row label="Manufacturer" value={data.manufacturerName} />
            <Row label="Pack" value={[data.packageContainer, data.packageSize].filter(Boolean).join(" · ")} last />
          </View>

          {data.genericId ? (
            <TouchableOpacity
              onPress={() => {
                triggerSelectionHaptic();
                router.push(`/dims/generic/${data.genericId}` as any);
              }}
              className="mt-4 flex-row items-center justify-between rounded-clinical border border-border-mint bg-mint-soft p-4"
            >
              <View className="flex-1 pr-3">
                <Text className="font-headingBold text-[16px] text-mint">View Generic Details</Text>
                <Text className="mt-1 font-body text-[12px] leading-5 text-text-secondary">
                  Pharmacology, dosage, interactions, and related brands
                </Text>
              </View>
              <ChevronRight size={19} color="#B8FFD2" strokeWidth={1.6} />
            </TouchableOpacity>
          ) : null}
        </View>
      </ScrollView>
    </ClinicalShell>
  );
}

function Row({ label, value, last = false }: { label: string; value?: string | null; last?: boolean }) {
  if (!value) return null;
  return (
    <View className={`flex-row justify-between py-3 ${last ? "" : "border-b border-border-soft"}`}>
      <Text className="font-body text-[14px] text-text-muted">{label}</Text>
      <Text className="ml-4 flex-1 text-right font-bodySemi text-[14px] text-text-primary">{value}</Text>
    </View>
  );
}
