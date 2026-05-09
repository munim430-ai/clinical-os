import { ClinicalShell } from "@/components/layout/ClinicalShell";
import { EmergencyPill } from "@/components/navigation/EmergencyPill";
import { useDatabase } from "@/db/provider";
import {
  conditions as conditionsTable,
  systems as systemsTable,
} from "@/db/schema";
import { triggerSelectionHaptic } from "@/lib/clinical-haptics";
import { sql } from "drizzle-orm";
import { router } from "expo-router";
import {
  Activity,
  Baby,
  Brain,
  FlaskConical,
  Heart,
  Search,
  Stethoscope,
  Syringe,
  Wind,
} from "lucide-react-native";
import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const ICONS: Record<string, typeof Stethoscope> = {
  Heart,
  Wind,
  Activity,
  Brain,
  Baby,
  FlaskConical,
  Stethoscope,
  Syringe,
};

type SystemRow = typeof systemsTable.$inferSelect & {
  conditionCount: number;
};

export default function GPMasterScreen() {
  const { db } = useDatabase();
  const [systems, setSystems] = useState<SystemRow[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!db) return;
    const database = db;

    async function loadSystems() {
      setLoading(true);
      const [systemRows, countRows] = await Promise.all([
        database.select().from(systemsTable),
        database
          .select({
            systemId: conditionsTable.systemId,
            count: sql<number>`count(*)`,
          })
          .from(conditionsTable)
          .groupBy(conditionsTable.systemId),
      ]);
      const countMap = countRows.reduce<Record<string, number>>((acc, row) => {
        if (row.systemId) acc[row.systemId] = Number(row.count);
        return acc;
      }, {});
      setSystems(
        systemRows.map((system) => ({
          ...system,
          conditionCount: countMap[system.id] ?? 0,
        })),
      );
      setLoading(false);
    }

    loadSystems();
  }, [db]);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return systems;
    return systems.filter((system) =>
      system.name.toLowerCase().includes(needle),
    );
  }, [query, systems]);

  return (
    <ClinicalShell>
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 156 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-row items-center justify-between gap-3 pb-4 pt-2">
          <View className="flex-1">
            <Text className="font-heading text-[30px] leading-10 text-text-primary">
              GP Master
            </Text>
            <Text className="mt-1 font-body text-[13px] text-text-tertiary">
              Clinical workflows by body system
            </Text>
          </View>
          <EmergencyPill />
        </View>

        <View className="mb-5 flex-row items-center gap-3 rounded-clinical border border-border bg-surface px-4">
          <Search
            color={query ? "#2470FF" : "#8A91A8"}
            size={19}
            strokeWidth={1.8}
          />
          <TextInput
            className="min-h-[52px] flex-1 font-body text-[15px] text-text-primary"
            placeholder="Search a condition or system"
            placeholderTextColor="#8A91A8"
            value={query}
            onChangeText={setQuery}
            accessibilityLabel="Search GP Master"
          />
        </View>

        {loading ? (
          <View className="mt-24 items-center justify-center">
            <ActivityIndicator color="#2470FF" />
            <Text className="mt-3 font-body text-[13px] text-text-tertiary">
              Loading systems...
            </Text>
          </View>
        ) : (
          <View className="flex-row flex-wrap justify-between">
            {filtered.map((system) => {
              const Icon = ICONS[system.icon ?? ""] ?? Stethoscope;
              return (
                <TouchableOpacity
                  key={system.id}
                  onPress={() => {
                    triggerSelectionHaptic();
                    router.push({
                      pathname: "/gp/[system]",
                      params: { system: system.id },
                    });
                  }}
                  className="mb-3 min-h-[148px] w-[48%] justify-between rounded-[28px] border border-surface-glassBorder bg-surface p-4"
                  activeOpacity={0.82}
                  accessibilityRole="button"
                  accessibilityLabel={`${system.name}, ${system.conditionCount} conditions`}
                  style={{
                    shadowColor: "#182456",
                    shadowOffset: { width: 0, height: 14 },
                    shadowOpacity: 0.08,
                    shadowRadius: 34,
                    elevation: 2,
                  }}
                >
                  <View className="h-12 w-12 items-center justify-center rounded-2xl bg-accent-primarySoft">
                    <Icon color="#2470FF" size={25} strokeWidth={1.8} />
                  </View>
                  <View>
                    <Text className="font-headingSemi text-[16px] leading-5 text-text-primary">
                      {system.name}
                    </Text>
                    <Text className="mt-1 font-body text-[12px] text-text-tertiary">
                      {system.conditionCount} conditions
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        )}
      </ScrollView>
    </ClinicalShell>
  );
}
