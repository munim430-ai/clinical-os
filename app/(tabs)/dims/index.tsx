import { View, Text, TextInput, TouchableOpacity, FlatList, ActivityIndicator } from "react-native";
import { Search, X, Pill } from "lucide-react";
import { useState, useEffect, useCallback, useRef } from "react";
import { router } from "expo-router";
import { useDatabase } from "@/db/provider";
import { sql, like, or } from "drizzle-orm";
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
};

export default function DIMSScreen() {
  const { db } = useDatabase();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<DrugResult[]>([]);
  const [loading, setLoading] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const search = useCallback(async (q: string) => {
    if (!db || q.trim().length < 2) {
      setResults([]);
      return;
    }
    setLoading(true);
    try {
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
        .leftJoin(manufacturers, sql`${medicines.manufacturerId} = ${manufacturers.id}`)
        .leftJoin(dosageForms, sql`${medicines.dosageFormId} = ${dosageForms.id}`)
        .where(or(like(medicines.brandName, term), like(generics.name, term)))
        .limit(60);
      setResults(rows as DrugResult[]);
    } finally {
      setLoading(false);
    }
  }, [db]);

  useEffect(() => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => search(query), 300);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [query, search]);

  return (
    <ClinicalShell>
      <View className="pb-3 pt-2">
        <Text className="font-heading text-[28px] leading-9 text-text-primary">DIMS</Text>
        <Text className="mt-1 font-body text-[13px] text-text-muted">Search 21,700+ Bangladesh drug brands</Text>
      </View>

      <View className="mb-4 overflow-hidden rounded-[28px] border border-border bg-ink-800/80 px-4">
        <View className="flex-row items-center gap-3">
          <Search size={18} color={query ? "#B8FFD2" : "#7A7A80"} strokeWidth={1.6} />
          <TextInput
            className="min-h-[52px] flex-1 font-bodySemi text-[16px] text-text-primary"
            placeholder="Search brands or generics..."
            placeholderTextColor="#7A7A80"
            value={query}
            onChangeText={setQuery}
            autoCorrect={false}
            autoCapitalize="none"
            returnKeyType="search"
            selectionColor="#B8FFD2"
          />
          {loading ? (
            <ActivityIndicator size="small" color="#B8FFD2" />
          ) : query.length > 0 ? (
            <TouchableOpacity onPress={() => setQuery("")} hitSlop={10}>
              <X size={18} color="#7A7A80" strokeWidth={1.6} />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>

      {query.length < 2 ? (
        <View className="flex-1 items-center justify-center pb-24">
          <View className="h-20 w-20 items-center justify-center rounded-[28px] border border-border bg-ink-800">
            <Pill size={36} color="#B8FFD2" strokeWidth={1.4} />
          </View>
          <Text className="mt-4 font-bodySemi text-[15px] text-text-secondary">Start with a brand or generic name</Text>
          <Text className="mt-1 font-body text-[12px] text-text-muted">High-contrast DIMS cards will appear here</Text>
        </View>
      ) : results.length === 0 && !loading ? (
        <View className="flex-1 items-center justify-center pb-24">
          <Text className="font-bodySemi text-[14px] text-text-muted">No results for “{query}”</Text>
        </View>
      ) : (
        <FlatList
          data={results}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={{ paddingBottom: 104 }}
          ItemSeparatorComponent={() => <View className="h-3" />}
          renderItem={({ item }) => (
            <PremiumMedicineCard
              brandName={item.brandName}
              genericName={item.genericName ?? "Generic not listed"}
              strength={item.strength ?? "Strength not listed"}
              manufacturer={item.manufacturerName ?? "Manufacturer not listed"}
              dosageForm={item.dosageForm ?? "Medicine"}
              onPress={() => router.push(`/dims/brand/${item.id}` as any)}
            />
          )}
        />
      )}
    </ClinicalShell>
  );
}
