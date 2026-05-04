import {
  View, Text, TextInput, TouchableOpacity,
  FlatList, ActivityIndicator, ScrollView, Keyboard,
} from "react-native";
import { Search, X, Pill, Building2, FlaskConical, Leaf, ShieldAlert } from "lucide-react";
import { useState, useEffect, useCallback, useRef } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { triggerSelectionHaptic } from "@/lib/clinical-haptics";
import { useDatabase } from "@/db/provider";
import { sql, like, or, and, eq } from "drizzle-orm";
import { medicines, generics, manufacturers, dosageForms } from "@/db/schema";
import { ClinicalShell } from "@/components/layout/ClinicalShell";
import { PremiumMedicineCard } from "@/components/cards/PremiumMedicineCard";

type DrugResult = {
  id: number;
  brandName: string;
  strength: string | null;
  dosageForm: string | null;
  genericName: string | null;
  manufacturerName: string | null;
  type: string | null;
};

type TypeFilter = "all" | "allopathic" | "herbal";

const TYPE_FILTERS: { key: TypeFilter; label: string; icon?: React.ReactNode }[] = [
  { key: "all",        label: "All" },
  { key: "allopathic", label: "Allopathic" },
  { key: "herbal",     label: "Herbal" },
];

export default function DIMSScreen() {
  const { db } = useDatabase();
  const params = useLocalSearchParams<{ q?: string }>();
  const [query, setQuery] = useState(params.q ?? "");
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("all");
  const [results, setResults] = useState<DrugResult[]>([]);
  const [loading, setLoading] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const search = useCallback(async (q: string, filter: TypeFilter) => {
    if (!db || q.trim().length < 2) {
      setResults([]);
      return;
    }
    setLoading(true);
    try {
      const term = `%${q.trim()}%`;
      const textCondition = or(like(medicines.brandName, term), like(generics.name, term));
      const whereCondition = filter === "all"
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
        })
        .from(medicines)
        .leftJoin(generics, sql`${medicines.genericId} = ${generics.id}`)
        .leftJoin(manufacturers, sql`${medicines.manufacturerId} = ${manufacturers.id}`)
        .leftJoin(dosageForms, sql`${medicines.dosageFormId} = ${dosageForms.id}`)
        .where(whereCondition)
        .limit(60);
      setResults(rows as DrugResult[]);
    } finally {
      setLoading(false);
    }
  }, [db]);

  useEffect(() => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => search(query, typeFilter), 300);
    return () => { if (timer.current) clearTimeout(timer.current); };
  }, [query, typeFilter, search]);

  const isSearching = query.length >= 2;

  return (
    <ClinicalShell>
      <View className="pb-3 pt-2">
        <Text className="font-heading text-[32px] leading-10 text-text-primary">DIMS</Text>
        <Text className="mt-1 font-body text-[13px] text-text-muted">Search 21,700+ Bangladesh drug brands</Text>
      </View>

      {/* Search bar */}
      <View className="mb-3 overflow-hidden rounded-[28px] border border-border bg-ink-800/80 px-4">
        <View className="flex-row items-center gap-3">
          <Search size={18} color={query ? "#C8F53C" : "#7A7A80"} strokeWidth={1.6} />
          <TextInput
            className="min-h-[52px] flex-1 font-bodySemi text-[16px] text-text-primary"
            placeholder="Search brands or generics..."
            placeholderTextColor="#7A7A80"
            value={query}
            onChangeText={setQuery}
            autoCorrect={false}
            autoCapitalize="none"
            returnKeyType="search"
            selectionColor="#C8F53C"
            onSubmitEditing={Keyboard.dismiss}
            accessibilityLabel="Search medicines"
          />
          {loading ? (
            <ActivityIndicator size="small" color="#C8F53C" />
          ) : query.length > 0 ? (
            <TouchableOpacity
              onPress={() => { setQuery(""); setResults([]); }}
              hitSlop={10}
              accessibilityLabel="Clear search"
            >
              <X size={18} color="#7A7A80" strokeWidth={1.6} />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>

      {/* Type filter chips — shown during search */}
      {isSearching ? (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="mb-3 flex-grow-0"
          contentContainerStyle={{ gap: 8, paddingHorizontal: 2 }}
        >
          {TYPE_FILTERS.map(({ key, label }) => {
            const active = typeFilter === key;
            const isHerbal = key === "herbal";
            return (
              <TouchableOpacity
                key={key}
                onPress={() => { triggerSelectionHaptic(); setTypeFilter(key); }}
                className={active
                  ? "flex-row items-center gap-1.5 rounded-pill bg-mint px-4 py-2"
                  : "flex-row items-center gap-1.5 rounded-pill border border-border bg-ink-800 px-4 py-2"}
                activeOpacity={0.78}
                accessibilityRole="button"
                accessibilityLabel={`Filter by ${label}`}
              >
                {isHerbal ? (
                  <Leaf size={12} color={active ? "#0C0C0E" : "#7A7A80"} strokeWidth={1.8} />
                ) : null}
                <Text className={active
                  ? "font-bodySemi text-[13px] text-text-inverse"
                  : "font-bodySemi text-[13px] text-text-muted"}>
                  {label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      ) : null}

      {/* Content */}
      {!isSearching ? (
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ paddingBottom: 104 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Text className="mb-3 font-bodySemi text-[11px] uppercase tracking-[1.5px] text-text-muted">Browse by</Text>
          <View className="mb-6 flex-row gap-3">
            <BrowseCard
              icon={<Building2 size={18} color="#C8F53C" strokeWidth={1.6} />}
              label="Company"
              sub="By manufacturer"
              onPress={() => { triggerSelectionHaptic(); router.push("/dims/companies" as any); }}
            />
            <BrowseCard
              icon={<FlaskConical size={18} color="#00D7B5" strokeWidth={1.6} />}
              label="Generic"
              sub="By molecule"
              onPress={() => { triggerSelectionHaptic(); router.push("/dims/generic" as any); }}
            />
          </View>
          <BrowseCard
            icon={<Leaf size={18} color="#86EFAC" strokeWidth={1.6} />}
            label="Herbal / Natural"
            sub="351 plant-based medicines"
            onPress={() => { triggerSelectionHaptic(); setQuery("a"); setTypeFilter("herbal"); }}
            wide
          />
          <View className="mt-3">
            <BrowseCard
              icon={<ShieldAlert size={18} color="#FF453A" strokeWidth={1.6} />}
              label="Interaction Checker"
              sub="Screen multiple drugs for class-based interactions"
              onPress={() => { triggerSelectionHaptic(); router.push("/dims/interactions" as any); }}
              wide
            />
          </View>
          <View className="mt-8 items-center py-4">
            <View className="h-20 w-20 items-center justify-center rounded-[28px] border border-border bg-ink-800">
              <Pill size={36} color="#C8F53C" strokeWidth={1.4} />
            </View>
            <Text className="mt-4 font-bodySemi text-[15px] text-text-secondary">Search 21,700+ brands</Text>
            <Text className="mt-1 font-body text-[12px] text-text-muted">Type a brand or generic name above</Text>
          </View>
        </ScrollView>
      ) : results.length === 0 && !loading ? (
        <View className="flex-1 items-center justify-center pb-24">
          <View className="mb-4 h-16 w-16 items-center justify-center rounded-[24px] border border-border bg-ink-800">
            <Search size={28} color="#4A4A4F" strokeWidth={1.4} />
          </View>
          <Text className="font-bodySemi text-[15px] text-text-secondary">No results</Text>
          <Text className="mt-1 font-body text-[13px] text-text-muted">
            No{typeFilter !== "all" ? ` ${typeFilter}` : ""} medicines matching "{query}"
          </Text>
          {typeFilter !== "all" ? (
            <TouchableOpacity
              onPress={() => { triggerSelectionHaptic(); setTypeFilter("all"); }}
              className="mt-4 rounded-pill border border-border bg-ink-800 px-5 py-2.5"
              activeOpacity={0.78}
            >
              <Text className="font-bodySemi text-[13px] text-mint">Search all types</Text>
            </TouchableOpacity>
          ) : null}
        </View>
      ) : (
        <FlatList
          data={results}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={{ paddingBottom: 104 }}
          keyboardDismissMode="on-drag"
          keyboardShouldPersistTaps="handled"
          ItemSeparatorComponent={() => <View className="h-3" />}
          ListHeaderComponent={results.length > 0 ? (
            <Text className="mb-3 font-body text-[12px] text-text-muted">
              {results.length}{results.length === 60 ? "+" : ""} result{results.length !== 1 ? "s" : ""}
              {typeFilter !== "all" ? ` · ${typeFilter} only` : ""}
            </Text>
          ) : null}
          renderItem={({ item }) => (
            <PremiumMedicineCard
              brandName={item.brandName}
              genericName={item.genericName ?? "Generic not listed"}
              strength={item.strength ?? "Strength not listed"}
              manufacturer={item.manufacturerName ?? "Manufacturer not listed"}
              dosageForm={item.dosageForm ?? "Medicine"}
              safetyNote={item.type === "herbal" ? "Herbal / plant-based medicine" : undefined}
              onPress={() => router.push(`/dims/brand/${item.id}` as any)}
            />
          )}
        />
      )}
    </ClinicalShell>
  );
}

function BrowseCard({
  icon, label, sub, onPress, wide = false,
}: {
  icon: React.ReactNode;
  label: string;
  sub: string;
  onPress: () => void;
  wide?: boolean;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.78}
      className={`flex-row items-center gap-3 rounded-2xl border border-border bg-ink-800 px-4 py-3 ${wide ? "flex-1" : "flex-1"}`}
      accessibilityRole="button"
      accessibilityLabel={label}
    >
      <View className="h-9 w-9 items-center justify-center rounded-xl border border-border-soft bg-ink-700">
        {icon}
      </View>
      <View>
        <Text className="font-bodySemi text-[14px] text-text-primary">{label}</Text>
        <Text className="font-body text-[11px] text-text-muted">{sub}</Text>
      </View>
    </TouchableOpacity>
  );
}
