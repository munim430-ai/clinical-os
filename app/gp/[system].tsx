import { View, Text, FlatList, TouchableOpacity, ActivityIndicator } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { useEffect, useState } from "react";
import { eq } from "drizzle-orm";
import { ArrowLeft, ChevronRight, AlertCircle } from "lucide-react-native";
import { useDatabase } from "@/db/provider";
import { conditions, systems } from "@/db/schema";

const SYSTEM_LABELS: Record<string, string> = {
  cardiology: "Cardiology", respiratory: "Respiratory", gi: "GI & Hepatology",
  nephrology: "Nephrology", neurology: "Neurology", infectious: "Infectious Disease",
  endocrine: "Endocrinology", haematology: "Haematology", obgyn: "Obs & Gynaecology",
  paediatrics: "Paediatrics",
};

export default function SystemScreen() {
  const { system } = useLocalSearchParams<{ system: string }>();
  const { db } = useDatabase();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!db || !system) return;
    db.select().from(conditions).where(eq(conditions.systemId, system))
      .then((rows) => { setItems(rows); setLoading(false); });
  }, [db, system]);

  return (
    <View className="flex-1 bg-background">
      <View className="px-4 pt-12 pb-4 flex-row items-center">
        <TouchableOpacity onPress={() => router.back()} className="mr-3 w-9 h-9 items-center justify-center">
          <ArrowLeft size={22} color="#F2F2F2" />
        </TouchableOpacity>
        <Text className="text-foreground text-xl font-bold">{SYSTEM_LABELS[system] ?? system}</Text>
      </View>

      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator color="#00C896" />
        </View>
      ) : items.length === 0 ? (
        <View className="flex-1 items-center justify-center px-8">
          <AlertCircle size={40} color="#333" />
          <Text className="text-muted-foreground text-sm mt-3 text-center">
            Content coming soon. Your doctor friend's review is pending for this system.
          </Text>
        </View>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24 }}
          ItemSeparatorComponent={() => <View className="h-2" />}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => router.push(`/gp/condition/${item.id}` as any)}
              className="bg-card rounded-2xl p-4 border border-border flex-row items-center justify-between"
              activeOpacity={0.7}
            >
              <View className="flex-1">
                <Text className="text-foreground font-semibold">{item.name}</Text>
                {item.icd10Code && (
                  <Text className="text-muted-foreground text-xs mt-0.5">ICD-10: {item.icd10Code}</Text>
                )}
              </View>
              <ChevronRight size={18} color="#555" />
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}
