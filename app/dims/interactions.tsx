import { ClinicalShell } from "@/components/layout/ClinicalShell";
import { useDatabase } from "@/db/provider";
import { drugClasses, generics, medicines } from "@/db/schema";
import {
  triggerEmergencyHaptic,
  triggerSelectionHaptic,
} from "@/lib/clinical-haptics";
import {
  type InteractionHit,
  checkInteractions,
  severityColor,
} from "@/lib/drug-interactions";
import { eq, like, sql } from "drizzle-orm";
import { router } from "expo-router";
import {
  AlertTriangle,
  ArrowLeft,
  Plus,
  Search,
  ShieldCheck,
  X,
} from "lucide-react-native";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface SearchResult {
  id: number;
  brandName: string;
  genericName: string | null;
  drugClass: string | null;
}

export default function InteractionsScreen() {
  const { db } = useDatabase();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [selected, setSelected] = useState<SearchResult[]>([]);

  const search = useCallback(
    async (q: string) => {
      if (!db || q.trim().length < 2) {
        setResults([]);
        return;
      }
      setSearching(true);
      const term = `%${q.trim()}%`;
      const rows = await db
        .select({
          id: medicines.id,
          brandName: medicines.brandName,
          genericName: generics.name,
          drugClass: drugClasses.name,
        })
        .from(medicines)
        .leftJoin(generics, eq(medicines.genericId, generics.id))
        .leftJoin(drugClasses, eq(generics.drugClassId, drugClasses.id))
        .where(like(medicines.brandName, term))
        .limit(8);
      setResults(rows as SearchResult[]);
      setSearching(false);
    },
    [db],
  );

  useEffect(() => {
    const t = setTimeout(() => search(query), 250);
    return () => clearTimeout(t);
  }, [query, search]);

  function add(drug: SearchResult) {
    if (selected.some((s) => s.id === drug.id)) return;
    triggerSelectionHaptic();
    setSelected([...selected, drug]);
    setQuery("");
    setResults([]);
  }

  function remove(id: number) {
    triggerSelectionHaptic();
    setSelected(selected.filter((s) => s.id !== id));
  }

  const hits: InteractionHit[] = checkInteractions(
    selected.map((s) => ({ brandName: s.brandName, drugClass: s.drugClass })),
  );

  useEffect(() => {
    if (hits.some((h) => h.severity === "major")) triggerEmergencyHaptic();
  }, [hits.length]);

  const noClassDrugs = selected.filter((s) => !s.drugClass);

  return (
    <ClinicalShell padded={false}>
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 80 }}
        keyboardShouldPersistTaps="handled"
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
              accessibilityRole="button"
              accessibilityLabel="Back"
            >
              <ArrowLeft size={21} color="#2470FF" strokeWidth={1.7} />
            </TouchableOpacity>
            <View className="flex-1">
              <Text className="font-heading text-[24px] leading-7 text-text-primary">
                Interaction Checker
              </Text>
              <Text className="font-body text-[12px] text-text-tertiary">
                Class-based screening · reference only
              </Text>
            </View>
          </View>

          {/* Search */}
          <View className="mb-3 flex-row items-center gap-2 rounded-clinical border border-border bg-surface px-3 py-2">
            <Search size={16} color="#8A91A8" />
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder="Search a brand to add"
              placeholderTextColor="#505058"
              className="flex-1 font-body text-[14px] text-text-primary"
              autoCorrect={false}
              autoCapitalize="none"
              accessibilityLabel="Search medicines to add to interaction check"
            />
            {searching ? (
              <ActivityIndicator color="#2470FF" size="small" />
            ) : null}
          </View>

          {/* Search results */}
          {results.length > 0 ? (
            <View className="mb-4 overflow-hidden rounded-clinical border border-border bg-surface">
              {results.map((r) => {
                const alreadyAdded = selected.some((s) => s.id === r.id);
                return (
                  <Pressable
                    key={r.id}
                    onPress={() => add(r)}
                    disabled={alreadyAdded}
                    className="flex-row items-center justify-between border-b border-border-soft px-4 py-3 last:border-b-0"
                  >
                    <View className="flex-1 pr-3">
                      <Text className="font-bodySemi text-[14px] text-text-primary">
                        {r.brandName}
                      </Text>
                      <Text className="mt-0.5 font-body text-[11px] text-text-tertiary">
                        {[r.genericName, r.drugClass]
                          .filter(Boolean)
                          .join(" · ") || "Class unknown"}
                      </Text>
                    </View>
                    {alreadyAdded ? (
                      <Text className="font-body text-[11px] text-mint">
                        Added
                      </Text>
                    ) : (
                      <Plus size={16} color="#2470FF" strokeWidth={1.8} />
                    )}
                  </Pressable>
                );
              })}
            </View>
          ) : null}

          {/* Selected chips */}
          {selected.length > 0 ? (
            <View className="mb-4">
              <Text className="mb-2 font-bodySemi text-[11px] uppercase tracking-[1.3px] text-text-tertiary">
                Selected ({selected.length})
              </Text>
              <View className="flex-row flex-wrap gap-2">
                {selected.map((s) => (
                  <View
                    key={s.id}
                    className="flex-row items-center gap-1.5 rounded-pill border border-border-accent bg-mint-soft px-3 py-1.5"
                  >
                    <Text className="font-bodySemi text-[12px] text-mint">
                      {s.brandName}
                    </Text>
                    <TouchableOpacity
                      onPress={() => remove(s.id)}
                      hitSlop={8}
                      accessibilityLabel={`Remove ${s.brandName}`}
                    >
                      <X size={12} color="#2470FF" strokeWidth={2} />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            </View>
          ) : (
            <View className="mb-4 rounded-clinical border border-border-soft bg-surface p-5 items-center">
              <ShieldCheck size={32} color="#505058" strokeWidth={1.5} />
              <Text className="mt-3 text-center font-body text-[13px] text-text-tertiary">
                Add 2 or more medicines to screen for known class-based
                interactions.
              </Text>
            </View>
          )}

          {/* Results */}
          {selected.length >= 2 ? (
            hits.length === 0 ? (
              <View className="rounded-clinical border border-border-accent bg-mint-soft p-4 flex-row items-start gap-2">
                <ShieldCheck
                  size={16}
                  color="#2470FF"
                  strokeWidth={1.7}
                  style={{ marginTop: 1 }}
                />
                <View className="flex-1">
                  <Text className="font-headingBold text-[14px] text-mint">
                    No flagged interactions
                  </Text>
                  <Text className="mt-1 font-body text-[12px] leading-5 text-text-secondary">
                    No major class-based interactions in our rule set. Always
                    cross-check with BNF / Stockley's before prescribing.
                  </Text>
                </View>
              </View>
            ) : (
              <View>
                <Text className="mb-3 font-bodySemi text-[11px] uppercase tracking-[1.3px] text-text-tertiary">
                  {hits.length} interaction{hits.length !== 1 ? "s" : ""} found
                </Text>
                {hits.map((hit, idx) => {
                  const c = severityColor(hit.severity);
                  return (
                    <View
                      key={idx}
                      className={`mb-3 rounded-clinical border ${c.border} ${c.bg} p-4`}
                    >
                      <View className="mb-2 flex-row items-center gap-2">
                        <AlertTriangle
                          size={14}
                          className={c.text}
                          color={
                            hit.severity === "major"
                              ? "#FF3B30"
                              : hit.severity === "moderate"
                                ? "#FFA01D"
                                : "#2470FF"
                          }
                          strokeWidth={1.8}
                        />
                        <Text
                          className={`font-bodySemi text-[10px] uppercase tracking-[1.3px] ${c.text}`}
                        >
                          {hit.severity}
                        </Text>
                      </View>
                      <Text className="font-headingBold text-[14px] text-text-primary">
                        {hit.drugA} ↔ {hit.drugB}
                      </Text>
                      <Text className="mt-0.5 font-body text-[11px] text-text-tertiary">
                        {hit.drugAClass} ↔ {hit.drugBClass}
                      </Text>
                      <Text className="mt-2 font-body text-[13px] leading-5 text-text-secondary">
                        {hit.note}
                      </Text>
                    </View>
                  );
                })}
              </View>
            )
          ) : null}

          {/* Drugs without class warning */}
          {noClassDrugs.length > 0 ? (
            <View className="mt-4 rounded-clinical border border-border-soft bg-surface p-3">
              <Text className="font-body text-[11px] leading-5 text-text-tertiary">
                Class data unknown for:{" "}
                {noClassDrugs.map((d) => d.brandName).join(", ")}. These were
                skipped.
              </Text>
            </View>
          ) : null}

          {/* Disclaimer */}
          <View className="mt-5 rounded-clinical border border-border-red bg-clinical-redSoft p-3 flex-row items-start gap-2">
            <AlertTriangle
              size={13}
              color="#FF3B30"
              strokeWidth={1.7}
              style={{ marginTop: 1 }}
            />
            <Text className="flex-1 font-body text-[11px] leading-5 text-clinical-red">
              Class-based screening only. Not a substitute for full prescribing
              references. Always verify before clinical use.
            </Text>
          </View>
        </View>
      </ScrollView>
    </ClinicalShell>
  );
}
