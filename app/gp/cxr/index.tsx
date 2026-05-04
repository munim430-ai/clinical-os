import { View, Text, TextInput, ScrollView, TouchableOpacity, ActivityIndicator } from "react-native";
import { router } from "expo-router";
import { useEffect, useState, useMemo } from "react";
import { ArrowLeft, Search, FileImage, ChevronRight } from "lucide-react";
import { useDatabase } from "@/db/provider";
import { cxrFindings } from "@/db/schema";
import { ClinicalShell } from "@/components/layout/ClinicalShell";
import { triggerSelectionHaptic } from "@/lib/clinical-haptics";

interface CXRRow {
  id: number;
  name: string;
  description: string | null;
}

export default function CXRListScreen() {
  const { db } = useDatabase();
  const [rows, setRows] = useState<CXRRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (!db) return;
    db.select().from(cxrFindings).then((data) => {
      setRows(data as CXRRow[]);
      setLoading(false);
    });
  }, [db]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((r) =>
      r.name.toLowerCase().includes(q) || (r.description ?? "").toLowerCase().includes(q)
    );
  }, [rows, query]);

  return (
    <ClinicalShell padded={false}>
      <View className="flex-1">
        <View className="px-4 pt-2">
          <View className="mb-4 flex-row items-center">
            <TouchableOpacity
              onPress={() => { triggerSelectionHaptic(); router.back(); }}
              className="mr-3 h-11 w-11 items-center justify-center rounded-2xl border border-border bg-ink-800"
              accessibilityRole="button"
              accessibilityLabel="Back"
            >
              <ArrowLeft size={21} color="#F5F5F7" strokeWidth={1.7} />
            </TouchableOpacity>
            <View className="flex-1">
              <Text className="font-heading text-[24px] leading-7 text-text-primary">CXR Reader</Text>
              <Text className="font-body text-[12px] text-text-muted">{rows.length} chest X-ray patterns</Text>
            </View>
          </View>

          <View className="mb-4 flex-row items-center gap-2 rounded-clinical border border-border bg-ink-800 px-3 py-2">
            <Search size={16} color="#7A7A80" />
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder="Search patterns (e.g. cardiomegaly)"
              placeholderTextColor="#505058"
              className="flex-1 font-body text-[14px] text-text-primary"
              autoCorrect={false}
              autoCapitalize="none"
              accessibilityLabel="Search CXR patterns"
            />
          </View>
        </View>

        {loading ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator color="#C8F53C" />
          </View>
        ) : (
          <ScrollView
            className="flex-1"
            contentContainerStyle={{ paddingBottom: 80, paddingHorizontal: 16 }}
            keyboardDismissMode="on-drag"
            keyboardShouldPersistTaps="handled"
          >
            {filtered.length === 0 ? (
              <View className="mt-12 items-center">
                <Text className="font-body text-[13px] text-text-muted">No CXR patterns match "{query}"</Text>
              </View>
            ) : (
              filtered.map((row) => (
                <TouchableOpacity
                  key={row.id}
                  onPress={() => { triggerSelectionHaptic(); router.push(`/gp/cxr/${row.id}` as any); }}
                  className="mb-2 flex-row items-center rounded-clinical border border-border bg-ink-800 p-4"
                  activeOpacity={0.78}
                  accessibilityRole="button"
                  accessibilityLabel={`Open ${row.name}`}
                >
                  <View className="mr-3 h-10 w-10 items-center justify-center rounded-2xl bg-mint-soft">
                    <FileImage size={16} color="#C8F53C" strokeWidth={1.7} />
                  </View>
                  <View className="flex-1 pr-2">
                    <Text className="font-bodySemi text-[14px] text-text-primary">{row.name}</Text>
                    {row.description ? (
                      <Text className="mt-0.5 font-body text-[12px] text-text-muted" numberOfLines={1}>
                        {row.description}
                      </Text>
                    ) : null}
                  </View>
                  <ChevronRight size={16} color="#7A7A80" strokeWidth={1.6} />
                </TouchableOpacity>
              ))
            )}
          </ScrollView>
        )}
      </View>
    </ClinicalShell>
  );
}
