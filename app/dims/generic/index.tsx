import { ClinicalShell } from "@/components/layout/ClinicalShell";
import { useDatabase } from "@/db/provider";
import { drugClasses, generics, medicines } from "@/db/schema";
import { triggerSelectionHaptic } from "@/lib/clinical-haptics";
import { sql } from "drizzle-orm";
import { router } from "expo-router";
import { ArrowLeft, FlaskConical, Search, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

type GenericRow = {
  id: number;
  name: string;
  drugClassName: string | null;
  brandCount: number;
};

export default function GenericsScreen() {
  const { db } = useDatabase();
  const [rows, setRows] = useState<GenericRow[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!db) return;
    db.select({
      id: generics.id,
      name: generics.name,
      drugClassName: drugClasses.name,
      brandCount: sql<number>`count(${medicines.id})`,
    })
      .from(generics)
      .leftJoin(drugClasses, sql`${generics.drugClassId} = ${drugClasses.id}`)
      .leftJoin(medicines, sql`${medicines.genericId} = ${generics.id}`)
      .groupBy(generics.id)
      .orderBy(generics.name)
      .all()
      .then((data) => {
        setRows(data as GenericRow[]);
        setLoading(false);
      });
  }, [db]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((r) => r.name.toLowerCase().includes(q));
  }, [rows, query]);

  return (
    <ClinicalShell padded={false}>
      <View className="flex-1">
        <View className="px-4 pt-2">
          <View className="mb-4 flex-row items-center">
            <TouchableOpacity
              onPress={() => {
                triggerSelectionHaptic();
                router.back();
              }}
              className="mr-3 h-11 w-11 items-center justify-center rounded-2xl border border-border bg-ink-800"
              accessibilityRole="button"
              accessibilityLabel="Back"
            >
              <ArrowLeft size={21} color="#F5F5F7" strokeWidth={1.7} />
            </TouchableOpacity>
            <View className="flex-1">
              <Text className="font-heading text-[24px] leading-7 text-text-primary">
                Generics
              </Text>
              <Text className="font-body text-[12px] text-text-muted">
                {loading ? "Loading…" : `${rows.length} molecules`}
              </Text>
            </View>
          </View>

          <View className="mb-3 flex-row items-center gap-2 rounded-clinical border border-border bg-ink-800 px-3 py-2">
            <Search size={16} color="#7A7A80" />
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder="Search generics (e.g. amoxicillin)"
              placeholderTextColor="#505058"
              className="flex-1 font-body text-[14px] text-text-primary"
              autoCorrect={false}
              autoCapitalize="none"
              accessibilityLabel="Search generics"
            />
            {query.length > 0 ? (
              <TouchableOpacity
                onPress={() => setQuery("")}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <X size={14} color="#7A7A80" />
              </TouchableOpacity>
            ) : null}
          </View>
        </View>

        {loading ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator color="#C8F53C" />
          </View>
        ) : (
          <FlatList
            data={filtered}
            keyExtractor={(item) => String(item.id)}
            contentContainerStyle={{ paddingBottom: 80, paddingHorizontal: 16 }}
            keyboardDismissMode="on-drag"
            keyboardShouldPersistTaps="handled"
            ListEmptyComponent={
              <View className="mt-12 items-center">
                <Text className="font-body text-[13px] text-text-muted">
                  No generics match "{query}"
                </Text>
              </View>
            }
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => {
                  triggerSelectionHaptic();
                  router.push(`/dims/generic/${item.id}` as any);
                }}
                className="mb-2 flex-row items-center rounded-clinical border border-border bg-ink-800 p-4"
                activeOpacity={0.78}
                accessibilityRole="button"
                accessibilityLabel={`Open ${item.name}`}
              >
                <View className="mr-3 h-10 w-10 items-center justify-center rounded-2xl bg-accent-successSoft">
                  <FlaskConical size={16} color="#00D7B5" strokeWidth={1.7} />
                </View>
                <View className="flex-1 pr-2">
                  <Text className="font-bodySemi text-[14px] text-text-primary">
                    {item.name}
                  </Text>
                  <Text className="mt-0.5 font-body text-[12px] text-text-muted">
                    {item.drugClassName ?? "Unclassified"} · {item.brandCount}{" "}
                    brand{item.brandCount !== 1 ? "s" : ""}
                  </Text>
                </View>
              </TouchableOpacity>
            )}
          />
        )}
      </View>
    </ClinicalShell>
  );
}
