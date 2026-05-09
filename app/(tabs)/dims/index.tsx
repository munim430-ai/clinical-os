import { ClinicalShell } from "@/components/layout/ClinicalShell";
import { EmergencyPill } from "@/components/navigation/EmergencyPill";
import { useDatabase } from "@/db/provider";
import { dosageForms, generics, manufacturers, medicines } from "@/db/schema";
import { triggerSelectionHaptic } from "@/lib/clinical-haptics";
import { and, eq, like, or, sql } from "drizzle-orm";
import { router, useLocalSearchParams } from "expo-router";
import {
  Building2,
  FlaskConical,
  Leaf,
  Pill,
  Search,
  ShieldAlert,
  X,
} from "lucide-react-native";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Keyboard,
  ScrollView,
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
  type: string | null;
  unitPriceBdt: number | null;
  packPriceBdt: number | null;
};

type TypeFilter = "all" | "allopathic" | "herbal";

const TYPE_FILTERS: { key: TypeFilter; label: string }[] = [
  { key: "all", label: "All" },
  { key: "allopathic", label: "Allopathic" },
  { key: "herbal", label: "Herbal" },
];

export default function DIMSScreen() {
  const { db } = useDatabase();
  const params = useLocalSearchParams<{ q?: string }>();
  const [query, setQuery] = useState(params.q ?? "");
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("all");
  const [results, setResults] = useState<DrugResult[]>([]);
  const [loading, setLoading] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const search = useCallback(
    async (q: string, filter: TypeFilter) => {
      if (!db || q.trim().length < 2) {
        setResults([]);
        return;
      }
      setLoading(true);
      try {
        const term = `%${q.trim()}%`;
        const textCondition = or(
          like(medicines.brandName, term),
          like(generics.name, term),
        );
        const whereCondition =
          filter === "all"
            ? textCondition
            : and(textCondition, eq(medicines.type, filter));

        const rows = await db
          .select({
            id: medicines.id,
            brandName: medicines.brandName,
            strength: medicines.strength,
            dosageForm: dosageForms.name,
            genericName: generics.name,
            manufacturerName: manufacturers.name,
            type: medicines.type,
            unitPriceBdt: medicines.unitPriceBdt,
            packPriceBdt: medicines.packPriceBdt,
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
          .where(whereCondition)
          .limit(60);
        setResults(rows as DrugResult[]);
      } finally {
        setLoading(false);
      }
    },
    [db],
  );

  useEffect(() => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => search(query, typeFilter), 120);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [query, typeFilter, search]);

  const isSearching = query.trim().length >= 2;

  return (
    <ClinicalShell>
      <View className="flex-row items-center justify-between gap-3 pb-4 pt-2">
        <View className="flex-1">
          <Text className="font-heading text-[30px] leading-10 text-text-primary">
            DIMS
          </Text>
          <Text className="mt-1 font-body text-[13px] text-text-tertiary">
            Search 21,700+ Bangladesh drug brands
          </Text>
        </View>
        <EmergencyPill />
      </View>

      <View className="mb-3 flex-row items-center gap-3 rounded-clinical border border-border bg-surface px-4">
        <Search
          color={query ? "#2470FF" : "#8A91A8"}
          size={19}
          strokeWidth={1.8}
        />
        <TextInput
          className="min-h-[54px] flex-1 font-body text-[15px] text-text-primary"
          placeholder="Search brands or generics..."
          placeholderTextColor="#8A91A8"
          value={query}
          onChangeText={setQuery}
          autoCorrect={false}
          autoCapitalize="none"
          returnKeyType="search"
          selectionColor="#2470FF"
          onSubmitEditing={Keyboard.dismiss}
          accessibilityLabel="Search medicines"
        />
        {loading ? (
          <ActivityIndicator size="small" color="#2470FF" />
        ) : query.length > 0 ? (
          <TouchableOpacity
            onPress={() => {
              setQuery("");
              setResults([]);
            }}
            hitSlop={10}
            accessibilityLabel="Clear search"
          >
            <X size={18} color="#8A91A8" strokeWidth={1.8} />
          </TouchableOpacity>
        ) : null}
      </View>

      {isSearching ? (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="mb-3 flex-grow-0"
          contentContainerStyle={{ gap: 8, paddingHorizontal: 2 }}
        >
          {TYPE_FILTERS.map(({ key, label }) => {
            const active = typeFilter === key;
            return (
              <TouchableOpacity
                key={key}
                onPress={() => {
                  triggerSelectionHaptic();
                  setTypeFilter(key);
                }}
                className={
                  active
                    ? "rounded-full bg-accent-primary px-4 py-2"
                    : "rounded-full border border-border bg-surface px-4 py-2"
                }
                activeOpacity={0.78}
                accessibilityRole="button"
                accessibilityLabel={`Filter by ${label}`}
              >
                <Text
                  className={
                    active
                      ? "font-bodySemi text-[13px] text-text-inverse"
                      : "font-bodySemi text-[13px] text-text-secondary"
                  }
                >
                  {label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      ) : null}

      {!isSearching ? (
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ paddingBottom: 168 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Text className="mb-3 font-headingSemi text-[18px] text-text-primary">
            Browse by
          </Text>
          <View className="mb-3 flex-row gap-3">
            <BrowseCard
              icon={<Building2 size={21} color="#2470FF" strokeWidth={1.8} />}
              label="Company"
              sub="By manufacturer"
              onPress={() => router.push("/dims/companies")}
            />
            <BrowseCard
              icon={
                <FlaskConical size={21} color="#2BC97A" strokeWidth={1.8} />
              }
              label="Generic"
              sub="Type to search"
              onPress={() => setQuery("para")}
            />
          </View>
          <BrowseCard
            icon={<Leaf size={21} color="#2BC97A" strokeWidth={1.8} />}
            label="Herbal / Natural"
            sub="351 plant-based medicines"
            onPress={() => {
              setQuery("a");
              setTypeFilter("herbal");
            }}
            wide
          />
          <View className="mt-3">
            <BrowseCard
              icon={<ShieldAlert size={21} color="#FF3B30" strokeWidth={1.8} />}
              label="Interaction Checker"
              sub="Screen multiple drugs for class-based interactions"
              onPress={() => router.push("/dims/interactions")}
              wide
            />
          </View>
          <View className="mt-8 items-center rounded-[28px] border border-surface-glassBorder bg-surface px-5 py-8">
            <View className="h-20 w-20 items-center justify-center rounded-[24px] bg-accent-primarySoft">
              <Pill size={36} color="#2470FF" strokeWidth={1.6} />
            </View>
            <Text className="mt-4 font-headingSemi text-[16px] text-text-primary">
              Search 21,700+ brands
            </Text>
            <Text className="mt-1 text-center font-body text-[13px] text-text-tertiary">
              Type a brand or generic name above. Results stay local and work
              offline.
            </Text>
          </View>
        </ScrollView>
      ) : results.length === 0 && !loading ? (
        <View className="flex-1 items-center justify-center pb-24">
          <View className="mb-4 h-16 w-16 items-center justify-center rounded-[20px] border border-surface-glassBorder bg-surface">
            <Search
              size={28}
              color="#8A91A8"
              strokeWidth={1.6}
            />
          </View>
          <Text className="font-headingSemi text-[16px] text-text-primary">
            No results
          </Text>
          <Text className="mt-1 text-center font-body text-[13px] text-text-tertiary">
            No{typeFilter !== "all" ? ` ${typeFilter}` : ""} medicines matching
            "{query}"
          </Text>
        </View>
      ) : (
        <FlatList
          data={results}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={{ paddingBottom: 168 }}
          keyboardDismissMode="on-drag"
          keyboardShouldPersistTaps="handled"
          ItemSeparatorComponent={() => <View className="h-3" />}
          ListHeaderComponent={
            results.length > 0 ? (
              <Text className="mb-3 font-body text-[12px] text-text-tertiary">
                {results.length}
                {results.length === 60 ? "+" : ""} result
                {results.length !== 1 ? "s" : ""}
                {typeFilter !== "all" ? ` · ${typeFilter} only` : ""}
              </Text>
            ) : null
          }
          renderItem={({ item }) => <DrugRow item={item} />}
        />
      )}
    </ClinicalShell>
  );
}

function DrugRow({ item }: { item: DrugResult }) {
  const price = item.unitPriceBdt ?? item.packPriceBdt;

  return (
    <TouchableOpacity
      onPress={() => {
        triggerSelectionHaptic();
        router.push({
          pathname: "/dims/brand/[id]",
          params: { id: String(item.id) },
        });
      }}
      className="rounded-[24px] border border-surface-glassBorder bg-surface p-4"
      activeOpacity={0.82}
      accessibilityRole="button"
      accessibilityLabel={`${item.brandName}, ${
        item.genericName ?? "generic not listed"
      }`}
    >
      <View className="flex-row items-start gap-3">
        <View className="h-11 w-11 items-center justify-center rounded-2xl bg-accent-primarySoft">
          <Pill color="#2470FF" size={22} strokeWidth={1.8} />
        </View>
        <View className="flex-1">
          <Text className="font-headingSemi text-[16px] text-text-primary">
            {item.brandName}
          </Text>
          <Text
            className="mt-1 font-body text-[13px] text-text-secondary"
            numberOfLines={1}
          >
            {item.strength ?? "Strength not listed"} ·{" "}
            {item.dosageForm ?? "Medicine"}
          </Text>
          <Text
            className="mt-0.5 font-body text-[12px] text-text-tertiary"
            numberOfLines={1}
          >
            {item.genericName ?? "Generic not listed"} ·{" "}
            {item.manufacturerName ?? "Manufacturer not listed"}
          </Text>
        </View>
        {price ? (
          <View className="rounded-full bg-accent-primarySoft px-3 py-1">
            <Text className="font-bodySemi text-[12px] text-accent-primary">
              Tk {price.toFixed(2)}
            </Text>
          </View>
        ) : null}
      </View>
    </TouchableOpacity>
  );
}

function BrowseCard({
  icon,
  label,
  sub,
  onPress,
  wide = false,
}: {
  icon: React.ReactNode;
  label: string;
  sub: string;
  onPress: () => void;
  wide?: boolean;
}) {
  return (
    <TouchableOpacity
      onPress={() => {
        triggerSelectionHaptic();
        onPress();
      }}
      activeOpacity={0.78}
      className={`flex-row items-center gap-3 rounded-[24px] border border-surface-glassBorder bg-surface px-4 py-4 ${
        wide ? "" : "flex-1"
      }`}
      accessibilityRole="button"
      accessibilityLabel={label}
    >
      <View className="h-11 w-11 items-center justify-center rounded-2xl bg-surface-muted">
        {icon}
      </View>
      <View className="flex-1">
        <Text className="font-headingSemi text-[14px] text-text-primary">
          {label}
        </Text>
        <Text className="mt-0.5 font-body text-[12px] text-text-tertiary">
          {sub}
        </Text>
      </View>
    </TouchableOpacity>
  );
}
