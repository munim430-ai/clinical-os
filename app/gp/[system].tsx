import { View, Text, FlatList, TouchableOpacity, ActivityIndicator } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { useEffect, useState } from "react";
import { eq } from "drizzle-orm";
import { ArrowLeft, AlertCircle } from "lucide-react";
import { useDatabase } from "@/db/provider";
import { conditions } from "@/db/schema";
import { ClinicalShell } from "@/components/layout/ClinicalShell";
import { ProtocolChecklistCard } from "@/components/cards/ProtocolChecklistCard";
import { ClinicalHumorHero } from "@/components/hero/ClinicalHumorHero";
import { triggerSelectionHaptic } from "@/lib/clinical-haptics";

const SYSTEM_LABELS: Record<string, string> = {
  cardiology: "Cardiology",
  respiratory: "Respiratory",
  gi: "GI & Hepatology",
  nephrology: "Nephrology",
  neurology: "Neurology",
  infectious: "Infectious Disease",
  endocrine: "Endocrinology",
  haematology: "Haematology",
  obgyn: "Obs & Gynaecology",
  paediatrics: "Paediatrics",
};

const CRITICAL_CONDITION_TERMS = ["shock", "sepsis", "dengue", "malaria", "cholera", "asthma", "mi", "stroke"];

function isCriticalCondition(name: string) {
  const normalized = name.toLowerCase();
  return CRITICAL_CONDITION_TERMS.some((term) => normalized.includes(term));
}

export default function SystemScreen() {
  const { system } = useLocalSearchParams<{ system: string }>();
  const { db } = useDatabase();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!db || !system) return;
    setLoading(true);
    db.select().from(conditions).where(eq(conditions.systemId, system))
      .then((rows) => {
        setItems(rows);
        setLoading(false);
      });
  }, [db, system]);

  return (
    <ClinicalShell>
      <View className="mb-4 flex-row items-center pt-2">
        <TouchableOpacity
          onPress={() => {
            triggerSelectionHaptic();
            router.back();
          }}
          className="mr-3 h-11 w-11 items-center justify-center rounded-2xl border border-border bg-ink-800"
        >
          <ArrowLeft size={21} color="#F5F5F7" strokeWidth={1.7} />
        </TouchableOpacity>
        <View className="flex-1">
          <Text className="font-heading text-[25px] leading-8 text-text-primary" numberOfLines={1}>
            {SYSTEM_LABELS[system] ?? system}
          </Text>
          <Text className="mt-1 font-body text-[12px] text-text-muted">GP Master protocol library</Text>
        </View>
      </View>

      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator color="#B8FFD2" />
        </View>
      ) : items.length === 0 ? (
        <View className="flex-1 items-center justify-center px-2 pb-20">
          <ClinicalHumorHero
            compact
            title="No protocols loaded yet"
            subtitle="The tiny doctor is ready. The database is still catching up."
          />
        </View>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 104 }}
          ItemSeparatorComponent={() => <View className="h-3" />}
          renderItem={({ item }) => (
            <ProtocolChecklistCard
              title={item.name}
              category={item.icd10Code ? `ICD-10 ${item.icd10Code}` : "Clinical condition"}
              estimatedTime="3–6 min read"
              completedSteps={0}
              totalSteps={4}
              critical={isCriticalCondition(item.name)}
              onPress={() => router.push(`/gp/condition/${item.id}` as any)}
            />
          )}
        />
      )}
    </ClinicalShell>
  );
}
