import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { useEffect, useState } from "react";
import { eq } from "drizzle-orm";
import { ArrowLeft, Activity, ChevronRight } from "lucide-react";
import { useDatabase } from "@/db/provider";
import { ecgPatterns, conditions } from "@/db/schema";
import { ClinicalShell } from "@/components/layout/ClinicalShell";
import { triggerSelectionHaptic } from "@/lib/clinical-haptics";

interface ECGDetail {
  id: number;
  name: string;
  description: string | null;
  keyFeaturesJson: string | null;
  conditionId: string | null;
  conditionName: string | null;
}

interface KeyFeature {
  feature: string;
  value: string;
}

function parseFeatures(json: string | null): KeyFeature[] {
  if (!json) return [];
  try {
    const parsed = JSON.parse(json);
    if (Array.isArray(parsed)) return parsed.filter((p) => p?.feature && p?.value);
    return [];
  } catch {
    return [];
  }
}

export default function ECGDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { db } = useDatabase();
  const [data, setData] = useState<ECGDetail | null>(null);

  useEffect(() => {
    if (!db || !id) return;
    db.select({
      id: ecgPatterns.id,
      name: ecgPatterns.name,
      description: ecgPatterns.description,
      keyFeaturesJson: ecgPatterns.keyFeaturesJson,
      conditionId: ecgPatterns.conditionId,
      conditionName: conditions.name,
    })
      .from(ecgPatterns)
      .leftJoin(conditions, eq(ecgPatterns.conditionId, conditions.id))
      .where(eq(ecgPatterns.id, Number(id)))
      .then((rows) => setData((rows[0] as ECGDetail) ?? null));
  }, [db, id]);

  if (!data) {
    return (
      <ClinicalShell>
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator color="#C8F53C" />
        </View>
      </ClinicalShell>
    );
  }

  const features = parseFeatures(data.keyFeaturesJson);

  return (
    <ClinicalShell padded={false}>
      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 56 }}>
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
            <Text className="flex-1 font-bodySemi text-[13px] uppercase tracking-[1.6px] text-text-muted">
              ECG Pattern
            </Text>
          </View>

          <View className="rounded-[32px] border border-border bg-ink-800 p-5">
            <View className="mb-4 h-14 w-14 items-center justify-center rounded-[22px] bg-clinical-redSoft">
              <Activity size={26} color="#FF453A" strokeWidth={1.5} />
            </View>
            <Text className="font-heading text-[28px] leading-9 text-text-primary">{data.name}</Text>
            {data.description ? (
              <Text className="mt-3 font-body text-[14px] leading-6 text-text-secondary">{data.description}</Text>
            ) : null}
          </View>

          {features.length > 0 ? (
            <View className="mt-4 rounded-clinical border border-border bg-ink-800 p-4">
              <Text className="mb-3 font-bodySemi text-[11px] uppercase tracking-[1.5px] text-text-muted">
                Key Features
              </Text>
              {features.map((f, i) => (
                <View
                  key={i}
                  className={`flex-row items-start justify-between gap-3 py-2 ${
                    i < features.length - 1 ? "border-b border-border-soft" : ""
                  }`}
                >
                  <Text className="font-bodySemi text-[12px] uppercase tracking-[1.1px] text-text-muted flex-shrink-0 w-32">
                    {f.feature}
                  </Text>
                  <Text className="flex-1 text-right font-body text-[13px] leading-5 text-text-secondary">
                    {f.value}
                  </Text>
                </View>
              ))}
            </View>
          ) : null}

          {data.conditionId && data.conditionName ? (
            <TouchableOpacity
              onPress={() => { triggerSelectionHaptic(); router.push(`/gp/condition/${data.conditionId}` as any); }}
              className="mt-4 flex-row items-center justify-between rounded-clinical border border-border-accent bg-mint-soft p-4"
              activeOpacity={0.78}
              accessibilityRole="button"
              accessibilityLabel={`Open ${data.conditionName} condition`}
            >
              <View className="flex-1 pr-3">
                <Text className="font-bodySemi text-[11px] uppercase tracking-[1.3px] text-mint">Linked condition</Text>
                <Text className="mt-1 font-headingBold text-[16px] text-text-primary">{data.conditionName}</Text>
              </View>
              <ChevronRight size={19} color="#C8F53C" strokeWidth={1.6} />
            </TouchableOpacity>
          ) : null}
        </View>
      </ScrollView>
    </ClinicalShell>
  );
}
