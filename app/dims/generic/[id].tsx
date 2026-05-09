import { ClinicalShell } from "@/components/layout/ClinicalShell";
import { useDatabase } from "@/db/provider";
import { dosageForms, generics, manufacturers, medicines } from "@/db/schema";
import { triggerSelectionHaptic } from "@/lib/clinical-haptics";
import { toBlocks } from "@/lib/html-strip";
import { eq, sql } from "drizzle-orm";
import { router, useLocalSearchParams } from "expo-router";
import { ArrowLeft, ChevronRight, TrendingDown } from "lucide-react-native";
import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

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

type BrandRow = {
  id: number;
  brandName: string;
  strength: string | null;
  dosageForm: string | null;
  manufacturerName: string | null;
  unitPriceBdt: number | null;
  packPriceBdt: number | null;
  packageSize: string | null;
};

type SortMode = "az" | "price";

export default function GenericDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { db } = useDatabase();
  const [generic, setGeneric] = useState<any>(null);
  const [brands, setBrands] = useState<BrandRow[]>([]);
  const [expanded, setExpanded] = useState<string | null>("dosageDescription");
  const [sort, setSort] = useState<SortMode>("az");

  useEffect(() => {
    if (!db || !id) return;
    db.select()
      .from(generics)
      .where(eq(generics.id, Number(id)))
      .then((rows) => setGeneric(rows[0] ?? null));

    db.select({
      id: medicines.id,
      brandName: medicines.brandName,
      strength: medicines.strength,
      dosageForm: dosageForms.name,
      manufacturerName: manufacturers.name,
      unitPriceBdt: medicines.unitPriceBdt,
      packPriceBdt: medicines.packPriceBdt,
      packageSize: medicines.packageSize,
    })
      .from(medicines)
      .leftJoin(dosageForms, sql`${medicines.dosageFormId} = ${dosageForms.id}`)
      .leftJoin(
        manufacturers,
        sql`${medicines.manufacturerId} = ${manufacturers.id}`,
      )
      .where(eq(medicines.genericId, Number(id)))
      .limit(60)
      .then((rows) => setBrands(rows as BrandRow[]));
  }, [db, id]);

  const sortedBrands = useMemo(() => {
    if (sort === "price") {
      const priced = brands
        .filter((b) => b.unitPriceBdt != null)
        .sort((a, b) => (a.unitPriceBdt ?? 0) - (b.unitPriceBdt ?? 0));
      const unpriced = brands
        .filter((b) => b.unitPriceBdt == null)
        .sort((a, b) => a.brandName.localeCompare(b.brandName));
      return [...priced, ...unpriced];
    }
    return [...brands].sort((a, b) => a.brandName.localeCompare(b.brandName));
  }, [brands, sort]);

  const pricedCount = brands.filter((b) => b.unitPriceBdt != null).length;
  const cheapest = sortedBrands.find((b) => b.unitPriceBdt != null);

  if (!generic) {
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
          {/* Header */}
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
              Generic Monograph
            </Text>
          </View>

          <View className="mb-4 rounded-[28px] border border-border bg-surface p-5">
            <Text className="font-heading text-[28px] leading-9 text-text-primary">
              {generic.name}
            </Text>
            {generic.indicationText ? (
              <Text
                className="mt-2 font-body text-[14px] leading-5 text-text-tertiary"
                numberOfLines={3}
              >
                {toBlocks(generic.indicationText)
                  .map((b) => b.text)
                  .join(" ")}
              </Text>
            ) : null}
          </View>

          {/* Cheapest alternative banner — shown only when price data exists */}
          {cheapest && sort === "price" ? (
            <View className="mb-4 flex-row items-center gap-3 rounded-2xl border border-border-accent bg-mint-soft px-4 py-3">
              <TrendingDown size={18} color="#2470FF" strokeWidth={1.6} />
              <View className="flex-1">
                <Text className="font-bodySemi text-[13px] text-mint">
                  Cheapest available
                </Text>
                <Text className="mt-0.5 font-body text-[12px] text-text-secondary">
                  {cheapest.brandName} — ৳{cheapest.unitPriceBdt?.toFixed(2)}
                  /unit
                  {cheapest.manufacturerName
                    ? ` · ${cheapest.manufacturerName}`
                    : ""}
                </Text>
              </View>
            </View>
          ) : null}

          {/* Clinical sections */}
          {SECTIONS.map(({ key, label }) => {
            const content = generic[key];
            if (!content) return null;
            const open = expanded === key;
            return (
              <TouchableOpacity
                key={key}
                onPress={() => {
                  triggerSelectionHaptic();
                  setExpanded(open ? null : key);
                }}
                className="mb-2 overflow-hidden rounded-clinical border border-border bg-surface"
                activeOpacity={0.82}
              >
                <View className="flex-row items-center justify-between p-4">
                  <Text className="flex-1 font-bodySemi text-[15px] text-text-primary">
                    {label}
                  </Text>
                  <Text className="font-heading text-[22px] text-text-tertiary">
                    {open ? "−" : "+"}
                  </Text>
                </View>
                {open ? (
                  <View className="border-t border-border-soft px-4 pb-4 pt-3">
                    {toBlocks(content as string).map((block, i) =>
                      block.type === "bullet" ? (
                        <View key={i} className="mb-1.5 flex-row gap-2">
                          <Text className="font-body text-[14px] leading-6 text-mint">
                            •
                          </Text>
                          <Text className="flex-1 font-body text-[14px] leading-6 text-text-secondary">
                            {block.text}
                          </Text>
                        </View>
                      ) : (
                        <Text
                          key={i}
                          className="mb-2 font-body text-[14px] leading-6 text-text-secondary"
                        >
                          {block.text}
                        </Text>
                      ),
                    )}
                  </View>
                ) : null}
              </TouchableOpacity>
            );
          })}

          {/* Available brands */}
          {brands.length > 0 ? (
            <View className="mt-4">
              <View className="mb-3 flex-row items-center justify-between">
                <Text className="font-bodySemi text-[11px] uppercase tracking-[1.7px] text-text-tertiary">
                  Available Brands ({brands.length})
                  {pricedCount > 0 ? ` · ${pricedCount} priced` : ""}
                </Text>
                {pricedCount > 0 ? (
                  <View className="flex-row gap-1">
                    <SortChip
                      label="A–Z"
                      active={sort === "az"}
                      onPress={() => {
                        triggerSelectionHaptic();
                        setSort("az");
                      }}
                    />
                    <SortChip
                      label="Cheapest"
                      active={sort === "price"}
                      onPress={() => {
                        triggerSelectionHaptic();
                        setSort("price");
                      }}
                    />
                  </View>
                ) : null}
              </View>

              {sortedBrands.map((b, idx) => (
                <TouchableOpacity
                  key={b.id}
                  onPress={() => {
                    triggerSelectionHaptic();
                    router.push(`/dims/brand/${b.id}` as any);
                  }}
                  className="mb-2 flex-row items-center justify-between rounded-clinical border border-border bg-surface p-4"
                  activeOpacity={0.78}
                >
                  <View className="flex-1 pr-3">
                    <View className="flex-row items-center gap-2">
                      <Text className="font-bodySemi text-[14px] text-text-primary">
                        {b.brandName}
                      </Text>
                      {sort === "price" &&
                      b.unitPriceBdt != null &&
                      idx === 0 ? (
                        <View className="rounded-pill bg-mint-soft px-2 py-0.5">
                          <Text className="font-bodySemi text-[10px] text-mint">
                            CHEAPEST
                          </Text>
                        </View>
                      ) : null}
                    </View>
                    <Text className="mt-0.5 font-body text-[12px] text-text-tertiary">
                      {[b.strength, b.dosageForm, b.manufacturerName]
                        .filter(Boolean)
                        .join(" · ")}
                    </Text>
                  </View>
                  <View className="items-end">
                    {b.unitPriceBdt != null ? (
                      <Text className="font-bodySemi text-[13px] text-mint">
                        ৳{b.unitPriceBdt.toFixed(2)}
                      </Text>
                    ) : (
                      <Text className="font-body text-[11px] text-text-tertiary">
                        No price
                      </Text>
                    )}
                    <ChevronRight size={15} color="#8A91A8" strokeWidth={1.6} />
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          ) : null}
        </View>
      </ScrollView>
    </ClinicalShell>
  );
}

function SortChip({
  label,
  active,
  onPress,
}: { label: string; active: boolean; onPress: () => void }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className={
        active
          ? "rounded-pill bg-mint px-3 py-1"
          : "rounded-pill border border-border bg-surface px-3 py-1"
      }
      activeOpacity={0.78}
    >
      <Text
        className={
          active
            ? "font-bodySemi text-[11px] text-text-inverse"
            : "font-bodySemi text-[11px] text-text-tertiary"
        }
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}
