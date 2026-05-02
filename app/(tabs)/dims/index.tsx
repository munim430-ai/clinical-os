import { View, Text, TextInput, TouchableOpacity, FlatList, ActivityIndicator } from "react-native";
import { Search, X, Pill } from "lucide-react-native";
import { useState, useEffect, useCallback, useRef } from "react";
import { router } from "expo-router";
import { useDatabase } from "@/db/provider";
import { sql, like, or } from "drizzle-orm";
import { medicines, generics, manufacturers, dosageForms } from "@/db/schema";

type DrugResult = {
  id: number; brandName: string; strength: string | null;
  dosageForm: string | null; genericName: string | null; manufacturerName: string | null;
};

export default function DIMSScreen() {
  const { db } = useDatabase();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<DrugResult[]>([]);
  const [loading, setLoading] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const search = useCallback(async (q: string) => {
    if (!db || q.trim().length < 2) { setResults([]); return; }
    setLoading(true);
    try {
      const term = `%${q.trim()}%`;
      const rows = await db
        .select({
          id: medicines.id, brandName: medicines.brandName, strength: medicines.strength,
          dosageForm: dosageForms.name, genericName: generics.name, manufacturerName: manufacturers.name,
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
    return () => { if (timer.current) clearTimeout(timer.current); };
  }, [query, search]);

  return (
    <View className="flex-1 bg-background">
      {/* Search Bar */}
      <View className="px-4 pt-4 pb-3">
        <View className="flex-row items-center bg-card rounded-xl px-4 h-12 border border-border">
          <Search size={18} color="#555" />
          <TextInput
            className="flex-1 ml-3 text-foreground text-base"
            placeholder="Search brands, generics..."
            placeholderTextColor="#555"
            value={query}
            onChangeText={setQuery}
            autoCorrect={false}
            autoCapitalize="none"
            returnKeyType="search"
          />
          {loading
            ? <ActivityIndicator size="small" color="#00C896" />
            : query.length > 0 && (
              <TouchableOpacity onPress={() => setQuery("")}>
                <X size={18} color="#555" />
              </TouchableOpacity>
            )}
        </View>
      </View>

      {query.length < 2 ? (
        <View className="flex-1 items-center justify-center">
          <Pill size={44} color="#1A1A1A" />
          <Text className="text-muted-foreground text-sm mt-3">Search 21,700+ BD drug brands</Text>
          <Text className="text-muted-foreground text-xs mt-1">Generic names, brand names, drug classes</Text>
        </View>
      ) : results.length === 0 && !loading ? (
        <View className="flex-1 items-center justify-center">
          <Text className="text-muted-foreground text-sm">No results for "{query}"</Text>
        </View>
      ) : (
        <FlatList
          data={results}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24 }}
          ItemSeparatorComponent={() => <View className="h-2" />}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => router.push(`/dims/brand/${item.id}` as any)}
              className="bg-card rounded-2xl p-4 border border-border"
              activeOpacity={0.7}
            >
              <View className="flex-row items-start justify-between">
                <View className="flex-1">
                  <Text className="text-foreground font-semibold text-base">{item.brandName}</Text>
                  {item.genericName && (
                    <Text className="text-muted-foreground text-xs mt-0.5">{item.genericName}</Text>
                  )}
                </View>
                {item.dosageForm && (
                  <View className="bg-secondary rounded-lg px-2 py-1 ml-2">
                    <Text className="text-muted-foreground text-xs">{item.dosageForm}</Text>
                  </View>
                )}
              </View>
              {(item.strength || item.manufacturerName) && (
                <View className="flex-row mt-2 gap-4">
                  {item.strength && <Text className="text-primary text-xs">{item.strength}</Text>}
                  {item.manufacturerName && <Text className="text-muted-foreground text-xs">{item.manufacturerName}</Text>}
                </View>
              )}
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}
