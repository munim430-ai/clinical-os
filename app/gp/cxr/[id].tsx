import { ClinicalShell } from "@/components/layout/ClinicalShell";
import { useDatabase } from "@/db/provider";
import { conditions, cxrFindings } from "@/db/schema";
import { triggerSelectionHaptic } from "@/lib/clinical-haptics";
import { eq } from "drizzle-orm";
import { router, useLocalSearchParams } from "expo-router";
import { ArrowLeft, ChevronRight, FileImage } from "lucide-react-native";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface CXRDetail {
  id: number;
  name: string;
  description: string | null;
  conditionId: string | null;
  conditionName: string | null;
}

export default function CXRDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { db } = useDatabase();
  const [data, setData] = useState<CXRDetail | null>(null);

  useEffect(() => {
    if (!db || !id) return;
    db.select({
      id: cxrFindings.id,
      name: cxrFindings.name,
      description: cxrFindings.description,
      conditionId: cxrFindings.conditionId,
      conditionName: conditions.name,
    })
      .from(cxrFindings)
      .leftJoin(conditions, eq(cxrFindings.conditionId, conditions.id))
      .where(eq(cxrFindings.id, Number(id)))
      .then((rows) => setData((rows[0] as CXRDetail) ?? null));
  }, [db, id]);

  if (!data) {
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
        contentContainerStyle={{ paddingBottom: 56 }}
      >
        <View className="px-4 pt-2">
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
            <Text className="flex-1 font-bodySemi text-[13px] uppercase tracking-[1.6px] text-text-tertiary">
              CXR Pattern
            </Text>
          </View>

          <View className="rounded-[32px] border border-border bg-surface p-5">
            <View className="mb-4 h-14 w-14 items-center justify-center rounded-[22px] bg-mint-soft">
              <FileImage size={26} color="#2470FF" strokeWidth={1.5} />
            </View>
            <Text className="font-heading text-[28px] leading-9 text-text-primary">
              {data.name}
            </Text>
            {data.description ? (
              <Text className="mt-3 font-body text-[14px] leading-6 text-text-secondary">
                {data.description}
              </Text>
            ) : null}
          </View>

          {data.conditionId && data.conditionName ? (
            <TouchableOpacity
              onPress={() => {
                triggerSelectionHaptic();
                router.push(`/gp/condition/${data.conditionId}` as any);
              }}
              className="mt-4 flex-row items-center justify-between rounded-clinical border border-border-accent bg-mint-soft p-4"
              activeOpacity={0.78}
              accessibilityRole="button"
              accessibilityLabel={`Open ${data.conditionName} condition`}
            >
              <View className="flex-1 pr-3">
                <Text className="font-bodySemi text-[11px] uppercase tracking-[1.3px] text-mint">
                  Linked condition
                </Text>
                <Text className="mt-1 font-headingBold text-[16px] text-text-primary">
                  {data.conditionName}
                </Text>
              </View>
              <ChevronRight size={19} color="#2470FF" strokeWidth={1.6} />
            </TouchableOpacity>
          ) : null}
        </View>
      </ScrollView>
    </ClinicalShell>
  );
}
