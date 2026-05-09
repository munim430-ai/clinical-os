import { ClinicalShell } from "@/components/layout/ClinicalShell";
import { useDatabase } from "@/db/provider";
import {
  dosageForms,
  drugClasses,
  generics,
  manufacturers,
  medicines,
} from "@/db/schema";
import { triggerSelectionHaptic } from "@/lib/clinical-haptics";
import { and, eq, ne, sql } from "drizzle-orm";
import { router, useLocalSearchParams } from "expo-router";
import {
  ArrowLeft,
  ChevronRight,
  Pill,
  ShieldAlert,
  TrendingDown,
} from "lucide-react-native";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type AltRow = {
  id: number;
  brandName: string;
  strength: string | null;
  manufacturerName: string | null;
  unitPriceBdt: number | null;
};

export default function BrandDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { db } = useDatabase();
  const [data, setData] = useState<any>(null);
  const [alternatives, setAlternatives] = useState<AltRow[]>([]);

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
      unitPriceBdt: medicines.unitPriceBdt,
      packPriceBdt: medicines.packPriceBdt,
      drugClass: drugClasses.name,
    })
      .from(medicines)
      .leftJoin(generics, sql`${medicines.genericId} = ${generics.id}`)
      .leftJoin(
        manufacturers,
        sql`${medicines.manufacturerId} = ${manufacturers.id}`,
      )
      .leftJoin(dosageForms, sql`${medicines.dosageFormId} = ${dosageForms.id}`)
      .leftJoin(drugClasses, sql`${generics.drugClassId} = ${drugClasses.id}`)
      .where(eq(medicines.id, Number(id)))
      .then((rows) => {
        const brand = rows[0] ?? null;
        setData(brand);
        if (brand?.genericId) {
          db.select({
            id: medicines.id,
            brandName: medicines.brandName,
            strength: medicines.strength,
            manufacturerName: manufacturers.name,
            unitPriceBdt: medicines.unitPriceBdt,
          })
            .from(medicines)
            .leftJoin(
              manufacturers,
              sql`${medicines.manufacturerId} = ${manufacturers.id}`,
            )
            .where(
              and(
                eq(medicines.genericId, brand.genericId),
                ne(medicines.id, Number(id)),
              ),
            )
            .orderBy(sql`unit_price_bdt ASC NULLS LAST, brand_name ASC`)
            .limit(6)
            .then((alts) => setAlternatives(alts as AltRow[]))
            .catch(() => {});
        }
      })
      .catch(() => setData(null));
  }, [db, id]);

  if (!data) {
    return (
      <ClinicalShell>
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator color="#2470FF" />
        </View>
      </ClinicalShell>
    );
  }

  return (
    <ClinicalShell padded={false}>
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 36 }}
      >
        <View className="px-4 pt-2">
          <View className="mb-4 flex-row items-center">
            <TouchableOpacity
              onPress={() => {
                triggerSelectionHaptic();
                router.back();
              }}
              className="mr-3 h-11 w-11 items-center justify-center rounded-2xl border border-border bg-surface"
            >
              <ArrowLeft size={21} color="#2470FF" strokeWidth={1.7} />
            </TouchableOpacity>
            <Text className="flex-1 font-bodySemi text-[13px] uppercase tracking-[1.6px] text-text-tertiary">
              Medicine Detail
            </Text>
          </View>

          <View className="rounded-[32px] border border-border bg-surface p-5">
            <View className="mb-4 h-14 w-14 items-center justify-center rounded-[22px] border border-border-soft bg-surface-muted">
              <Pill size={28} color="#2470FF" strokeWidth={1.5} />
            </View>
            <Text className="font-heading text-[34px] leading-[40px] text-text-primary">
              {data.brandName}
            </Text>
            {data.genericName ? (
              <Text className="mt-2 font-bodySemi text-[16px] leading-6 text-text-secondary">
                {data.genericName}
              </Text>
            ) : null}
            <View className="mt-5 flex-row flex-wrap gap-2">
              {data.strength ? (
                <View className="rounded-2xl border border-border-accent bg-mint-soft px-4 py-2">
                  <Text className="font-headingBold text-[16px] text-mint">
                    {data.strength}
                  </Text>
                </View>
              ) : null}
              {data.drugClass ? (
                <View className="self-center rounded-pill border border-border-soft bg-surface-muted px-3 py-2">
                  <Text className="font-bodySemi text-[12px] text-text-secondary">
                    {data.drugClass}
                  </Text>
                </View>
              ) : null}
            </View>
          </View>

          <TouchableOpacity
            onPress={() => {
              triggerSelectionHaptic();
              router.push("/dims/interactions" as any);
            }}
            className="mt-4 flex-row items-center justify-between rounded-clinical border border-border bg-surface p-4"
            activeOpacity={0.78}
            accessibilityRole="button"
            accessibilityLabel="Open interaction checker"
          >
            <View className="flex-1 flex-row items-center gap-3">
              <View className="h-9 w-9 items-center justify-center rounded-2xl bg-clinical-redSoft border border-border-red">
                <ShieldAlert size={16} color="#FF3B30" strokeWidth={1.7} />
              </View>
              <View className="flex-1">
                <Text className="font-bodySemi text-[14px] text-text-primary">
                  Check interactions
                </Text>
                <Text className="mt-0.5 font-body text-[11px] text-text-tertiary">
                  Compare against other prescribed drugs
                </Text>
              </View>
            </View>
            <ChevronRight size={17} color="#8A91A8" strokeWidth={1.6} />
          </TouchableOpacity>

          <View className="mt-4 rounded-clinical border border-border bg-surface p-4">
            <Row label="Form" value={data.dosageForm} />
            <Row label="Type" value={data.type} />
            <Row label="Manufacturer" value={data.manufacturerName} />
            <Row
              label="Pack"
              value={[data.packageContainer, data.packageSize]
                .filter(Boolean)
                .join(" · ")}
            />
            {data.unitPriceBdt != null ? (
              <Row
                label="Unit price"
                value={`৳${data.unitPriceBdt.toFixed(2)} per unit`}
              />
            ) : null}
            <Row
              label="Pack price"
              value={
                data.packPriceBdt != null
                  ? `৳${data.packPriceBdt.toFixed(2)}`
                  : null
              }
              last
            />
          </View>

          {/* Cheapest alternatives for same generic */}
          {alternatives.length > 0 ? (
            <View className="mt-4">
              <View className="mb-3 flex-row items-center gap-2">
                <TrendingDown size={14} color="#2470FF" strokeWidth={1.6} />
                <Text className="font-bodySemi text-[11px] uppercase tracking-[1.5px] text-mint">
                  Alternatives — Same Generic
                </Text>
              </View>
              {alternatives.map((alt, idx) => (
                <TouchableOpacity
                  key={alt.id}
                  onPress={() => {
                    triggerSelectionHaptic();
                    router.push(`/dims/brand/${alt.id}` as any);
                  }}
                  className="mb-2 flex-row items-center justify-between rounded-2xl border border-border bg-surface px-4 py-3"
                  activeOpacity={0.78}
                >
                  <View className="flex-1 pr-3">
                    <View className="flex-row items-center gap-2">
                      <Text className="font-bodySemi text-[14px] text-text-primary">
                        {alt.brandName}
                      </Text>
                      {alt.unitPriceBdt != null && idx === 0 ? (
                        <View className="rounded-pill bg-mint-soft px-2 py-0.5">
                          <Text className="font-bodySemi text-[10px] text-mint">
                            CHEAPEST
                          </Text>
                        </View>
                      ) : null}
                    </View>
                    <Text className="mt-0.5 font-body text-[11px] text-text-tertiary">
                      {[alt.strength, alt.manufacturerName]
                        .filter(Boolean)
                        .join(" · ")}
                    </Text>
                  </View>
                  {alt.unitPriceBdt != null ? (
                    <Text className="font-bodySemi text-[13px] text-mint">
                      ৳{alt.unitPriceBdt.toFixed(2)}
                    </Text>
                  ) : (
                    <Text className="font-body text-[11px] text-text-tertiary">
                      No price
                    </Text>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          ) : null}

          {data.genericId ? (
            <TouchableOpacity
              onPress={() => {
                triggerSelectionHaptic();
                router.push(`/dims/generic/${data.genericId}` as any);
              }}
              className="mt-4 flex-row items-center justify-between rounded-clinical border border-border-accent bg-mint-soft p-4"
            >
              <View className="flex-1 pr-3">
                <Text className="font-headingBold text-[16px] text-mint">
                  View Generic Details
                </Text>
                <Text className="mt-1 font-body text-[12px] leading-5 text-text-secondary">
                  Pharmacology, dosage, interactions, and related brands
                </Text>
              </View>
              <ChevronRight size={19} color="#2470FF" strokeWidth={1.6} />
            </TouchableOpacity>
          ) : null}
        </View>
      </ScrollView>
    </ClinicalShell>
  );
}

function Row({
  label,
  value,
  last = false,
}: { label: string; value?: string | null; last?: boolean }) {
  if (!value) return null;
  return (
    <View
      className={`flex-row justify-between py-3 ${
        last ? "" : "border-b border-border-soft"
      }`}
    >
      <Text className="font-body text-[14px] text-text-tertiary">{label}</Text>
      <Text className="ml-4 flex-1 text-right font-bodySemi text-[14px] text-text-primary">
        {value}
      </Text>
    </View>
  );
}
