import { View, Text, TextInput, TouchableOpacity, FlatList, ActivityIndicator } from "react-native";
import { ArrowLeft, Pill, Search, X } from "lucide-react-native";
import { useState, useEffect, useMemo } from "react";
import { router } from "expo-router";
import { sql } from "drizzle-orm";
import { useDatabase } from "@/db/provider";
import { generics, medicines, drugClasses } from "@/db/schema";
import { ClinicalShell } from "@/components/layout/ClinicalShell";
import { triggerSelectionHaptic } from "@/lib/clinical-haptics";

type GenericRow = {
  id: number;
  name: string;
  drugClass: string | null;
  brandCount: number;
};

export default function GenericIndexScreen() {
  const { db } = useDatabase();
  const [items, setItems] = useState<GenericRow[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!db) return;
    db.select({
      id: generics.id,
      name: generics.name,
      drugClass: drugClasses.name,
      brandCount: sql<number>`count(${medicines.id})`,
    })
      .from(generics)
      .leftJoin(drugClasses, sql`${generics.drugClassId} = ${drugClasses.id}`)
      .leftJoin(medicines, sql`${medicines.genericId} = ${generics.id}`)
      .groupBy(generics.id)
      .orderBy(generics.name)
      .then((rows) => {
        setItems(rows as GenericRow[]);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [db]);

  const filtered = useMemo(() => {
    if (!query.trim()) return items;
    const q = query.trim().toLowerCase();
    return items.filter(
      (g) => g.name.toLowerCase().includes(q) || (g.drugClass ?? "").toLowerCase().includes(q)
    );
  }, [items, query]);

  return (
    <ClinicalShell>
      <View className="mb-4 flex-row items-center pt-2">
        <TouchableOpacity
          onPress={() => { triggerSelectionHaptic(); router.back(); }}
          className="mr-3 h-11 w-11 items-center justify-center rounded-2xl border border-border bg-surface"
        >
          <ArrowLeft size={21} color="#2470FF" strokeWidth={1.7} />
        </TouchableOpacity>
        <View className="flex-1">
          <Text className="font-heading text-[28px] leading-9 text-text-primary">By Molecule</Text>
          <Text className="font-body text-[12px] text-text-muted">{items.length} generics</Text>
        </View>
      </View>

      <View className="mb-4 overflow-hidden rounded-[28px] border border-border bg-surface px-4">
        <View className="flex-row items-center gap-3">
          <Search size={18} color={query ? "#2470FF" : "#B8C5E6"} strokeWidth={1.6} />
          <TextInput
            className="min-h-[52px] flex-1 font-bodySemi text-[16px] text-text-primary"
            placeholder="Search generics or drug class..."
            placeholderTextColor="#7A7A80"
            value={query}
            onChangeText={setQuery}
            autoCorrect={false}
            autoCapitalize="none"
            selectionColor="#2470FF"
          />
          {query.length > 0 ? (
            <TouchableOpacity onPress={() => setQuery("")} hitSlop={10}>
              <X size={18} color="#7A7A80" strokeWidth={1.6} />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>

      {loading ? (
        <ActivityIndicator color="#2470FF" className="mt-8" />
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => String(item.id)}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 32 }}
          ItemSeparatorComponent={() => <View className="h-px bg-border" />}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => {
                triggerSelectionHaptic();
                router.push(`/dims/generic/${item.id}` as any);
              }}
              className="flex-row items-center gap-3 py-3"
              activeOpacity={0.7}
            >
              <View className="h-10 w-10 items-center justify-center rounded-xl border border-border bg-surface-muted">
                <Pill size={18} color="#2470FF" strokeWidth={1.6} />
              </View>
              <View className="flex-1">
                <Text className="font-bodySemi text-[15px] text-text-primary">{item.name}</Text>
                {item.drugClass ? (
                  <Text className="font-body text-[12px] text-text-muted">{item.drugClass}</Text>
                ) : null}
              </View>
              <Text className="font-body text-[12px] text-text-muted">
                {item.brandCount} brand{item.brandCount !== 1 ? "s" : ""}
              </Text>
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <View className="mt-16 items-center gap-2">
              <Pill size={32} color="#B8C5E6" strokeWidth={1.4} />
              <Text className="font-body text-[14px] text-text-muted">No generics found</Text>
            </View>
          }
        />
      )}
    </ClinicalShell>
  );
}
